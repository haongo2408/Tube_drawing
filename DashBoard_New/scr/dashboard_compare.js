/* ════════════════════════════════════════════════════════════════════
   dashboard_compare.js  —  (file 4/15 — load order #4)
   ------------------------------------------------------------------
   TAB 📊 SO SÁNH (A7 — So sánh đa tháng)
    - cmpMonths, cmpView, CMP_COLORS
    - cmpAddMonth/cmpRemoveMonth/cmpClearAll/setCmpView/buildCompare
    - _buildCmpTrend/_buildCmpBar/_buildCmpTable
    Cần: dashboard_core.js (planData, PRODUCTS)
   ════════════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════
   A7 — SO SÁNH ĐA THÁNG
   ══════════════════════════════════════════════════════════════ */
let cmpMonths = [];
let cmpView = 'trend';
const CMP_COLORS = [
	'#1e5fa8',
	'#dc2626',
	'#16a34a',
	'#d97706',
	'#7c3aed',
	'#0891b2',
];

function cmpAddMonth() {
	const mo = document.getElementById('cmp_add_month')?.value;
	if (!mo) {
		alert('Chọn tháng trước.');
		return;
	}
	if (cmpMonths.includes(mo)) {
		alert('Tháng này đã có.');
		return;
	}
	if (cmpMonths.length >= 6) {
		alert('Tối đa 6 tháng.');
		return;
	}
	cmpMonths.push(mo);
	cmpMonths.sort();
	buildCompare();
}
function cmpRemoveMonth(mo) {
	cmpMonths = cmpMonths.filter((m) => m !== mo);
	buildCompare();
}
function cmpClearAll() {
	cmpMonths = [];
	buildCompare();
}

function setCmpView(v) {
	cmpView = v;
	['trend', 'bar', 'table'].forEach((x) => {
		const panel = document.getElementById('cmp_view_' + x + '_panel');
		const btn = document.getElementById('cmp_view_' + x);
		if (panel) panel.style.display = x === v ? '' : 'none';
		if (btn) {
			btn.style.background = x === v ? 'var(--navy)' : '';
			btn.style.color = x === v ? '#fff' : '';
		}
	});
	buildCompare();
}

function buildCompare() {
	const tagsEl = document.getElementById('cmp_month_tags');
	if (tagsEl)
		tagsEl.innerHTML = cmpMonths.length
			? cmpMonths
					.map(
						(mo, i) =>
							`<span style="display:inline-flex;align-items:center;gap:4px;background:${CMP_COLORS[i]};color:#fff;padding:2px 8px;border-radius:12px;font-size:9.5px;font-weight:700">${mo}<button onclick="cmpRemoveMonth('${mo}')" style="background:none;border:none;color:#fff;cursor:pointer;font-size:11px;padding:0;margin-left:2px;line-height:1">×</button></span>`,
					)
					.join('')
			: '<span style="font-size:10px;color:var(--t3)">Chưa chọn tháng — nhập và nhấn + Thêm</span>';
	if (!cmpMonths.length) {
		const ks = document.getElementById('cmp_kpi_strip');
		if (ks) ks.innerHTML = '';
		return;
	}
	const series = document.getElementById('cmp_series')?.value || 'ALL';
	const skuV = document.getElementById('cmp_sku')?.value || 'ALL';
	let prods = PRODUCTS;
	if (series !== 'ALL') prods = prods.filter((p) => p.s === series);
	if (skuV !== 'ALL') prods = prods.filter((p) => p.code === skuV);
	const skuSel = document.getElementById('cmp_sku');
	if (skuSel) {
		if (series !== 'ALL') {
			skuSel.style.display = '';
			const sp = PRODUCTS.filter((p) => p.s === series);
			skuSel.innerHTML =
				'<option value="ALL">Mọi mã ' +
				series +
				'</option>' +
				sp.map((p) => `<option value="${p.code}">${p.code}</option>`).join('');
		} else {
			skuSel.style.display = 'none';
			skuSel.value = 'ALL';
		}
	}
	const moData = cmpMonths.map((mo) => {
		const [yr, m] = mo.split('-').map(Number);
		const days = new Date(yr, m, 0).getDate();
		let totTT = 0,
			totKH = 0;
		const skuBreakdown = {};
		prods.forEach((p) => {
			let tt = 0,
				kh = 0;
			for (let d = 1; d <= days; d++) {
				tt += getTT(mo, p.code, d);
				kh += getKH(mo, p.code, d);
			}
			totTT += tt;
			totKH += kh;
			skuBreakdown[p.code] = {
				tt,
				kh,
				pct: kh > 0 ? Math.round((tt / kh) * 100) : 0,
			};
		});
		const ngQty = ngData
			.filter((r) => r.date && r.date.startsWith(mo))
			.reduce((s, r) => s + (r.qty || 0), 0);
		let leaveDays = 0;
		try {
			const att = JSON.parse(
				localStorage.getItem('smc_attendance_' + mo) || '{}',
			);
			WORKERS.forEach((w) => {
				const wAtt = att[w.id] || {};
				leaveDays += Object.values(wAtt).reduce((a, b) => a + b, 0);
			});
		} catch (e) {}
		const cumDays = Array.from({ length: days }, (_, i) =>
			prods.reduce((s, p) => s + getTT(mo, p.code, i + 1), 0),
		).reduce((acc, v, i) => {
			acc.push((acc[i - 1] || 0) + v);
			return acc;
		}, []);
		return {
			mo,
			totTT,
			totKH,
			pct: totKH > 0 ? Math.round((totTT / totKH) * 100) : 0,
			ngQty,
			leaveDays,
			skuBreakdown,
			cumDays,
			days,
		};
	});
	/* KPI Strip */
	const kpiEl = document.getElementById('cmp_kpi_strip');
	if (kpiEl)
		kpiEl.innerHTML = moData
			.map(
				(d, i) =>
					`<div class="card" style="padding:8px 12px;flex:1;min-width:130px;border-top:3px solid ${CMP_COLORS[i]}"><div style="font-size:9px;font-weight:700;color:${CMP_COLORS[i]};margin-bottom:4px">${d.mo}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:3px"><div><div style="font-size:16px;font-weight:700;font-family:var(--mono);color:var(--navy)">${d.totTT.toLocaleString()}</div><div style="font-size:8px;color:var(--t3)">TT (pcs)</div></div><div><div style="font-size:16px;font-weight:700;font-family:var(--mono);color:${d.pct >= 90 ? 'var(--grn-m)' : d.pct >= 70 ? 'var(--amb-m)' : 'var(--red-m)'}">${d.pct}%</div><div style="font-size:8px;color:var(--t3)">% KH</div></div><div><div style="font-size:13px;font-weight:700;font-family:var(--mono);color:var(--red-m)">${d.ngQty}</div><div style="font-size:8px;color:var(--t3)">NG pcs</div></div><div><div style="font-size:13px;font-weight:700;font-family:var(--mono);color:var(--amb-m)">${d.leaveDays}</div><div style="font-size:8px;color:var(--t3)">Nghỉ (ngày)</div></div></div></div>`,
			)
			.join('');
	if (cmpView === 'trend') _buildCmpTrend(moData, prods);
	else if (cmpView === 'bar') _buildCmpBar(moData, prods);
	else if (cmpView === 'table') _buildCmpTable(moData, prods);
}

function _buildCmpTrend(moData, prods) {
	if (charts.cmpCum) charts.cmpCum.destroy();
	const cumEl = document.getElementById('cmpCumChart');
	if (cumEl) {
		const maxDays = Math.max(...moData.map((d) => d.days));
		charts.cmpCum = new Chart(cumEl, {
			type: 'line',
			data: {
				labels: Array.from({ length: maxDays }, (_, i) => i + 1),
				datasets: moData.map((d, i) => ({
					label: d.mo,
					data: Array.from({ length: maxDays }, (_, j) => d.cumDays[j] ?? null),
					borderColor: CMP_COLORS[i],
					backgroundColor: CMP_COLORS[i] + '20',
					borderWidth: 2,
					pointRadius: 0,
					tension: 0.3,
					fill: false,
					spanGaps: false,
				})),
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'bottom',
						labels: { font: { size: 9 }, boxWidth: 12 },
					},
				},
				scales: {
					x: { title: { display: true, text: 'Ngày', font: { size: 9 } } },
					y: { title: { display: true, text: 'pcs', font: { size: 9 } } },
				},
			},
		});
	}
	if (charts.cmpPct) charts.cmpPct.destroy();
	const pctEl = document.getElementById('cmpPctChart');
	if (pctEl)
		charts.cmpPct = new Chart(pctEl, {
			type: 'bar',
			data: {
				labels: moData.map((d) => d.mo),
				datasets: [
					{
						label: '% Đạt KH',
						data: moData.map((d) => d.pct),
						backgroundColor: moData.map((d) =>
							d.pct >= 90
								? '#16a34acc'
								: d.pct >= 70
									? '#d97706cc'
									: '#dc2626cc',
						),
						borderRadius: 4,
						borderWidth: 0,
					},
					{
						label: 'Target 90%',
						data: moData.map(() => 90),
						type: 'line',
						borderColor: '#dc2626',
						borderDash: [5, 3],
						pointRadius: 0,
						borderWidth: 1.5,
						fill: false,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'bottom',
						labels: { font: { size: 9 }, boxWidth: 10 },
					},
				},
				scales: { y: { min: 0, max: 130 } },
			},
		});
	if (charts.cmpNG) charts.cmpNG.destroy();
	const ngEl = document.getElementById('cmpNGChart');
	if (ngEl)
		charts.cmpNG = new Chart(ngEl, {
			type: 'bar',
			data: {
				labels: moData.map((d) => d.mo),
				datasets: [
					{
						label: 'NG (pcs)',
						data: moData.map((d) => d.ngQty),
						backgroundColor: '#dc262688',
						borderRadius: 4,
						borderWidth: 0,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: { legend: { display: false } },
				scales: {
					y: { title: { display: true, text: 'pcs', font: { size: 9 } } },
				},
			},
		});
	if (charts.cmpLeave) charts.cmpLeave.destroy();
	const lvEl = document.getElementById('cmpLeaveChart');
	if (lvEl)
		charts.cmpLeave = new Chart(lvEl, {
			type: 'bar',
			data: {
				labels: moData.map((d) => d.mo),
				datasets: [
					{
						label: 'Ngày nghỉ',
						data: moData.map((d) => d.leaveDays),
						backgroundColor: '#d9780688',
						borderRadius: 4,
						borderWidth: 0,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: { legend: { display: false } },
				scales: {
					y: { title: { display: true, text: 'ngày', font: { size: 9 } } },
				},
			},
		});
}

function _buildCmpBar(moData, prods) {
	if (charts.cmpBar) charts.cmpBar.destroy();
	const el = document.getElementById('cmpBarChart');
	if (el)
		charts.cmpBar = new Chart(el, {
			type: 'bar',
			data: {
				labels: prods.map((p) => p.code),
				datasets: moData.map((d, i) => ({
					label: d.mo,
					data: prods.map((p) => d.skuBreakdown[p.code]?.tt || 0),
					backgroundColor: CMP_COLORS[i] + '99',
					borderRadius: 3,
					borderWidth: 0,
				})),
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'bottom',
						labels: { font: { size: 9 }, boxWidth: 10 },
					},
				},
				scales: {
					x: { ticks: { font: { size: 8 } } },
					y: { title: { display: true, text: 'pcs', font: { size: 9 } } },
				},
			},
		});
	if (charts.cmpBarPct) charts.cmpBarPct.destroy();
	const el2 = document.getElementById('cmpBarPctChart');
	if (el2)
		charts.cmpBarPct = new Chart(el2, {
			type: 'bar',
			data: {
				labels: prods.map((p) => p.code),
				datasets: moData.map((d, i) => ({
					label: d.mo,
					data: prods.map((p) => d.skuBreakdown[p.code]?.pct || 0),
					backgroundColor: CMP_COLORS[i] + '99',
					borderRadius: 3,
					borderWidth: 0,
				})),
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'bottom',
						labels: { font: { size: 9 }, boxWidth: 10 },
					},
				},
				scales: {
					x: { ticks: { font: { size: 8 } } },
					y: {
						min: 0,
						max: 150,
						title: { display: true, text: '%', font: { size: 9 } },
					},
				},
			},
		});
}

function _buildCmpTable(moData, prods) {
	const tbl = document.getElementById('cmp_table');
	if (!tbl) return;
	let html = `<thead><tr><th style="position:sticky;left:0;background:var(--navy);color:#fff;padding:4px 8px;font-size:10px;text-align:left;z-index:2;min-width:100px">Mã SP</th><th style="position:sticky;left:100px;background:var(--navy);color:#fff;padding:4px 5px;font-size:9px;z-index:2;min-width:46px">Series</th>${moData.map((d, i) => `<th colspan="3" style="background:${CMP_COLORS[i]};color:#fff;padding:4px 8px;font-size:9.5px;text-align:center">${d.mo}</th>`).join('')}</tr><tr><th style="position:sticky;left:0;background:#1a3d6b;color:#fff;padding:3px 8px;z-index:2"></th><th style="position:sticky;left:100px;background:#1a3d6b;color:#fff;padding:3px 5px;z-index:2"></th>${moData.map(() => '<th style="background:#1a3d6b;color:#aac4e8;font-size:8.5px;padding:3px 4px;text-align:center;min-width:46px">TT</th><th style="background:#1a3d6b;color:#aac4e8;font-size:8.5px;padding:3px 4px;text-align:center;min-width:46px">KH</th><th style="background:#1a3d6b;color:#aac4e8;font-size:8.5px;padding:3px 4px;text-align:center;min-width:38px">%</th>').join('')}</tr></thead><tbody>`;
	prods.forEach((p) => {
		const w = SM[p.s] || { bg: '#fff', c: '#111' };
		html += `<tr><td style="position:sticky;left:0;background:#fff;z-index:1;font-weight:700;font-family:var(--mono);font-size:9.5px;color:${w.c};padding:3px 8px;border-bottom:1px solid #f0f2f6">${p.code}</td><td style="position:sticky;left:100px;background:#fff;z-index:1;padding:3px 5px;border-bottom:1px solid #f0f2f6"><span style="background:${w.bg};color:${w.c};padding:1px 4px;border-radius:2px;font-size:8px;font-weight:700">${p.s}</span></td>${moData
			.map((d, mi) => {
				const bd = d.skuBreakdown[p.code] || { tt: 0, kh: 0, pct: 0 };
				const pc = bd.pct;
				const bg =
					pc >= 90
						? '#f0fdf4'
						: pc >= 70
							? '#fffbeb'
							: bd.tt > 0
								? '#fef2f2'
								: '';
				const fc =
					pc >= 90
						? 'var(--grn-m)'
						: pc >= 70
							? 'var(--amb-m)'
							: 'var(--red-m)';
				return `<td style="text-align:right;font-family:var(--mono);font-size:9.5px;padding:3px 6px;background:${mi % 2 ? '#fafbff' : ''};border-bottom:1px solid #f0f2f6">${bd.tt || '—'}</td><td style="text-align:right;font-family:var(--mono);font-size:9.5px;padding:3px 6px;color:var(--t3);background:${mi % 2 ? '#fafbff' : ''};border-bottom:1px solid #f0f2f6">${bd.kh || '—'}</td><td style="text-align:center;font-family:var(--mono);font-size:9.5px;font-weight:700;padding:3px 5px;background:${bg};color:${bd.tt > 0 ? fc : 'var(--t3)'};border-bottom:1px solid #f0f2f6">${bd.tt > 0 ? pc + '%' : '—'}</td>`;
			})
			.join('')}</tr>`;
	});
	html += `<tr><td style="position:sticky;left:0;background:#0f2b4a;color:#fff;padding:4px 8px;font-size:10px;font-weight:700;z-index:2">TỔNG</td><td style="position:sticky;left:100px;background:#0f2b4a;color:#fff;padding:4px 5px;z-index:2">—</td>${moData
		.map((d, mi) => {
			const bg = d.pct >= 90 ? '#16a34a' : d.pct >= 70 ? '#d97706' : '#dc2626';
			return `<td style="text-align:right;font-family:var(--mono);font-size:10px;padding:4px 6px;font-weight:700;color:var(--navy);background:${mi % 2 ? '#e8f0ff' : ''}">${d.totTT.toLocaleString()}</td><td style="text-align:right;font-family:var(--mono);font-size:10px;padding:4px 6px;color:var(--t3);background:${mi % 2 ? '#e8f0ff' : ''}">${d.totKH.toLocaleString()}</td><td style="text-align:center;font-family:var(--mono);font-size:11px;font-weight:700;padding:4px 5px;background:${bg};color:#fff">${d.pct}%</td>`;
		})
		.join('')}</tr></tbody>`;
	tbl.innerHTML = html;
}
/* ── end A7 ── */

