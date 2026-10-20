import sys
from playwright.sync_api import sync_playwright
base = sys.argv[1] if len(sys.argv) > 1 else 'http://localhost:8123/'
errs = []
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/opt/pw-browsers/chromium', args=['--no-sandbox'])
    pg = b.new_context(viewport={'width': 1280, 'height': 900}).new_page()
    pg.on('pageerror', lambda e: errs.append('PAGEERR ' + str(e)))
    pg.on('console', lambda m: errs.append('CONSOLE ' + m.text[:200]) if m.type == 'error' and 'ERR_TUNNEL' not in m.text else None)
    pg.goto(base); pg.wait_for_selector('#jn-name'); pg.fill('#jn-name', '테스터'); pg.click('#join-form button[type=submit]'); pg.wait_for_timeout(400)
    # ch1 practice
    pg.goto(base + '#/ch/1/1'); pg.wait_for_timeout(500)
    for b_ in pg.query_selector_all('.fc .fc-opt')[::2]: b_.click()
    # ch2
    pg.goto(base + '#/ch/2/1'); pg.wait_for_timeout(500)
    pg.click('text=저장하고 함께 보기')
    # ch3-6
    for n in range(3, 7):
        pg.goto(f'{base}#/ch/{n}/1'); pg.wait_for_timeout(600)
        pg.click('.est button >> nth=0')
        for fc in pg.query_selector_all('.fc'):
            fc.query_selector_all('.fc-opt')[0].click()
        for r in pg.query_selector_all('.wsrow'): r.query_selector('button').click()
    pg.goto(base + '#/ch/3/2'); pg.wait_for_timeout(700); pg.screenshot(path='/tmp/c3t.png', full_page=True)
    pg.goto(base + '#/ch/7/1'); pg.wait_for_timeout(700); pg.screenshot(path='/tmp/c7p.png', full_page=True)
    pg.click('text=이 유형을 나의 최적합으로 정하기'); pg.wait_for_timeout(300)
    pg.goto(base + '#/ch/7/2'); pg.wait_for_timeout(700); pg.screenshot(path='/tmp/c7t.png', full_page=True)
    pg.goto(base + '#/ch/8/1'); pg.wait_for_timeout(600)
    pg.click('button[role=tab]:has-text("일하는 방식")'); pg.click('.chk >> nth=0'); pg.click('text=저장하고 함께 보기')
    pg.goto(base + '#/ch/8/2'); pg.wait_for_timeout(700); pg.screenshot(path='/tmp/c8t.png', full_page=True)
    pg.goto(base + '#/ch/9/1'); pg.wait_for_timeout(600); pg.click('text=저장하고 함께 보기')
    pg.goto(base + '#/ch/9/2'); pg.wait_for_timeout(700); pg.screenshot(path='/tmp/c9t.png', full_page=True)
    pg.goto(base + '#/ch/9/1'); pg.wait_for_timeout(500); pg.screenshot(path='/tmp/c9p.png', full_page=True)
    pg.goto(base + '#/ch/7/3'); pg.wait_for_timeout(400); pg.click('.opt >> nth=1'); pg.wait_for_timeout(300)
    pg.goto(base + '#/'); pg.wait_for_timeout(500)
    print(pg.inner_text('.stats'))
    b.close()
print('\n'.join(errs) or 'OK')
