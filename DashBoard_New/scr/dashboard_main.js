/* ════════════════════════════════════════════════════════════════════
   dashboard_main.js  —  (file 15/15 — load order #15)
   ------------------------------------------------------------------
   ORCHESTRATION — update()/goTab() + INIT + mọi *FilterChanged handler + BOOTSTRAP
    - update()/goTab() (chuyển tab, gọi build*() tương ứng từng tab)
    - initSelects/setWorkerPhoto/ngFilterChanged/ovFilterChanged/ovSkuChanged/
      _syncSeriesSelect/ovPieChanged/ovCumChanged/planFilterChanged/planSkuChanged/
      buildNGCharts/refreshActiveTab/buildNGSummary/buildStaffSummary/buildHelpTab
    - BOOTSTRAP: gọi loadAll(), buildXXX() ban đầu, setInterval cho clock/status bar
    ⚠ PHẢI load CUỐI CÙNG (sau tất cả 14 file kia) — BOOTSTRAP gọi hàm từ mọi tab.
   ════════════════════════════════════════════════════════════════════ */

/* MAIN UPDATE + TAB SWITCH */
function update() {
	const bnIdx = gBN();
	PROCS.forEach((p, i) => (p.isBN = i === bnIdx));
	const { res: caps, sys } = cascade('MB63TD');
	document.getElementById('hdr_shift').textContent =
		`${gA()} ph/ca · ${Math.round(gU() * 100)}% util · ${document.getElementById('s_ca').value} ca/ngày`;
	document.getElementById('hdr_bn').textContent =
		`${PROCS[bnIdx].name.split(' ')[0]} BN ⚠ ${PROCS[bnIdx].ct}s×${PROCS[bnIdx].sta}台 | SYS:${sys}`;
	const at = document.querySelector('.panel.act');
	if (at) {
		const n = at.id.replace('tab-', '');
		if (n === 'overview') renderOverview();
		if (n === 'capacity') {
			buildProcTable(caps, sys);
			buildSOBBars(caps, sys);
		}
		if (n === 'pulse') {
			drawPulse();
			buildPulseSummary();
		}
		if (n === 'ca3') updateCa();
	}
	calcOEE();
	updateStatusBar();
}
function goTab(name, btn) {
	document
		.querySelectorAll('.panel')
		.forEach((el) => el.classList.remove('act'));
	document.querySelectorAll('.tab').forEach((el) => el.classList.remove('act'));
	const panel = document.getElementById('tab-' + name);
	if (panel) panel.classList.add('act');
	btn.classList.add('act');
	saveUIState(); /* Persist active tab */
	setTimeout(() => {
		if (name === 'overview') {
			renderOverview();
			buildStaffSummary();
		}
		if (name === 'plan') {
			buildPlanTable();
			setTimeout(() => updatePlanCharts(), 100);
		}
		if (name === 'ctsx') buildCTSXTable();
		/* F4: resize all charts after tab switch */
		setTimeout(
			() =>
				Object.values(charts).forEach((c) => {
					try {
						if (c && typeof c.resize === 'function') c.resize();
					} catch (e) {}
				}),
			120,
		);
		if (name === 'pulse') {
			drawPulse();
			buildPulseSummary();
		}
		if (name === 'heatmap') buildHeatmap();
		if (name === 'compare') buildCompare();
		if (name === 'ca3') updateCa();
		if (name === 'worker') {
			buildWorkerCards();
			buildAttendTable();
		}
		if (name === 'quality') {
			buildNGTable();
			if (ngPanelOpen) buildNGCodesTable();
			buildNGCharts();
		}
		if (name === 'incident') renderIncList();
		if (name === 'capacity') {
			/* Init cap_sku dropdown if not done */
			const capSku = document.getElementById('cap_sku');
			if (capSku && capSku.options.length <= 1) {
				PRODUCTS.forEach((p) => {
					const o = document.createElement('option');
					o.value = p.code;
					o.textContent = p.code;
					capSku.appendChild(o);
				});
			}
			const ser = document.getElementById('cap_series')?.value || 'ALL';
			const sku = document.getElementById('cap_sku')?.value || 'ALL';
			let refSku = 'MB63TD';
			if (sku !== 'ALL') refSku = sku;
			else if (ser !== 'ALL') {
				const f = PRODUCTS.find((p) => p.s === ser);
				if (f) refSku = f.code;
			}
			const { res: c, sys: s } = cascade(refSku);
			buildProcTable(c, s);
			buildSOBBars(c, s);
			buildCapCharts(refSku);
		}
		if (name === 'help') buildHelpTab();
		calcOEE();
	}, 50);
}

/* INIT */
function initSelects() {
	['pulse_sku', 'tt_sku'].forEach((id) => {
		const el = document.getElementById(id);
		if (!el) return;
		el.innerHTML = PRODUCTS.map(
			(p) => `<option value="${p.code}">${p.code}</option>`,
		).join('');
		el.value = 'MB63TD';
	});
}

document.addEventListener('keydown', (e) => {
	if ((e.ctrlKey || e.metaKey) && e.key === 's') {
		e.preventDefault();
		saveAll();
	}
	if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
		e.preventDefault();
		editMode ? exitEdit(false) : enterEdit();
	}
	if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
		e.preventDefault();
		window.print();
	}
	if (e.key === 'Escape' && editMode) exitEdit(false);
});

/* Worker photo */
function setWorkerPhoto(wi, input) {
	const file = input.files[0];
	if (!file) return;
	const reader = new FileReader();
	reader.onload = (e) => {
		WORKERS[wi].photo = e.target.result;
		saveWorkers();
		buildWorkerCards();
	};
	reader.readAsDataURL(file);
}

function ngFilterChanged() {
	const ser = document.getElementById('ng_filter_ser')?.value || 'ALL';
	const skuSel = document.getElementById('ng_filter_sku');
	if (skuSel) {
		if (ser !== 'ALL') {
			skuSel.style.display = '';
			const prods = PRODUCTS.filter((p) => p.s === ser);
			skuSel.innerHTML =
				'<option value="ALL">Mọi mã</option>' +
				prods
					.map((p) => `<option value="${p.code}">${p.code}</option>`)
					.join('');
		} else {
			skuSel.style.display = 'none';
			skuSel.value = 'ALL';
		}
	}
	buildNGCharts();
}

/* ── FILTER HELPERS ── */
/* F1 fix: ovFilterChanged sync tất cả charts trong Overview */
function ovFilterChanged() {
	saveUIState();
	const ser = document.getElementById('ov_filter')?.value || 'ALL';
	const skuSel = document.getElementById('ov_sku');
	/* Rebuild SKU dropdown */
	if (skuSel) {
		if (ser !== 'ALL') {
			skuSel.style.display = '';
			const prods = PRODUCTS.filter((p) => p.s === ser);
			skuSel.innerHTML =
				'<option value="ALL">Mọi mã ' +
				ser +
				'</option>' +
				prods
					.map((p) => `<option value="${p.code}">${p.code}</option>`)
					.join('');
		} else {
			skuSel.style.display = 'none';
			skuSel.value = 'ALL';
		}
	}
	/* Sync pie filter */
	const pf = document.getElementById('ov_pie_f');
	if (pf) {
		_syncSeriesSelect(pf, ser);
		pf.value = ser;
	}
	/* Sync cum filter */
	const cf = document.getElementById('ov_cum_f');
	if (cf) {
		_syncSeriesSelect(cf, ser);
		cf.value = ser;
	}
	renderOverview();
}
/* Khi SKU select thay đổi → sync pie + cum theo SKU đó */
function ovSkuChanged() {
	saveUIState();
	const ser = document.getElementById('ov_filter')?.value || 'ALL';
	const sku = document.getElementById('ov_sku')?.value || 'ALL';
	/* Pie và cum không có SKU-level filter → chỉ sync series */
	const pf = document.getElementById('ov_pie_f');
	if (pf) {
		_syncSeriesSelect(pf, ser);
		pf.value = ser;
	}
	const cf = document.getElementById('ov_cum_f');
	if (cf) {
		_syncSeriesSelect(cf, ser);
		cf.value = ser;
	}
	renderOverview();
}
/* Helper: rebuild a series select to match current series, optionally include SKU options */
function _syncSeriesSelect(sel, ser) {
	if (!sel) return;
	const base =
		'<option value="ALL">Tất cả</option><option value="MB">MB</option><option value="NCA">NCA</option><option value="CG">CG</option>';
	if (ser === 'ALL') {
		sel.innerHTML = base;
	} else {
		const prods = PRODUCTS.filter((p) => p.s === ser);
		sel.innerHTML =
			`<option value="ALL">Tất cả</option><option value="MB">MB</option><option value="NCA">NCA</option><option value="CG">CG</option>` +
			'<optgroup label="── ' +
			ser +
			' ──">' +
			prods
				.map((p) => `<option value="${p.code}">${p.code}</option>`)
				.join('') +
			'</optgroup>';
	}
}
/* Khi pie filter đổi → sync ov_filter nếu là series level */
function ovPieChanged() {
	const v = document.getElementById('ov_pie_f')?.value || 'ALL';
	const isSkuLevel = PRODUCTS.some((p) => p.code === v);
	if (!isSkuLevel) {
		const of = document.getElementById('ov_filter');
		if (of && of.value !== v) {
			of.value = v;
			ovFilterChanged();
			return;
		}
	}
	buildPieChart();
}
/* Khi cum filter đổi → sync */
function ovCumChanged() {
	const v = document.getElementById('ov_cum_f')?.value || 'ALL';
	const isSkuLevel = PRODUCTS.some((p) => p.code === v);
	if (!isSkuLevel) {
		const of = document.getElementById('ov_filter');
		if (of && of.value !== v) {
			of.value = v;
			ovFilterChanged();
			return;
		}
	}
	buildOvCumChart();
}
function planFilterChanged() {
	const ser = document.getElementById('plan_series')?.value || 'ALL';
	const skuSel = document.getElementById('plan_sku');
	/* Rebuild SKU select */
	if (skuSel) {
		if (ser !== 'ALL') {
			skuSel.style.display = '';
			const prods2 = PRODUCTS.filter((p) => p.s === ser);
			skuSel.innerHTML =
				`<option value="ALL">Mọi mã ${ser}</option>` +
				prods2
					.map((p) => `<option value="${p.code}">${p.code}</option>`)
					.join('');
		} else {
			skuSel.style.display = 'none';
			skuSel.value = 'ALL';
		}
	}
	buildPlanTable();
	updatePlanCharts();
	saveUIState();
}
function planSkuChanged() {
	buildPlanTable();
	updatePlanCharts();
	saveUIState();
}

/* ── NG CHARTS IMPROVED ── */
function buildNGCharts() {
	/* Chart 1: NG xu hướng theo ngày + filter by series/SKU */
	const ngSer = document.getElementById('ng_filter_ser')?.value || 'ALL';
	const ngSku = document.getElementById('ng_filter_sku')?.value || 'ALL';
	let filtered = ngData;
	if (ngSer !== 'ALL')
		filtered = filtered.filter(
			(r) => PRODUCTS.find((p) => p.code === r.sku)?.s === ngSer,
		);
	if (ngSku !== 'ALL') filtered = filtered.filter((r) => r.sku === ngSku);

	/* Trend chart */
	if (charts.ngTrend) charts.ngTrend.destroy();
	const te = document.getElementById('ng_trend');
	if (te) {
		if (!filtered.length) {
			te.parentElement.innerHTML =
				'<p style="text-align:center;color:var(--t3);padding:40px;font-size:11px">Chưa có dữ liệu NG</p>';
			return;
		}
		const g = {};
		filtered.forEach((r) => {
			if (!g[r.date]) g[r.date] = 0;
			g[r.date] += r.qty;
		});
		const dates = Object.keys(g).sort();
		charts.ngTrend = new Chart(te, {
			type: 'bar',
			data: {
				labels: dates,
				datasets: [
					{
						label: 'NG qty/ngày',
						data: dates.map((d) => g[d]),
						backgroundColor: '#fca5a5',
						borderWidth: 0,
					},
					{
						label: 'Trend',
						data: dates.map((d) => g[d]),
						type: 'line',
						borderColor: '#dc2626',
						pointRadius: 3,
						borderWidth: 2,
						fill: false,
						tension: 0.3,
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
					y: { ticks: { font: { size: 9 } } },
				},
			},
		});
	}

	/* Pareto chart */
	if (charts.ngPareto) charts.ngPareto.destroy();
	const pe = document.getElementById('ng_pareto');
	if (pe && filtered.length) {
		const gc = {};
		filtered.forEach((r) => {
			const lbl = r.ngCode
				? NG_CODES.find((c) => c.code === r.ngCode)?.vn || 'Code ' + r.ngCode
				: r.cause || 'Khác';
			if (!gc[lbl]) gc[lbl] = 0;
			gc[lbl] += r.qty;
		});
		const sorted = Object.entries(gc)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 10);
		const total = sorted.reduce((s, [, v]) => s + v, 0);
		let cum = 0;
		const cp = sorted.map(([, v]) => {
			cum += v;
			return +((cum / total) * 100).toFixed(1);
		});
		charts.ngPareto = new Chart(pe, {
			type: 'bar',
			data: {
				labels: sorted.map(([k]) => k),
				datasets: [
					{
						label: 'NG qty',
						data: sorted.map(([, v]) => v),
						backgroundColor: '#fca5a5',
						borderWidth: 0,
					},
					{
						label: '累計%',
						data: cp,
						type: 'line',
						borderColor: '#dc2626',
						yAxisID: 'y2',
						pointRadius: 3,
						borderWidth: 2,
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
						labels: { font: { size: 9 }, boxWidth: 8 },
					},
				},
				scales: {
					x: { ticks: { font: { size: 8 }, maxRotation: 35 } },
					y: { ticks: { font: { size: 9 } } },
					y2: {
						position: 'right',
						min: 0,
						max: 100,
						ticks: { font: { size: 9 }, callback: (v) => v + '%' },
					},
				},
			},
		});
	}

	/* NEW: NG by Series pie */
	if (charts.ngPie) charts.ngPie.destroy();
	const pie = document.getElementById('ng_pie_chart');
	if (pie && filtered.length) {
		const gs = { MB: 0, NCA: 0, CG: 0, Unknown: 0 };
		filtered.forEach((r) => {
			const s = PRODUCTS.find((p) => p.code === r.sku)?.s || 'Unknown';
			gs[s] = (gs[s] || 0) + r.qty;
		});
		const entries = Object.entries(gs).filter(([, v]) => v > 0);
		charts.ngPie = new Chart(pie, {
			type: 'doughnut',
			data: {
				labels: entries.map(([k]) => k),
				datasets: [
					{
						data: entries.map(([, v]) => v),
						backgroundColor: entries.map(
							([k]) =>
								({
									MB: '#1e5fa8',
									NCA: '#dc2626',
									CG: '#16a34a',
									Unknown: '#9aa3b0',
								})[k] || '#888',
						),
						borderWidth: 2,
						borderColor: '#fff',
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
			},
		});
	}

	/* NEW: NG by SKU bar */
	if (charts.ngBySku) charts.ngBySku.destroy();
	const bsk = document.getElementById('ng_bysku_chart');
	if (bsk && filtered.length) {
		const gs2 = {};
		filtered.forEach((r) => {
			if (!gs2[r.sku]) gs2[r.sku] = 0;
			gs2[r.sku] += r.qty;
		});
		const sorted2 = Object.entries(gs2).sort((a, b) => b[1] - a[1]);
		const skuColors = sorted2.map(
			([k]) => SM[PRODUCTS.find((p) => p.code === k)?.s]?.c || '#888',
		);
		charts.ngBySku = new Chart(bsk, {
			type: 'bar',
			data: {
				labels: sorted2.map(([k]) => k),
				datasets: [
					{
						label: 'NG qty',
						data: sorted2.map(([, v]) => v),
						backgroundColor: skuColors,
						borderWidth: 0,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				indexAxis: 'y',
				plugins: { legend: { display: false } },
				scales: {
					x: { ticks: { font: { size: 8 } } },
					y: { ticks: { font: { size: 9 } } },
				},
			},
		});
	}
}

/* ── REALTIME REFRESH — save triggers immediate rebuild ── */
/* refreshActiveTab below */
function refreshActiveTab() {
	const at = document.querySelector('.panel.act');
	if (!at) return;
	const n = at.id.replace('tab-', '');
	if (n === 'overview') renderOverview();
	if (n === 'plan') {
		buildPlanTable();
		setTimeout(() => {
			updatePlanCharts();
			Object.values(charts).forEach((c) => {
				try {
					c.resize();
				} catch (e) {}
			});
		}, 120);
	}
	if (n === 'heatmap') buildHeatmap();
	if (n === 'worker') buildWorkerCards();
	if (n === 'quality') {
		buildNGTable();
		buildNGCharts();
	}
	if (n === 'capacity') {
		const { res: c, sys: s } = cascade('MB63TD');
		buildProcTable(c, s);
		buildSOBBars(c, s);
	}
}

/* ── OVERVIEW: staff attendance ── */
/* ── A5: NG SUMMARY (mini) cho Overview ── */
function buildNGSummary() {
	const el = document.getElementById('ov_ng_summary');
	if (!el) return;
	const mo =
		document.getElementById('ov_month')?.value ||
		new Date().toISOString().slice(0, 7);
	const moEl = document.getElementById('ng_sum_mo');
	if (moEl) moEl.textContent = mo;
	/* Filter ngData by month */
	const rows = ngData.filter((r) => r.date && r.date.startsWith(mo));
	if (!rows.length) {
		el.innerHTML =
			'<p style="font-size:11px;color:var(--t3);padding:4px 0">Chưa có data NG tháng này</p>';
		return;
	}
	/* Aggregate by ngCode */
	const byCode = {};
	rows.forEach((r) => {
		const k = r.ngCode || '?';
		if (!byCode[k]) byCode[k] = { code: k, qty: 0, desc: '', causes: {} };
		byCode[k].qty += r.qty || 0;
		if (r.cause)
			byCode[k].causes[r.cause] =
				(byCode[k].causes[r.cause] || 0) + (r.qty || 0);
		const codeInfo = NG_CODES.find((c) => c.code === k);
		if (codeInfo) byCode[k].desc = codeInfo.vn || codeInfo.jp || '';
	});
	const sorted = Object.values(byCode)
		.sort((a, b) => b.qty - a.qty)
		.slice(0, 3);
	const totalNG = rows.reduce((s, r) => s + (r.qty || 0), 0);
	el.innerHTML = `
    <div style="font-size:10px;color:var(--t3);margin-bottom:6px">Tổng NG: <b style="color:var(--red-m);font-family:var(--mono)">${totalNG} pcs</b> | ${rows.length} records</div>
    ${sorted
			.map((c, i) => {
				const topCause = Object.entries(c.causes).sort(
					(a, b) => b[1] - a[1],
				)[0];
				const pct = totalNG > 0 ? Math.round((c.qty / totalNG) * 100) : 0;
				return `<div style="margin-bottom:7px">
        <div style="display:flex;align-items:center;gap:5px;margin-bottom:2px">
          <span style="background:${i === 0 ? '#fef2f2' : i === 1 ? '#fffbeb' : '#f0fdf4'};color:${i === 0 ? 'var(--red-m)' : i === 1 ? 'var(--amb-m)' : 'var(--grn-m)'};font-size:9px;font-weight:700;padding:1px 5px;border-radius:3px">#${i + 1}</span>
          <span style="font-size:10px;font-weight:700;font-family:var(--mono)">${c.code}</span>
          <span style="font-size:9.5px;color:var(--t2);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.desc}</span>
          <span style="font-family:var(--mono);font-size:10px;font-weight:700;color:var(--red-m)">${c.qty}</span>
        </div>
        <div style="height:4px;background:#f0f2f6;border-radius:2px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:${i === 0 ? 'var(--red-m)' : i === 1 ? 'var(--amb-m)' : 'var(--grn-m)'};border-radius:2px"></div>
        </div>
        ${topCause ? `<div style="font-size:9px;color:var(--t3);margin-top:1px">↳ ${topCause[0]}</div>` : ''}
      </div>`;
			})
			.join('')}
    <div style="margin-top:6px;padding-top:6px;border-top:1px dashed var(--bdr)">
      <span style="font-size:9px;color:var(--t3)">💡 Đối ứng: </span>
      <span id="ng_sum_action" style="font-size:9px;color:var(--t2)" contenteditable="false">${localStorage.getItem('smc_ng_sum_action_' + mo) || 'Chưa cập nhật'}</span>
    </div>`;
	/* Enable edit on click in edit mode */
	const actionEl = document.getElementById('ng_sum_action');
	if (actionEl) {
		actionEl.addEventListener('blur', () => {
			localStorage.setItem('smc_ng_sum_action_' + mo, actionEl.textContent);
		});
		if (document.body.classList.contains('edit-mode'))
			actionEl.contentEditable = 'true';
	}
}

function buildStaffSummary() {
	const el = document.getElementById('ov_staff');
	if (!el) return;
	const now = new Date();
	const todayY = now.getFullYear(),
		todayM = now.getMonth() + 1,
		todayD = now.getDate();
	const todayMo = `${todayY}-${String(todayM).padStart(2, '0')}`;
	let att = {};
	try {
		att = JSON.parse(localStorage.getItem('smc_attendance_' + todayMo) || '{}');
	} catch (e) {}
	/* ONLY use actual attendance data for today — never fallback to monthly leave total */
	const hasAttData = Object.keys(att).length > 0;
	const todayAbsent = WORKERS.filter((w) => (att[w.id]?.[todayD] || 0) > 0);
	const onLeave = todayAbsent; /* strict: only today's real data */
	const workers = WORKERS.length;
	const present = workers - onLeave.length;
	const pct = workers > 0 ? Math.round((present / workers) * 100) : 100;
	el.innerHTML = `
    <div style="display:flex;gap:10px;align-items:flex-start;flex-wrap:wrap;margin-bottom:8px">
      <div style="text-align:center;min-width:50px">
        <div style="font-size:28px;font-weight:700;color:var(--grn-m);font-family:var(--mono)">${present}</div>
        <div style="font-size:9px;color:var(--t3)">Đi làm</div>
      </div>
      <div style="width:1px;height:40px;background:var(--bdr);align-self:center"></div>
      <div style="text-align:center;min-width:50px">
        <div style="font-size:28px;font-weight:700;color:${onLeave.length ? 'var(--red-m)' : 'var(--t3)'};font-family:var(--mono)">${onLeave.length}</div>
        <div style="font-size:9px;color:var(--t3)">Nghỉ</div>
      </div>
      <div style="width:1px;height:40px;background:var(--bdr);align-self:center"></div>
      <div style="text-align:center;min-width:50px">
        <div style="font-size:28px;font-weight:700;color:var(--t2);font-family:var(--mono)">${workers}</div>
        <div style="font-size:9px;color:var(--t3)">Tổng</div>
      </div>
      <div style="flex:1;min-width:100px;align-self:center">
        <div style="font-size:9px;color:var(--t3);margin-bottom:3px">Hôm nay ${todayD}/${todayM} — ${hasAttData ? pct + '%' : '?'}</div>
        <div style="height:7px;background:#e5e7eb;border-radius:4px;overflow:hidden">
          <div style="height:100%;width:${hasAttData ? pct : 100}%;background:${hasAttData ? (pct >= 80 ? 'var(--grn-m)' : 'var(--amb-m)') : '#d1d5db'};border-radius:4px"></div>
        </div>
        ${!hasAttData ? `<div style="font-size:8.5px;color:var(--amb-m);margin-top:2px">⚠ Chưa nhập điểm danh tháng ${todayMo}<br>→ Tab Nhân sự → Bảng ngày nghỉ</div>` : '<div style="font-size:8.5px;color:var(--grn-m);margin-top:2px">✓ Từ bảng điểm danh</div>'}
      </div>
    </div>
    <!-- Worker dots: green=present, red=absent today, grey=no data -->
    <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:7px">
      ${WORKERS.map((w) => {
				const val = att[w.id]?.[todayD] || 0;
				const absent = val > 0;
				const noData = !hasAttData;
				const bg = noData ? '#f3f4f6' : absent ? '#fecaca' : '#bbf7d0';
				const border = noData
					? '#d1d5db'
					: absent
						? 'var(--red-m)'
						: 'var(--grn-m)';
				const fc = noData
					? '#9ca3af'
					: absent
						? 'var(--red-m)'
						: 'var(--grn-m)';
				return `<div title="${w.name}${absent ? ' — Nghỉ hôm nay' : noData ? ' — Chưa có data' : ' — Đi làm'}" style="width:24px;height:24px;border-radius:50%;background:${bg};border:2px solid ${border};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:${fc};cursor:default">${w.name.charAt(0)}</div>`;
			}).join('')}
    </div>
    ${
			onLeave.length
				? `
    <div style="border-top:1px dashed var(--bdr);padding-top:6px">
      <div style="font-size:9px;font-weight:700;color:var(--red-m);margin-bottom:4px">Người nghỉ hôm nay (${todayD}/${todayM}):</div>
      ${onLeave
				.map((w) => {
					const val = att[w.id]?.[todayD] || 0;
					return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
          <span style="font-size:10px;font-weight:700">${w.name}</span>
          <span style="font-size:9px;background:#f1f3f6;padding:1px 5px;border-radius:10px;color:var(--t3)">${w.ca || 'Ca1'}</span>
          <span style="font-size:9px;color:var(--t3)">— ${w.leaveNote || 'Nghỉ phép'}</span>
          <span style="font-size:9px;font-family:var(--mono);font-weight:700;color:var(--red-m);margin-left:auto">${val}d</span>
        </div>`;
				})
				.join('')}
    </div>`
				: `<div style="font-size:10px;color:${hasAttData ? 'var(--grn-m)' : 'var(--t3)'};font-weight:700">${hasAttData ? '✅ Toàn bộ đi làm hôm nay' : 'Nhập điểm danh để xem thực tế'}</div>`
		}`;
}
function buildHelpTab() {
	const el = document.getElementById('help_content');
	if (!el) return;
	const L = I18N[curLang] || I18N.vi;
	const tabs = [
		{
			icon: '📊',
			key: 'overview',
			desc: {
				vi: '(1)Tổng quan tiến độ tháng. <br>(2)KPI + tiến độ từng mã SP.<br> (3)Biểu đồ tỉ trọng, lũy kế.<br> (4)Thông tin nhân sự đi làm.',
				jp: '月次生産進捗の概要。KPI、品番別進捗、生産比率グラフ、累計、人員。',
				en: 'Monthly production overview. KPI, per-SKU progress, output distribution, cumulative, staff.',
			},
		},
		{
			icon: '📅',
			key: 'plan',
			desc: {
				vi: '(1)Nhập số lượng SP theo KH và cập nhập TT. <br> (2)Bộ lọc cho phép phân loại theo : SP/Tỉ lệ/Số lg.<br>(3)Bảng dữ liệu thực tích theo từng ngày và lũy kế.',
				jp: '受注から計画入力、日次実績入力。品番ごとに計画/実績/%の3行。CSV出力/入力。',
				en: 'Enter plan from orders and daily actual. 3 rows per SKU: Plan/Actual/%. Export/Import CSV.',
			},
		},
		{
			icon: '⚡',
			key: 'pulse',
			desc: {
				vi: 'Timeline sản xuất (8:00~16:30). CT database per mã x công đoạn. NOW marker realtime.',
				jp: 'リアルタイムタイムライン (8:00~16:30)。品番x工程別CT。NOWマーカー。',
				en: 'Production timeline (8:00~16:30). CT per SKU x process. Real-time NOW marker.',
			},
		},
		{
			icon: '🟩',
			key: 'heatmap',
			desc: {
				vi: 'Ma trận ngày x mã SP, màu theo % KH. Xanh=OK, Vàng=Chú ý, Đỏ=Cảnh báo.',
				jp: '日付x品番マトリクス、計画達成率色分け。緑=OK、黄=注意、赤=警告。',
				en: 'Day x SKU matrix, colored by plan %. Green=OK, Yellow=Watch, Red=Alert.',
			},
		},
		{
			icon: '📊',
			key: 'compare',
			desc: {
				vi: 'So sánh tối đa 6 tháng. 3 views: Trend, Cột per SKU, Bảng tóm tắt.',
				jp: '最大6ヶ月比較。3ビュー：トレンド、棒グラフ、サマリー。',
				en: 'Compare up to 6 months. 3 views: Trend lines, Bar per SKU, Summary table.',
			},
		},
		{
			icon: '🔄',
			key: 'ca3',
			desc: {
				vi: 'Cài đặt Ca1/Ca2/Ca3/Hành chính. Thực tích per công đoạn per ca.',
				jp: 'シフト1/2/3/管理設定。工程別・シフト別実績。',
				en: 'Setup shifts Ca1/Ca2/Ca3/Office. Actuals per process per shift.',
			},
		},
		{
			icon: '👷',
			key: 'worker',
			desc: {
				vi: '(1)Hồ sơ nhân viên:Kỹ năng, thông tin cá nhân.<br> (2)Bảng diểm danh tháng.<br>(3)Ghi nhận vi phạm tháng .',
				jp: '作業者プロフィール、工程、スキル。出欠表 (0.5日単位)。スキルマトリクス。',
				en: 'Worker profiles, kotei, skills. Attendance table (0.5 day). Skill matrix.',
			},
		},
		{
			icon: '❌',
			key: 'quality',
			desc: {
				vi: 'Nhập NG theo ngày/mã/lỗi. 4 biểu đồ: Xu hướng, Pareto, Series, per mã. Bảng mã 301-401.',
				jp: 'NG入力。4グラフ：推移、パレート、シリーズ別、品番別。不良コード表。',
				en: 'NG entry by date/SKU/code. 4 charts. Code table 301-401.',
			},
		},
		{
			icon: '🔧',
			key: 'incident',
			desc: {
				vi: 'Báo cáo sự cố: Hiện tượng/Điều tra/Đối sách/Kết quả. Đính kèm ảnh & Excel.',
				jp: '設備不具合：現象/調査/対策/結果。写真・Excel添付可。',
				en: 'Incident reports: Phenomenon/Investigation/Action/Result. Attach photos & Excel.',
			},
		},
		{
			icon: '📋',
			key: 'reports',
			desc: {
				vi: 'Template báo cáo + thêm tùy chỉnh. Lưu riêng từng báo cáo, export TXT.',
				jp: '報告書テンプレ＋カスタム追加可。個別保存、TXT出力。',
				en: 'Report templates + custom types. Save individually, export TXT.',
			},
		},
		{
			icon: '⚙',
			key: 'capacity',
			desc: {
				vi: 'CT thực đo vs cài đặt. Cascade: SYS = MIN(effective/kotei). Filter Series/SKU.',
				jp: '実測CT vs 設定CT。カスケード: SYS=MIN(各工程)。フィルタ対応。',
				en: 'Measured vs set CT. Cascade: SYS=MIN(effective/process). Filter Series/SKU.',
			},
		},
	];
	const sc = [
		['Ctrl+S', { vi: 'Lưu tất cả', jp: '全保存', en: 'Save All' }],
		[
			'Ctrl+E',
			{ vi: 'Toggle Edit Mode', jp: '編集切替', en: 'Toggle Edit Mode' },
		],
		['Ctrl+P', { vi: 'In báo cáo', jp: '印刷', en: 'Print' }],
		['Esc', { vi: 'Thoát Edit', jp: '編集終了', en: 'Exit Edit' }],
	];
	el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px;margin-bottom:10px">
      ${tabs
				.map(
					(
						t,
					) => `<div class="card" style="padding:10px 12px;margin-bottom:0;border-left:3px solid var(--blue)">
        <div style="font-size:18px;margin-bottom:3px">${t.icon} <span style="font-size:11px;font-weight:700;color:var(--navy)">${L[t.key] || t.key}</span></div>
        <div style="font-size:10px;color:var(--t2);line-height:1.5">${t.desc[curLang] || t.desc.vi}</div>
      </div>`,
				)
				.join('')}
    </div>
    <div class="g2">
      <div class="card" style="padding:12px"><div class="ct"><span class="dot" style="background:var(--blue)"></span>${L.help_shortcuts || 'Phím tắt'}</div>
        ${sc.map(([k, d]) => `<div style="display:flex;gap:8px;align-items:center;margin-bottom:5px"><code style="background:#f1f5f9;padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--bdr);flex-shrink:0">${k}</code><span style="font-size:11px;color:var(--t2)">${d[curLang] || d.vi}</span></div>`).join('')}
      </div>
      <div class="card" style="padding:12px"><div class="ct"><span class="dot" style="background:var(--grn-m)"></span>${L.help_data || 'Lưu & Chia sẻ'}</div>
        <div style="font-size:10.5px;color:var(--t2);line-height:1.9">${{ vi: '<b>Lưu:</b> Ctrl+S vào localStorage.<br><b>Chia sẻ:</b> Export HTML (file có data).<br><b>Migrate:</b> Export JSON sang version mới.<br><b>CSV:</b> Tab Kế hoạch, Export CSV/tháng.', jp: '<b>保存:</b> Ctrl+S でlocalStorageへ。<br><b>共有:</b> HTMLエクスポート（データ込み）。<br><b>移行:</b> JSONエクスポートで新版へ。<br><b>CSV:</b> 計画タブから月次エクスポート。', en: '<b>Save:</b> Ctrl+S to localStorage.<br><b>Share:</b> Export HTML (includes data).<br><b>Migrate:</b> Export JSON to new version.<br><b>CSV:</b> Schedule tab, export per month.' }[curLang] || ''}</div>
      </div>
    </div>`;
}

/* BOOTSTRAP — correct order */
loadAll();
initSelects();
buildStaffSummary();
renderCustomRptTypes();
setTimeout(initCardToggles, 300);
setTimeout(restoreUIState, 100); /* Restore UI preferences after DOM ready */
buildCTTable();
buildWorkerCards();
buildPlanTable();
/* Lock plan inputs at startup (edit mode is off) */
document
	.querySelectorAll('.pt-in')
	.forEach((el) => el.setAttribute('readonly', ''));
buildHeatmap();
buildNGTable();
renderIssues();
renderViolList();
renderIncList();
update();
const savedLang = localStorage.getItem('smc_lang');
if (savedLang && savedLang !== 'vi') setLang(savedLang);
const idate = document.getElementById('issue_date');
if (idate) idate.value = new Date().toISOString().slice(0, 10);
const vdate = document.getElementById('viol_date');
if (vdate) vdate.value = new Date().toISOString().slice(0, 10);
setInterval(updateStatusBar, 1000);
setInterval(() => {
	if (document.getElementById('tab-pulse')?.classList.contains('act')) {
		drawPulse();
	}
	const rc = document.getElementById('rt_clock');
	if (rc)
		rc.textContent = new Date().toLocaleTimeString('vi-VN', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
}, 60000);
window.addEventListener('resize', () => {
	if (document.getElementById('tab-pulse')?.classList.contains('act'))
		drawPulse();
	Object.values(charts).forEach((c) => {
		try {
			c.resize();
		} catch (e) {}
	});
});
