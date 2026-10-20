/* 챕터 공통 도우미 */
(function () {
  const ST = (window.ST = window.ST || {});
  const { h, esc, charts: C } = ST;

  /* 챕터 데이터 객체에서 참가자 id만 추림(퀴즈 응답 'q' 제외) */
  ST.people = (d) => Object.keys(d || {}).filter((k) => k !== 'q' && d[k] && typeof d[k] === 'object');
  ST.colorOfId = (id) => { let s = 0; for (const c of String(id)) s = (s * 31 + c.charCodeAt(0)) >>> 0; return ST.PAL[s % ST.PAL.length]; };
  ST.avatar = (id) => { const n = ST.nameOf(id) || '?'; return h('span', { class: 'pp-av', style: { background: ST.colorOfId(id) } }, n.slice(0, 1)); };
  ST.isMe = (id) => id === ST.store.me.id;
  ST.nameTag = (id) => h('span', {}, ST.nameOf(id), ST.isMe(id) ? h('span', { class: 'me-badge' }, 'ME') : null);

  /* 숫자 지표 줄 */
  ST.metrics = (arr) => h('div', { class: 'metric-row' }, arr.map(([v, l, bad]) => h('div', { class: 'metric' + (bad ? ' bad' : '') }, h('b', {}, v instanceof Node ? v : String(v)), h('span', {}, l))));

  /* 글자 칩 */
  ST.pole = (l) => h('span', { class: 'chip x', style: { '--c': ST.D.letterColor(l) } }, l + ' ' + ST.D.LET[l].ko);

  /* 한 선호축 결과 카드(원점수·보고 글자·명확도·스펙트럼) */
  ST.pairResult = function (pairKey, ans, est, mine) {
    const D = ST.D, p = D.pairOf(pairKey), r = D.score(pairKey, ans);
    const res = {}; res[pairKey] = r;
    const wrap = h('div');
    const cn = D.CLARITY[r.clarity];
    wrap.appendChild(h('div', { class: 'metric-row' },
      h('div', { class: 'metric' }, h('b', {}, ST.letters(r.letter)), h('span', {}, '나의 선호 · ' + D.LET[r.letter].ko)),
      h('div', { class: 'metric' }, h('b', {}, `${r.a} : ${r.b}`), h('span', {}, `${p.a} ${D.LET[p.a].ko} : ${p.b} ${D.LET[p.b].ko} 원점수`)),
      h('div', { class: 'metric' }, h('b', {}, r.tie ? '동점' : cn), h('span', {}, r.tie ? `동점 규칙 → ${r.letter} 로 표기 (선호가 아직 불분명)` : '선호 명확도'))));
    wrap.appendChild(C.spectrum({ pair: pairKey, values: [{ pos: r.pos, me: true, title: '나' }], label: '내 위치' }));
    if (est && est !== '?') {
      const same = est === r.letter;
      wrap.appendChild(ST.callout(same ? 'tip' : 'key', same ? '자기 추정과 일치해요' : '자기 추정과 달라요', same
        ? `처음에 고른 <b>${est}</b>와 결과가 같습니다. 가장 자연스러운 쪽이 맞다는 신호예요.`
        : `처음에 고른 <b>${est}</b>와 결과(<b>${r.letter}</b>)가 달라요. 틀린 게 아니라 <b>7장에서 최종 ‘최적합’ 글자를 내가 결정</b>하게 됩니다. 점수가 ${r.tie ? '동점' : '근소'}하다면 두 글자 설명을 모두 읽어 보세요.`));
    }
    return wrap;
  };

  /* 챕터 3~6의 내 문서 4개를 한 번에 읽어 온다 */
  ST.loadMine = function (ctx, cb) {
    const docs = [null, null, null, null]; let got = 0;
    [3, 4, 5, 6].forEach((n, i) => ctx.ready(`c${n}/${ctx.me.id}`, (d) => { docs[i] = d; if (++got === 4) cb(docs); }));
  };
  /* 내 최적합 유형(7장)을 읽어 온다 */
  ST.loadFit = function (ctx, cb) { ctx.ready(`c7/${ctx.me.id}`, (d) => cb(d && ST.D.isType(d.fit) ? d.fit : null, d || {})); };
})();
