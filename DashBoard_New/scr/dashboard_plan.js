/* ════════════════════════════════════════════════════════════════════
   dashboard_plan.js  —  (file 5/15 — load order #5)
   ------------------------------------------------------------------
   TAB 📅 KẾ HOẠCH (Plan/KH-TT — phần lõi)
    - getKH/getTT/setKHAll/setPlanKH/setPlanTT/_autoSavePlan/updateSummaryCell
    - buildPlanTable()/updatePlanCharts()
    - Modals: fillKHModal/applyKH/bulkTTModal/applyBulkTT/addSKUModal/applyNewSKU/
      showMonthArchive/exportMonthCSV/deleteMonth/showPlanSummary
    - Export/Import: exportPlanCSV/exportPlanXLSX/_doExcelJS/importPlanCSV/
      downloadTemplate/showTemplates/clearMonthData
    Cần: dashboard_core.js, dashboard_api.js (apiSaveKH/apiSaveTT/apiLoadPlanActual)
   ════════════════════════════════════════════════════════════════════ */

function getKH(mo, code, d) {
	return planData[`${mo}_${code}_kh_${d}`] !== undefined
		? planData[`${mo}_${code}_kh_${d}`]
		: 0;
}
function getTT(mo, code, d) {
	return planData[`${mo}_${code}_${d}`] || 0;
}
function setKHAll(mo, code, val) {
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	for (let d = 1; d <= days; d++) {
		if (!isWE(yr, m, d)) planData[`${mo}_${code}_kh_${d}`] = val;
	}
	buildPlanTable();
}
function setPlanKH(mo, code, d, v) {
	planData[`${mo}_${code}_kh_${d}`] = v;
	updateSummaryCell(mo, code);
	updatePlanCharts();
	_autoSavePlan(mo);
}
function setPlanTT(mo, code, d, v) {
	planData[`${mo}_${code}_${d}`] = v;
	updateSummaryCell(mo, code);
	updatePlanCharts();
	_autoSavePlan(mo);
	if (document.getElementById('tab-overview')?.classList.contains('act')) {
		renderOverview();
	}
}
/* Save to localStorage immediately after each cell edit — no debounce */
function _autoSavePlan(mo) {
	/* 1. Lưu localStorage như cũ — luôn chạy dù offline */
	const slice = {};
	Object.entries(planData).forEach(([k, v]) => {
		if (k.startsWith(mo)) slice[k] = v;
	});
	localStorage.setItem('smc_plan_' + mo, JSON.stringify(slice));
	const ts = document.getElementById('plan_save_ts');
	const n = new Date();
	if (ts)
		ts.textContent = `✅ ${n.getHours()}:${String(n.getMinutes()).padStart(2, '0')}:${String(n.getSeconds()).padStart(2, '0')}`;

	/* PHASE 2: Đồng thời ghi lên DB qua api.php
     SQL: INSERT INTO t_plan_actual (month,day,sku_db,kh,tt,source='dashboard')
          ON DUPLICATE KEY UPDATE kh=VALUES(kh), tt=VALUES(tt)
     Parse planData keys: 'YYYY-MM_SKU_kh_DD' (KH) hoặc 'YYYY-MM_SKU_DD' (TT)
     Chỉ gọi API nếu kết nối DB available (_apiAvailable=true) */
	if (_apiAvailable !== true) return; // Offline → dừng, localStorage đã lưu rồi

	// Gom tất cả thay đổi của tháng này → batch 1 lần gọi API per SKU
	const khBatch = {}; // {SKU: {day: kh}}
	const ttBatch = {}; // {SKU: {day: tt}}

	Object.entries(slice).forEach(([k, v]) => {
		// Key format: 'YYYY-MM_SKU_kh_DD' hoặc 'YYYY-MM_SKU_DD'
		const parts = k.replace(mo + '_', '').split('_');
		if (parts.length === 3 && parts[1] === 'kh') {
			// KH: parts = [SKU, 'kh', day]
			const sku = parts[0],
				day = +parts[2];
			if (!khBatch[sku]) khBatch[sku] = {};
			khBatch[sku][day] = +v;
		} else if (parts.length === 2) {
			// TT: parts = [SKU, day]
			const sku = parts[0],
				day = +parts[1];
			if (!ttBatch[sku]) ttBatch[sku] = {};
			ttBatch[sku][day] = +v;
		}
	});

	// Gọi save_plan cho từng SKU có thay đổi
	Object.entries(khBatch).forEach(([sku, days]) => {
		fetch(`${API_BASE}?action=save_plan`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ month: mo, sku, kh_per_day: days }),
		}).catch((e) => console.warn('[API] save_plan KH error:', e));
	});

	Object.entries(ttBatch).forEach(([sku, days]) => {
		fetch(`${API_BASE}?action=save_plan`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ month: mo, sku, tt_per_day: days }),
		}).catch((e) => console.warn('[API] save_plan TT error:', e));
	});
}
function updateSummaryCell(mo, code) {
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	const arr = Array.from({ length: days }, (_, i) => i + 1);
	const kh = arr.reduce((s, d) => s + getKH(mo, code, d), 0);
	const tt = arr.reduce((s, d) => s + getTT(mo, code, d), 0);
	const pct = kh > 0 ? Math.round((tt / kh) * 100) : 0;
	const pc =
		pct >= 90 ? 'var(--grn-m)' : pct >= 70 ? 'var(--amb-m)' : 'var(--red-m)';
	const ekh = document.getElementById('sk_' + code);
	if (ekh) ekh.textContent = kh ? kh.toLocaleString() : '—';
	const ett = document.getElementById('st_' + code);
	if (ett) {
		ett.textContent = tt ? tt.toLocaleString() : '0';
		ett.style.color =
			tt >= kh * 0.9 && kh > 0 ? 'var(--grn-m)' : 'var(--red-m)';
	}
	const ep = document.getElementById('sp_' + code);
	if (ep) {
		ep.textContent = kh > 0 ? pct + '%' : '—';
		ep.style.color = pc;
	}
}

function buildPlanTable() {
	const mo = document.getElementById('plan_month')?.value || '2026-06';
	const series = document.getElementById('plan_series')?.value || 'ALL';
	const view = document.getElementById('plan_view')?.value || 'sku';
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	const L = I18N[curLang] || I18N.vi;
	/* Only load from localStorage when month changes — NOT on every rebuild
     (would overwrite in-memory edits that haven't been saved yet) */
	if (!_planLoadedMonths) _planLoadedMonths = {};
	if (!_planLoadedMonths[mo]) {
		const stored = localStorage.getItem('smc_plan_' + mo);
		if (stored)
			try {
				Object.assign(planData, JSON.parse(stored));
			} catch (e) {}
		_planLoadedMonths[mo] = true;
	}
	const skuFilter2 = document.getElementById('plan_sku')?.value || 'ALL';
	let prods = PRODUCTS;
	if (series !== 'ALL') prods = prods.filter((p) => p.s === series);
	if (skuFilter2 !== 'ALL') prods = prods.filter((p) => p.code === skuFilter2);
	const planSortMode = document.getElementById('plan_sort')?.value || 'series';
	if (planSortMode === 'pct_desc') {
		const mo2 = document.getElementById('plan_month')?.value || '2026-06';
		const [yr2, m2] = mo.split('-').map(Number);
		const d2 = new Date(yr2, m2, 0).getDate();
		prods = [...prods].sort((a, b) => {
			const pa = (dayArr2) =>
				[...Array(d2)].reduce(
					(s, _, i) => [
						s[0] + getTT(mo2, a.code, i + 1),
						s[1] + getKH(mo2, a.code, i + 1),
					],
					[0, 0],
				);
			const pb = (dayArr2) =>
				[...Array(d2)].reduce(
					(s, _, i) => [
						s[0] + getTT(mo2, b.code, i + 1),
						s[1] + getKH(mo2, b.code, i + 1),
					],
					[0, 0],
				);
			const [tta, kha] = pa();
			const [ttb, khb] = pb();
			const pctA = kha > 0 ? tta / kha : 0;
			const pctB = khb > 0 ? ttb / khb : 0;
			return pctB - pctA;
		});
	} else if (planSortMode === 'code') {
		prods = [...prods].sort((a, b) => a.code.localeCompare(b.code));
	} else {
		/* Default: group by series */
		prods = [...prods].sort(
			(a, b) => a.s.localeCompare(b.s) || a.code.localeCompare(b.code),
		);
	}
	const dayArr = Array.from({ length: days }, (_, i) => i + 1);
	const dows = ['日', '月', '火', '水', '木', '金', '土'];
	const tod = todayObj();
	/* Plan inputs editable only in edit mode */
	const ro = editMode ? '' : 'readonly';

	const thead = document.getElementById('plan_thead');
	if (thead)
		thead.innerHTML = `<tr>
    <th class="c0" style="text-align:left;min-width:100px">${L.th_sku}</th>
  <th class="c1" style="min-width:34px">${L.th_series}</th>
  <th class="c2" style="min-width:40px;background:#1a4a8a">${L.th_kh_day}</th>
  <th class="c3" style="min-width:50px;background:#1a4a8a">${L.th_sum_kh}</th>
  <th class="c4" style="min-width:50px;background:#1a4a8a">${L.th_sum_tt}</th>
  <th class="c5" style="min-width:40px;background:#1a4a8a">${L.th_pct}</th>
    ${dayArr
			.map((d) => {
				const we = isWE(yr, m, d);
				const isTod = d === tod.d && m === tod.m && yr === tod.y;
				const dow = dows[new Date(yr, m - 1, d).getDay()];
				return `<th class="${we ? 'we-head' : isTod ? 'today-head' : ''}" style="min-width:30px;padding:4px 1px;font-size:8.5px">${d}<br><span style="opacity:.6;font-size:7.5px">${dow}</span></th>`;
			})
			.join('')}
  </tr>`;

	const tbody = document.getElementById('plan_tbody');
	if (!tbody) return;
	tbody.innerHTML = '';

	function addRows(prod) {
		const w = SM[prod.s] || { bg: '#fff', c: '#111' };
		const kh = dayArr.reduce((s, d) => s + getKH(mo, prod.code, d), 0);
		const tt = dayArr.reduce((s, d) => s + getTT(mo, prod.code, d), 0);
		const pct = kh > 0 ? Math.round((tt / kh) * 100) : 0;
		const pc =
			pct >= 90 ? 'var(--grn-m)' : pct >= 70 ? 'var(--amb-m)' : 'var(--red-m)';
		const rk = tbody.insertRow();
		rk.className = 'row-kh';
		rk.innerHTML = `
      <td class="c0" style="text-align:left;font-weight:700;font-family:var(--mono);font-size:10px;color:${w.c};padding:2px 6px;border-left:3px solid ${w.c}">${prod.code}</td>
      <td class="c1" style="padding:2px 3px"><span style="background:${w.bg};color:${w.c};padding:1px 4px;border-radius:3px;font-size:8.5px;font-weight:700">${prod.s}</span></td>
      <td class="c2" style="padding:2px 3px;background:#dbeafe"><input type="number" class="pt-in" style="width:38px;color:#1e5fa8;font-weight:700;border-color:#bfdbfe" placeholder="KH" value="${getKH(mo, prod.code, 1) || ''}" ${ro} onchange="setKHAll('${mo}','${prod.code}',+this.value)"></td>
      <td class="c3" id="sk_${prod.code}" style="font-family:var(--mono);font-weight:700;font-size:10px;background:#dbeafe;padding:2px 4px">${kh ? kh.toLocaleString() : '—'}</td>
      <td class="c4" id="st_${prod.code}" style="font-family:var(--mono);font-weight:700;font-size:10px;background:#fef9c3;color:${tt >= kh * 0.9 && kh > 0 ? 'var(--grn-m)' : 'var(--red-m)'};padding:2px 4px">${tt ? tt.toLocaleString() : '0'}</td>
      <td class="c5" id="sp_${prod.code}" style="font-family:var(--mono);font-weight:700;font-size:10px;background:#dcfce7;color:${pc};padding:2px 4px">${kh > 0 ? pct + '%' : '—'}</td>
      ${dayArr
				.map((d) => {
					const we = isWE(yr, m, d);
					const isTod = d === tod.d && m === tod.m && yr === tod.y;
					const v = getKH(mo, prod.code, d);
					return `<td class="${we ? 'we-col' : isTod ? 'today-col' : ''}" style="padding:2px 1px"><input type="number" class="pt-in" value="${v || ''}" placeholder="${we ? '' : ''}" ${ro} style="color:#1e5fa8" onchange="const _kv=this.value.trim();if(_kv===''){delete planData['${mo}_${prod.code}_kh_${d}'];this.value='';}else{planData['${mo}_${prod.code}_kh_${d}']=+_kv;}updateSummaryCell('${mo}','${prod.code}');updatePlanCharts();_autoSavePlan('${mo}')"></td>`;
				})
				.join('')}`;
		const rt = tbody.insertRow();
		rt.className = 'row-tt';
		rt.innerHTML = `
      <td class="c0" style="padding:2px 6px;border-left:3px solid ${w.c}"></td>
      <td class="c1" style="font-size:9px;color:#92400e;font-weight:700;padding:2px 3px">実際</td>
      <td class="c2" style="background:#dbeafe;font-size:8.5px;color:var(--t3);padding:2px 3px">↑KH</td>
      <td class="c3" style="background:#dbeafe"></td><td class="c4" style="background:#fef9c3"></td><td class="c5" style="background:#dcfce7"></td>
      ${dayArr
				.map((d) => {
					const we = isWE(yr, m, d);
					const isTod = d === tod.d && m === tod.m && yr === tod.y;
					const ttv = getTT(mo, prod.code, d);
					const khv = getKH(mo, prod.code, d);
					const r = khv > 0 && ttv > 0 ? ttv / khv : null;
					const bg = we
						? ''
						: r === null
							? ''
							: r >= 0.9
								? '#dcfce7'
								: r >= 0.7
									? '#fef9c3'
									: '#fef2f2';
					return `<td class="${we ? 'we-col' : isTod ? 'today-col' : ''}" style="padding:2px 1px;${bg ? 'background:' + bg : ''}"><input type="number" class="pt-in" value="${ttv || ''}" placeholder="" ${ro} style="font-weight:${ttv ? '700' : '400'}" onchange="const _v=this.value.trim();if(_v===''){delete planData['${mo}_${prod.code}_${d}'];this.value='';this.style.fontWeight='400';this.closest('td').style.background='';}else{const _n=+_v;planData['${mo}_${prod.code}_${d}']=_n;this.style.fontWeight=_n?'700':'400';}updateSummaryCell('${mo}','${prod.code}');updatePlanCharts();_autoSavePlan('${mo}')"></td>`;
				})
				.join('')}`;
		const rp = tbody.insertRow();
		rp.className = 'row-pct';
		rp.innerHTML = `
      <td class="c0" style="padding:2px 6px;border-left:3px solid ${w.c}"></td>
      <td class="c1" style="font-size:9px;color:var(--grn-m);font-weight:700;padding:2px 3px">完了率</td>
      <td class="c2" style="background:#dbeafe"></td><td class="c3" style="background:#dbeafe"></td><td class="c4" style="background:#fef9c3"></td>
      <td class="c5" style="font-family:var(--mono);font-weight:700;font-size:10px;background:#dcfce7;color:${pc}">${kh > 0 ? pct + '%' : '—'}</td>
      ${dayArr
				.map((d) => {
					const we = isWE(yr, m, d);
					const isTod = d === tod.d && m === tod.m && yr === tod.y;
					const ttv = getTT(mo, prod.code, d);
					const khv = getKH(mo, prod.code, d);
					if (we)
						return `<td class="we-col" style="font-size:8px;color:#bbb;text-align:center">休</td>`;
					if (!ttv)
						return `<td class="${isTod ? 'today-col' : ''}" style="font-size:8px;color:#ddd">—</td>`;
					const pv = khv > 0 ? Math.round((ttv / khv) * 100) : 0;
					const bg2 = pv >= 90 ? '#bbf7d0' : pv >= 70 ? '#fef08a' : '#fecaca';
					const fc2 = pv >= 90 ? '#14532d' : pv >= 70 ? '#713f12' : '#7f1d1d';
					return `<td class="${isTod ? 'today-col' : ''}" style="background:${bg2};color:${fc2};font-size:8px;font-weight:700;text-align:center">${pv}%</td>`;
				})
				.join('')}`;
	}

	if (view === 'kotei') {
		PROCS.forEach((proc) => {
			const hr = tbody.insertRow();
			hr.className = 'row-grp';
			hr.innerHTML = `<td colspan="${days + 7}" style="text-align:left;font-weight:700;color:${proc.color};padding:5px 10px;font-size:11px;border-top:2px solid ${proc.color};border-left:3px solid ${proc.color}">${proc.name}&nbsp;<span style="font-size:9px;font-weight:400;color:var(--t3)">CT${proc.ct}s·B${proc.batch}·${proc.sta}台</span></td>`;
			prods.forEach((p) => addRows(p));
		});
	} else {
		prods.forEach((p) => addRows(p));
	}

	const tf = document.getElementById('plan_tfoot');
	if (tf) {
		const gTT = prods.reduce(
			(s, p) => dayArr.reduce((s2, d) => s2 + getTT(mo, p.code, d), s),
			0,
		);
		const gKH = prods.reduce(
			(s, p) => dayArr.reduce((s2, d) => s2 + getKH(mo, p.code, d), s),
			0,
		);
		const gP = gKH > 0 ? Math.round((gTT / gKH) * 100) : 0;
		tf.innerHTML = `<tr style="position:sticky;bottom:0;z-index:4">
      <td class="c0" style="font-weight:700;font-size:11px;background:#0f2b4a;color:#fff;text-align:left;padding:5px 8px">日計</td>
      <td class="c1" style="background:#0f2b4a;color:#fff;font-weight:700;font-size:9.5px">TOTAL</td>
      <td class="c2" style="background:#1a4a8a"></td>
      <td class="c3" style="background:#1a4a8a;color:#fff;font-family:var(--mono);font-weight:700">${gKH.toLocaleString()}</td>
      <td class="c4" style="background:#1a4a8a;color:${gTT >= gKH * 0.9 ? '#86efac' : '#fca5a5'};font-family:var(--mono);font-weight:700">${gTT.toLocaleString()}</td>
      <td class="c5" style="background:#1a4a8a;color:${gP >= 90 ? '#86efac' : gP >= 70 ? '#fde68a' : '#fca5a5'};font-family:var(--mono);font-weight:700">${gKH > 0 ? gP + '%' : '—'}</td>
      ${dayArr
				.map((d) => {
					const we = isWE(yr, m, d);
					const isTod = d === tod.d && m === tod.m && yr === tod.y;
					const dt = prods.reduce((s, p) => s + getTT(mo, p.code, d), 0);
					const dk = prods.reduce((s, p) => s + getKH(mo, p.code, d), 0);
					const dp = dk > 0 ? Math.round((dt / dk) * 100) : 0;
					return `<td style="background:${we ? '#374151' : isTod ? '#78350f' : '#0f2b4a'};color:${dt ? (dp >= 90 ? '#86efac' : dp >= 70 ? '#fde68a' : '#fca5a5') : '#4b5563'};font-family:var(--mono);font-size:9.5px;font-weight:700;padding:4px 1px;text-align:center">${dt || ''}</td>`;
				})
				.join('')}
    </tr>`;
	}
	updatePlanCharts();
}

function updatePlanCharts() {
	const mo = document.getElementById('plan_month')?.value || '2026-06';
	/* planData already current — no reload needed */
	/* Follow plan_series + plan_sku — same as table filter */
	const series = document.getElementById('plan_series')?.value || 'ALL';
	const skuSel = document.getElementById('plan_sku')?.value || 'ALL';
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	let prods = PRODUCTS;
	if (series !== 'ALL') prods = prods.filter((p) => p.s === series);
	if (skuSel !== 'ALL') prods = prods.filter((p) => p.code === skuSel);
	/* Update chart title */
	const titleEl = document.getElementById('plan_chart_title');
	if (titleEl)
		titleEl.textContent =
			skuSel !== 'ALL'
				? skuSel
				: series !== 'ALL'
					? series + ' Series'
					: 'Tất cả';
	const lbls = Array.from({ length: days }, (_, i) => i + 1);
	const dayTT = lbls.map((d) =>
		prods.reduce((s, p) => s + getTT(mo, p.code, d), 0),
	);
	const dayKH = lbls.map((d) =>
		isWE(yr, m, d) ? null : prods.reduce((s, p) => s + getKH(mo, p.code, d), 0),
	);
	const todayDate = new Date();
	const isCurMo =
		todayDate.getFullYear() === yr && todayDate.getMonth() + 1 === m;
	const cutDay = isCurMo ? todayDate.getDate() : days;
	const cumTT = dayTT.reduce((a, v, i) => {
		const d = i + 1;
		a.push(d <= cutDay ? (a[i - 1] || 0) + v : null);
		return a;
	}, []);
	const cumKH = dayKH.reduce((a, v, i) => {
		a.push((a[i - 1] || 0) + (v || 0));
		return a;
	}, []);
	const yMax = Math.max(...dayKH.filter((v) => v != null), ...dayTT) || 500;
	const cumMax = Math.max(...cumKH.filter((v) => v != null)) || 1000;
	if (charts.plan) charts.plan.destroy();
	const pe = document.getElementById('planChart');
	if (pe)
		charts.plan = new Chart(pe, {
			type: 'bar',
			data: {
				labels: lbls,
				datasets: [
					{
						label: 'KH/ngày',
						data: dayKH,
						backgroundColor: '#bfdbfe88',
						borderWidth: 0,
					},
					{
						label: 'TT/ngày',
						data: dayTT,
						backgroundColor: dayTT.map((v, i) =>
							!v
								? '#e5e7eb'
								: v >= (dayKH[i] || 1) * 0.9
									? '#16a34acc'
									: '#dc2626cc',
						),
						borderWidth: 0,
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
	if (charts.cum) charts.cum.destroy();
	const ce = document.getElementById('cumChart');
	if (ce)
		charts.cum = new Chart(ce, {
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
					y: {
						min: 0,
						suggestedMax: cumMax * 1.1,
						ticks: { font: { size: 9 } },
					},
				},
			},
		});
}

/* PLAN MODALS */
function fillKHModal() {
	openModal('modal_kh');
}
function applyKH() {
	const mo = document.getElementById('plan_month')?.value || '2026-06';
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	const ser = document.getElementById('kh_series')?.value || 'ALL';
	const val = +(document.getElementById('kh_val')?.value || 400);
	const skipWE = document.getElementById('kh_skip_we')?.checked;
	const ow = document.getElementById('kh_overwrite')?.checked;
	let prods = PRODUCTS;
	if (ser !== 'ALL') prods = prods.filter((p) => p.s === ser);
	let cnt = 0;
	prods.forEach((p) => {
		for (let d = 1; d <= days; d++) {
			if (skipWE && isWE(yr, m, d)) continue;
			const k = `${mo}_${p.code}_kh_${d}`;
			if (ow || planData[k] === undefined) {
				planData[k] = val;
				cnt++;
			}
		}
	});
	savePlan();
	buildPlanTable();
	closeModal('modal_kh');
}
function bulkTTModal() {
	const mo = document.getElementById('plan_month')?.value || '2026-06';
	const [yr, m] = mo.split('-').map(Number);
	const sel = document.getElementById('tt_sku');
	if (sel)
		sel.innerHTML =
			'<option value="ALL">Tất cả</option>' +
			PRODUCTS.map((p) => `<option value="${p.code}">${p.code}</option>`).join(
				'',
			);
	document.getElementById('tt_to').value = new Date(yr, m, 0).getDate();
	openModal('modal_tt');
}
function applyBulkTT() {
	const mo = document.getElementById('plan_month')?.value || '2026-06';
	const [yr, m] = mo.split('-').map(Number);
	const sku = document.getElementById('tt_sku')?.value || 'ALL';
	const from = +document.getElementById('tt_from')?.value || 1;
	const to = +document.getElementById('tt_to')?.value || 30;
	const val = +document.getElementById('tt_val')?.value || 0;
	const skip = document.getElementById('tt_skip_we')?.checked;
	const prods =
		sku === 'ALL' ? PRODUCTS : PRODUCTS.filter((p) => p.code === sku);
	prods.forEach((p) => {
		for (let d = from; d <= to; d++) {
			if (skip && isWE(yr, m, d)) continue;
			planData[`${mo}_${p.code}_${d}`] = val;
		}
	});
	savePlan();
	buildPlanTable();
	closeModal('modal_tt');
}
function addSKUModal() {
	openModal('modal_sku');
}
function applyNewSKU() {
	const code = document.getElementById('new_code')?.value?.trim().toUpperCase();
	if (!code) {
		alert('Nhập mã SP!');
		return;
	}
	if (PRODUCTS.find((p) => p.code === code)) {
		alert('Mã đã tồn tại!');
		return;
	}
	PRODUCTS.push({
		code,
		s: document.getElementById('new_series')?.value || 'MB',
		od: +document.getElementById('new_od')?.value || 50,
		id: +document.getElementById('new_id2')?.value || 45,
		ctF: +document.getElementById('new_ctf')?.value || 1,
	});
	localStorage.setItem('smc_products', JSON.stringify(PRODUCTS));
	initSelects();
	buildPlanTable();
	buildCTTable();
	closeModal('modal_sku');
}
function showMonthArchive() {
	const months = [];
	for (let i = 0; i < localStorage.length; i++) {
		const k = localStorage.key(i);
		if (k && k.startsWith('smc_plan_')) months.push(k.replace('smc_plan_', ''));
	}
	months.sort().reverse();
	const el = document.getElementById('archive_content');
	if (el)
		el.innerHTML = months.length
			? months
					.map(
						(mo) =>
							`<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #f0f2f6"><span style="font-family:var(--mono);font-weight:700;width:80px">${mo}</span><button class="btn sm" onclick="document.getElementById('plan_month').value='${mo}';buildPlanTable();closeModal('modal_archive')">📂 Mở</button><button class="btn sm" onclick="exportMonthCSV('${mo}')">📥</button><button class="btn sm red" onclick="deleteMonth('${mo}')">🗑</button></div>`,
					)
					.join('')
			: '<p style="font-size:11px;color:var(--t3)">Chưa có</p>';
	openModal('modal_archive');
}
function exportMonthCSV(mo) {
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	let csv = 'sku,ngay,ke_hoach,thuc_tich\n';
	PRODUCTS.forEach((p) => {
		for (let d = 1; d <= days; d++) {
			const kh = getKH(mo, p.code, d);
			const tt = getTT(mo, p.code, d);
			if (kh || tt) csv += `${p.code},${d},${kh},${tt}\n`;
		}
	});
	const a = document.createElement('a');
	a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
	a.download = `plan_${mo}.csv`;
	a.click();
}
function deleteMonth(mo) {
	if (!confirm('Xóa data tháng ' + mo + '?')) return;
	localStorage.removeItem('smc_plan_' + mo);
	showMonthArchive();
}
function showPlanSummary() {
	const mo = document.getElementById('plan_month')?.value || '2026-06';
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	let html = `<p style="font-size:11px;color:var(--t2);margin-bottom:10px">Tháng ${m}/${yr}</p>`;
	let gt = 0,
		gk = 0;
	['MB', 'NCA', 'CG'].forEach((s) => {
		const ps = PRODUCTS.filter((p) => p.s === s);
		let t = 0,
			k = 0;
		ps.forEach((p) => {
			for (let d = 1; d <= days; d++) {
				t += getTT(mo, p.code, d);
				k += getKH(mo, p.code, d);
			}
		});
		gt += t;
		gk += k;
		const pct = k > 0 ? Math.round((t / k) * 100) : 0;
		const w = SM[s];
		html += `<div style="display:flex;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid #f0f2f6"><span style="width:44px;font-weight:700;color:${w.c}">${s}</span><div style="flex:1;height:12px;background:#f1f3f6;border-radius:3px;overflow:hidden"><div style="height:100%;width:${Math.min(100, pct)}%;background:${pct >= 90 ? 'var(--grn-m)' : pct >= 70 ? 'var(--amb-m)' : 'var(--red-m)'}"></div></div><span style="font-family:var(--mono);font-size:11px;width:100px;text-align:right">${t.toLocaleString()}/${k.toLocaleString()}</span><span style="font-family:var(--mono);font-weight:700;width:40px;text-align:right;color:${pct >= 90 ? 'var(--grn-m)' : pct >= 70 ? 'var(--amb-m)' : 'var(--red-m)'}">${pct}%</span></div>`;
	});
	const gP = gk > 0 ? Math.round((gt / gk) * 100) : 0;
	html += `<div style="display:flex;justify-content:space-between;padding:9px 0;font-weight:700;font-size:12px;border-top:2px solid var(--bdr);margin-top:4px"><span>TOTAL</span><span style="font-family:var(--mono)">${gt.toLocaleString()}/${gk.toLocaleString()}</span><span style="font-family:var(--mono);color:${gP >= 90 ? 'var(--grn-m)' : gP >= 70 ? 'var(--amb-m)' : 'var(--red-m)'}">${gP}%</span></div>`;
	document.getElementById('summary_content').innerHTML = html;
	openModal('modal_summary');
}
function exportPlanCSV() {
	exportPlanXLSX();
} /* alias */
function exportPlanXLSX() {
	const mo = document.getElementById('plan_month')?.value || '2026-06';
	const [yr, m] = mo.split('-').map(Number);
	/* Check if ExcelJS available (loaded from CDN) */
	if (window.ExcelJS) {
		_doExcelJS(mo, yr, m);
		return;
	}
	const scr = document.createElement('script');
	scr.src =
		'https://cdnjs.cloudflare.com/ajax/libs/exceljs/4.4.0/exceljs.min.js';
	scr.onload = () => _doExcelJS(mo, yr, m);
	scr.onerror = () => _exportFallbackCSV(mo, yr, m);
	document.head.appendChild(scr);
}
function _doExcelJS(mo, yr, m) {
	if (!window.ExcelJS) {
		_exportFallbackCSV(mo, yr, m);
		return;
	}
	const days = new Date(yr, m, 0).getDate();
	const tod = new Date();
	const isCur = tod.getFullYear() === yr && tod.getMonth() + 1 === m;
	const todD = isCur ? tod.getDate() : -1;
	const DOWS = ['日', '月', '火', '水', '木', '金', '土'];
	const is_we = (d) => new Date(yr, m - 1, d).getDay() % 6 === 0;
	const dow = (d) => DOWS[new Date(yr, m - 1, d).getDay()];
	const C = {
		navy: '0F2B4A',
		white: 'FFFFFF',
		blue: '1E5FA8',
		red: 'DC2626',
		green: '16A34A',
		amb: 'D97706',
		grey: '9AA3B0',
		kh: 'DBEAFE',
		tt: 'FEF9C3',
		rt: 'F0FDF4',
		we: 'E5E7EB',
		tod: 'FEF3C7',
		ok_bg: 'BBF7D0',
		ok_fg: '14532D',
		wn_bg: 'FDE68A',
		wn_fg: '78350F',
		ng_bg: 'FECACA',
		ng_fg: '7F1D1D',
		mb: '1E5FA8',
		nca: 'DC2626',
		cg: '16A34A',
	};
	const SC = { MB: C.mb, NCA: C.nca, CG: C.cg };
	const F = (c) => ({
		type: 'pattern',
		pattern: 'solid',
		fgColor: { argb: 'FF' + c },
	});
	const Ft = (bold, color, sz = 9) => ({
		bold,
		color: { argb: 'FF' + color },
		size: sz,
		name: 'Segoe UI',
	});
	const Al = (h = 'center', wrap = false) => ({
		horizontal: h,
		vertical: 'center',
		wrapText: wrap,
	});
	const Bd = (c = 'D1D5DB') => ({
		top: { style: 'thin', color: { argb: 'FF' + c } },
		left: { style: 'thin', color: { argb: 'FF' + c } },
		bottom: { style: 'thin', color: { argb: 'FF' + c } },
		right: { style: 'thin', color: { argb: 'FF' + c } },
	});
	const TodBd = () => ({
		top: { style: 'thin', color: { argb: 'FFD1D5DB' } },
		left: { style: 'medium', color: { argb: 'FFD97706' } },
		bottom: { style: 'thin', color: { argb: 'FFD1D5DB' } },
		right: { style: 'medium', color: { argb: 'FFD97706' } },
	});
	const rateStyle = (r, sz = 9) => {
		if (r == null) return [Ft(false, C.grey, sz), F(C.rt)];
		if (r >= 90) return [Ft(true, C.ok_fg, sz), F(C.ok_bg)];
		if (r >= 70) return [Ft(true, C.wn_fg, sz), F(C.wn_bg)];
		return [Ft(true, C.ng_fg, sz), F(C.ng_bg)];
	};

	/* ── Precompute all data ── */
	const gkh = PRODUCTS.reduce(
		(s, p) =>
			s +
			Array.from({ length: days }, (_, i) => getKH(mo, p.code, i + 1)).reduce(
				(a, b) => a + b,
				0,
			),
		0,
	);
	const gtt = PRODUCTS.reduce(
		(s, p) =>
			s +
			Array.from({ length: days }, (_, i) => getTT(mo, p.code, i + 1)).reduce(
				(a, b) => a + b,
				0,
			),
		0,
	);
	const gr = gkh ? Math.round((gtt / gkh) * 100) : 0;

	const wb = new ExcelJS.Workbook();
	wb.creator = '生産管理 Dashboard v7';
	wb.created = new Date();

	/* ══════════════ SHEET 1: Overview ══════════════ */
	const ws1 = wb.addWorksheet('Overview', {
		views: [{ showGridLines: false }],
	});
	const mkW = (ws, widths) =>
		widths.forEach(([col, w]) => (ws.getColumn(col).width = w));
	mkW(ws1, [
		['A', 16],
		['B', 10],
		['C', 10],
		['D', 10],
		['E', 10],
		['F', 14],
	]);

	ws1.mergeCells('A1:F1');
	const t1 = ws1.getCell('A1');
	t1.value = `生産管理 月次レポート — ${mo}`;
	t1.font = Ft(true, C.white, 14);
	t1.fill = F(C.navy);
	t1.alignment = Al();
	ws1.getRow(1).height = 28;
	ws1.getRow(2).height = 8;
	ws1.getRow(3).height = 48;

	const kpiDefs = [
		[
			`${gr}%`,
			'% Đạt KH',
			C.blue,
			gr >= 90 ? 'F0FDF4' : gr >= 70 ? 'FFFBEB' : 'FEF2F2',
		],
		[`${gtt.toLocaleString()}`, 'TT (pcs)', C.navy, 'EFF6FF'],
		[`${gkh.toLocaleString()}`, 'KH (pcs)', C.navy, 'EFF6FF'],
		[
			`${ngData.reduce((s, r) => s + (r.qty || 0), 0)}`,
			'NG (pcs)',
			C.red,
			'FEF2F2',
		],
		[
			`${Math.round(+document.getElementById('oee_a')?.value || 89) * +((document.getElementById('oee_p')?.value || 90) / 100) * (+(document.getElementById('oee_q')?.value || 98) / 100)}%` ||
				'—',
			'OEE',
			C.nca,
			'FDF4FF',
		],
	];
	kpiDefs.forEach(([val, lbl, col, bg], i) => {
		const c = ws1.getCell(3, i + 1);
		c.value = val + '\n' + lbl;
		c.font = {
			bold: true,
			color: { argb: 'FF' + col },
			size: i === 0 ? 13 : 11,
			name: 'Segoe UI',
		};
		c.fill = F(bg);
		c.alignment = Al('center', true);
		c.border = {
			top: { style: 'medium', color: { argb: 'FF' + col } },
			left: { style: 'medium', color: { argb: 'FF' + col } },
			bottom: { style: 'medium', color: { argb: 'FF' + col } },
			right: { style: 'medium', color: { argb: 'FF' + col } },
		};
	});

	/* Series summary */
	ws1.getRow(4).height = 8;
	ws1.getRow(5).height = 20;
	['Series', 'TT (pcs)', 'KH (pcs)', '達成率 %', '備考'].forEach((h, i) => {
		const c = ws1.getCell(5, i + 1);
		c.value = h;
		c.font = Ft(true, C.white);
		c.fill = F(C.navy);
		c.alignment = Al();
		c.border = Bd();
	});
	const groups = {};
	PRODUCTS.forEach((p) => {
		if (!groups[p.s]) groups[p.s] = { kh: 0, tt: 0, codes: [] };
		groups[p.s].kh += Array.from({ length: days }, (_, i) =>
			getKH(mo, p.code, i + 1),
		).reduce((a, b) => a + b, 0);
		groups[p.s].tt += Array.from({ length: days }, (_, i) =>
			getTT(mo, p.code, i + 1),
		).reduce((a, b) => a + b, 0);
		groups[p.s].codes.push(p.code);
	});
	let sr = 6;
	Object.entries(groups).forEach(([s, d]) => {
		const sc = SC[s] || C.navy;
		const rt = d.kh ? Math.round((d.tt / d.kh) * 100) : 0;
		ws1.getRow(sr).height = 18;
		const ca = ws1.getCell(sr, 1);
		ca.value = `${s} Series (${d.codes.length} mã)`;
		ca.font = {
			bold: true,
			color: { argb: 'FF' + sc },
			size: 11,
			name: 'Segoe UI',
		};
		ca.fill = F('F8FAFF');
		ca.alignment = Al('left');
		ca.border = {
			...Bd(),
			left: { style: 'medium', color: { argb: 'FF' + sc } },
		};
		[
			[2, d.tt],
			[3, d.kh],
		].forEach(([ci, v]) => {
			const c = ws1.getCell(sr, ci);
			c.value = v || null;
			c.font = Ft(true, '111111', 11);
			c.fill = F('F8FAFF');
			c.alignment = Al();
			c.border = Bd();
		});
		const [fn, fb] = rateStyle(rt, 11);
		const c = ws1.getCell(sr, 4);
		c.value = `${rt}%`;
		c.font = fn;
		c.fill = fb;
		c.alignment = Al();
		c.border = Bd();
		ws1.getCell(sr, 5).border = Bd();
		sr++;
	});
	/* Total row */
	ws1.getRow(sr).height = 20;
	const ta = ws1.getCell(sr, 1);
	ta.value = 'TỔNG CỘNG';
	ta.font = Ft(true, C.white, 11);
	ta.fill = F(C.navy);
	ta.alignment = Al('left');
	ta.border = Bd();
	[
		[2, gtt],
		[3, gkh],
	].forEach(([ci, v]) => {
		const c = ws1.getCell(sr, ci);
		c.value = v || null;
		c.font = Ft(true, C.white, 11);
		c.fill = F(C.navy);
		c.alignment = Al();
		c.border = Bd();
	});
	const tg = ws1.getCell(sr, 4);
	tg.value = `${gr}%`;
	tg.font = {
		bold: true,
		color: { argb: 'FFFCD34D' },
		size: 12,
		name: 'Segoe UI',
	};
	tg.fill = F(C.navy);
	tg.alignment = Al();
	tg.border = Bd();
	ws1.getCell(sr, 5).fill = F(C.navy);
	ws1.getCell(sr, 5).border = Bd();
	sr++;

	/* All-SKU detail */
	ws1.getRow(sr).height = 8;
	sr++;
	ws1.getRow(sr).height = 18;
	['Mã SP', 'Series', 'Σ KH', 'Σ TT', '達成率', 'KH/日'].forEach((h, i) => {
		const c = ws1.getCell(sr, i + 1);
		c.value = h;
		c.font = Ft(true, C.white);
		c.fill = F(C.navy);
		c.alignment = Al();
		c.border = Bd();
	});
	sr++;
	PRODUCTS.forEach((p) => {
		const pkh = Array.from({ length: days }, (_, i) =>
			getKH(mo, p.code, i + 1),
		).reduce((a, b) => a + b, 0);
		const ptt = Array.from({ length: days }, (_, i) =>
			getTT(mo, p.code, i + 1),
		).reduce((a, b) => a + b, 0);
		const pr = pkh ? Math.round((ptt / pkh) * 100) : null;
		const khd =
			Array.from({ length: days }, (_, i) => getKH(mo, p.code, i + 1)).find(
				(v) => v,
			) || null;
		const sc = SC[p.s] || C.navy;
		ws1.getRow(sr).height = 14;
		const ca = ws1.getCell(sr, 1);
		ca.value = p.code;
		ca.font = {
			bold: true,
			color: { argb: 'FF' + sc },
			size: 9,
			name: 'Segoe UI',
		};
		ca.fill = F('FAFBFF');
		ca.alignment = Al('left');
		ca.border = Bd();
		const cb = ws1.getCell(sr, 2);
		cb.value = p.s;
		cb.font = Ft(true, C.white, 8);
		cb.fill = F(sc);
		cb.alignment = Al();
		cb.border = Bd();
		[
			[3, pkh, 'DBEAFE'],
			[4, ptt, 'FEF9C3'],
		].forEach(([ci, v, bg]) => {
			const c = ws1.getCell(sr, ci);
			c.value = v || null;
			c.font = Ft(false, '111111', 9);
			c.fill = F(bg);
			c.alignment = Al();
			c.border = Bd();
		});
		const [fn, fb] = rateStyle(pr);
		const c = ws1.getCell(sr, 5);
		c.value = pr != null ? `${pr}%` : '—';
		c.font = fn;
		c.fill = fb;
		c.alignment = Al();
		c.border = Bd();
		const cf = ws1.getCell(sr, 6);
		cf.value = khd;
		cf.font = Ft(false, C.blue, 9);
		cf.fill = F('EFF6FF');
		cf.alignment = Al();
		cf.border = Bd();
		sr++;
	});

	/* ══════════════ SHEET 2: 計画実績表 (ALL SKUs) ══════════════ */
	const ws2 = wb.addWorksheet('計画実績表', {
		views: [{ state: 'frozen', xSplit: 6, ySplit: 2, showGridLines: false }],
	});
	const FIXED = 6;
	const DS = FIXED + 1;
	ws2.getColumn(1).width = 14;
	ws2.getColumn(2).width = 5.5;
	ws2.getColumn(3).width = 7;
	ws2.getColumn(4).width = 8;
	ws2.getColumn(5).width = 8;
	ws2.getColumn(6).width = 6;
	for (let d = 1; d <= days; d++) ws2.getColumn(DS + d - 1).width = 5.2;

	ws2.mergeCells(1, 1, 1, FIXED + days);
	const t2 = ws2.getCell(1, 1);
	t2.value = `計画実績表 — ${mo}（全${PRODUCTS.length}品番）`;
	t2.font = Ft(true, C.white, 12);
	t2.fill = F(C.navy);
	t2.alignment = Al();
	ws2.getRow(1).height = 24;

	ws2.getRow(2).height = 32;
	['MÃ SP', 'S', 'KH/日', 'Σ KH', 'Σ TT', '%'].forEach((h, i) => {
		const c = ws2.getCell(2, i + 1);
		c.value = h;
		c.font = Ft(true, C.white);
		c.fill = F(C.navy);
		c.alignment = Al();
		c.border = Bd();
	});
	for (let d = 1; d <= days; d++) {
		const we2 = is_we(d);
		const isT = d === todD;
		const bg = isT ? C.tod : we2 ? C.we : C.navy;
		const fg = isT ? '78350F' : we2 ? C.grey : C.white;
		const c = ws2.getCell(2, DS + d - 1);
		c.value = `${d}\n${dow(d)}`;
		c.font = {
			bold: true,
			color: { argb: 'FF' + fg },
			size: 8,
			name: 'Segoe UI',
		};
		c.fill = F(bg);
		c.alignment = Al('center', true);
		c.border = Bd();
	}

	let row2 = 3;
	const ttDayTot = new Array(days).fill(0);
	PRODUCTS.forEach((p) => {
		const kh_v = Array.from({ length: days }, (_, i) =>
			getKH(mo, p.code, i + 1),
		);
		const tt_v = Array.from({ length: days }, (_, i) =>
			getTT(mo, p.code, i + 1),
		);
		const sumKH = kh_v.reduce((a, b) => a + b, 0);
		const sumTT = tt_v.reduce((a, b) => a + b, 0);
		const rate = sumKH ? Math.round((sumTT / sumKH) * 100) : null;
		const khD = kh_v.find((v) => v) || null;
		const sc = SC[p.s] || C.navy;
		const hasData = sumKH > 0 || sumTT > 0;
		ws2.getRow(row2).height = 15;
		ws2.getRow(row2 + 1).height = 15;
		ws2.getRow(row2 + 2).height = 13;

		ws2.mergeCells(row2, 1, row2 + 2, 1);
		const ca2 = ws2.getCell(row2, 1);
		ca2.value = p.code;
		ca2.font = {
			bold: true,
			color: { argb: 'FF' + sc },
			size: 9,
			name: 'Segoe UI',
		};
		ca2.fill = F(hasData ? 'FFFFFF' : 'FAFAFA');
		ca2.alignment = Al('left');
		ca2.border = Bd();

		ws2.mergeCells(row2, 2, row2 + 2, 2);
		const cb2 = ws2.getCell(row2, 2);
		cb2.value = p.s;
		cb2.font = Ft(true, C.white, 8);
		cb2.fill = F(hasData ? sc : 'AAAAAA');
		cb2.alignment = Al();
		cb2.border = Bd();

		[
			[khD || '—', C.kh, C.blue],
			['>KH', C.tt, C.grey],
			[null, C.rt, C.grey],
		].forEach(([v, bg, fg2], i) => {
			const c = ws2.getCell(row2 + i, 3);
			c.value = v;
			c.font = Ft(false, fg2, 8);
			c.fill = F(bg);
			c.alignment = Al();
			c.border = Bd();
		});

		const cd2 = ws2.getCell(row2, 4);
		cd2.value = sumKH || null;
		cd2.font = Ft(!!sumKH, C.blue, 9);
		cd2.fill = F(C.kh);
		cd2.alignment = Al();
		cd2.border = Bd();
		[
			[1, C.tt],
			[2, C.rt],
		].forEach(([i, bg]) => {
			const c = ws2.getCell(row2 + i, 4);
			c.fill = F(bg);
			c.border = Bd();
		});

		const tf2 = sumTT < sumKH ? C.red : C.green;
		const ce2 = ws2.getCell(row2 + 1, 5);
		ce2.value = sumTT || null;
		ce2.font = {
			bold: !!sumTT,
			color: { argb: 'FF' + tf2 },
			size: 9,
			name: 'Segoe UI',
		};
		ce2.fill = F(C.tt);
		ce2.alignment = Al();
		ce2.border = Bd();
		[
			[0, C.kh],
			[2, C.rt],
		].forEach(([i, bg]) => {
			const c = ws2.getCell(row2 + i, 5);
			c.fill = F(bg);
			c.border = Bd();
		});

		const [fn2, fb2] = rateStyle(rate);
		const cf2 = ws2.getCell(row2 + 2, 6);
		cf2.value = rate != null ? `${rate}%` : '—';
		cf2.font = fn2;
		cf2.fill = fb2;
		cf2.alignment = Al();
		cf2.border = Bd();
		[
			[0, C.kh],
			[1, C.tt],
		].forEach(([i, bg]) => {
			const c = ws2.getCell(row2 + i, 6);
			c.fill = F(bg);
			c.border = Bd();
		});

		for (let d = 1; d <= days; d++) {
			const ci2 = DS + d - 1;
			const we2 = is_we(d);
			const isT = d === todD;
			const isFut = d > todD && isCur;
			const kv = kh_v[d - 1];
			const tv = tt_v[d - 1];
			ttDayTot[d - 1] += tv;
			const dr = kv && tv ? Math.round((tv / kv) * 100) : null;
			const brd = isT ? TodBd() : Bd();
			const ck2 = ws2.getCell(row2, ci2);
			if (we2) {
				ck2.value = '休';
				ck2.font = Ft(false, C.grey, 8);
				ck2.fill = F(C.we);
			} else {
				ck2.value = kv || null;
				ck2.font = Ft(false, C.blue, 9);
				ck2.fill = F(hasData ? C.kh : 'F5F8FF');
			}
			ck2.alignment = Al();
			ck2.border = brd;
			const ct2 = ws2.getCell(row2 + 1, ci2);
			if (we2) {
				ct2.value = '休';
				ct2.font = Ft(false, C.grey, 8);
				ct2.fill = F(C.we);
			} else if (isFut) {
				ct2.fill = F(C.tt);
			} else {
				ct2.value = tv || null;
				ct2.font = {
					bold: !!tv,
					size: 9,
					color: { argb: 'FF111111' },
					name: 'Segoe UI',
				};
				ct2.fill = F(C.tt);
			}
			ct2.alignment = Al();
			ct2.border = brd;
			const cr2 = ws2.getCell(row2 + 2, ci2);
			if (we2) {
				cr2.value = '休';
				cr2.font = Ft(false, C.grey, 8);
				cr2.fill = F(C.we);
			} else if (dr != null) {
				const [fn3, fb3] = rateStyle(dr, 8);
				cr2.value = `${dr}%`;
				cr2.font = fn3;
				cr2.fill = fb3;
			} else {
				cr2.value = isFut ? null : '—';
				cr2.font = Ft(false, C.grey, 8);
				cr2.fill = F(C.rt);
			}
			cr2.alignment = Al();
			cr2.border = brd;
		}
		row2 += 3;
	});

	/* Total row */
	ws2.getRow(row2).height = 18;
	ws2.mergeCells(row2, 1, row2, 2);
	const ta2 = ws2.getCell(row2, 1);
	ta2.value = '日計 TOTAL';
	ta2.font = Ft(true, C.white, 10);
	ta2.fill = F(C.navy);
	ta2.alignment = Al();
	ta2.border = Bd();
	const tc2 = ws2.getCell(row2, 3);
	tc2.value = '—';
	tc2.font = Ft(true, C.white, 8);
	tc2.fill = F(C.navy);
	tc2.alignment = Al();
	tc2.border = Bd();
	[
		[4, gkh],
		[5, gtt],
	].forEach(([ci, v]) => {
		const c = ws2.getCell(row2, ci);
		c.value = v || null;
		c.font = Ft(true, C.white, 9);
		c.fill = F(C.navy);
		c.alignment = Al();
		c.border = Bd();
	});
	const tg2 = ws2.getCell(row2, 6);
	tg2.value = `${gr}%`;
	tg2.font = {
		bold: true,
		color: { argb: 'FFFCD34D' },
		size: 9,
		name: 'Segoe UI',
	};
	tg2.fill = F(C.navy);
	tg2.alignment = Al();
	tg2.border = Bd();
	for (let d = 1; d <= days; d++) {
		const ci2 = DS + d - 1;
		const we2 = is_we(d);
		const dv = ttDayTot[d - 1];
		const c = ws2.getCell(row2, ci2);
		c.value = we2 ? null : dv || null;
		c.font = {
			bold: !!dv,
			color: { argb: dv ? 'FFFCD34D' : 'FF6B7280' },
			size: 9,
			name: 'Segoe UI',
		};
		c.fill = F(C.navy);
		c.alignment = Al();
		c.border = Bd();
	}

	/* ══════════════ SHEET 3: Chart & Data ══════════════ */
	const ws3 = wb.addWorksheet('Chart & Data', {
		views: [{ showGridLines: false }],
	});
	mkW(ws3, [
		['A', 5],
		['B', 4],
		['C', 10],
		['D', 10],
		['E', 10],
		['F', 10],
		['G', 9],
	]);
	ws3.mergeCells('A1:G1');
	const t3 = ws3.getCell('A1');
	t3.value = `累計チャート & 日別データ — ${mo}`;
	t3.font = Ft(true, C.white, 12);
	t3.fill = F(C.navy);
	t3.alignment = Al();
	ws3.getRow(1).height = 22;

	const CDR = 3;
	ws3.getRow(CDR).height = 18;
	['日', '曜', '計画累積', '実際累積', '計画/日', '実際/日', '達成率%'].forEach(
		(h, i) => {
			const c = ws3.getCell(CDR, i + 1);
			c.value = h;
			c.font = Ft(true, C.white);
			c.fill = F(C.navy);
			c.alignment = Al();
			c.border = Bd();
		},
	);

	let ck2 = 0,
		ct2 = 0;
	for (let d = 1; d <= days; d++) {
		const dkh = PRODUCTS.reduce((s, p) => s + getKH(mo, p.code, d), 0);
		const dtt = PRODUCTS.reduce((s, p) => s + getTT(mo, p.code, d), 0);
		ck2 += dkh;
		ct2 += dtt;
		const cumTT = d <= todD || !isCur ? ct2 : '—';
		const dr = dkh && dtt ? Math.round((dtt / dkh) * 100) : null;
		const r3 = CDR + d;
		ws3.getRow(r3).height = 14;
		const we2 = is_we(d);
		const isT = d === todD;
		[
			[1, d, '111111', 'FFFFFF'],
			[2, dow(d), C.grey, 'F5F5F5'],
			[3, ck2, C.blue, C.kh],
			[4, cumTT, C.red, C.tt],
			[5, dkh || null, C.blue, 'EFF6FF'],
			[6, dtt || null, C.green, 'F0FDF4'],
			[
				7,
				dr != null ? `${dr}%` : we2 ? '休' : '—',
				dr >= 90 ? C.ok_fg : dr >= 70 ? C.wn_fg : dr ? C.ng_fg : C.grey,
				dr >= 90 ? C.ok_bg : dr >= 70 ? C.wn_bg : dr ? C.ng_bg : C.rt,
			],
		].forEach(([ci, v, fg2, bg]) => {
			const c = ws3.getCell(r3, ci);
			c.value = v;
			c.font = {
				color: { argb: 'FF' + fg2 },
				size: 9,
				name: 'Segoe UI',
				bold: isT && ci > 2,
			};
			c.fill = F(we2 && ci > 1 ? C.we : bg);
			c.alignment = Al();
			c.border = isT && ci > 1 ? TodBd() : Bd();
		});
	}

	/* ── Download ── */
	wb.xlsx
		.writeBuffer()
		.then(function (buf) {
			const blob = new Blob([buf], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			});
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `生産管理_${mo}.xlsx`;
			a.click();
			setTimeout(() => URL.revokeObjectURL(url), 3000);
			const ts = document.getElementById('plan_save_ts');
			if (ts) ts.textContent = '📊 Excel exported ✅';
		})
		.catch(function (e) {
			console.error('ExcelJS:', e);
			_exportFallbackCSV(mo, yr, m);
		});
}
function importPlanCSV(input) {
	const file = input.files[0];
	if (!file) return;
	const reader = new FileReader();
	reader.onload = (e) => {
		const mo = document.getElementById('plan_month')?.value || '2026-06';
		const text = e.target.result.replace(/\r/g, '');
		const lines = text
			.split('\n')
			.filter((l) => l.trim() && !l.startsWith('#'));
		if (!lines.length) {
			alert('File rỗng hoặc không đúng format');
			input.value = '';
			return;
		}
		const hdr = lines[0].split(',');
		let cnt = 0;
		/* Detect format: new (SKU,Series,Type,1,2,...) or old (sku,ngay,ke_hoach,thuc_tich) */
		if (hdr[0] === 'SKU' && hdr[2] === 'Type') {
			/* New format */
			const dayStart = 3;
			lines.slice(1).forEach((l) => {
				const cells = l.split(',');
				const sku = cells[0]?.trim();
				const type = cells[2]?.trim();
				if (!sku || !type) return;
				for (let i = dayStart; i < cells.length; i++) {
					const d = i - dayStart + 1;
					const v = +cells[i];
					if (isNaN(v)) continue;
					if (type === 'KH' && v > 0) planData[`${mo}_${sku}_kh_${d}`] = v;
					if (type === 'TT') planData[`${mo}_${sku}_${d}`] = v;
					cnt++;
				}
			});
		} else {
			/* Old format: sku,ngay,ke_hoach,thuc_tich */
			lines.slice(1).forEach((l) => {
				const [sku, ngay, kh, tt] = l.split(',');
				if (!sku || !ngay) return;
				if (tt !== undefined && !isNaN(+tt.trim()))
					planData[`${mo}_${sku.trim()}_${ngay.trim()}`] = +tt.trim();
				if (kh !== undefined && +kh.trim() > 0)
					planData[`${mo}_${sku.trim()}_kh_${ngay.trim()}`] = +kh.trim();
				cnt++;
			});
		}
		savePlan();
		buildPlanTable();
		updatePlanCharts();
		alert(`✅ Import thành công ${cnt} records vào tháng ${mo}`);
	};
	reader.readAsText(file, 'UTF-8');
	input.value = '';
}
function downloadTemplate(t) {
	const templates = {
		plan: 'sku,ngay,ke_hoach,thuc_tich\nMB63TD,1,350,320\nMB63TD,2,350,0\nNCA64TD,1,200,190\nCG50TD,1,150,145',
		worker: 'id,name,rank,main,sub,assign,skill,ca,leave,perf,qual,phone,note',
		ng: 'code,desc_vn,desc_jp,desc_cn\n301,Lỗi tạo hình,成形不良,成形不良\n305,Lỗi độ nhám (Rz),粗さ不良,粗糙度不良',
	};
	const csv = templates[t || 'plan'] || '';
	const a = document.createElement('a');
	a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
	a.download = `template_${t || 'plan'}.csv`;
	a.click();
}
function showTemplates() {
	const t = prompt(
		'Template:\n1. KH/TT (plan)\n2. Nhân sự (worker)\n3. NG codes (ng)\nNhập 1/2/3:',
	);
	if (t === '1') downloadTemplate('plan');
	else if (t === '2') downloadTemplate('worker');
	else if (t === '3') downloadTemplate('ng');
}
function clearMonthData() {
	const mo = document.getElementById('plan_month')?.value || '2026-06';
	if (!confirm('Xóa data tháng ' + mo + '?')) return;
	Object.keys(planData)
		.filter((k) => k.startsWith(mo))
		.forEach((k) => delete planData[k]);
	localStorage.removeItem('smc_plan_' + mo);
	buildPlanTable();
	buildHeatmap();
}

