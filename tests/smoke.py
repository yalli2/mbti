import sys
from playwright.sync_api import sync_playwright
base = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8123/'
errs = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    ctx = b.new_context(viewport={'width': 1280, 'height': 900})
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.on('console', lambda m: errs.append('CONSOLE ' + m.text) if m.type == 'error' else None)
    pg.goto(base)
    pg.wait_for_selector('#jn-name')
    pg.fill('#jn-name', '테스터'); pg.click('#join-form button[type=submit]')
    pg.wait_for_timeout(500)
    for n in range(1, 10):
        for s in range(4):
            pg.goto(f'{base}#/ch/{n}/{s}')
            pg.wait_for_timeout(450)
            txt = pg.inner_text('#app')
            if len(txt) < 80: errs.append(f'SHORT ch{n} step{s}: {len(txt)}')
    pg.goto(base + '#/'); pg.wait_for_timeout(500)
    pg.screenshot(path='/tmp/home.png', full_page=True)
    b.close()
print('\n'.join(errs) or 'OK')
