from pathlib import Path

root = Path(r'c:/Users/DELL/OneDrive/Desktop/precision-engineering')
index = root / 'index.html'
text = index.read_text(encoding='utf-8')
start = text.find('<footer class="site-footer">')
end = text.rfind('</footer>')
if start == -1 or end == -1:
    raise SystemExit('footer block not found in index.html')
footer = text[start:end + len('</footer>')]
files = ['about.html', 'capabilities.html', 'contact.html', 'control.html', 'process.html', 'work.html']
for fname in files:
    path = root / fname
    data = path.read_text(encoding='utf-8')
    s = data.find('<footer class="site-footer">')
    e = data.find('</footer>', s)
    if s == -1 or e == -1:
        print(f'{fname}: footer not found, skipped')
        continue
    e = e + len('</footer>')
    path.write_text(data[:s] + footer + data[e:], encoding='utf-8')
    print(f'{fname}: updated')
