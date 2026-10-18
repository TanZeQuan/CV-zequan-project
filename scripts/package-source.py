from pathlib import Path
import zipfile
root=Path.cwd()
target=root.parent/'TanZeQuan_Recruiter_Portfolio_2026.zip'
folders=['src','public','scripts','dist','standalone']
files=[]
for name in folders:
    files.extend(p for p in (root/name).rglob('*') if p.is_file())
files.extend(p for p in root.glob('*') if p.is_file() and p.name not in ['design-qa.md','VERIFICATION.md'])
files.extend((root/'qa').glob('recruiter-*.png'))
with zipfile.ZipFile(target,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as archive:
    for source in files:
        archive.write(source,Path('zequan-portfolio')/source.relative_to(root))
with zipfile.ZipFile(target) as archive:
    assert archive.testzip() is None
    assert 'zequan-portfolio/package.json' in archive.namelist()
    assert 'zequan-portfolio/standalone/index.html' in archive.namelist()
    assert 'zequan-portfolio/REVIEW_NOTES.md' in archive.namelist()
    assert not any('/node_modules/' in n or '/.openai/' in n or '/.env' in n for n in archive.namelist())
print(f'ZIP verified: {target}\n{len(files)} files; {target.stat().st_size:,} bytes')
