from pathlib import Path
import re

root = Path(r'c:/Users/DELL/OneDrive/Desktop/precision-engineering')
files = ['index.html', 'about.html', 'capabilities.html', 'contact.html', 'process.html', 'control.html', 'work.html']
sequence = ['webp3.webp', 'webp4.webp', 'webp5.webp', 'webp6.webp', 'webp7.webp', 'webp8.webp', 'webp9.webp', 'webp10.webp', 'webp11.webp', 'webp12.webp']
seq_idx = 0

# remove any inserted webp image tags and has-image classes first
remove_img = re.compile(r'<img[^>]*src="webp[0-9]+\.webp"[^>]*>', re.IGNORECASE)
remove_has_image = re.compile(r'(\s+has-image)|(has-image\s+)|(^has-image$)')

placeholder_open = re.compile(
    r'(<(div|span)\s+class="([^"]*\bimg-placeholder(?:--[^"]*)?[^\"]*)"([^>]*)>)',
    re.IGNORECASE,
)

for fname in files:
    path = root / fname
    text = path.read_text(encoding='utf-8')
    text = remove_img.sub('', text)
    text = text.replace(' has-image', '').replace('has-image ', '')

    def repl(match):
        nonlocal seq_idx
        full_tag = match.group(1)
        tag = match.group(2)
        classes = match.group(3)
        rest = match.group(4)
        if 'img-placeholder__text' in classes.lower():
            return full_tag
        src = sequence[seq_idx % len(sequence)]
        seq_idx += 1
        if 'avatar' in classes:
            src = 'webp11.webp'
            alt = 'Customer avatar'
        elif 'map' in classes:
            src = 'webp6.webp'
            alt = 'Location map'
        elif 'work' in classes:
            alt = 'Project image'
        elif 'tall' in classes or 'feature-panel__media' in classes or 'img-placeholder' in classes:
            alt = 'Precision manufacturing image'
        else:
            alt = 'Precision image'
        if 'has-image' not in classes:
            classes = classes + ' has-image'
        return f'<{tag} class="{classes}"{rest}><img src="{src}" alt="{alt}" />'

    text = placeholder_open.sub(repl, text)
    path.write_text(text, encoding='utf-8')
    print(f'{fname}: fixed')
