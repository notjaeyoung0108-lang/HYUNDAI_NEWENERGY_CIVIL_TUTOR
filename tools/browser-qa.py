"""Run with the workspace's Python Playwright and installed Chrome."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
URL = (ROOT / 'index.html').as_uri()
EXAMS = ['Q14-1', 'Q15', 'Q14-2', 'Q16', 'Q17', 'Q18']
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless=True)
    context = browser.new_context(viewport={'width': 1280, 'height': 900}, accept_downloads=True)
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(URL)
    total = page.evaluate('COURSE.chapters.flatMap(c=>c.sections).length')
    assert total == 51, total
    assert page.locator('.chapter').count() == total
    page.locator('#fast-only').check()
    assert page.locator('.chapter').count() == 22 + len(EXAMS)
    page.locator('#fast-only').uncheck()
    page.locator('#search').fill('Retained Logic')
    assert 0 < page.locator('.chapter').count() < total
    page.locator('#search').fill('존재하지않는검색어')
    assert '검색 결과가 없습니다' in page.locator('#course-list').inner_text()

    # Every section renders with its title and no leftover markup; lessons show definition boxes and fold-outs.
    sections = page.evaluate('COURSE.chapters.flatMap(c=>c.sections.map(s=>({id:s.id,kind:s.kind})))')
    for s in sections:
        page.goto(URL + '#course/' + s['id'])
        page.wait_for_selector('[data-action="read"]')
        assert page.locator('article').inner_text().startswith(s['id'] + '.'), s['id']
        main = page.locator('#main').inner_text()
        assert 'undefined' not in main and '::: term' not in main and '<details>' not in main, s['id']
        if s['kind'] == 'lesson':
            assert page.locator('aside.term').count() >= 3, s['id']
            assert page.locator('article details').count() >= 6, s['id']
    page.goto(URL + '#course/08')
    page.locator('[data-action="read"]').click()
    assert page.locator('[data-action="read"]').get_attribute('aria-pressed') == 'true'

    for ident in EXAMS:
        page.goto(URL + '#practice/' + ident)
        page.wait_for_selector('#answer')
        assert not page.locator('.solution').get_attribute('open')
        assert '④ 풀이' not in page.locator('article.prose').first.inner_text(), ident
        page.locator('#answer').fill('테스트 답안 <script>alert(1)</script> ' + ident)
        page.locator('[data-check="0"]').check()
        page.locator('[data-action="timer"]').click()
        assert page.locator('[data-action="timer"]').inner_text() == '일시정지'
        if ident == 'Q14-1':
            page.wait_for_timeout(2100)
            assert page.locator('#timer').inner_text() != '20:00'
        page.locator('[data-action="timer"]').click()
        page.locator('details.panel > summary').click()
        page.locator('.source-image').scroll_into_view_if_needed()
        page.wait_for_function("document.querySelector('.source-image').naturalWidth > 0")
        page.locator('.solution > summary').click()
        assert page.locator('.solution > article').is_visible()
    page.reload()
    assert page.locator('#answer').input_value().endswith('Q18')
    assert page.locator('[data-check="0"]').is_checked()

    # Cards: only read lessons by default (08 is read); "앎" schedules the card away from today.
    page.goto(URL + '#cards')
    deck = page.evaluate("COURSE.glossary.filter(t=>t.lesson==='08').length")
    assert f'덱 {deck}장' in page.locator('#main').inner_text()
    page.locator('[data-action="flip"]').click()
    assert page.locator('.card-answer').is_visible()
    page.locator('[data-grade="2"]').click()
    assert f'오늘 남은 카드 {deck - 1}장' in page.locator('#main').inner_text()

    page.goto(URL + '#glossary')
    n = page.evaluate('COURSE.glossary.length')
    assert page.locator('#glist aside.term').count() == n
    page.locator('#gsearch').fill('Total Float')
    assert 1 <= page.locator('#glist aside.term').count() < n

    page.goto(URL + '#home')
    assert '6 / 6' in page.locator('#main').inner_text()
    with page.expect_download() as download:
        page.locator('[data-action="export"]').click()
    backup = json.loads(Path(download.value.path()).read_text())
    assert len(backup['answers']) == 6 and backup['read'] == ['08'] and len(backup['srs']) == 1
    page.goto(URL + '#not-a-route')
    page.wait_for_url('**#course')
    (ROOT / 'qa').mkdir(exist_ok=True)
    page.screenshot(path=str(ROOT / 'qa/desktop.png'), full_page=False)
    page.set_viewport_size({'width': 390, 'height': 844})
    for hash_value in ['#course', '#course/08', '#course/Q14-2', '#practice/Q18', '#cards', '#glossary', '#home']:
        page.goto(URL + hash_value)
        page.wait_for_timeout(100)
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), hash_value + ' overflow'
    page.goto(URL + '#course/08')
    page.screenshot(path=str(ROOT / 'qa/mobile.png'), full_page=False)
    page.goto(URL + '#home')
    page.once('dialog', lambda dialog: dialog.dismiss())
    page.locator('[data-action="reset"]').click()
    assert '6 / 6' in page.locator('#main').inner_text()
    page.once('dialog', lambda dialog: dialog.accept())
    page.locator('[data-action="reset"]').click()
    assert '0 / 6' in page.locator('#main').inner_text()
    # Corrupt storage and unavailable storage must leave the app usable.
    broken = browser.new_context()
    broken.add_init_script("localStorage.setItem('hyundai_newenergy_civil.v2', '{broken');")
    tab = broken.new_page(); tab.goto(URL)
    assert tab.locator('#storage-warning').is_visible()
    assert tab.locator('.chapter').count() == total
    blocked = browser.new_context()
    blocked.add_init_script("Storage.prototype.setItem = () => {throw new Error('disabled')};")
    tab2 = blocked.new_page(); tab2.goto(URL + '#practice/Q14-1')
    tab2.locator('#answer').fill('저장 차단 테스트')
    assert '실패' in tab2.locator('#save-status').inner_text()
    assert not errors, errors
    browser.close()
print('PASS: 51 sections render with term boxes, fast path filter, 6 PT cases, persistence, timer, SRS cards, glossary, export, mobile layout, corrupt/blocked storage.')
