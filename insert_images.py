from pathlib import Path
import re

root = Path(r'c:/Users/DELL/OneDrive/Desktop/precision-engineering')
html_files = [
    'index.html',
    'about.html',
    'capabilities.html',
    'contact.html',
    'process.html',
    'control.html',
    'work.html',
]

work_images = ['webp7.webp', 'webp8.webp', 'webp9.webp', 'webp10.webp', 'webp11.webp', 'webp12.webp']
work_index = 0

def choose_image(classes, fname):
    global work_index
    if 'avatar' in classes:
        return 'webp11.webp', 'Customer avatar'
    if 'map' in classes:
        return 'webp6.webp', 'Factory location map'
    if 'img-placeholder--work' in classes:
        src = work_images[work_index % len(work_images)]
        work_index += 1
        return src, 'Project image'
    if 'img-placeholder--tall' in classes or 'feature-panel__media' in classes or 'img-placeholder' in classes:
        return 'webp3.webp', 'Precision manufacturing image'
    return 'webp3.webp', 'Precision manufacturing image'

pattern = re.compile(r'<(div|span)\s+class="([^"]*img-placeholder[^"]*)"([^>]*)>', re.IGNORECASE)

for fname in html_files:
    path = root / fname
    text = path.read_text(encoding='utf-8')

    def repl(match):
        tag = match.group(1)
        classes = match.group(2)
        rest = match.group(3)
        if 'has-image' in classes:
            return match.group(0)
        src, alt = choose_image(classes, fname)
        classes = classes + ' has-image'
        return f'<{tag} class="{classes}"{rest}><img src="{src}" alt="{alt}" />'

    new_text = pattern.sub(repl, text)
    path.write_text(new_text, encoding='utf-8')
    print(f'{fname}: updated')
