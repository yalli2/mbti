/* SVG/HTML 차트 모음 — 모두 DOM 요소를 돌려줍니다 */
(function () {
  const ST = (window.ST = window.ST || {});
  const { esc, h, fromSvg, fmt, clamp } = ST;
  const C = {};

  const nice = (max) => { if (max <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(max))); const m = max / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; };
  const col = (c) => c || 'var(--brand)';

  /* ── 선 그래프 ── */
  C.line = function (o) {
    const W = o.w || 640, H = o.h || 320, m = { l: o.yLabel ? 58 : 46, r: 18, t: 16, b: o.xLabel ? 46 : 32 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const S = o.series.map((s) => ({ ...s, pts: s.pts || s.ys.map((y, i) => [i, y]) }));
    const xs = S.flatMap((s) => s.pts.map((p) => p[0])), ys = S.flatMap((s) => s.pts.map((p) => p[1]));
    const xmin = o.xmin != null ? o.xmin : Math.min(...xs), xmax = o.xmax != null ? o.xmax : Math.max(...xs);
    const ymin = o.ymin != null ? o.ymin : 0, ymax = o.ymax != null ? o.ymax : nice(Math.max(...ys) * 1.05);
    const X = (x) => m.l + ((x - xmin) / (xmax - xmin || 1)) * iw, Y = (y) => m.t + ih - ((y - ymin) / (ymax - ymin || 1)) * ih;
    const yt = o.yTicks || 5, xt = o.xTickVals || null;
    let g = '';
    for (let i = 0; i <= yt; i++) { const v = ymin + ((ymax - ymin) * i) / yt, y = Y(v); g += `<line class="gl" x1="${m.l}" x2="${W - m.r}" y1="${y}" y2="${y}"/><text class="tk" x="${m.l - 8}" y="${y + 4}" text-anchor="end">${esc((o.yFmt || fmt)(v))}</text>`; }
    (xt || Array.from({ length: 6 }, (_, i) => xmin + ((xmax - xmin) * i) / 5)).forEach((v) => { const x = X(v); g += `<line class="gl v" x1="${x}" x2="${x}" y1="${m.t}" y2="${m.t + ih}"/><text class="tk" x="${x}" y="${H - m.b + 18}" text-anchor="middle">${esc((o.xFmt || fmt)(v))}</text>`; });
    if (o.xLabel) g += `<text class="ax" x="${m.l + iw / 2}" y="${H - 6}" text-anchor="middle">${esc(o.xLabel)}</text>`;
    if (o.yLabel) g += `<text class="ax" transform="translate(14 ${m.t + ih / 2}) rotate(-90)" text-anchor="middle">${esc(o.yLabel)}</text>`;
    if (o.refY != null) g += `<line class="ref" x1="${m.l}" x2="${W - m.r}" y1="${Y(o.refY)}" y2="${Y(o.refY)}"/><text class="tk ref-t" x="${W - m.r - 4}" y="${Y(o.refY) - 5}" text-anchor="end">${esc(o.refLabel || '')}</text>`;
    S.forEach((s) => {
      const d = s.pts.map((p, i) => (i ? 'L' : 'M') + X(p[0]).toFixed(1) + ' ' + Y(p[1]).toFixed(1)).join('');
      if (s.area) g += `<path d="${d}L${X(s.pts[s.pts.length - 1][0])} ${Y(ymin)}L${X(s.pts[0][0])} ${Y(ymin)}Z" style="fill:${col(s.color)};opacity:.1"/>`;
      g += `<path d="${d}" fill="none" style="stroke:${col(s.color)}" stroke-width="${s.width || 2.6}" stroke-linejoin="round" stroke-linecap="round"${s.dash ? ` stroke-dasharray="${s.dash}"` : ''}/>`;
      if (s.dots) s.pts.forEach((p) => { g += `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="3.6" style="fill:var(--card);stroke:${col(s.color)}" stroke-width="2"/>`; });
      if (s.endLabel) { const p = s.pts[s.pts.length - 1]; g += `<text class="end" x="${Math.min(X(p[0]) + 6, W - 4)}" y="${Y(p[1]) - 8}" text-anchor="${X(p[0]) > W - 90 ? 'end' : 'start'}" style="fill:${col(s.color)}">${esc(s.endLabel)}</text>`; }
    });
    const legend = o.legend === false ? '' : `<div class="legend">${S.filter((s) => s.name).map((s) => `<span><i style="background:${col(s.color)}${s.dash ? ';opacity:.6' : ''}"></i>${esc(s.name)}</span>`).join('')}</div>`;
    const wrap = h('div', { class: 'chart' });
    wrap.appendChild(fromSvg(`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || '선 그래프')}">${g}</svg>`));
    if (legend) wrap.appendChild(ST.fromHtml(legend));
    return wrap;
  };

  /* ── 가로 막대(HTML) ── */
  C.bars = function (o) {
    const max = o.max || Math.max(1, ...o.items.map((i) => i.value));
    const wrap = h('div', { class: 'hbars' });
    o.items.forEach((it) => {
      const w = clamp((it.value / max) * 100, 0, 100);
      wrap.appendChild(h('div', { class: 'hb' + (it.hl ? ' hl' : '') },
        h('span', { class: 'hb-l', title: it.label }, it.label),
        h('span', { class: 'hb-t' }, h('i', { style: { width: w + '%', background: col(it.color) } })),
        h('span', { class: 'hb-v' }, it.text != null ? it.text : (o.fmt || fmt)(it.value))));
    });
    return wrap;
  };

  /* ── 세로 막대 / 히스토그램 (퍼널) ── */
  C.vbars = function (o) {
    const W = o.w || 640, H = o.h || 320, m = { l: 48, r: 14, t: 24, b: 54 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b, n = o.items.length;
    const max = o.max || nice(Math.max(1, ...o.items.map((i) => i.value)) * 1.08);
    const bw = Math.min(110, iw / n * 0.62), step = iw / n;
    const Y = (v) => m.t + ih - (v / max) * ih;
    let g = '';
    for (let i = 0; i <= 4; i++) { const v = (max * i) / 4, y = Y(v); g += `<line class="gl" x1="${m.l}" x2="${W - m.r}" y1="${y}" y2="${y}"/><text class="tk" x="${m.l - 8}" y="${y + 4}" text-anchor="end">${esc(fmt(v))}</text>`; }
    o.items.forEach((it, i) => {
      const x = m.l + step * i + (step - bw) / 2, y = Y(it.value), c = col(it.color);
      g += `<rect x="${x}" y="${y}" width="${bw}" height="${Math.max(0, m.t + ih - y)}" rx="4" style="fill:${c}" opacity="${it.dim ? 0.45 : 1}"/>`;
      g += `<text class="val" x="${x + bw / 2}" y="${y - 7}" text-anchor="middle">${esc(it.text != null ? it.text : fmt(it.value))}</text>`;
      const lines = String(it.label).split('\n');
      lines.forEach((ln, k) => { g += `<text class="tk" x="${x + bw / 2}" y="${H - m.b + 18 + k * 14}" text-anchor="middle">${esc(ln)}</text>`; });
      if (it.drop != null && i > 0) g += `<text class="drop" x="${m.l + step * i}" y="${m.t + 6}" text-anchor="middle">▼ ${esc(it.drop)}</text>`;
    });
    (o.pins || []).forEach((p, k) => {
      const i = p.at, x = m.l + step * i + step / 2, y = m.t + 30 + (k % 4) * 22;
      g += `<g class="pin"><rect x="${x - 52}" y="${y - 12}" width="104" height="20" rx="10"/><text x="${x}" y="${y + 3}" text-anchor="middle">${esc(p.label.length > 11 ? p.label.slice(0, 10) + '…' : p.label)}</text></g>`;
    });
    return h('div', { class: 'chart' }, fromSvg(`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || '막대 그래프')}">${g}</svg>`));
  };

  /* ── 레이더 ── */
  C.radar = function (o) {
    const W = o.w || 460, H = o.h || 420, cx = W / 2, cy = H / 2 + 6, R = Math.min(W, H) / 2 - 78, n = o.axes.length, max = o.max || 5;
    const P = (i, v) => { const a = -Math.PI / 2 + (i * 2 * Math.PI) / n; return [cx + Math.cos(a) * R * (v / max), cy + Math.sin(a) * R * (v / max)]; };
    let g = '';
    for (let r = 1; r <= max; r++) g += `<polygon class="gl" fill="none" points="${o.axes.map((_, i) => P(i, r).join(',')).join(' ')}"/>`;
    o.axes.forEach((a, i) => {
      const [x, y] = P(i, max), [lx, ly] = P(i, max + 0.55);
      g += `<line class="gl" x1="${cx}" y1="${cy}" x2="${x}" y2="${y}"/>`;
      const lines = String(a).split('\n');
      lines.forEach((ln, k) => { g += `<text class="tk lb" x="${lx}" y="${ly + 4 + (k - (lines.length - 1) / 2) * 13}" text-anchor="${Math.abs(lx - cx) < 8 ? 'middle' : lx > cx ? 'start' : 'end'}">${esc(ln)}</text>`; });
    });
    o.series.forEach((s) => {
      const pts = s.vals.map((v, i) => P(i, v || 0).join(',')).join(' ');
      g += `<polygon points="${pts}" style="fill:${col(s.color)};stroke:${col(s.color)}" fill-opacity="${s.fill != null ? s.fill : 0.14}" stroke-width="${s.width || 2.4}"${s.dash ? ` stroke-dasharray="${s.dash}"` : ''} stroke-linejoin="round"/>`;
      if (s.dots !== false) s.vals.forEach((v, i) => { const [x, y] = P(i, v || 0); g += `<circle cx="${x}" cy="${y}" r="3.4" style="fill:${col(s.color)}"/>`; });
    });
    const legend = `<div class="legend">${o.series.filter((s) => s.name).map((s) => `<span><i style="background:${col(s.color)}"></i>${esc(s.name)}</span>`).join('')}</div>`;
    const w = h('div', { class: 'chart radar' }, fromSvg(`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || '레이더 차트')}">${g}</svg>`));
    w.appendChild(ST.fromHtml(legend));
    return w;
  };

  /* ── 산점도 / 우선순위 그리드 ── */
  C.scatter = function (o) {
    const W = o.w || 640, H = o.h || 420, m = { l: 54, r: 16, t: 16, b: 50 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b;
    const xmin = o.xmin != null ? o.xmin : 0, xmax = o.xmax != null ? o.xmax : 10, ymin = o.ymin != null ? o.ymin : 0, ymax = o.ymax != null ? o.ymax : 10;
    const X = (x) => m.l + ((x - xmin) / (xmax - xmin)) * iw, Y = (y) => m.t + ih - ((y - ymin) / (ymax - ymin)) * ih;
    let g = `<rect x="${m.l}" y="${m.t}" width="${iw}" height="${ih}" class="plot"/>`;
    (o.zones || []).forEach((z) => {
      g += `<rect x="${X(z.x0)}" y="${Y(z.y1)}" width="${X(z.x1) - X(z.x0)}" height="${Y(z.y0) - Y(z.y1)}" style="fill:${z.fill}" opacity="${z.op || 0.12}"/>`;
      if (z.label) g += `<text class="zone" x="${X(z.x0) + 8}" y="${Y(z.y1) + 18}">${esc(z.label)}</text>`;
    });
    for (let i = 0; i <= 5; i++) {
      const xv = xmin + ((xmax - xmin) * i) / 5, yv = ymin + ((ymax - ymin) * i) / 5;
      g += `<line class="gl v" x1="${X(xv)}" x2="${X(xv)}" y1="${m.t}" y2="${m.t + ih}"/><text class="tk" x="${X(xv)}" y="${H - m.b + 16}" text-anchor="middle">${esc(fmt(xv, o.xd || 0))}</text>`;
      g += `<line class="gl" x1="${m.l}" x2="${m.l + iw}" y1="${Y(yv)}" y2="${Y(yv)}"/><text class="tk" x="${m.l - 8}" y="${Y(yv) + 4}" text-anchor="end">${esc(fmt(yv, o.yd || 0))}</text>`;
    }
    if (o.xLabel) g += `<text class="ax" x="${m.l + iw / 2}" y="${H - 8}" text-anchor="middle">${esc(o.xLabel)}</text>`;
    if (o.yLabel) g += `<text class="ax" transform="translate(14 ${m.t + ih / 2}) rotate(-90)" text-anchor="middle">${esc(o.yLabel)}</text>`;
    (o.points || []).forEach((p) => {
      g += `<g><circle cx="${X(p.x)}" cy="${Y(p.y)}" r="${p.r || 7}" style="fill:${col(p.color)};stroke:var(--card)" fill-opacity="${p.op || 0.78}" stroke-width="1.6"><title>${esc(p.title || p.label || '')}</title></circle>${p.label ? `<text class="pl" x="${X(p.x) + (p.r || 7) + 3}" y="${Y(p.y) + 4}">${esc(p.label.length > 12 ? p.label.slice(0, 11) + '…' : p.label)}</text>` : ''}</g>`;
    });
    return h('div', { class: 'chart' }, fromSvg(`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || '산점도')}">${g}</svg>`));
  };

  /* ── 게이지 (0~1) ── */
  C.gauge = function (o) {
    const W = 360, H = 210, cx = 180, cy = 170, R = 130, a = (t) => Math.PI * (1 - t);
    const pt = (t, r = R) => [cx + Math.cos(a(t)) * r, cy - Math.sin(a(t)) * r];
    const arc = (t0, t1, r, cls, stroke) => { const [x0, y0] = pt(t0, r), [x1, y1] = pt(t1, r); return `<path d="M${x0} ${y0} A${r} ${r} 0 ${t1 - t0 > 0.5 ? 1 : 0} 1 ${x1} ${y1}" fill="none" class="${cls || ''}" ${stroke ? `style="stroke:${stroke}"` : ''} stroke-width="22" stroke-linecap="butt"/>`; };
    const th = o.threshold != null ? o.threshold : 0.4, v = clamp(o.value || 0, 0, 1);
    const [nx, ny] = pt(v, R - 28), [tx0, ty0] = pt(th, R - 16), [tx1, ty1] = pt(th, R + 16), [tl, tly] = pt(th, R + 28);
    const ok = v >= th;
    const g = `${arc(0, th, R, '', 'var(--coral-l)')}${arc(th, 1, R, '', 'var(--brand-l)')}${arc(0, Math.max(0.001, v), R, '', ok ? 'var(--brand)' : 'var(--coral)')}
      <line x1="${tx0}" y1="${ty0}" x2="${tx1}" y2="${ty1}" style="stroke:var(--ink)" stroke-width="3"/>
      <text class="tk" x="${tl}" y="${tly}" text-anchor="middle">${esc(o.thLabel || Math.round(th * 100) + '%')}</text>
      <text class="big" x="${cx}" y="${cy - 14}" text-anchor="middle" style="fill:${ok ? 'var(--brand)' : 'var(--coral)'}">${esc(o.text != null ? o.text : Math.round(v * 100) + '%')}</text>
      <text class="tk" x="${cx}" y="${cy + 8}" text-anchor="middle">${esc(o.caption || '')}</text>`;
    return h('div', { class: 'chart gauge' }, fromSvg(`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || '게이지')}">${g}</svg>`));
  };

  /* ── 도넛 ── */
  C.donut = function (o) {
    const S = 220, cx = S / 2, cy = S / 2, R = 88, r = 56, tot = o.parts.reduce((s, p) => s + p.v, 0) || 1;
    let a0 = -Math.PI / 2, g = '';
    o.parts.forEach((p) => {
      if (p.v <= 0) return;
      const a1 = a0 + (p.v / tot) * Math.PI * 2, big = a1 - a0 > Math.PI ? 1 : 0;
      const f = (a, rr) => [cx + Math.cos(a) * rr, cy + Math.sin(a) * rr];
      const [x0, y0] = f(a0, R), [x1, y1] = f(a1 - 0.0001, R), [x2, y2] = f(a1 - 0.0001, r), [x3, y3] = f(a0, r);
      g += `<path d="M${x0} ${y0}A${R} ${R} 0 ${big} 1 ${x1} ${y1}L${x2} ${y2}A${r} ${r} 0 ${big} 0 ${x3} ${y3}Z" style="fill:${col(p.color)};stroke:var(--card)" stroke-width="2"/>`;
      a0 = a1;
    });
    g += `<text class="big" x="${cx}" y="${cy + 6}" text-anchor="middle">${esc(o.center || '')}</text><text class="tk" x="${cx}" y="${cy + 26}" text-anchor="middle">${esc(o.sub || '')}</text>`;
    const legend = `<div class="legend col">${o.parts.map((p) => `<span><i style="background:${col(p.color)}"></i>${esc(p.name)} <b>${esc(p.text != null ? p.text : Math.round((p.v / tot) * 100) + '%')}</b></span>`).join('')}</div>`;
    const w = h('div', { class: 'donut' }, fromSvg(`<svg viewBox="0 0 ${S} ${S}" role="img" aria-label="${esc(o.label || '도넛 차트')}">${g}</svg>`));
    w.appendChild(ST.fromHtml(legend));
    return w;
  };

  /* ── 히트맵 (HTML) ── */
  C.heat = function (o) {
    const max = o.max || Math.max(1, ...o.data.flat());
    const t = h('table', { class: 'heat' });
    t.appendChild(h('thead', {}, h('tr', {}, h('th', {}, o.corner || ''), o.cols.map((c) => h('th', { scope: 'col' }, c)))));
    const tb = h('tbody');
    o.rows.forEach((r, i) => {
      tb.appendChild(h('tr', {}, h('th', { scope: 'row' }, r), o.data[i].map((v, j) => {
        const k = clamp(v / max, 0, 1);
        return h('td', { style: { background: `color-mix(in srgb, ${o.color || 'var(--brand)'} ${Math.round(k * 88)}%, var(--card))`, color: k > 0.55 ? '#fff' : 'var(--ink)' }, title: (o.cols[j] || '') + ' · ' + (o.fmt || fmt)(v) }, v ? (o.fmt || fmt)(v) : '');
      })));
    });
    t.appendChild(tb);
    return h('div', { class: 'tbl-wrap' }, t);
  };

  /* ── 누적 가로 막대 (HTML) ── */
  C.stack = function (o) {
    const wrap = h('div', { class: 'stackbars' });
    o.items.forEach((it) => {
      const tot = it.parts.reduce((s, p) => s + p.v, 0) || 1;
      wrap.appendChild(h('div', { class: 'sb' + (it.hl ? ' hl' : '') }, h('span', { class: 'hb-l' }, it.label),
        h('span', { class: 'sb-t' }, it.parts.map((p, i) => (p.v > 0 ? h('i', { style: { width: (p.v / tot) * 100 + '%', background: col(p.color || ST.PAL[i]) }, title: `${p.name}: ${p.v}` }, p.v / tot > 0.12 ? String(p.show != null ? p.show : p.v) : '') : null))),
        it.text ? h('span', { class: 'hb-v' }, it.text) : null));
    });
    if (o.legend) wrap.appendChild(ST.fromHtml(`<div class="legend">${o.legend.map((l) => `<span><i style="background:${col(l.color)}"></i>${esc(l.name)}</span>`).join('')}</div>`));
    return wrap;
  };

  /* ── 점 띠 (분포) ── */
  C.dots = function (o) {
    const W = o.w || 640, H = o.h || 130, m = { l: 20, r: 20 }, iw = W - m.l - m.r;
    const min = o.min, max = o.max, X = (v) => m.l + ((v - min) / (max - min || 1)) * iw;
    let g = `<line class="gl" x1="${m.l}" x2="${W - m.r}" y1="82" y2="82" style="stroke-width:2"/>`;
    for (let i = 0; i <= 4; i++) { const v = min + ((max - min) * i) / 4; g += `<text class="tk" x="${X(v)}" y="108" text-anchor="middle">${esc((o.fmt || fmt)(v))}</text><line class="gl" x1="${X(v)}" x2="${X(v)}" y1="78" y2="86"/>`; }
    const bins = {};
    o.values.forEach((p) => { const b = Math.round(X(p.v) / 12); bins[b] = (bins[b] || 0) + 1; p._h = bins[b]; });
    o.values.forEach((p) => { g += `<circle cx="${X(p.v)}" cy="${74 - (p._h - 1) * 12}" r="5.5" style="fill:${col(p.color)};stroke:var(--card)" stroke-width="1.4" fill-opacity=".85"><title>${esc(p.title || '')}</title></circle>`; });
    (o.markers || []).forEach((mk) => { g += `<line x1="${X(mk.v)}" x2="${X(mk.v)}" y1="14" y2="82" style="stroke:${col(mk.color)}" stroke-width="2" stroke-dasharray="4 3"/><text class="tk" x="${X(mk.v)}" y="10" text-anchor="middle" style="fill:${col(mk.color)}">${esc(mk.label)}</text>`; });
    return h('div', { class: 'chart' }, fromSvg(`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || '분포')}">${g}</svg>`));
  };


  /* ───────── 타입 심포니 전용 차트 ───────── */
  const D = () => ST.D;

  /* 4글자 코드를 선호별 색으로 칠해 줌 */
  ST.letters = function (code, cls) {
    const w = h('span', { class: 'lt ' + (cls || '') });
    String(code || '').split('').forEach((c) => w.appendChild(h('span', { style: { color: D().letterColor(c) } }, c)));
    return w;
  };

  /* ── 4×4 유형표 (교재의 Team / 인구 분포 표) ──
     o.cells: {코드: {n, text}} · o.mode: 'x' | 'count' | 'text' · o.leader · o.me · o.nick · o.onpick · o.max */
  C.typegrid = function (o) {
    const cells = o.cells || {}, max = o.max || Math.max(1, ...Object.keys(cells).map((k) => (cells[k] && cells[k].n) || 0));
    const g = h('div', { class: 'tgrid' + (o.compact ? ' compact' : ''), role: o.onpick ? 'group' : 'table', 'aria-label': o.label || '16유형 표' });
    D().GRID.forEach((row) => row.forEach((code) => {
      const c = cells[code] || {}, n = c.n || 0;
      const mode = o.mode || 'count';
      let body = null;
      if (mode === 'x') body = h('div', { class: 'tg-x' }, n ? 'X'.repeat(Math.min(n, 9)) + (n > 9 ? '+' + (n - 9) : '') : '');
      else if (mode === 'text') body = h('div', { class: 'tg-v' }, c.text != null ? c.text : '');
      else body = h('div', { class: 'tg-v' }, n ? String(n) : '');
      const tag = o.onpick ? 'button' : 'div';
      const cell = h(tag, {
        class: 'tg-cell' + (o.me === code ? ' me' : '') + (o.leader === code ? ' lead' : '') + (o.sel === code ? ' sel' : '') + (n ? ' has' : ''),
        type: o.onpick ? 'button' : null,
        style: { '--k': Math.round(clamp(n / max, 0, 1) * (o.shade === false ? 0 : 40)) + '%' },
        title: `${code} ${D().TYPES[code].nick}${n ? ' · ' + n : ''}`,
        onclick: o.onpick ? () => o.onpick(code) : null
      },
        h('div', { class: 'tg-code' }, ST.letters(code)),
        o.nick ? h('div', { class: 'tg-nick' }, D().TYPES[code].nick) : null,
        body,
        o.leader === code ? h('div', { class: 'tg-lead' }, 'Leader') : null,
        o.me === code ? h('span', { class: 'tg-me' }, 'ME') : null);
      g.appendChild(cell);
    }));
    return g;
  };

  /* ── 선호 스펙트럼: 왼쪽 첫 글자 ↔ 오른쪽 둘째 글자. values: [{pos(a-b), color, title, me}] ── */
  C.spectrum = function (o) {
    const d = D(), p = d.pairOf(o.pair), N = d.N_ITEMS;
    const W = o.w || 680, H = o.h || 190, m = { l: 14, r: 14 }, iw = W - m.l - m.r, top = 34, bh = 58;
    const X = (pos) => m.l + ((N - pos) / (2 * N)) * iw;       // pos>0 → 왼쪽(a)
    const cA = d.letterColor(p.a), cB = d.letterColor(p.b);
    let g = '';
    /* 명확도 띠: |pos| 구간별로 진하기 */
    const bands = [[0, 3, 0.10, '약간'], [3, 5, 0.20, '보통'], [5, 7, 0.32, '뚜렷'], [7, 8, 0.46, '매우\n뚜렷']];
    bands.forEach(([a0, a1, op, lb]) => {
      [[1, cA], [-1, cB]].forEach(([sg, col]) => {
        const x0 = X(sg * a0), x1 = X(sg * a1), xl = Math.min(x0, x1), wd = Math.abs(x1 - x0);
        g += `<rect x="${xl}" y="${top}" width="${wd}" height="${bh}" style="fill:${col}" opacity="${op}"/>`;
        if (a0 > 0 || sg === 1) {
          const lines = lb.split('\n');
          lines.forEach((ln, k) => { g += `<text class="tk" x="${xl + wd / 2}" y="${top - 8 - (lines.length - 1 - k) * 11}" text-anchor="middle">${esc(ln)}</text>`; });
        }
      });
    });
    g += `<line x1="${X(0)}" x2="${X(0)}" y1="${top - 4}" y2="${top + bh + 6}" style="stroke:var(--ink3)" stroke-width="1.5" stroke-dasharray="4 3"/>`;
    for (let v = -N; v <= N; v += 2) g += `<line class="gl" x1="${X(v)}" x2="${X(v)}" y1="${top + bh}" y2="${top + bh + 5}"/>`;
    g += `<text x="${m.l}" y="${top + bh + 36}" class="pole" style="fill:${cA}">${p.a} ${esc(d.LET[p.a].ko)}</text>`;
    g += `<text x="${W - m.r}" y="${top + bh + 36}" class="pole" text-anchor="end" style="fill:${cB}">${esc(d.LET[p.b].ko)} ${p.b}</text>`;
    /* 점 쌓기 */
    const bins = {};
    (o.values || []).forEach((v) => { const k = v.pos; bins[k] = (bins[k] || 0) + 1; v._h = bins[k] - 1; });
    (o.values || []).forEach((v) => {
      const cx = X(v.pos), cy = top + bh - 10 - v._h * 13;
      const r = v.me ? 8 : 5.6;
      g += `<circle cx="${cx}" cy="${Math.max(top + 6, cy)}" r="${r}" style="fill:${v.color || (v.pos >= 0 ? cA : cB)};stroke:${v.me ? 'var(--ink)' : 'var(--card)'}" stroke-width="${v.me ? 2.4 : 1.4}" fill-opacity="${v.me ? 1 : 0.85}"><title>${esc(v.title || '')}</title></circle>`;
    });
    const w = h('div', { class: 'chart spectrum' }, fromSvg(`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label || p.title + ' 스펙트럼')}">${g}</svg>`));
    return w;
  };

  /* ── 채점표(교재 37쪽의 RAW POINTS · REPORTED TYPE · CLARITY 모양을 새로 그림) ── */
  C.scoresheet = function (o) {
    const d = D(), res = o.res || {};
    const root = h('div', { class: 'sheet' });
    /* 1) 원점수 */
    const raw = h('section', { class: 'sh-sec' }, h('h5', {}, '① 원점수 RAW POINTS'));
    d.PAIRS.forEach((p) => {
      const r = res[p.k];
      raw.appendChild(h('div', { class: 'sh-row' },
        h('span', { class: 'sh-l', style: { background: d.letterColor(p.a) } }, p.a), h('span', { class: 'sh-n' }, r ? String(r.a) : '–'),
        h('span', { class: 'sh-mid' }, d.LET[p.a].ko + ' · ' + d.LET[p.b].ko),
        h('span', { class: 'sh-n' }, r ? String(r.b) : '–'), h('span', { class: 'sh-l', style: { background: d.letterColor(p.b) } }, p.b)));
    });
    root.appendChild(raw);
    /* 2) 보고된 유형 + 동점 규칙 */
    const rep = h('section', { class: 'sh-sec' }, h('h5', {}, '② 보고된 유형 REPORTED TYPE'));
    const boxes = h('div', { class: 'sh-boxes' });
    d.PAIRS.forEach((p) => { const r = res[p.k]; boxes.appendChild(h('span', { class: 'sh-box' + (r && r.tie ? ' tie' : ''), style: r ? { color: d.letterColor(r.letter) } : {} }, r ? r.letter : '?')); });
    rep.appendChild(boxes);
    rep.appendChild(h('p', { class: 'sh-rule' }, h('b', {}, '동점 규칙'), ' 두 점수가 같으면 I · N · F · P 로 적습니다. (점선 칸이 동점으로 정해진 글자)'));
    root.appendChild(rep);
    /* 3) 명확도 */
    const cl = h('section', { class: 'sh-sec wide' }, h('h5', {}, '③ 선호 명확도 CLARITY'));
    d.PAIRS.forEach((p) => {
      const r = res[p.k];
      const bar = h('div', { class: 'cl-bar' }, [0, 1, 2, 3].map((i) => h('i', { class: r && i <= r.clarity ? 'on' : '', style: r && i <= r.clarity ? { background: d.letterColor(r.letter) } : {} }, d.CLARITY[i])));
      cl.appendChild(h('div', { class: 'cl-row' }, h('b', { class: 'cl-p' }, r ? ST.letters(r.letter) : '?'), bar, h('span', { class: 'cl-t' }, r ? (r.tie ? '동점 · ' : '') + d.CLARITY[r.clarity] : '미완료')));
    });
    root.appendChild(cl);
    return root;
  };

  /* ── 전·후 비교용 두 극 막대: 왼쪽 a, 오른쪽 b, 중앙 50% ── */
  C.duel = function (o) {
    const d = D(), wrap = h('div', { class: 'duel' });
    (o.rows || []).forEach((r) => {
      const tot = (r.a || 0) + (r.b || 0), pa = tot ? (r.a / tot) * 100 : 50;
      wrap.appendChild(h('div', { class: 'du' + (r.hl ? ' hl' : '') },
        h('span', { class: 'du-l' }, r.label),
        h('span', { class: 'du-t', title: `${o.a} ${r.a || 0} · ${o.b} ${r.b || 0}` },
          h('i', { style: { width: pa + '%', background: d.letterColor(o.a) } }, tot && pa > 14 ? String(r.a) : ''),
          h('i', { style: { width: 100 - pa + '%', background: d.letterColor(o.b) } }, tot && 100 - pa > 14 ? String(r.b) : '')),
        h('span', { class: 'du-v' }, tot ? Math.round(pa) + '%' : '–')));
    });
    wrap.appendChild(ST.fromHtml(`<div class="legend"><span><i style="background:${d.letterColor(o.a)}"></i>${esc(o.a)} ${esc(d.LET[o.a].ko)}</span><span><i style="background:${d.letterColor(o.b)}"></i>${esc(o.b)} ${esc(d.LET[o.b].ko)}</span></div>`));
    return wrap;
  };

  ST.charts = C;
})();
