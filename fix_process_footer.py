from pathlib import Path

root = Path(r'c:/Users/DELL/OneDrive/Desktop/precision-engineering')
index = root / 'index.html'
process = root / 'process.html'

index_text = index.read_text(encoding='utf-8')
footer_start = index_text.find('<footer class="site-footer">')
footer_end = index_text.rfind('</footer>')
if footer_start == -1 or footer_end == -1:
    raise SystemExit('Could not find footer block in index.html')
footer_block = index_text[footer_start:footer_end + len('</footer>')]

process_text = process.read_text(encoding='utf-8')
process_footer_start = process_text.find('<footer class="site-footer">')
if process_footer_start == -1:
    raise SystemExit('Could not find footer start in process.html')

new_process_text = process_text[:process_footer_start] + footer_block + '\n\n  <button class="back-to-top" id="backToTop" aria-label="Back to top">\n    <svg viewBox="0 0 48 48" width="44" height="44" class="back-to-top__ring">\n      <circle cx="24" cy="24" r="21" class="back-to-top__track"/>\n      <circle cx="24" cy="24" r="21" class="back-to-top__fill" id="backToTopFill"/>\n    </svg>\n    <svg width="16" height="16" viewBox="0 0 16 16" class="back-to-top__arrow"><path d="M8 13V3M3 7l5-5 5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>\n  </button>\n\n  <script src="script.js"></script>\n</body>\n</html>\n'
process.write_text(new_process_text, encoding='utf-8')
print('process.html footer fixed')
