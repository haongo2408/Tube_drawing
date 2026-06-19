/* ════════════════════════════════════════════════════════════════════
   dashboard_overview.js  —  (file 6/15 — load order #6)
   ------------------------------------------------------------------
   TAB 📊 OVERVIEW + ISSUES (cảnh báo nhanh)
    - renderOverview()/buildPieChart()/buildOvCumChart()
    - addIssue()/renderIssues()/calcOEE()
    Cần: dashboard_core.js, dashboard_plan.js (planData đã build)
   ════════════════════════════════════════════════════════════════════ */

/* OVERVIEW */
function renderOverview() {
	const mo = document.getElementById('ov_month')?.value || '2026-06';
	/* planData always current — managed by _autoSavePlan */
	const filter = document.getElementById('ov_filter')?.value || 'ALL';
	const skuFilter = document.getElementById('ov_sku')?.value || 'ALL';
	const sort = document.getElementById('ov_sort')?.value || 'series';
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	let prods = PRODUCTS;
	if (filter !== 'ALL') prods = prods.filter((p) => p.s === filter);
	if (skuFilter !== 'ALL') prods = prods.filter((p) => p.code === skuFilter);
	const stats = prods.map((p) => {
		const t = Array.from({ length: days }, (_, i) =>
			getTT(mo, p.code, i + 1),
		).reduce((a, b) => a + b, 0);
		const k = Array.from({ length: days }, (_, i) =>
			getKH(mo, p.code, i + 1),
		).reduce((a, b) => a + b, 0);
		return { ...p, _t: t, _k: k, _p: k > 0 ? Math.round((t / k) * 100) : 0 };
	});
	if (sort === 'pct_desc') stats.sort((a, b) => b._p - a._p);
	else if (sort === 'pct_asc') stats.sort((a, b) => a._p - b._p);
	else if (sort === 'tt_desc') stats.sort((a, b) => b._t - a._t);
	else if (sort === 'kh_desc') stats.sort((a, b) => b._k - a._k);
	else if (sort === 'code') stats.sort((a, b) => a.code.localeCompare(b.code));
	else
		/* series */ stats.sort(
			(a, b) => a.s.localeCompare(b.s) || a.code.localeCompare(b.code),
		);
	const gTT = stats.reduce((s, p) => s + p._t, 0);
	const gKH = stats.reduce((s, p) => s + p._k, 0);
	const gP = gKH > 0 ? Math.round((gTT / gKH) * 100) : 0;
	const { sys } = cascade('MB63TD');
	/* KPI + Series strip combined */
	const kpi = document.getElementById('ov_kpi');
	if (kpi)
		kpi.innerHTML = `
    <div class="mc ${gP >= 90 ? 'ok' : gP >= 70 ? 'warn' : 'bn'}"><div class="mc-v" style="font-size:26px">${gP}%</div><div class="mc-l">% Đạt KH</div></div>
    <div class="mc neu"><div class="mc-v" style="font-size:22px">${gTT.toLocaleString()}</div><div class="mc-l">TT tháng (pcs)</div></div>
    <div class="mc neu"><div class="mc-v" style="font-size:22px">${gKH.toLocaleString()}</div><div class="mc-l">KH (đơn hàng)</div></div>
    <div class="mc info"><div class="mc-v" style="font-size:22px">${sys}</div><div class="mc-l">SYS Cap pcs/ca</div></div>
    ${['MB', 'NCA', 'CG']
			.map((s) => {
				const ps = stats.filter((p) => p.s === s);
				const t = ps.reduce((a, p) => a + p._t, 0);
				const k = ps.reduce((a, p) => a + p._k, 0);
				const pct = k > 0 ? Math.round((t / k) * 100) : 0;
				const w = SM[s];
				return `<div class="mc ser-card" style="border-left:4px solid ${w.c};background:#fff"><div style="font-size:11px;font-weight:700;color:${w.c};margin-bottom:5px">${s} Series (${ps.length} mã)</div><div style="font-family:var(--mono);font-size:18px;font-weight:700;color:var(--navy)">${t.toLocaleString()} <span style="font-size:10px;color:var(--t3)">pcs</span></div><div style="font-size:10px;color:var(--t3);margin:2px 0">KH: ${k.toLocaleString()}</div><div style="display:flex;align-items:center;gap:6px;margin-top:4px"><div style="flex:1;height:5px;background:#e5e7eb;border-radius:3px"><div style="height:100%;width:${Math.min(100, pct)}%;background:${w.c};border-radius:3px"></div></div><span style="font-size:11px;font-weight:700;color:${pct >= 90 ? 'var(--grn-m)' : pct >= 70 ? 'var(--amb-m)' : 'var(--red-m)'}">${pct}%</span></div></div>`;
			})
			.join('')}`;
	/* Hide row 2 series strip (now embedded in kpi) */
	const ser = document.getElementById('ov_series');
	if (ser) ser.style.display = 'none';
	const pb = document.getElementById('ov_progress_bars');
	if (pb)
		pb.innerHTML =
			stats
				.map((p) => {
					const w = SM[p.s] || { c: '#888', bg: '#eee' };
					return `<div class="ov-prog-row"><div style="min-width:130px;max-width:160px;font-size:10px;font-weight:700;color:var(--navy);font-family:var(--mono);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.code}</div><span style="background:${w.bg};color:${w.c};padding:1px 4px;border-radius:3px;font-size:8.5px;font-weight:700;width:34px;text-align:center;flex-shrink:0">${p.s}</span><div class="ov-bar-bg"><div class="ov-bar" style="width:${Math.min(100, p._p)}%;background:${p._p >= 90 ? 'var(--grn-m)' : p._p >= 70 ? 'var(--amb-m)' : 'var(--red-m)'}"></div></div><div style="min-width:110px;font-size:9.5px;font-family:var(--mono);color:var(--t2);text-align:right">${p._t.toLocaleString()}/${p._k.toLocaleString()}</div><div style="width:38px;font-size:9.5px;font-weight:700;font-family:var(--mono);color:${p._p >= 90 ? 'var(--grn-m)' : p._p >= 70 ? 'var(--amb-m)' : 'var(--red-m)'};text-align:right">${p._p}%</div></div>`;
				})
				.join('') ||
			'<p style="font-size:11px;color:var(--t3)">Chưa có data</p>';
	/* Man hours */
	const mo2 = document.getElementById('plan_month')?.value || mo;
	const [yr2, m2] = mo2.split('-').map(Number);
	const days2 = new Date(yr2, m2, 0).getDate();
	let wd = 0;
	for (let d = 1; d <= days2; d++) {
		if (!isWE(yr2, m2, d)) wd++;
	}
	const wTotal = WORKERS.reduce(
		(s, w) => s + Math.max(0, wd - (w.leave || 0)) * 8,
		0,
	);
	const wPerf = WORKERS.length
		? Math.round(WORKERS.reduce((s, w) => s + w.perf, 0) / WORKERS.length)
		: 0;
	const mh = document.getElementById('ov_manhour');
	if (mh)
		mh.innerHTML = `<div style="display:flex;gap:16px;flex-wrap:wrap"><div><div style="font-family:var(--mono);font-size:22px;font-weight:700;color:var(--navy)">${wTotal}</div><div style="font-size:10px;color:var(--t3)">Giờ công/tháng<br>(${WORKERS.length} NV)</div></div><div><div style="font-family:var(--mono);font-size:22px;font-weight:700;color:var(--grn-m)">${wPerf}%</div><div style="font-size:10px;color:var(--t3)">Năng suất TB</div></div></div>`;
	buildPieChart();
	buildOvCumChart();
	renderIssues();
	updateStatusBar();
	buildNGSummary();
}
function buildPieChart() {
	const mo = document.getElementById('ov_month')?.value || '2026-06';
	const f = document.getElementById('ov_pie_f')?.value || 'ALL';
	const skuF = document.getElementById('ov_sku')?.value || 'ALL';
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	const SCFG = {
		MB: {
			shades: [
				'#1e3a8a',
				'#1e5fa8',
				'#2563eb',
				'#3b82f6',
				'#60a5fa',
				'#93c5fd',
			],
		},
		NCA: { shades: ['#7f1d1d', '#991b1b', '#dc2626', '#ef4444', '#f87171'] },
		CG: {
			shades: [
				'#14532d',
				'#166534',
				'#16a34a',
				'#22c55e',
				'#4ade80',
				'#86efac',
				'#bbf7d0',
				'#dcfce7',
			],
		},
	};
	const centerTextPlugin = {
		id: 'centerText',
		afterDraw(chart) {
			const {
				ctx,
				chartArea: { left, top, width, height },
			} = chart;
			const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
			if (!total) return;
			ctx.save();
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			const cx = left + width / 2,
				cy = top + height / 2;
			ctx.font = '700 13px "Segoe UI"';
			ctx.fillStyle = '#0f2b4a';
			ctx.fillText(total.toLocaleString(), cx, cy - 6);
			ctx.font = '9px "Segoe UI"';
			ctx.fillStyle = '#64748b';
			ctx.fillText('pcs', cx, cy + 8);
			ctx.restore();
		},
	};
	/* Destroy old */
	['pie', 'pie_MB', 'pie_NCA', 'pie_CG'].forEach((k) => {
		if (charts[k]) {
			charts[k].destroy();
			charts[k] = null;
		}
	});
	const commonOpts = (label) => ({
		responsive: true,
		maintainAspectRatio: false,
		cutout: '58%',
		plugins: {
			legend: { display: false },
			tooltip: {
				callbacks: {
					label: (ctx) => {
						const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
						const pct = total > 0 ? Math.round((ctx.parsed / total) * 100) : 0;
						return ` ${ctx.label}: ${ctx.parsed.toLocaleString()} pcs (${pct}%)`;
					},
				},
			},
		},
	});
	/* Per-series small pies */
	['MB', 'NCA', 'CG'].forEach((s) => {
		const el = document.getElementById('pieChart_' + s);
		if (!el) return;
		let prods = PRODUCTS.filter((p) => p.s === s);
		if (skuF !== 'ALL') prods = prods.filter((p) => p.code === skuF);
		const data = prods
			.map((p) => ({
				code: p.code,
				t: Array.from({ length: days }, (_, i) =>
					getTT(mo, p.code, i + 1),
				).reduce((a, b) => a + b, 0),
			}))
			.filter((d) => d.t > 0);
		const isDim =
			f !== 'ALL' &&
			f !== s &&
			!PRODUCTS.some((p) => p.code === f && p.s === s);
		el.parentElement.style.opacity = isDim ? '0.2' : '1';
		el.parentElement.style.transition = 'opacity .2s';
		if (!data.length) {
			const ctx2 = el.getContext('2d');
			ctx2.clearRect(0, 0, el.width, el.height);
			ctx2.font = '9px Segoe UI';
			ctx2.fillStyle = '#9ca3af';
			ctx2.textAlign = 'center';
			ctx2.fillText('No data', el.width / 2, el.height / 2);
			return;
		}
		const cfg = SCFG[s];
		charts['pie_' + s] = new Chart(el, {
			type: 'doughnut',
			data: {
				labels: data.map((d) => d.code),
				datasets: [
					{
						data: data.map((d) => d.t),
						backgroundColor: data.map(
							(_, i) => cfg.shades[i % cfg.shades.length],
						),
						borderWidth: 2,
						borderColor: '#fff',
						hoverOffset: 4,
					},
				],
			},
			options: commonOpts(s),
			plugins: [centerTextPlugin],
		});
		/* Side legend - vertical beside pie */
		const legEl = document.getElementById('pie_leg_' + s);
		if (legEl)
			legEl.innerHTML = data
				.map(
					(d, i) =>
						`<div style="display:flex;align-items:center;gap:4px;white-space:nowrap"><span style="width:8px;height:8px;border-radius:50%;background:${cfg.shades[i % cfg.shades.length]};display:inline-block;flex-shrink:0"></span><span style="color:#374151;font-size:8px">${d.code.replace(/TD$/, '')}</span><span style="color:var(--t3);font-family:var(--mono);font-size:8px;margin-left:auto;padding-left:4px">${d.t.toLocaleString()}</span></div>`,
				)
				.join('');
	});
	/* Total pie */
	const totalEl = document.getElementById('pieChart');
	if (!totalEl) return;
	let allProds = PRODUCTS;
	if (f !== 'ALL' && !PRODUCTS.some((p) => p.code === f))
		allProds = allProds.filter((p) => p.s === f);
	else if (PRODUCTS.some((p) => p.code === f))
		allProds = allProds.filter((p) => p.code === f);
	if (skuF !== 'ALL') allProds = allProds.filter((p) => p.code === skuF);
	const totalData = allProds
		.map((p) => ({
			code: p.code,
			s: p.s,
			t: Array.from({ length: days }, (_, i) =>
				getTT(mo, p.code, i + 1),
			).reduce((a, b) => a + b, 0),
		}))
		.filter((d) => d.t > 0);
	if (!totalData.length) {
		totalEl.parentElement.innerHTML =
			'<p style="text-align:center;color:var(--t3);padding:20px;font-size:10px">No data</p>';
		return;
	}
	/* Group by series for total pie: 3 slices MB/NCA/CG */
	const serTotals = { MB: 0, NCA: 0, CG: 0 };
	totalData.forEach((d) => (serTotals[d.s] = (serTotals[d.s] || 0) + d.t));
	const serData = Object.entries(serTotals).filter(([, v]) => v > 0);
	const serColors = { MB: '#1e5fa8', NCA: '#dc2626', CG: '#16a34a' };
	charts.pie = new Chart(totalEl, {
		type: 'doughnut',
		data: {
			labels: serData.map(([s]) => s),
			datasets: [
				{
					data: serData.map(([, v]) => v),
					backgroundColor: serData.map(([s]) => serColors[s]),
					borderWidth: 2,
					borderColor: '#fff',
					hoverOffset: 6,
				},
			],
		},
		options: {
			...commonOpts('ALL'),
			plugins: { ...commonOpts('ALL').plugins, legend: { display: false } },
		},
		plugins: [centerTextPlugin],
	});
	/* Total legend - vertical beside total pie */
	const totalLeg = document.getElementById('pie_leg_total');
	if (totalLeg)
		totalLeg.innerHTML = serData
			.map(
				([s, v]) =>
					`<div style="display:flex;align-items:center;gap:6px;margin-bottom:2px"><span style="width:10px;height:10px;border-radius:50%;background:${serColors[s]};display:inline-block;flex-shrink:0"></span><span style="font-size:10px;font-weight:700;color:${serColors[s]}">${s}</span><span style="font-family:var(--mono);font-size:10px;color:var(--navy);margin-left:4px">${v.toLocaleString()}</span><span style="font-size:8.5px;color:var(--t3)">pcs</span></div>`,
			)
			.join('');
}
function buildOvCumChart() {
	const mo = document.getElementById('ov_month')?.value || '2026-06';
	/* Follow same filter as progress bars (ov_filter + ov_sku) */
	const f = document.getElementById('ov_filter')?.value || 'ALL';
	const skuF = document.getElementById('ov_sku')?.value || 'ALL';
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	let prods = PRODUCTS;
	if (f !== 'ALL') prods = prods.filter((p) => p.s === f);
	if (skuF !== 'ALL') prods = prods.filter((p) => p.code === skuF);
	const lbls = Array.from({ length: days }, (_, i) => i + 1);
	const dayTT = lbls.map((d) =>
		prods.reduce((s, p) => s + getTT(mo, p.code, d), 0),
	);
	const dayKH = lbls.map((d) =>
		prods.reduce((s, p) => s + getKH(mo, p.code, d), 0),
	);
	const _td2 = new Date();
	const _isCur2 = _td2.getFullYear() === yr && _td2.getMonth() + 1 === m;
	const _cut2 = _isCur2 ? _td2.getDate() : days;
	const cumTT = dayTT.reduce((a, v, i) => {
		a.push(i + 1 <= _cut2 ? (a[i - 1] || 0) + v : null);
		return a;
	}, []);
	const cumKH = dayKH.reduce((a, v, i) => {
		a.push((a[i - 1] || 0) + v);
		return a;
	}, []);
	const yMax = Math.max(...cumKH.filter((v) => v != null)) || 1000;
	/* Update filter label */
	const cumF = document.getElementById('ov_cum_f');
	if (cumF) cumF.value = f;
	if (charts.ovcum) charts.ovcum.destroy();
	const el = document.getElementById('ovCumChart');
	if (!el) return;
	charts.ovcum = new Chart(el, {
		type: 'line',
		data: {
			labels: lbls,
			datasets: [
				{
					label: 'KH lũy kế',
					data: cumKH,
					borderColor: '#1e5fa8',
					borderDash: [4, 3],
					pointRadius: 0,
					borderWidth: 1.5,
					fill: false,
				},
				{
					label: 'TT lũy kế',
					data: cumTT,
					borderColor: '#dc2626',
					pointRadius: 2,
					borderWidth: 2,
					fill: false,
					spanGaps: false,
				},
			],
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: 'bottom',
					labels: { font: { size: 9 }, boxWidth: 8 },
				},
			},
			scales: {
				x: { ticks: { font: { size: 8 } } },
				y: { min: 0, suggestedMax: yMax * 1.1, ticks: { font: { size: 9 } } },
			},
		},
	});
}

/* ISSUES */
function addIssue() {
	const txt = document.getElementById('issue_txt').value.trim();
	if (!txt) return;
	issues.unshift({
		type: document.getElementById('issue_type').value,
		txt,
		date:
			document.getElementById('issue_date').value ||
			new Date().toISOString().slice(0, 10),
		id: Date.now(),
	});
	localStorage.setItem('smc_issues', JSON.stringify(issues));
	renderIssues();
	document.getElementById('issue_txt').value = '';
}
function renderIssues() {
	const el = document.getElementById('issues_list');
	if (!el) return;
	const cols = {
		'⚠': 'var(--red-m)',
		'👷': 'var(--blue)',
		'📦': 'var(--amb-m)',
		'❌': 'var(--red-m)',
		'🔧': 'var(--org-m)',
		ℹ: 'var(--t3)',
	};
	el.innerHTML =
		issues
			.slice(0, 6)
			.map(
				(is) =>
					`<div style="display:flex;align-items:flex-start;gap:7px;padding:5px 0;border-bottom:1px solid #f0f2f6"><div style="width:7px;height:7px;border-radius:50%;background:${cols[is.type] || 'var(--t3)'};margin-top:4px;flex-shrink:0"></div><div style="flex:1;font-size:11px"><span style="font-size:10px;margin-right:3px">${is.type}</span>${is.txt}<div style="font-size:9px;color:var(--t3)">${is.date}</div></div><button class="btn sm" onclick="issues=issues.filter(i=>i.id!==${is.id});localStorage.setItem('smc_issues',JSON.stringify(issues));renderIssues()" style="color:var(--t3)">✕</button></div>`,
			)
			.join('') ||
		'<p style="font-size:11px;color:var(--t3);padding:6px 0">Chưa có sự kiện</p>';
}
function calcOEE() {
	const a = +(document.getElementById('oee_a')?.value || 89) / 100,
		p2 = +(document.getElementById('oee_p')?.value || 90) / 100,
		q = +(document.getElementById('oee_q')?.value || 98) / 100;
	const oee = (a * p2 * q * 100).toFixed(1);
	const el = document.getElementById('oee_val');
	if (el) {
		el.textContent = oee + '%';
		el.parentElement.className =
			'mc ' + (oee >= 85 ? 'ok' : oee >= 60 ? 'warn' : 'bn');
	}
}

