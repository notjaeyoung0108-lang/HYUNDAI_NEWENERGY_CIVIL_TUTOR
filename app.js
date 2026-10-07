/* Local, dependency-free reader and PT practice. */
(() => {
  'use strict';
  const KEY = 'hyundai_newenergy_civil.v1';
  const course = window.COURSE, cases = window.PRACTICE, cards = window.CARDS;
  const sections = course.chapters.flatMap(ch => ch.sections.map(s => ({...s, chapter:ch})));
  const byId = new Map(sections.map(s => [s.id,s]));
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const md = window.renderMarkdown;
  const defaults = () => ({version:1,read:[],last:'',answers:{},checks:{},grades:{}});
  let state = defaults(), cardIndex = 0, flipped = false;
  let timer = {remaining:0,deadline:0,running:false};
  function storageWarning(message) { $('storage-warning').hidden = false; $('storage-warning').textContent = message; }
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if(raw?.version === 1) {
      state.read = Array.isArray(raw.read) ? [...new Set(raw.read.filter(x=>byId.has(x)))] : [];
      state.last = byId.has(raw.last) ? raw.last : '';
      for(const c of cases) {
        state.answers[c.id] = typeof raw.answers?.[c.id] === 'string' ? raw.answers[c.id] : '';
        state.checks[c.id] = c.checks.map((_,i)=>raw.checks?.[c.id]?.[i] === true);
      }
      cards.forEach((_,i)=>{if([1,2,3].includes(raw.grades?.[i]))state.grades[i]=raw.grades[i];});
    }
  } catch { storageWarning('저장 기록을 읽지 못했습니다. 현재 학습은 가능하며 기록 탭에서 백업할 수 있습니다.'); }
  function save() {
    try { localStorage.setItem(KEY,JSON.stringify(state)); return true; }
    catch { storageWarning('브라우저 저장이 불가능합니다. 기록 탭에서 JSON 백업을 내려받으세요.'); return false; }
  }
  let toastId;
  function toast(message) { $('toast').textContent=message; $('toast').classList.add('visible'); clearTimeout(toastId); toastId=setTimeout(()=>$('toast').classList.remove('visible'),2200); }
  const footer = '<p class="footer-note">HYUNDAI NEW ENERGY CIVIL · 개인 학습도구 · 현대건설 공식 서비스가 아닙니다.<br>기출 해설은 학습용 제안이며 공식 정답이 아닙니다. 학습 기록은 이 브라우저에 저장됩니다.</p>';
  const lessonLink = id => `<a class="button subtle" href="#course/${id}">${esc(id)} ${esc(byId.get(id)?.title || '')}</a>`;
  function courseHome() {
    $('main').innerHTML=`<div class="eyebrow">COURSE / NEW ENERGY CIVIL</div><div class="topline"><div><h1>${esc(course.title)}</h1><p class="intro">기본 Flow → 올바른 상황 → 기출문제 풀이</p></div><span class="pill">${sections.length} SECTIONS</span></div>
      <section class="panel"><h2>현장을 이해하고, 기출을 설명합니다</h2><p>공정·자재·품질의 기본 순서를 세우고 원전 토목의 정상 시공과 인계를 익힙니다. 마지막에는 실제 기출의 수치와 제약으로 판단을 연습합니다.</p><p class="note">제공 PDF 14~18쪽 NewEnergy 5문항 전체 연결 · 배관 문제는 토목 인계 관점까지 다룹니다. 자료의 공기·금액·벌칙은 문제 속 가정입니다.</p><a class="button primary" href="#practice">기출 PT 시작 ↗</a></section>
      ${state.last?`<a class="backlink" href="#course/${state.last}">이어서 읽기 · ${esc(byId.get(state.last).title)} →</a>`:''}
      <label for="search" class="filter-label">교재 제목·본문 검색</label><input id="search" class="search-box" type="search" placeholder="주공정, NCR, 콘크리트…"><div id="course-list"></div>${footer}`;
    courseList('');
  }
  function courseList(query) {
    const q=query.trim().toLowerCase(); let count=0;
    const html=course.chapters.map(ch=>{
      const found=ch.sections.filter(s=>(s.id+' '+s.title+' '+s.md).toLowerCase().includes(q)); count+=found.length;
      if(!found.length)return '';
      return `<section><div class="section-title"><h2>${String(ch.num).padStart(2,'0')} 챕터 ${ch.num} · ${esc(ch.title)}</h2><span>${ch.sections.filter(s=>state.read.includes(s.id)).length} / ${ch.sections.length}</span></div><p class="note">${esc(ch.lead)}</p><div class="chapter-grid">${found.map(s=>`<a class="chapter" href="#course/${s.id}"><span class="num">${s.id}</span><div><strong>${esc(s.title)}</strong><small>${state.read.includes(s.id)?'✓ 읽음':'아직 읽지 않음'}</small></div><span class="arrow" aria-hidden="true">↗</span></a>`).join('')}</div></section>`;
    }).join('');
    $('course-list').innerHTML=html || '<p class="empty" role="status">검색 결과가 없습니다. 다른 단어로 검색해 보세요.</p>';
  }
  function reader(id) {
    const s=byId.get(id); if(!s)return courseHome();
    state.last=id; save(); const index=sections.findIndex(x=>x.id===id), c=cases.find(x=>x.id===id);
    $('main').innerHTML=`<a class="backlink" href="#course">← 교재 목차</a><div class="eyebrow">챕터 ${s.chapter.num} · ${esc(s.chapter.title)}</div>${c?`<p><a class="button primary" href="#practice/${id}">해설을 가리고 먼저 풀기 ↗</a></p>`:''}<article class="panel prose">${md(s.md)}</article><button class="button full" data-action="read" data-id="${id}" aria-pressed="${state.read.includes(id)}">${state.read.includes(id)?'✓ 읽은 절':'읽음으로 표시'}</button><div class="book-nav">${index>0?`<a class="button" href="#course/${sections[index-1].id}">← ${sections[index-1].id}</a>`:'<span></span>'}<a class="button subtle" href="#course">목차</a>${index<sections.length-1?`<a class="button" href="#course/${sections[index+1].id}">${sections[index+1].id} →</a>`:'<a class="button" href="#practice">기출 PT →</a>'}</div>${footer}`;
  }
  function practiceHome() {
    $('main').innerHTML=`<div class="eyebrow">PRACTICE / PDF 14–18</div><h1>기출 PT 연습</h1><p class="intro">조건을 읽고, 계산하고, 내 판단을 말해보세요.</p><section class="panel"><h2>답을 쓰기 전에는 해설을 가립니다</h2><p>원문 조건과 질문 → 답안 작성 → 해설 비교 → 자기점검 순서입니다. 타이머는 준비·발표·질의응답 시간을 각각 연습합니다. 자동 채점은 하지 않습니다.</p></section><div class="chapter-grid">${cases.map(c=>`<a class="chapter" href="#practice/${c.id}"><span class="num">${c.id}</span><div><strong>${c.title}</strong><small>PDF ${c.page}쪽 · 준비 ${c.prep}분 · ${state.answers[c.id]?.trim()?'답안 있음':'시작 전'}</small></div><span class="arrow">↗</span></a>`).join('')}</div>${footer}`;
  }
  function practice(id) {
    const c=cases.find(x=>x.id===id); if(!c)return practiceHome();
    const s=byId.get(id), split=s.md.indexOf('## ④');
    timer={remaining:c.prep*60,deadline:0,running:false};
    $('main').innerHTML=`<a class="backlink" href="#practice">← 기출 목록</a><div class="eyebrow">${c.id} / PDF ${c.page}쪽</div><h1>${c.title}</h1><div class="case-meta"><span class="pill">준비 ${c.prep}분</span><span class="pill">발표 5분</span><span class="pill">질의응답 ${c.qa}분</span></div>
      <section class="panel"><label for="timer-mode">연습 단계</label><div class="practice-actions"><select id="timer-mode" class="timer-select"><option value="${c.prep}">준비 ${c.prep}분</option><option value="5">발표 5분</option><option value="${c.qa}">질의응답 ${c.qa}분</option></select><span id="timer" class="timer" role="timer" aria-label="남은 시간"></span><button class="button" data-action="timer">시작</button><button class="button subtle" data-action="timer-reset">다시 맞추기</button></div><p class="note">화면을 이동하면 타이머는 초기화되고 작성 답안은 저장됩니다.</p><p id="timer-status" role="status"></p></section>
      <article class="panel prose">${md(s.md.slice(s.md.indexOf('## ①'),split))}</article>
      <details class="panel"><summary>PDF ${c.page}쪽 원문 보기</summary><p class="note">사용자가 제공한 PDF 해당 페이지입니다. 표·도표·문구를 직접 확인하세요.</p><a href="reference/page-${c.page}.png" target="_blank" rel="noopener" class="source-link">원문 이미지를 크게 열기 ↗</a><img class="source-image" src="reference/page-${c.page}.png" alt="PDF ${c.page}쪽 NewEnergy 기출문제 원문" loading="lazy"></details>
      <section class="panel"><label for="answer"><h2>나의 발표 초안</h2></label><p class="note">결론 → 계산 근거 → 대안 비교 → 담당자별 실행 → 추가 확인</p><textarea id="answer" class="answer-box" data-id="${id}" placeholder="먼저 내 판단을 적어보세요…">${esc(state.answers[id]||'')}</textarea><p id="save-status" class="note" role="status">입력하면 이 브라우저에 자동 저장됩니다.</p></section>
      <details class="solution"><summary>작성 후 해설·계산 근거 펼치기</summary><article class="panel prose">${md(s.md.slice(split))}</article></details>
      <section class="panel"><h2>발표 후 자기점검</h2><p class="note">체크는 자기평가입니다. 정답 판정이나 합격 예측 점수가 아닙니다.</p>${c.checks.map((label,i)=>`<label class="self-check"><input type="checkbox" data-check="${i}" data-id="${id}" ${state.checks[id]?.[i]?'checked':''}>${esc(label)}</label>`).join('')}</section>
      <section><h2>막혔다면 돌아갈 학습</h2><div class="practice-actions">${c.lessons.map(lessonLink).join('')}</div></section>${footer}`;
    updateTimer();
  }
  function updateTimer() {
    if(timer.running) {
      timer.remaining=Math.max(0,Math.ceil((timer.deadline-Date.now())/1000));
      if(timer.remaining===0) {timer.running=false;const b=document.querySelector('[data-action="timer"]');if(b)b.textContent='시작';if($('timer-status'))$('timer-status').textContent='연습 시간이 끝났습니다.';}
    }
    if($('timer'))$('timer').textContent=`${String(Math.floor(timer.remaining/60)).padStart(2,'0')}:${String(timer.remaining%60).padStart(2,'0')}`;
  }
  setInterval(updateTimer,250);
  function cardView() {
    const [question,answer,section]=cards[cardIndex];
    $('main').innerHTML=`<div class="eyebrow">RECALL / 핵심 암기</div><h1>계산보다 먼저 떠올릴 원리</h1><p class="intro">${cardIndex+1} / ${cards.length} · 마지막 자기평가 ${state.grades[cardIndex]?['','다시 보기','헷갈림','설명 가능'][state.grades[cardIndex]]:'없음'}</p><article class="panel"><span class="pill">${flipped?'ANSWER':'QUESTION'}</span><h2>${esc(question)}</h2><div class="card-answer">${flipped?`<p>${esc(answer)}</p>${lessonLink(section)}`:'<p class="note">눈으로 읽기 전에 소리 내어 답해보세요.</p>'}</div></article><button class="button primary full" data-action="flip">${flipped?'질문 다시 보기':'정답 보기'}</button>${flipped?'<div class="practice-actions"><button class="button" data-grade="1">다시 보기</button><button class="button" data-grade="2">헷갈림</button><button class="button" data-grade="3">설명 가능</button></div>':''}<div class="book-nav"><button class="button" data-action="card-prev">← 이전</button><span>Space로 뒤집기</span><button class="button" data-action="card-next">다음 →</button></div>${footer}`;
  }
  function records() {
    const answers=cases.filter(c=>state.answers[c.id]?.trim()).length;
    $('main').innerHTML=`<div class="eyebrow">MY STUDY</div><h1>나의 학습 기록</h1><p class="intro">같은 브라우저에서 이어서 공부합니다.</p><div class="stats"><div class="stat"><span>읽은 교재</span><strong>${state.read.length} / ${sections.length}</strong></div><div class="stat"><span>작성한 기출 답안</span><strong>${answers} / ${cases.length}</strong></div><div class="stat"><span>평가한 암기 카드</span><strong>${Object.keys(state.grades).length} / ${cards.length}</strong></div></div><section class="panel"><h2>챕터별 진도</h2>${course.chapters.map(ch=>{const n=ch.sections.filter(s=>state.read.includes(s.id)).length;return `<div class="progress-row"><div class="progress-head"><strong>${ch.title}</strong><span>${n}/${ch.sections.length}</span></div><progress max="${ch.sections.length}" value="${n}" aria-label="${ch.title} 읽기 진도"></progress></div>`;}).join('')}</section><section class="panel"><h2>기출 답안과 자기점검</h2>${cases.map(c=>`<p><a href="#practice/${c.id}">${c.id} ${c.title} ↗</a><br><small>${state.answers[c.id]?.trim()?'답안 저장됨':'답안 없음'} · 자기점검 ${(state.checks[c.id]||[]).filter(Boolean).length}/${c.checks.length}</small></p>`).join('')}</section><section class="panel"><h2>기록 보관</h2><p>기기 간 자동 동기화는 없습니다. 초기화 전에 JSON 백업으로 답안과 진도를 보관하세요.</p><div class="practice-actions"><button class="button primary" data-action="export">JSON 백업</button><button class="button" data-action="reset">학습 기록 초기화</button></div></section>${footer}`;
  }
  function route() {
    timer.running=false;
    const [name,arg]=(location.hash||'#course').slice(1).split('/');
    const valid=['course','practice','cards','home'];
    if(!valid.includes(name)){location.replace('#course');return;}
    document.querySelectorAll('#tabs a').forEach(a=>{const active=a.dataset.tab===name;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    if(name==='course'){if(arg)reader(arg);else courseHome();}
    else if(name==='practice'){if(arg)practice(arg);else practiceHome();}
    else if(name==='cards')cardView(); else records();
    document.title=`${byId.get(arg)?.title||{course:'교재',practice:'기출 PT',cards:'핵심 암기',home:'학습 기록'}[name]} | 현대건설 뉴에너지 토목`;
    scrollTo(0,0); $('main').focus({preventScroll:true});
  }
  document.addEventListener('input',event=>{
    if(event.target.id==='search')courseList(event.target.value);
    if(event.target.id==='answer'){state.answers[event.target.dataset.id]=event.target.value;$('save-status').textContent=save()?'저장했습니다.':'브라우저 저장 실패 · 기록 탭에서 백업하세요.';}
  });
  document.addEventListener('change',event=>{
    const t=event.target;
    if(t.dataset.check!==undefined){const c=cases.find(x=>x.id===t.dataset.id);state.checks[c.id] ||= c.checks.map(()=>false);state.checks[c.id][Number(t.dataset.check)]=t.checked;save();}
    if(t.id==='timer-mode'){timer={remaining:Number(t.value)*60,deadline:0,running:false};document.querySelector('[data-action="timer"]').textContent='시작';$('timer-status').textContent='';updateTimer();}
  });
  document.addEventListener('click',event=>{
    const b=event.target.closest('button');if(!b)return;
    const action=b.dataset.action;
    if(action==='read'){const id=b.dataset.id;state.read=state.read.includes(id)?state.read.filter(x=>x!==id):[...state.read,id];save();b.textContent=state.read.includes(id)?'✓ 읽은 절':'읽음으로 표시';b.setAttribute('aria-pressed',String(state.read.includes(id)));}
    if(action==='timer'){if(timer.running){updateTimer();timer.running=false;b.textContent='계속';}else if(timer.remaining>0){timer.deadline=Date.now()+timer.remaining*1000;timer.running=true;b.textContent='일시정지';}}
    if(action==='timer-reset'){timer={remaining:Number($('timer-mode').value)*60,deadline:0,running:false};document.querySelector('[data-action="timer"]').textContent='시작';$('timer-status').textContent='';updateTimer();}
    if(action==='flip'){flipped=!flipped;cardView();}
    if(action==='card-next'||action==='card-prev'){cardIndex=(cardIndex+(action==='card-next'?1:cards.length-1))%cards.length;flipped=false;cardView();}
    if(b.dataset.grade){state.grades[cardIndex]=Number(b.dataset.grade);save();cardIndex=(cardIndex+1)%cards.length;flipped=false;cardView();}
    if(action==='export'){const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='hyundai-ne-study-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
    if(action==='reset'&&confirm('이 브라우저의 현대건설 학습 진도·답안·자기점검을 모두 삭제할까요?')){state=defaults();save();records();toast('학습 기록을 초기화했습니다.');}
  });
  document.addEventListener('keydown',event=>{if(['INPUT','TEXTAREA','SELECT','BUTTON','A','SUMMARY'].includes(event.target.tagName))return;if(location.hash==='#cards'&&event.code==='Space'){event.preventDefault();flipped=!flipped;cardView();}});
  addEventListener('hashchange',route); route();
})();
