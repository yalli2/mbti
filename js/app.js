/* 앱 본체: 라우터 · 내비게이션 · 챕터 공통 틀 · 퀴즈 */
(function () {
  const ST = window.ST, S = ST.store;
  const { h, clear, add } = ST;
  const app = document.getElementById('app');
  const nav = document.getElementById('chapnav');
  let unsubs = [];
  let live = { users: {}, prog: {} };

  const isSample = (id) => /^s\d\d$/.test(id);
  ST.isSample = isSample;
  ST.sampleNote = () => (S.mode === 'live' ? null : h('p', { class: 'sample-note' }, S.samples ? '💡 단독 모드: 가상의 참가자 12명(샘플)의 결과가 함께 표시됩니다. 실시간 공유를 켜면 실제 참가자들의 결과로 바뀝니다. ' : '💡 단독 모드: 샘플 참가자를 숨겼어요. ', h('button', { type: 'button', class: 'btn sm', onclick: () => { S.setSamples(!S.samples); route(); } }, S.samples ? '샘플 숨기기' : '샘플 보기')));

  /* ── 진행 상황 ── */
  const progKey = () => 'ts.prog.' + S.room;
  function localProg() { try { return JSON.parse(localStorage.getItem(progKey()) || '{}'); } catch (e) { return {}; } }
  function markDone(key) {
    const p = localProg(); p[key] = 1; try { localStorage.setItem(progKey(), JSON.stringify(p)); } catch (e) {}
    if (S.me.name) S.put(`prog/${S.me.id}/${key}`, 1).catch(() => {});
    renderNav();
  }
  const isDone = (key) => !!(localProg()[key] || (live.prog[S.me.id] && live.prog[S.me.id][key]));

  /* ── 전역 구독 ── */
  let gUnsubs = [];
  function startGlobal() {
    gUnsubs.forEach((f) => f()); gUnsubs = [];
    gUnsubs.push(S.watch('users', (d) => { live.users = d || {}; ST.names = live.users; ST.bus.emit('users'); }));
    gUnsubs.push(S.watch('prog', (d) => { live.prog = d || {}; renderNav(); ST.bus.emit('prog'); }));
  }
  ST.bus = (function () { const m = {}; return { on(k, f) { (m[k] = m[k] || []).push(f); return () => { m[k] = m[k].filter((x) => x !== f); }; }, emit(k) { (m[k] || []).forEach((f) => f()); } }; })();
  ST.live = live;
  function register() { if (S.me.name) S.put('users/' + S.me.id, { name: S.me.name, t: Date.now() }).catch(() => {}); }

  /* ── 내비 ── */
  function renderNav() {
    const cur = parseRoute();
    clear(nav);
    nav.appendChild(h('h2', {}, 'Chapters'));
    nav.appendChild(h('a', { href: '#/', class: cur.home ? 'on' : '' }, h('span', { class: 'n' }, '◎'), h('span', {}, '프로그램 소개'), h('span')));
    ST.chapters.forEach((c) => nav.appendChild(h('a', { href: '#/ch/' + c.n, class: (cur.n === c.n ? 'on ' : '') + (isDone(c.key) ? 'done' : '') }, h('span', { class: 'n' }, String(c.n).padStart(2, '0')), h('span', {}, c.title), h('span', { class: 'ck', title: isDone(c.key) ? '실습 완료' : '' }))));
  }
  document.getElementById('menuBtn').addEventListener('click', () => { const o = nav.classList.toggle('open'); document.getElementById('menuBtn').setAttribute('aria-expanded', String(o)); });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) { nav.classList.remove('open'); } });

  /* ── 상태/방 ── */
  const statusEl = document.getElementById('status'), roomBtn = document.getElementById('roomBtn');
  S.onStatus((s) => {
    statusEl.className = 'status ' + s;
    statusEl.textContent = { live: '실시간 연결', connecting: '연결 중…', offline: '연결 끊김', local: '단독 모드' }[s] || s;
  });
  function renderRoomBtn() { roomBtn.textContent = (S.me.name || '이름 정하기') + ' · ' + S.room; }
  const dlg = document.getElementById('join');
  function openJoin(first) {
    document.getElementById('jn-name').value = S.me.name || '';
    document.getElementById('jn-room').value = S.room;
    document.getElementById('join-cancel').style.display = first && !S.me.name ? 'none' : '';
    if (!dlg.open) dlg.showModal();
    setTimeout(() => document.getElementById('jn-name').focus(), 30);
  }
  roomBtn.addEventListener('click', () => openJoin(false));
  document.getElementById('join-cancel').addEventListener('click', () => dlg.close());
  document.getElementById('join-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('jn-name').value.trim().slice(0, 12);
    if (!name) return;
    const oldRoom = S.room;
    S.setName(name); S.setRoom(document.getElementById('jn-room').value);
    dlg.close(); renderRoomBtn();
    if (S.room !== oldRoom) { location.href = location.pathname + '?room=' + encodeURIComponent(S.room) + location.hash; return; }
    register(); route();
  });

  /* ── 라우팅 ── */
  function parseRoute() {
    const m = location.hash.match(/^#\/ch\/(\d+)(?:\/(\d))?/);
    if (m) return { n: +m[1], step: m[2] != null ? +m[2] : 0 };
    return { home: true };
  }
  function cleanup() { unsubs.forEach((f) => f()); unsubs = []; }
  function route() {
    cleanup();
    const r = parseRoute();
    renderNav();
    clear(app);
    if (r.home) renderHome(); else {
      const ch = ST.chapters.find((c) => c.n === r.n);
      if (!ch) renderHome(); else renderChapter(ch, r.step);
    }
    window.scrollTo({ top: 0 });
  }
  window.addEventListener('hashchange', route);

  /* ── 챕터 컨텍스트 ── */
  function makeCtx(ch) {
    return {
      ch, key: ch.key, me: S.me, store: S,
      watch(base, cb) { const u = S.watch(base, cb); unsubs.push(u); return u; },
      ready(base, cb) {            // 내 데이터 한 번 불러오기
        let fired = false, un;
        const go = (d) => { if (fired) return; fired = true; setTimeout(() => un && un(), 0); cb(d || {}); };
        un = S.watch(base, go); unsubs.push(() => un && un());
        setTimeout(() => go({}), 1800);
      },
      put(path, v) { return S.put(`${ch.key}/${path}`, v).catch(() => ST.toast('저장하지 못했어요. 연결을 확인해 주세요.')); },
      putMine(sub, v) { return this.put(`${S.me.id}${sub ? '/' + sub : ''}`, v); },
      onLeave(fn) { unsubs.push(fn); },
      done() { markDone(ch.key); }
    };
  }

  /* ── 챕터 페이지 ── */
  const STEPS = ['배우기', '실습하기', '함께 보기', '확인하기'];
  function renderChapter(ch, step) {
    const ctx = makeCtx(ch);
    app.appendChild(h('header', { class: 'chead' },
      h('div', { class: 'no' }, `Chapter ${String(ch.n).padStart(2, '0')} · 교재 ${ch.pages}`),
      h('h1', {}, ch.title), h('div', { class: 'en' }, ch.en), h('p', { class: 'goal' }, ch.goal)));
    const bar = h('div', { class: 'steps', role: 'tablist' }, STEPS.map((s, i) => h('button', { role: 'tab', 'aria-selected': String(i === step), class: i === step ? 'on' : '', onclick: () => { location.hash = `#/ch/${ch.n}/${i}`; } }, h('span', { class: 'i' }, i + 1), s)));
    app.appendChild(bar);
    const pane = h('div', { class: 'pane' });
    app.appendChild(pane);
    const needsSignIn = step > 0 && !S.me.name;
    if (needsSignIn) {
      pane.appendChild(h('div', { class: 'card' }, h('h3', { class: 'card-t' }, '먼저 이름을 정해 주세요'), h('p', { class: 'p' }, '실습 결과를 모두와 함께 보려면 이름(별칭)이 필요해요.'), ST.btn('이름 정하기', { kind: 'primary', onclick: () => openJoin(true) })));
    } else if (step === 0) add(pane, ch.learn(ctx));
    else if (step === 1) add(pane, ch.practice(ctx));
    else if (step === 2) add(pane, [ST.sampleNote(), ch.together(ctx)]);
    else add(pane, quiz(ctx, ch));
    const prev = step > 0 ? h('a', { class: 'btn', href: `#/ch/${ch.n}/${step - 1}` }, '← ' + STEPS[step - 1]) : (ch.n > 1 ? h('a', { class: 'btn ghost', href: `#/ch/${ch.n - 1}/0` }, '← 이전 챕터') : h('span'));
    const nextCh = ST.chapters.find((c) => c.n === ch.n + 1);
    const next = step < 3 ? h('a', { class: 'btn primary', href: `#/ch/${ch.n}/${step + 1}` }, STEPS[step + 1] + ' →') : (nextCh ? h('a', { class: 'btn primary', href: `#/ch/${nextCh.n}/0` }, `다음 챕터: ${nextCh.title} →`) : h('a', { class: 'btn primary', href: '#/' }, '처음으로'));
    pane.appendChild(h('div', { class: 'pager' }, prev, next));
    app.focus({ preventScroll: true });
  }

  /* ── 퀴즈 ── */
  function quiz(ctx, ch) {
    const wrap = h('div');
    wrap.appendChild(h('p', { class: 'p' }, '배운 내용을 3문항으로 가볍게 확인해 보세요. 답을 고르면 바로 해설과 함께, 함께하는 사람들의 정답률이 나타납니다.'));
    let rates = {};
    const boxes = [];
    ch.quiz.forEach((q, qi) => {
      const rate = h('div', { class: 'rate' });
      const why = h('div', { class: 'why', hidden: true });
      const opts = q.opts.map((o, oi) => h('button', { type: 'button', class: 'opt', onclick: () => pick(oi) }, o));
      function paint(sel) {
        opts.forEach((b, oi) => { b.disabled = sel != null; b.classList.toggle('right', sel != null && oi === q.a); b.classList.toggle('wrong', sel === oi && oi !== q.a); });
        if (sel != null) { why.hidden = false; why.innerHTML = (sel === q.a ? '✅ 정답! ' : '❌ 아쉬워요. ') + ST.esc(q.why); }
      }
      function pick(oi) { ctx.put(`q/${S.me.id}/${qi}`, oi); paint(oi); ctx.done(); }
      boxes.push({ paint, rate, qi });
      wrap.appendChild(h('div', { class: 'q' }, h('h4', {}, h('span', { class: 'qn' }, 'Q' + (qi + 1)), q.q), opts, why, rate));
    });
    ctx.watch(`${ch.key}/q`, (d) => {
      const mine = d[S.me.id];
      boxes.forEach((b) => {
        const all = Object.keys(d).map((u) => d[u] && d[u][b.qi]).filter((v) => v != null);
        const ok = all.filter((v) => +v === ch.quiz[b.qi].a).length;
        b.rate.textContent = all.length ? `함께한 ${all.length}명 중 ${Math.round((ok / all.length) * 100)}%가 맞혔어요` : '';
        if (mine && mine[b.qi] != null && !b.locked) { b.locked = true; b.paint(+mine[b.qi]); }
      });
    });
    return wrap;
  }

  /* ── 홈 ── */
  function renderHome() {
    const D = ST.D;
    const art = h('div', { class: 'hero-art', 'aria-hidden': 'true' }, D.ALL.map((c) => h('span', { style: { background: ST.PAL[(D.ALL.indexOf(c) * 3) % 8] } }, c)));
    const hero = h('section', { class: 'hero' }, h('div', { class: 'hero-grid' },
      h('div', {},
        h('p', { class: 'eyebrow' }, 'HR · Adult Learning Program'),
        h('p', { class: 'tagline' }, 'Type Symphony'),
        h('h1', {}, '서로 다른 선율이 ', h('em', {}, '하모니'), '가 되는 시간'),
        h('p', { class: 'lede' }, '성격 유형 이론의 기초를 9개 챕터로 나누어, 직접 선호를 탐색하고 모두의 결과를 한 화면에서 겹쳐 보며 배우는 실시간 워크숍입니다. 16개의 유형을 “좋고 나쁨”이 아니라 서로 다른 악기로 이해하고, 팀의 차이를 자원으로 바꾸는 법을 익힙니다.'),
        h('div', { class: 'hero-actions' }, h('a', { class: 'btn gold', href: '#/ch/1/0' }, '1장부터 시작하기'), h('a', { class: 'btn', style: { background: 'transparent', color: '#F4F1E8', borderColor: '#5B6B7C' }, href: '#/ch/7/1' }, '내 유형 찾기'))),
      art));
    app.appendChild(hero);
    const st = h('div', { class: 'stats' });
    app.appendChild(st);
    const paint = () => {
      const users = Object.keys(live.users).length;
      const mine = ST.chapters.filter((c) => isDone(c.key)).length;
      const doneAll = Object.keys(live.prog).reduce((s, u) => s + Object.keys(live.prog[u] || {}).length, 0);
      clear(st);
      [[users, '함께하는 사람'], [`${mine} / ${ST.chapters.length}`, '내가 마친 챕터'], [doneAll, '모두가 마친 실습'], [S.room, '현재 방 코드']].forEach(([v, l]) => st.appendChild(h('div', { class: 'stat' }, h('b', {}, String(v)), h('span', {}, l))));
    };
    paint(); unsubs.push(ST.bus.on('users', paint), ST.bus.on('prog', paint));

    /* 우리 방의 16유형 지도 (7장 결과를 실시간으로) */
    const mapBox = h('div');
    app.appendChild(h('h2', { class: 'sec-t' }, '우리 방의 16유형 지도'));
    app.appendChild(h('p', { class: 'sec-s' }, '7장에서 “최적합 유형”을 정하면 이 지도에 X가 하나씩 쌓입니다.'));
    app.appendChild(h('div', { class: 'card' }, mapBox));
    const un = S.watch('c7', (d) => {
      clear(mapBox);
      const ids = ST.people(d).filter((u) => D.isType(d[u].fit));
      if (!ids.length) { mapBox.appendChild(ST.empty('아직 최적합 유형을 정한 사람이 없어요. 7장 “실습하기”에서 정해 보세요.')); return; }
      const cnt = {}; ids.forEach((u) => (cnt[d[u].fit] = (cnt[d[u].fit] || 0) + 1));
      const me = d[S.me.id] && D.isType(d[S.me.id].fit) ? d[S.me.id].fit : null;
      mapBox.appendChild(ST.charts.typegrid({ cells: Object.fromEntries(Object.keys(cnt).map((k) => [k, { n: cnt[k] }])), mode: 'x', me, nick: true, label: '우리 방의 16유형 지도' }));
      mapBox.appendChild(h('p', { class: 'tm-note' }, `${ids.length}명의 최적합 유형입니다.`));
    });
    unsubs.push(un);

    app.appendChild(h('h2', { class: 'sec-t' }, '이 프로그램이 걷는 길'));
    app.appendChild(h('p', { class: 'sec-s' }, '유형을 맞히는 데서 시작해, 차이를 활용하는 데서 끝납니다.'));
    app.appendChild(h('div', { class: 'loop' },
      h('div', {}, h('b', {}, '이해'), h('span', {}, '유형이란 무엇인가 · 선호의 발견 (1~2장)')),
      h('div', {}, h('b', {}, '탐색'), h('span', {}, 'E/I · S/N · T/F · J/P 네 쌍의 선호 (3~6장)')),
      h('div', {}, h('b', {}, '결정'), h('span', {}, '채점 · 명확도 · 나의 최적합 유형 (7장)')),
      h('div', {}, h('b', {}, '활용'), h('span', {}, '일터의 16유형 · 팀과 차이 활용 (8~9장)'))));
    app.appendChild(h('h2', { class: 'sec-t' }, '챕터'));
    const grid = h('div', { class: 'chgrid' });
    ST.chapters.forEach((c) => grid.appendChild(h('a', { class: 'chcard' + (isDone(c.key) ? ' done' : ''), href: '#/ch/' + c.n + '/0' },
      h('span', { class: 'prog' }, isDone(c.key) ? '✓' : ''), h('span', { class: 'no' }, 'CHAPTER ' + String(c.n).padStart(2, '0')), h('h3', {}, c.title), h('p', {}, c.tagline),
      h('div', { class: 'meta' }, c.chips.map((x, i) => h('span', { class: 'chip' + (i === 0 ? ' g' : '') }, x))))));
    app.appendChild(grid);
    app.appendChild(h('h2', { class: 'sec-t' }, '진행 방식'));
    app.appendChild(ST.grid(4, ...['배우기|핵심 개념과 교재의 도표를 새로 그린 도해로 익힙니다.', '실습하기|내 직감과 8문항, 일터의 장면을 직접 입력합니다.', '함께 보기|모두의 결과가 스펙트럼·16유형 표·차트로 실시간 합쳐집니다.', '확인하기|3문항 퀴즈로 이해를 점검하고 정답률을 비교합니다.'].map((s, i) => { const [a, b] = s.split('|'); return ST.card(null, h('div', { class: 'chip g', style: { marginBottom: '8px', display: 'inline-block' } }, 'STEP ' + (i + 1)), h('h3', { class: 'card-t' }, a), h('p', { class: 'muted', style: { margin: 0 } }, b)); })));
    app.appendChild(h('p', { class: 'notice' }, '이 프로그램은 학습용 자료이며 공식 MBTI® 검사가 아닙니다. 문항과 프로필 문장은 교재의 개념을 바탕으로 새로 작성했습니다. 공식 결과는 자격을 갖춘 전문가를 통해 확인하세요. MBTI®는 The Myers & Briggs Foundation의 등록 상표입니다.'));
  }
  /* ── 시작 ── */
  renderRoomBtn();
  startGlobal();
  register();
  route();
  if (!S.me.name) openJoin(true);
  setInterval(() => { if (S.me.name && S.mode === 'live') register(); }, 120000);
})();
