"""Run with the workspace's Python Playwright and installed Chrome."""
from pathlib import Path
import json
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
URL = (ROOT/'index.html').as_uri()
with sync_playwright() as p:
    browser = p.chromium.launch(executable_path='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless=True)
    context = browser.new_context(viewport={'width':1280,'height':900}, accept_downloads=True)
    page = context.new_page()
    errors = []
    page.on('pageerror', lambda e: errors.append(str(e)))
    page.goto(URL)
    assert page.locator('.chapter').count() == 20
    page.locator('#search').fill('단면재생')
    assert 0 < page.locator('.chapter').count() < 20
    page.locator('#search').fill('존재하지않는검색어')
    assert '검색 결과가 없습니다' in page.locator('#course-list').inner_text()
    ids = page.evaluate('COURSE.chapters.flatMap(c=>c.sections.map(s=>s.id))')
    for ident in ids:
        page.goto(URL+'#course/'+ident)
        page.wait_for_selector('[data-action="read"]')
        assert page.locator('article').inner_text().startswith(ident+'.')
        assert 'undefined' not in page.locator('#main').inner_text()
    page.locator('[data-action="read"]').click()
    for ident in ['3-01','3-02','3-03','3-04','3-05']:
        page.goto(URL+'#practice/'+ident)
        page.wait_for_selector('#answer')
        assert not page.locator('.solution').get_attribute('open')
        page.locator('#answer').fill('테스트 답안 <script>alert(1)</script> '+ident)
        page.locator('[data-check="0"]').check()
        page.locator('[data-action="timer"]').click()
        assert page.locator('[data-action="timer"]').inner_text() == '일시정지'
        if ident == '3-01':
            page.wait_for_timeout(1150)
            assert page.locator('#timer').inner_text() != '20:00'
        page.locator('[data-action="timer"]').click()
        page.locator('details.panel summary').click()
        page.locator('.source-image').scroll_into_view_if_needed()
        page.wait_for_function("document.querySelector('.source-image').naturalWidth > 0")
        page.locator('.solution summary').click()
        assert page.locator('.solution article').is_visible()
    page.reload()
    assert page.locator('#answer').input_value().endswith('3-05')
    assert page.locator('[data-check="0"]').is_checked()
    page.goto(URL+'#cards')
    page.locator('[data-action="flip"]').click()
    page.locator('[data-grade="3"]').click()
    page.goto(URL+'#home')
    assert '5 / 5' in page.locator('#main').inner_text()
    with page.expect_download() as download:
        page.locator('[data-action="export"]').click()
    backup = json.loads(Path(download.value.path()).read_text())
    assert len(backup['answers']) == 5 and backup['grades']['0'] == 3
    page.goto(URL+'#course/3-05')
    assert page.locator('[data-action="read"]').get_attribute('aria-pressed') == 'true'
    page.goto(URL+'#not-a-route')
    page.wait_for_url('**#course')
    (ROOT/'qa').mkdir(exist_ok=True)
    page.screenshot(path=str(ROOT/'qa/desktop.png'),full_page=True)
    page.set_viewport_size({'width':390,'height':844})
    for hash_value in ['#course','#course/3-01','#practice/3-05','#cards','#home']:
        page.goto(URL+hash_value)
        page.wait_for_timeout(100)
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth'), hash_value+' overflow'
    page.goto(URL+'#course')
    page.screenshot(path=str(ROOT/'qa/mobile.png'),full_page=True)
    page.goto(URL+'#home')
    page.once('dialog', lambda dialog: dialog.dismiss())
    page.locator('[data-action="reset"]').click()
    assert '5 / 5' in page.locator('#main').inner_text()
    page.once('dialog', lambda dialog: dialog.accept())
    page.locator('[data-action="reset"]').click()
    assert '0 / 5' in page.locator('#main').inner_text()
    assert page.locator('#toast').evaluate('(e)=>getComputedStyle(e).opacity') == '1'
    # Corrupt storage and unavailable storage must leave the app usable.
    broken = browser.new_context()
    broken.add_init_script("localStorage.setItem('hyundai_newenergy_civil.v1', '{broken');")
    tab = broken.new_page(); tab.goto(URL)
    assert tab.locator('#storage-warning').is_visible()
    assert tab.locator('.chapter').count() == 20
    blocked = browser.new_context()
    blocked.add_init_script("Storage.prototype.setItem = () => {throw new Error('disabled')};")
    tab2 = blocked.new_page(); tab2.goto(URL+'#practice/3-01')
    tab2.locator('#answer').fill('저장 차단 테스트')
    assert '실패' in tab2.locator('#save-status').inner_text()
    assert not errors, errors
    browser.close()
print('PASS: 20 readers, 5 PT cases, safe answers, persistence, checks, timer controls, cards, export, fallback, mobile layout, corrupt/blocked storage.')
