/* 4가지 선호를 설명하는 도해(교재 18·22·26·30쪽의 개념을 새로 그린 SVG) */
(function () {
  const ST = (window.ST = window.ST || {});
  const dia = (ST.dia = {});
  const col = (l) => ST.D.letterColor(l);
  const svg = (w, h, inner, label) => ST.fromSvg(`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}"><style>
    .dt{font:600 12.5px 'Noto Sans KR',sans-serif;fill:var(--ink2)} .dh{font:900 15px 'Noto Serif KR',serif} .dm{font:500 11px 'IBM Plex Mono',monospace;fill:var(--ink3)}
    .dl{stroke:var(--line);fill:none} </style>${inner}</svg>`);

  /* E–I : 에너지가 밖으로 / 안으로 */
  dia.EI = function () {
    const e = col('E'), i = col('I');
    const dots = (cx, cy, r, n, rot) => Array.from({ length: n }, (_, k) => { const a = rot + (k * 2 * Math.PI) / n; return [cx + Math.cos(a) * r, cy + Math.sin(a) * r]; });
    const L = dots(150, 112, 86, 10, 0), R = dots(470, 112, 86, 10, 0);
    let g = `<rect x="6" y="6" width="288" height="206" rx="16" class="dl"/><rect x="326" y="6" width="288" height="206" rx="16" class="dl"/>`;
    L.forEach(([x, y]) => { g += `<line x1="150" y1="112" x2="${x}" y2="${y}" style="stroke:${e}" stroke-width="2.4" stroke-dasharray="3 5" opacity=".6"/><path d="M${x} ${y} l${(x - 150) * 0.09} ${(y - 112) * 0.09}" style="stroke:${e}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="7" style="fill:${e}" opacity=".85"/>`; });
    g += `<circle cx="150" cy="112" r="30" style="fill:${e}"/><text class="dt" x="150" y="117" text-anchor="middle" style="fill:#fff">나</text>`;
    R.forEach(([x, y]) => { g += `<line x1="${x}" y1="${y}" x2="470" y2="112" style="stroke:${i}" stroke-width="2.4" opacity=".55"/><circle cx="${x}" cy="${y}" r="7" style="fill:${i}" opacity=".35"/><circle cx="${x + (470 - x) * 0.45}" cy="${y + (112 - y) * 0.45}" r="3.4" style="fill:${i}"/>`; });
    g += `<circle cx="470" cy="112" r="30" style="fill:${i}"/><text class="dt" x="470" y="117" text-anchor="middle" style="fill:#fff">나</text>`;
    g += `<text class="dh" x="150" y="204" text-anchor="middle" style="fill:${e}">E 외향 · 에너지가 밖으로</text><text class="dh" x="470" y="204" text-anchor="middle" style="fill:${i}">I 내향 · 에너지가 안으로</text>`;
    g += `<text class="dm" x="150" y="26" text-anchor="middle">사람·활동·세상으로 뻗어 간다</text><text class="dm" x="470" y="26" text-anchor="middle">생각·기억·내면으로 모인다</text>`;
    return svg(620, 222, g, '외향은 에너지가 바깥으로 향하고 내향은 안쪽으로 모이는 모습');
  };

  /* S–N : 계단식 순차 vs 한눈에 큰 그림 */
  dia.SN = function () {
    const s = col('S'), n = col('N');
    let g = `<rect x="6" y="6" width="288" height="206" rx="16" class="dl"/><rect x="326" y="6" width="288" height="206" rx="16" class="dl"/>`;
    [0, 1, 2, 3].forEach((k) => { const x = 36 + k * 62, y = 150 - k * 28; g += `<rect x="${x}" y="${y}" width="52" height="${170 - y}" rx="6" style="fill:${s}" opacity="${0.35 + k * 0.18}"/><text class="dh" x="${x + 26}" y="${y - 8}" text-anchor="middle" style="fill:${s}">${k + 1}</text>`; });
    g += `<text class="dh" x="150" y="204" text-anchor="middle" style="fill:${s}">S 감각 · 단계를 밟아 쌓는다</text>`;
    const pts = [[372, 130], [410, 70], [470, 95], [520, 52], [566, 118], [450, 150]];
    g += `<path d="M${pts.map((p) => p.join(' ')).join(' L')} Z" style="fill:${n}" opacity=".10"/>`;
    pts.forEach((a, i) => pts.forEach((b, j) => { if (j > i + 1 && (i + j) % 2 === 0) g += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" style="stroke:${n}" stroke-width="1.4" opacity=".5"/>`; }));
    pts.forEach(([x, y]) => { g += `<circle cx="${x}" cy="${y}" r="7" style="fill:${n}"/>`; });
    g += `<path d="M350 170 Q470 20 590 170" fill="none" style="stroke:${n}" stroke-width="2.4" stroke-dasharray="5 5"/>`;
    g += `<text class="dh" x="470" y="204" text-anchor="middle" style="fill:${n}">N 직관 · 한눈에 연결해 본다</text>`;
    g += `<text class="dm" x="150" y="26" text-anchor="middle">사실 → 사실 → 사실 → 결론</text><text class="dm" x="470" y="26" text-anchor="middle">패턴·의미 → 큰 그림 → 세부</text>`;
    return svg(620, 222, g, '감각은 단계별로 쌓고 직관은 점들을 이어 큰 그림을 본다');
  };

  /* T–F : 한 발 물러서서 / 한 발 들어가서 */
  dia.TF = function () {
    const t = col('T'), f = col('F');
    let g = `<rect x="6" y="6" width="288" height="206" rx="16" class="dl"/><rect x="326" y="6" width="288" height="206" rx="16" class="dl"/>`;
    g += `<circle cx="86" cy="106" r="38" style="fill:${t}" opacity=".9"/><text class="dt" x="86" y="111" text-anchor="middle" style="fill:#fff">나</text>`;
    g += `<circle cx="214" cy="106" r="46" style="fill:none;stroke:var(--ink3)" stroke-width="2" stroke-dasharray="5 5"/><text class="dt" x="214" y="111" text-anchor="middle">상황·사람</text>`;
    g += `<path d="M130 106 H164" style="stroke:${t}" stroke-width="2.4"/><path d="M126 96 v20 M168 96 v20" style="stroke:${t}" stroke-width="2.4"/><text class="dm" x="148" y="86" text-anchor="middle">거리</text>`;
    g += `<text class="dh" x="150" y="204" text-anchor="middle" style="fill:${t}">T 사고 · 한 발 물러서서 본다</text>`;
    g += `<circle cx="440" cy="106" r="40" style="fill:${f}" opacity=".78"/><circle cx="500" cy="106" r="46" style="fill:none;stroke:${f}" stroke-width="2.4"/>`;
    g += `<text class="dt" x="425" y="111" text-anchor="middle" style="fill:#fff">나</text><text class="dt" x="514" y="111" text-anchor="middle">상황·사람</text>`;
    g += `<path d="M470 76 q10 -22 28 -8" fill="none" style="stroke:${f}" stroke-width="2"/><text class="dm" x="470" y="64" text-anchor="middle">공감</text>`;
    g += `<text class="dh" x="470" y="204" text-anchor="middle" style="fill:${f}">F 감정 · 한 발 들어가 느낀다</text>`;
    g += `<text class="dm" x="150" y="26" text-anchor="middle">객관적 시선 · 논리와 원칙</text><text class="dm" x="470" y="26" text-anchor="middle">공감적 시선 · 가치와 영향</text>`;
    return svg(620, 222, g, '사고는 상황에서 한 발 물러나 객관적으로, 감정은 상황 속으로 들어가 공감적으로 본다');
  };

  /* J–P : 노력의 시간 곡선 */
  dia.JP = function () {
    const j = col('J'), p = col('P');
    const base = (x0, tag, c) => `<rect x="${x0 - 134}" y="6" width="288" height="206" rx="16" class="dl"/><line x1="${x0 - 112}" y1="160" x2="${x0 + 128}" y2="160" style="stroke:var(--ink3)" stroke-width="1.5"/><line x1="${x0 + 128}" y1="40" x2="${x0 + 128}" y2="160" style="stroke:${c}" stroke-width="2.4" stroke-dasharray="4 4"/><text class="dm" x="${x0 + 128}" y="34" text-anchor="middle">마감</text><text class="dm" x="${x0 - 112}" y="176">시작</text>`;
    let g = base(150, 'J', j) + base(470, 'P', p);
    [0, 1, 2, 3, 4, 5].forEach((k) => { const x = 62 + k * 38; g += `<rect x="${x}" y="${150 - (k + 1) * 14}" width="22" height="${(k + 1) * 14 + 10}" rx="4" style="fill:${j}" opacity="${0.35 + k * 0.1}"/>`; });
    let d = 'M382 158'; for (let k = 0; k <= 20; k++) { const t = k / 20; d += ` L${382 + t * 240} ${158 - Math.pow(t, 5) * 112}`; }
    g += `<path d="${d}" fill="none" style="stroke:${p}" stroke-width="3.2" stroke-linecap="round"/><path d="${d} L622 158 L382 158 Z" style="fill:${p}" opacity=".12"/>`;
    g += `<text class="dm" x="470" y="124" text-anchor="middle">탐색·옵션 열어 두기</text><text class="dm" x="560" y="58" text-anchor="middle">막판 몰입 ⚡</text>`;
    g += `<text class="dh" x="150" y="204" text-anchor="middle" style="fill:${j}">J 판단 · 계획대로 꾸준히</text><text class="dh" x="470" y="204" text-anchor="middle" style="fill:${p}">P 인식 · 열어 두고 막판에 집중</text>`;
    g += `<text class="dm" x="150" y="26" text-anchor="middle">시간에 따른 일의 양</text><text class="dm" x="470" y="26" text-anchor="middle">시간에 따른 일의 양</text>`;
    return svg(620, 222, g, '판단형은 일정을 나눠 꾸준히, 인식형은 막판에 집중해 마감을 맞추는 모습');
  };

  /* 선호 손 — 정상적 차이 */
  dia.Hands = function () {
    let g = `<rect x="6" y="6" width="608" height="150" rx="16" class="dl"/>`;
    g += `<text class="dh" x="160" y="52" text-anchor="middle" style="fill:var(--brand-d)">선호하는 손</text><text class="dm" x="160" y="74" text-anchor="middle">자연스럽다 · 빠르다 · 에너지가 적게 든다</text>`;
    g += `<path d="M70 118 q20 -34 40 -10 t40 -2 t40 6 t40 -4 t40 4" fill="none" style="stroke:var(--brand)" stroke-width="3.2" stroke-linecap="round"/>`;
    g += `<text class="dh" x="460" y="52" text-anchor="middle" style="fill:var(--coral)">선호하지 않는 손</text><text class="dm" x="460" y="74" text-anchor="middle">어색하다 · 느리다 · 집중과 에너지가 더 든다</text>`;
    g += `<path d="M370 118 q8 -40 20 -6 t14 -18 t24 28 t10 -30 t30 22 t12 -26 t18 20" fill="none" style="stroke:var(--coral)" stroke-width="3.2" stroke-linecap="round"/>`;
    g += `<path d="M300 40 V132" style="stroke:var(--line)" stroke-dasharray="4 5"/>`;
    return svg(620, 164, g, '선호하는 손으로 쓸 때와 선호하지 않는 손으로 쓸 때의 글씨 비교');
  };
})();
