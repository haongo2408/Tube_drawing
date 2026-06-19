/* ════════════════════════════════════════════════════════════════════
   dashboard_heatmap.js  —  (file 7/15 — load order #7)
   ------------------------------------------------------------------
   TAB 🟩 HEATMAP
    - buildHeatmap()
    Cần: dashboard_core.js, dashboard_plan.js (planData)
   ════════════════════════════════════════════════════════════════════ */

/* HEATMAP */
function buildHeatmap() {
	const el = document.getElementById('hm_content');
	if (!el) return;
	const mo =
		document.getElementById('hm_month')?.value ||
		document.getElementById('plan_month')?.value ||
		'2026-06';
	const series = document.getElementById('hm_series')?.value || 'ALL';
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	let prods = PRODUCTS;
	if (series !== 'ALL') prods = prods.filter((p) => p.s === series);
	const dows = ['日', '月', '火', '水', '木', '金', '土'];
	const nca = +document.getElementById('s_ca').value;
	let html = `<table style="border-collapse:collapse;font-size:9.5px"><thead><tr><th style="text-align:left;background:var(--navy);color:#fff;padding:3px 6px;font-size:9px">Mã SP</th><th style="background:var(--navy);color:#fff;padding:3px 4px;font-size:9px">S</th>`;
	Array.from({ length: days }, (_, i) => i + 1).forEach((d) => {
		const we = isWE(yr, m, d);
		const dow = dows[new Date(yr, m - 1, d).getDay()];
		html += `<th style="background:${we ? '#374151' : 'var(--navy)'};color:#fff;padding:3px 2px;font-size:8.5px;min-width:20px">${d}<br><span style="opacity:.6">${dow}</span></th>`;
	});
	html += `<th style="background:#1a3d6b;color:#fff;padding:3px 5px;font-size:8.5px">%</th></tr></thead><tbody>`;
	prods.forEach((p) => {
		const { sys: sc } = cascade(p.code);
		const dkh = sc * nca;
		let t = 0,
			k = 0;
		const w = SM[p.s] || { bg: '#fff', c: '#111' };
		html += `<tr><td style="text-align:left;font-weight:700;font-size:9.5px;font-family:var(--mono);color:${w.c}">${p.code}</td><td><span style="background:${w.bg};color:${w.c};padding:1px 3px;border-radius:2px;font-size:8px;font-weight:700">${p.s}</span></td>`;
		Array.from({ length: days }, (_, i) => i + 1).forEach((d) => {
			const we = isWE(yr, m, d);
			const v = planData[`${mo}_${p.code}_${d}`];
			k += dkh;
			if (we && (!v || v === 0)) {
				html += `<td style="background:#e5e7eb;font-size:8px;color:#9aa3b0;text-align:center">休</td>`;
				return;
			}
			if (!v) {
				html += `<td style="background:#f3f4f6"></td>`;
				return;
			}
			t += v;
			const pct = dkh > 0 ? v / dkh : 0;
			const bg = pct >= 0.9 ? '#bbf7d0' : pct >= 0.7 ? '#fde68a' : '#fecaca';
			const fc = pct >= 0.9 ? '#14532d' : pct >= 0.7 ? '#78350f' : '#7f1d1d';
			html += `<td style="background:${bg};color:${fc};font-size:8px;font-weight:700;text-align:center">${Math.round(pct * 100)}</td>`;
		});
		const pT = k > 0 ? Math.round((t / k) * 100) : 0;
		const bt = pT >= 90 ? '#bbf7d0' : pT >= 70 ? '#fde68a' : '#fecaca';
		const ft = pT >= 90 ? '#14532d' : pT >= 70 ? '#78350f' : '#7f1d1d';
		html += `<td style="background:${bt};color:${ft};font-weight:700;font-size:9px;text-align:center">${pT}%</td></tr>`;
	});
	el.innerHTML = html + '</tbody></table>';
}

