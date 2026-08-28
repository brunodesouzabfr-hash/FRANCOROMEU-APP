import importlib.util
import sys
import unittest
from pathlib import Path

SPEC = importlib.util.spec_from_file_location("orchestrator", Path(__file__).parents[1] / "tools" / "orchestrator.py")
orchestrator = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = orchestrator
SPEC.loader.exec_module(orchestrator)


class OrchestratorTest(unittest.TestCase):
    def test_idempotency_key_is_stable(self):
        finding = orchestrator.Finding("github", "abc", "missing-trace", "medium", "e", "a")
        self.assertEqual(finding.idempotency_key, "orchestrator:github:abc:missing-trace")

    def test_ticket_ids_are_unique(self):
        self.assertEqual(orchestrator.ticket_ids("APP-12 APP-12 WEB-7"), {"APP-12", "WEB-7"})

    def test_load_json_default(self):
        self.assertEqual(orchestrator.load_json(None, {}), {})


if __name__ == "__main__":
    unittest.main()
