"""Read-only archive inventory. Sources stay outside the public build."""
import csv
import hashlib
import json
import pathlib
import sys
import zipfile

dest = pathlib.Path(sys.argv[1])
dest.mkdir(parents=True, exist_ok=True)
rows = []
archives = []
for argument in sys.argv[2:]:
    source = pathlib.Path(argument)
    digest = hashlib.sha256(source.read_bytes()).hexdigest()
    with zipfile.ZipFile(source) as archive:
        entries = archive.infolist()
        unsafe = [e.filename for e in entries if pathlib.PurePosixPath(e.filename).is_absolute() or '..' in pathlib.PurePosixPath(e.filename).parts or (e.external_attr >> 16) & 0o170000 == 0o120000]
        if unsafe:
            raise ValueError(f'Unsafe archive paths: {unsafe}')
        invalid = archive.testzip()
        archives.append({'file': source.name, 'sha256': digest, 'entries': len(entries), 'uncompressedBytes': sum(e.file_size for e in entries), 'crcFailure': invalid, 'extracted': False})
        if invalid:
            raise ValueError(f'CRC failure: {invalid}')
        for entry in entries:
            if entry.is_dir():
                continue
            data = archive.read(entry)
            classification = 'instruction' if entry.filename.endswith(('.md', '.json', '.csv', '.txt')) else 'unreviewed'
            if any(word in entry.filename.upper() for word in ['ILUSTRACAO', 'ILUSTRATIV', 'RENDER']):
                classification = 'illustration-not-execution'
            if 'HOLD' in entry.filename.upper() or 'PENDENCIAS' in entry.filename.upper():
                classification = 'hold'
            rows.append({'archive': source.name, 'entry': entry.filename, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(), 'classification': classification, 'publication': 'not-published', 'visualReview': 'pending'})
with (dest / 'archive-inventory.csv').open('w', newline='') as output:
    writer = csv.DictWriter(output, fieldnames=rows[0].keys(), lineterminator='\n')
    writer.writeheader()
    writer.writerows(rows)
(dest / 'archives.json').write_text(json.dumps(archives, ensure_ascii=False, indent=2))
print(json.dumps(archives, ensure_ascii=False))
