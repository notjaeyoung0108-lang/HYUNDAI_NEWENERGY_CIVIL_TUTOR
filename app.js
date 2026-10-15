/* Local, dependency-free reader, PT practice, spaced-repetition term cards and glossary. */
(() => {
  'use strict';
  const KEY = 'hyundai_newenergy_civil.v2';
  const course = window.COURSE;
  const sections = course.chapters.flatMap(ch => ch.sections.map(s => ({...s, chapter: ch})));
  const byId = new Map(sections.map(s => [s.id, s]));
  const exams = course.exams.filter(e => byId.has(e.id));
  const examById = new Map(exams.map(e => [e.id, e]));
  const terms = course.glossary.map(t => ({...t, key: `${t.lesson}:${t.ko}`}));
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));
  const md = window.renderMarkdown;
  const DAY = 86400000;
  const INTERVALS = [1, 3, 7, 14, 30]; // days until the next review after each successful recall
  const today = () => Math.floor(Date.now() / DAY);
  const defaults = () => ({version: 2, read: [], last: '', answers: {}, checks: {}, srs: {}, fastOnly: false, cardScope: 'read'});
  let state = defaults(), card = null, flipped = false;
  let timer = {remaining: 0, deadline: 0, running: false};

  function storageWarning(message) { $('storage-warning').hidden = false; $('storage-warning').textContent = message; }
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (raw?.version === 2) {
      state.read = Array.isArray(raw.read) ? [...new Set(raw.read.filter(x => byId.has(x)))] : [];
      state.last = byId.has(raw.last) ? raw.last : '';
      state.fastOnly = raw.fastOnly === true;
      state.cardScope = raw.cardScope === 'all' ? 'all' : 'read';
      for (const e of exams) {
        state.answers[e.id] = typeof raw.answers?.[e.id] === 'string' ? raw.answers[e.id] : '';
        state.checks[e.id] = e.checks.map((_, i) => raw.checks?.[e.id]?.[i] === true);
      }
      for (const t of terms) {
        const r = raw.srs?.[t.key];
        if (r && Number.isInteger(r.box) && Number.isInteger(r.due)) state.srs[t.key] = {box: Math.min(Math.max(r.box, 0), INTERVALS.length), due: r.due};
      }
    }
  } catch { storageWarning('저장 기록을 읽지 못했습니다. 학습은 계속할 수 있으며 기록 탭에서 백업할 수 있습니다.'); }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); return true; }
    catch { storageWarning('브라우저 저장이 불가능합니다. 기록 탭에서 JSON 백업을 내려받으세요.'); return false; }
  }
  let toastId;
  function toast(message) { $('toast').textContent = message; $('toast').classList.add('visible'); clearTimeout(toastId); toastId = setTimeout(() => $('toast').classList.remove('visible'), 2200); }

  const footer = '<p class="footer-note">HYUNDAI NEW ENERGY CIVIL · 개인 학습도구 · 현대건설 공식 서비스가 아닙니다.<br>가람 원자력 1·2호기는 가상 현장입니다. 기출 해설은 학습용 제안이며 공식 정답이 아닙니다. 학습 기록은 이 브라우저에만 저장됩니다.</p>';
  const label = s => s.kind === 'exam' ? `기출 ${s.id.replace('Q', '')}쪽` : `${s.id}강`;
  const lessonLink = id => `<a class="button subtle" href="#course/${id}">${esc(label(byId.get(id)))} ${esc(byId.get(id)?.title || '')}</a>`;
  const isRead = id => state.read.includes(id);

  // ---------- 교재 ----------
  function courseHome() {
    const fastDone = course.fast.filter(isRead).length;
    $('main').innerHTML = `<div class="eyebrow">COURSE / NEW ENERGY CIVIL</div><div class="topline"><div><h1>${esc(course.title)}</h1><p class="intro">한 현장이 착공부터 상업운전까지 지어지는 이야기 45강, 그리고 장마다 끼워 둔 기출 6편</p></div><span class="pill">${sections.length} SECTIONS</span></div>
      <section class="panel"><h2>읽는 법</h2><p>각 강은 앞 강의 사건에서 시작해 다음 강의 사건으로 끝납니다. 용어는 처음 등장하는 장면에서 <strong>정의 박스</strong>로 한 번 정의되고, 뒤 강에서는 다른 상황으로 다시 나옵니다. 강마다 먼저 생각해 보기와 확인 문제가 있으니, 답을 머릿속으로 말한 다음 펼쳐 보세요.</p>
      <p><strong>기본 경로</strong> — 01강부터 순서대로. <strong>빠른 경로 ★</strong> — 기출을 먼저 풀 수 있게 22강만 (${fastDone} / ${course.fast.length} 읽음).</p>
      <label class="toggle"><input type="checkbox" id="fast-only" ${state.fastOnly ? 'checked' : ''}> 빠른 경로 ★와 기출만 보기</label></section>
      ${state.last ? `<a class="backlink" href="#course/${state.last}">이어서 읽기 · ${esc(label(byId.get(state.last)))} ${esc(byId.get(state.last).title)} →</a>` : ''}
      <label for="search" class="filter-label">제목·본문 검색</label><input id="search" class="search-box" type="search" placeholder="Float, NCR, 매입판, Transmittal…"><div id="course-list"></div>${footer}`;
    courseList('');
  }
  function courseList(query) {
    const q = query.trim().toLowerCase(); let count = 0;
    const html = course.chapters.map(ch => {
      const found = ch.sections.filter(s => (!state.fastOnly || s.fast || s.kind === 'exam') && (s.id + ' ' + s.title + ' ' + s.md).toLowerCase().includes(q));
      count += found.length;
      if (!found.length) return '';
      return `<section><div class="section-title"><h2>${ch.num}장 · ${esc(ch.title)}</h2><span>${ch.sections.filter(s => isRead(s.id)).length} / ${ch.sections.length}</span></div><p class="note">${esc(ch.lead)}</p><div class="chapter-grid">${found.map(s => `<a class="chapter${s.kind === 'exam' ? ' exam' : ''}" href="#course/${s.id}"><span class="num">${s.kind === 'exam' ? '기출' : s.id}</span><div><strong>${s.fast ? '★ ' : ''}${esc(s.title)}</strong><small>${s.kind === 'exam' ? `PDF ${examById.get(s.id).page}쪽 · 먼저 풀고 해설 보기` : isRead(s.id) ? '✓ 읽음' : '안 읽음'}</small></div><span class="arrow" aria-hidden="true">→</span></a>`).join('')}</div></section>`;
    }).join('');
    $('course-list').innerHTML = html || '<p class="empty" role="status">검색 결과가 없습니다. 다른 단어로 검색해 보세요.</p>';
  }
  function reader(id) {
    const s = byId.get(id); if (!s) return courseHome();
    state.last = id; save();
    const list = state.fastOnly ? sections.filter(x => x.fast || x.kind === 'exam') : sections;
    const i = list.findIndex(x => x.id === id), prev = list[i - 1], next = list[i + 1];
    const defined = terms.filter(t => t.lesson === id).length;
    $('main').innerHTML = `<a class="backlink" href="#course">← 목차</a><div class="eyebrow">${s.chapter.num}장 · ${esc(s.chapter.title)}${s.fast ? ' · ★ 빠른 경로' : ''}</div>
      ${s.kind === 'exam' ? `<p><a class="button primary" href="#practice/${id}">해설을 가리고 먼저 풀기 (타이머) ↗</a></p>` : ''}
      <article class="panel prose">${md(s.md)}</article>
      ${defined ? `<p class="note">이 강에서 정의한 용어 ${defined}개는 읽음으로 표시하면 용어 카드에 들어갑니다.</p>` : ''}
      <button class="button full" data-action="read" data-id="${id}" aria-pressed="${isRead(id)}">${isRead(id) ? '✓ 읽음' : '읽음으로 표시'}</button>
      <nav class="book-nav" aria-label="이전·다음">${prev ? `<a class="button" href="#course/${prev.id}">← ${esc(label(prev))}</a>` : '<span></span>'}${next ? `<a class="button primary" href="#course/${next.id}">${esc(label(next))} →</a>` : ''}</nav>${footer}`;
  }

  // ---------- 기출 PT ----------
  function practiceHome() {
    $('main').innerHTML = `<div class="eyebrow">PRACTICE / PDF 14–18</div><h1>기출 PT 연습</h1><p class="intro">조건을 읽고, 계산하고, 내 판단을 말해 보세요.</p>
      <section class="panel"><h2>순서</h2><p>원문 조건 → 풀기 전 체크 → 힌트(필요할 때만 하나씩) → 내 답안 작성 → 해설과 비교 → 자기점검. 타이머는 준비·발표·질의응답 시간에 맞춰져 있습니다.</p><p class="note">질의응답 연습은 Claude에게 발표 답안을 붙여넣고 "면접관처럼 꼬리질문 해줘"라고 요청하세요.</p></section>
      <div class="chapter-grid">${exams.map(e => { const ready = e.lessons.filter(isRead).length; return `<a class="chapter exam" href="#practice/${e.id}"><span class="num">${e.page}쪽</span><div><strong>${esc(e.title)}</strong><small>선행 강 ${ready} / ${e.lessons.length} 읽음 · ${state.answers[e.id]?.trim() ? '답안 있음' : '답안 없음'}</small></div><span class="arrow" aria-hidden="true">→</span></a>`; }).join('')}</div>${footer}`;
  }
  function practice(id) {
    const e = examById.get(id); if (!e) return practiceHome();
    const s = byId.get(id), split = s.md.indexOf('## ④'), start = s.md.indexOf('## ①');
    timer = {remaining: e.prep * 60, deadline: 0, running: false};
    const missing = e.lessons.filter(l => !isRead(l));
    $('main').innerHTML = `<a class="backlink" href="#practice">← 기출 목록</a><div class="eyebrow">${esc(e.id)} / PDF ${e.page}쪽</div><h1>${esc(e.title)}</h1><div class="case-meta"><span class="pill">준비 ${e.prep}분</span><span class="pill">발표 5분</span><span class="pill">질의응답 ${e.qa}분</span></div>
      ${missing.length ? `<p class="note">아직 안 읽은 선행 강: ${missing.map(l => `${l}강`).join(', ')}. 먼저 읽고 오면 훨씬 수월합니다.</p>` : ''}
      <section class="panel"><label for="timer-mode">연습 단계</label><div class="practice-actions"><select id="timer-mode" class="timer-select"><option value="${e.prep}">준비 ${e.prep}분</option><option value="5">발표 5분</option><option value="${e.qa}">질의응답 ${e.qa}분</option></select><span id="timer" class="timer" role="timer" aria-label="남은 시간"></span><button class="button primary" data-action="timer">시작</button><button class="button" data-action="timer-reset">초기화</button></div><p id="timer-status" class="note" role="status"></p></section>
      <article class="panel prose">${md(s.md.slice(start, split))}</article>
      <details class="panel"><summary>PDF ${e.page}쪽 원문 보기</summary><p class="note">사용자가 제공한 PDF 해당 페이지입니다. 표·그림·문구를 직접 확인하세요.</p><a href="reference/page-${e.page}.png" target="_blank" rel="noopener" class="source-link">원문 이미지를 크게 열기 ↗</a><img class="source-image" src="reference/page-${e.page}.png" alt="PDF ${e.page}쪽 기출 원문" loading="lazy"></details>
      <section class="panel"><label for="answer"><h2>나의 발표 초안</h2></label><p class="note">결론 → 계산 근거 → 대안 비교 → 부서별 실행 → 추가 확인</p><textarea id="answer" class="answer-box" data-id="${id}" placeholder="먼저 내 판단을 적어 보세요…">${esc(state.answers[id] || '')}</textarea><p id="save-status" class="note" role="status">입력하면 이 브라우저에 자동 저장됩니다.</p></section>
      <details class="solution"><summary>작성 후 해설·계산 근거 펼치기</summary><article class="panel prose">${md(s.md.slice(split))}</article></details>
      <section class="panel"><h2>발표 후 자기점검</h2><p class="note">자기평가입니다. 정답 판정이나 합격 예측이 아닙니다.</p>${e.checks.map((text, i) => `<label class="self-check"><input type="checkbox" data-check="${i}" data-id="${id}" ${state.checks[id]?.[i] ? 'checked' : ''}>${esc(text)}</label>`).join('')}</section>
      <section><h2>막혔다면 돌아갈 강</h2><div class="practice-actions">${e.lessons.map(lessonLink).join('')}</div></section>${footer}`;
    updateTimer();
  }
  function updateTimer() {
    if (timer.running) {
      timer.remaining = Math.max(0, Math.ceil((timer.deadline - Date.now()) / 1000));
      if (timer.remaining === 0) { timer.running = false; const b = document.querySelector('[data-action="timer"]'); if (b) b.textContent = '시작'; if ($('timer-status')) $('timer-status').textContent = '연습 시간이 끝났습니다.'; }
    }
    if ($('timer')) $('timer').textContent = `${String(Math.floor(timer.remaining / 60)).padStart(2, '0')}:${String(timer.remaining % 60).padStart(2, '0')}`;
  }
  setInterval(updateTimer, 250);

  // ---------- 용어 카드 (간격 반복: 1·3·7·14·30일) ----------
  const deck = () => terms.filter(t => state.cardScope === 'all' || isRead(t.lesson));
  const due = () => deck().filter(t => (state.srs[t.key]?.due ?? 0) <= today());
  function pickCard() {
    const list = due();
    // Reviews already scheduled come before brand-new cards; within each group, the textbook order.
    list.sort((a, b) => (state.srs[a.key] ? 0 : 1) - (state.srs[b.key] ? 0 : 1));
    return list[0] || null;
  }
  function cardView() {
    if (!card || (state.srs[card.key]?.due ?? 0) > today()) { card = pickCard(); flipped = false; }
    const total = deck().length, remaining = due().length, learned = deck().filter(t => (state.srs[t.key]?.box ?? 0) >= 3).length;
    const scope = `<div class="practice-actions"><label class="toggle"><input type="radio" name="scope" value="read" ${state.cardScope === 'read' ? 'checked' : ''}> 읽은 강의 용어만</label><label class="toggle"><input type="radio" name="scope" value="all" ${state.cardScope === 'all' ? 'checked' : ''}> 전체 용어</label></div>`;
    if (!card) {
      $('main').innerHTML = `<div class="eyebrow">RECALL / 용어 카드</div><h1>오늘 볼 카드가 없습니다</h1><p class="intro">덱 ${total}장 · 오래 기억(3단계 이상) ${learned}장</p>${scope}<section class="panel"><p>${total ? '오늘 복습할 카드를 다 봤습니다. 다음 복습일에 다시 나옵니다.' : '아직 읽은 강이 없습니다. 강을 읽고 "읽음으로 표시"하면 그 강의 정의 박스가 카드로 들어옵니다.'}</p></section>${footer}`;
      return;
    }
    const t = card, box = state.srs[t.key]?.box ?? 0;
    $('main').innerHTML = `<div class="eyebrow">RECALL / 용어 카드</div><h1>뜻을 먼저 말해 보세요</h1><p class="intro">오늘 남은 카드 ${remaining}장 · 덱 ${total}장 · 오래 기억 ${learned}장</p>${scope}
      <article class="panel card"><span class="pill">${box ? `${box}단계 복습` : '새 카드'}</span>
        <h2 lang="en">${esc(t.en)}${t.abbr ? ` <small>(${esc(t.abbr)})</small>` : ''}</h2>
        ${flipped ? `<div class="card-answer"><p><strong>${esc(t.ko)}</strong>${t.slang ? ` · 현장말 ${esc(t.slang)}` : ''}</p><p>${esc(t.def)}</p>${t.ex ? `<p class="term-ex" lang="en">${esc(t.ex)}</p>` : ''}<p class="note">처음 나온 곳: <a href="#course/${t.lesson}">${t.lesson}강</a>${t.also.length ? ` · 다시 나오는 곳: ${t.also.slice(0, 6).map(x => `<a href="#course/${x}">${x}강</a>`).join(', ')}` : ''}</p></div>` : '<p class="note">한국어 이름과 뜻을 소리 내어 말한 뒤 뒤집으세요. (Space)</p>'}
      </article>
      ${flipped ? `<div class="practice-actions"><button class="button" data-grade="0">다시 (오늘 한 번 더)</button><button class="button" data-grade="1">애매 (내일)</button><button class="button primary" data-grade="2">앎 (${INTERVALS[Math.min(box, INTERVALS.length - 1)]}일 뒤)</button></div>` : `<button class="button primary full" data-action="flip">뒤집기</button>`}${footer}`;
  }
  function grade(g) {
    const r = state.srs[card.key] || {box: 0, due: today()};
    if (g === 0) { r.box = 0; r.due = today(); }
    else if (g === 1) { r.due = today() + 1; }
    else { r.due = today() + INTERVALS[Math.min(r.box, INTERVALS.length - 1)]; r.box = Math.min(r.box + 1, INTERVALS.length); }
    state.srs[card.key] = r; save();
    // "다시" keeps the card due today but moves it behind the others.
    if (g === 0) { const rest = due().filter(t => t.key !== card.key); card = rest[0] || card; flipped = false; }
    else card = null;
    cardView();
  }

  // ---------- 용어사전 ----------
  function glossaryView() {
    $('main').innerHTML = `<div class="eyebrow">GLOSSARY / 용어사전</div><h1>모르는 말을 찾는 곳</h1><p class="intro">정의 박스 ${terms.length}개 · 한글·영문·약어·현장말로 찾을 수 있습니다. 외우는 곳은 용어 카드입니다.</p>
      <label for="gsearch" class="filter-label">검색</label><input id="gsearch" class="search-box" type="search" placeholder="TF, 보류점, Transmittal, 와꾸…"><div id="glist"></div>${footer}`;
    glossaryList('');
  }
  function glossaryList(query) {
    const q = query.trim().toLowerCase();
    const found = terms.filter(t => [t.ko, t.en, t.abbr, t.slang, t.def].join(' ').toLowerCase().includes(q));
    $('glist').innerHTML = found.length ? found.map(t => `<aside class="term"><div class="term-head"><strong>${esc(t.ko)}</strong><span class="term-en">${esc(t.en)}</span>${t.abbr ? `<span class="term-abbr">${esc(t.abbr)}</span>` : ''}${t.slang ? `<span class="term-slang">현장말 · ${esc(t.slang)}</span>` : ''}</div><p>${esc(t.def)}</p>${t.ex ? `<p class="term-ex" lang="en">${esc(t.ex)}</p>` : ''}<p class="note"><a href="#course/${t.lesson}">${t.lesson}강에서 정의</a>${t.also.length ? ` · 다시 나옴 ${t.also.length}곳` : ''}</p></aside>`).join('') : '<p class="empty" role="status">찾는 용어가 없습니다.</p>';
  }

  // ---------- 기록 ----------
  function records() {
    const lessons = sections.filter(s => s.kind === 'lesson');
    const answers = exams.filter(e => state.answers[e.id]?.trim()).length;
    const learned = terms.filter(t => (state.srs[t.key]?.box ?? 0) >= 3).length;
    $('main').innerHTML = `<div class="eyebrow">MY STUDY</div><h1>나의 학습 기록</h1><p class="intro">같은 브라우저에서 이어서 공부합니다.</p>
      <div class="stats"><div class="stat"><span>읽은 강</span><strong>${lessons.filter(s => isRead(s.id)).length} / ${lessons.length}</strong></div><div class="stat"><span>빠른 경로 ★</span><strong>${course.fast.filter(isRead).length} / ${course.fast.length}</strong></div><div class="stat"><span>기출 답안</span><strong>${answers} / ${exams.length}</strong></div><div class="stat"><span>오래 기억한 용어</span><strong>${learned} / ${terms.length}</strong></div></div>
      <section class="panel"><h2>장별 진도</h2>${course.chapters.map(ch => { const n = ch.sections.filter(s => isRead(s.id)).length; return `<div class="progress-row"><span>${ch.num}장 ${esc(ch.title)}</span><progress max="${ch.sections.length}" value="${n}"></progress><span>${n}/${ch.sections.length}</span></div>`; }).join('')}</section>
      <section class="panel"><h2>백업</h2><p class="note">진도·답안·카드 기록을 JSON으로 내려받습니다. Claude에게 이 파일을 주면 약한 용어와 판단을 골라 보충 문제를 만들 수 있습니다.</p><div class="practice-actions"><button class="button primary" data-action="export">JSON 내려받기</button><button class="button danger" data-action="reset">기록 초기화</button></div></section>${footer}`;
  }

  // ---------- 라우팅·이벤트 ----------
  function route() {
    timer.running = false;
    const [name, arg] = (location.hash || '#course').slice(1).split('/');
    const valid = ['course', 'practice', 'cards', 'glossary', 'home'];
    if (!valid.includes(name)) { location.replace('#course'); return; }
    document.querySelectorAll('#tabs a').forEach(a => { const active = a.dataset.tab === name; a.classList.toggle('active', active); if (active) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
    if (name === 'course') { if (arg) reader(arg); else courseHome(); }
    else if (name === 'practice') { if (arg) practice(arg); else practiceHome(); }
    else if (name === 'cards') { card = null; cardView(); }
    else if (name === 'glossary') glossaryView();
    else records();
    document.title = `${byId.get(arg)?.title || {course: '교재', practice: '기출 PT', cards: '용어 카드', glossary: '용어사전', home: '학습 기록'}[name]} | 현대건설 뉴에너지 토목`;
    scrollTo(0, 0); $('main').focus({preventScroll: true});
  }
  document.addEventListener('input', event => {
    const t = event.target;
    if (t.id === 'search') courseList(t.value);
    if (t.id === 'gsearch') glossaryList(t.value);
    if (t.id === 'answer') { state.answers[t.dataset.id] = t.value; $('save-status').textContent = save() ? '저장했습니다.' : '브라우저 저장 실패 · 기록 탭에서 백업하세요.'; }
  });
  document.addEventListener('change', event => {
    const t = event.target;
    if (t.id === 'fast-only') { state.fastOnly = t.checked; save(); courseList($('search').value); }
    if (t.name === 'scope') { state.cardScope = t.value; save(); card = null; cardView(); }
    if (t.dataset.check !== undefined) { const e = examById.get(t.dataset.id); state.checks[e.id] ||= e.checks.map(() => false); state.checks[e.id][Number(t.dataset.check)] = t.checked; save(); }
    if (t.id === 'timer-mode') { timer = {remaining: Number(t.value) * 60, deadline: 0, running: false}; document.querySelector('[data-action="timer"]').textContent = '시작'; $('timer-status').textContent = ''; updateTimer(); }
  });
  document.addEventListener('click', event => {
    const b = event.target.closest('button'); if (!b) return;
    const action = b.dataset.action;
    if (action === 'read') { const id = b.dataset.id; state.read = isRead(id) ? state.read.filter(x => x !== id) : [...state.read, id]; save(); b.textContent = isRead(id) ? '✓ 읽음' : '읽음으로 표시'; b.setAttribute('aria-pressed', String(isRead(id))); if (isRead(id) && terms.some(t => t.lesson === id)) toast('이 강의 용어가 카드에 들어갔습니다.'); }
    if (action === 'timer') { if (timer.running) { updateTimer(); timer.running = false; b.textContent = '계속'; } else if (timer.remaining > 0) { timer.deadline = Date.now() + timer.remaining * 1000; timer.running = true; b.textContent = '일시정지'; } }
    if (action === 'timer-reset') { timer = {remaining: Number($('timer-mode').value) * 60, deadline: 0, running: false}; document.querySelector('[data-action="timer"]').textContent = '시작'; $('timer-status').textContent = ''; updateTimer(); }
    if (action === 'flip') { flipped = !flipped; cardView(); }
    if (b.dataset.grade) grade(Number(b.dataset.grade));
    if (action === 'export') { const url = URL.createObjectURL(new Blob([JSON.stringify(state, null, 2)], {type: 'application/json'})); const a = document.createElement('a'); a.href = url; a.download = 'hyundai-ne-study-' + new Date().toISOString().slice(0, 10) + '.json'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
    if (action === 'reset' && confirm('이 브라우저의 진도·답안·자기점검·카드 기록을 모두 삭제할까요?')) { state = defaults(); save(); records(); toast('학습 기록을 초기화했습니다.'); }
  });
  document.addEventListener('keydown', event => {
    if (['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A', 'SUMMARY'].includes(event.target.tagName)) return;
    if (location.hash === '#cards' && event.code === 'Space' && card) { event.preventDefault(); flipped = !flipped; cardView(); }
  });
  addEventListener('hashchange', route); route();
})();
