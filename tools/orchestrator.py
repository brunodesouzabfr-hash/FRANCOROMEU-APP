#!/usr/bin/env python3
"""Auditoria local, determinística e somente-leitura para a rodada de governança."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

TICKET = re.compile(r"\b([A-Z][A-Z0-9]+-\d+)\b")
CONVENTIONAL = re.compile(
    r"^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)"
    r"(?:\([a-z0-9._/-]+\))?!?: .+"
)


@dataclass(frozen=True)
class Finding:
    source: str
    source_id: str
    kind: str
    severity: str
    evidence: str
    proposed_action: str

    @property
    def idempotency_key(self) -> str:
        return f"orchestrator:{self.source}:{self.source_id}:{self.kind}"


def git(repo: Path, *args: str) -> str:
    result = subprocess.run(
        ["git", *args], cwd=repo, check=True, text=True, capture_output=True
    )
    return result.stdout.strip()


def load_json(path: Path | None, default: Any) -> Any:
    if path is None:
        return default
    with path.open(encoding="utf-8") as stream:
        return json.load(stream)


def ticket_ids(text: str) -> set[str]:
    return set(TICKET.findall(text or ""))


def audit(repo: Path, github: dict[str, Any], linear: dict[str, Any]) -> dict[str, Any]:
    commits = []
    raw = git(repo, "log", "--format=%H%x09%s", "-n", "100")
    for line in raw.splitlines() if raw else []:
        sha, subject = line.split("\t", 1)
        commits.append({"sha": sha, "subject": subject, "tickets": sorted(ticket_ids(subject))})

    prs = github.get("pull_requests", [])
    issues = linear.get("issues", [])
    merged_tickets = {
        ticket
        for pr in prs
        if pr.get("merged")
        for ticket in ticket_ids(f"{pr.get('title', '')} {pr.get('body', '')}")
    }
    known_tickets = {str(issue.get("identifier")) for issue in issues}
    findings: list[Finding] = []

    for commit in commits:
        short = commit["sha"][:12]
        if not CONVENTIONAL.match(commit["subject"]):
            findings.append(Finding("github", short, "non-conventional-commit", "medium", commit["subject"], "Documentar correção; não reescrever o histórico."))
        if not commit["tickets"]:
            findings.append(Finding("github", short, "missing-linear-trace", "medium", commit["subject"], "Vincular o commit a uma issue Linear após revisão humana."))
        for ticket in set(commit["tickets"]) - known_tickets:
            findings.append(Finding("github", short, "unknown-linear-ticket", "high", ticket, "Confirmar o identificador ou criar a issue ausente."))

    for issue in issues:
        identifier = str(issue.get("identifier"))
        state = str(issue.get("state", ""))
        if state.casefold() in {"done", "completed", "concluído", "concluída"} and identifier not in merged_tickets:
            findings.append(Finding("linear", identifier, "done-without-merge", "high", f"state={state}; merge não encontrado", "Revisar e, se confirmado, mover para o estado anterior."))
        if not issue.get("test_evidence"):
            findings.append(Finding("linear", identifier, "missing-test-evidence", "medium", "test_evidence ausente", "Adicionar evidência de testes ou criar dívida de cobertura."))

    test_files = sorted(str(p.relative_to(repo)) for p in repo.rglob("*") if p.is_file() and ("test" in p.name.lower() or "spec" in p.name.lower()) and not {".git", "__pycache__"}.intersection(p.parts))
    ci_files = sorted(str(p.relative_to(repo)) for p in (repo / ".github" / "workflows").glob("*.y*ml")) if (repo / ".github" / "workflows").exists() else []
    manifests = [name for name in ("package.json", "pyproject.toml", "requirements.txt", "pom.xml", "build.gradle") if (repo / name).exists()]
    if not test_files:
        findings.append(Finding("repository", "root", "missing-tests", "high", "nenhum arquivo de teste encontrado", "Criar issue Linear para implantar testes automatizados."))
    if not ci_files:
        findings.append(Finding("repository", "root", "missing-ci", "high", ".github/workflows ausente", "Criar issue Linear para implantar CI."))

    branches = git(repo, "for-each-ref", "--format=%(refname:short)", "refs/heads").splitlines()
    tags = git(repo, "tag", "--list").splitlines()
    data = {
        "mode": "dry-run",
        "inventory": {"branches": branches, "tags": tags, "commits": len(commits), "pull_requests": len(prs), "linear_issues": len(issues), "test_files": test_files, "ci_files": ci_files, "dependency_manifests": manifests},
        "findings": [{**asdict(item), "idempotency_key": item.idempotency_key} for item in findings],
    }
    data["batch_plan"] = [{"connector": item.source, "resource": item.source_id, "action": item.proposed_action, "previous_state": "não alterado", "proposed_state": "aguarda aprovação", "evidence": item.evidence, "risk": item.severity, "rollback": "nenhum; dry-run", "idempotency_key": item.idempotency_key} for item in findings]
    data["summary"] = {"created": 0, "moved": 0, "edited": 0, "planned": len(findings), "mutations_applied": 0}
    data["slack_preview"] = {"blocks": [{"type": "header", "text": {"type": "plain_text", "text": "Governança de engenharia — dry-run"}}, {"type": "section", "text": {"type": "mrkdwn", "text": f"*{len(findings)}* achados; nenhuma mutação aplicada."}}]}
    return data


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=Path.cwd())
    parser.add_argument("--github-snapshot", type=Path)
    parser.add_argument("--linear-snapshot", type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()
    report = audit(args.repo.resolve(), load_json(args.github_snapshot, {}), load_json(args.linear_snapshot, {}))
    rendered = json.dumps(report, ensure_ascii=False, indent=2) + "\n"
    if args.output:
        args.output.write_text(rendered, encoding="utf-8")
    else:
        print(rendered, end="")


if __name__ == "__main__":
    main()
