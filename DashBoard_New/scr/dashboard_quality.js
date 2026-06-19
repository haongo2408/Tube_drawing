/* ════════════════════════════════════════════════════════════════════
   dashboard_quality.js  —  (file 10/15 — load order #10)
   ------------------------------------------------------------------
   TAB ❌ NG/QC (Quality)
    - NG Codes: toggleNGPanel/buildNGCodesTable/addNGCode/deleteNGCode/saveNGCodes/
      importNGCSV/ngSearchRun
    - NG Input table: addNGRow/buildNGTable/saveQuality
    Cần: dashboard_core.js (NG_CODES, NG_CAUSES)
   ════════════════════════════════════════════════════════════════════ */

/* NG CODES */
function toggleNGPanel() {
	ngPanelOpen = !ngPanelOpen;
	/* Only operate on the panel in NG/QC tab */
	const panel = document.getElementById('ng_panel');
	const icon = document.getElementById('ng_panel_icon');
	if (panel) panel.style.display = ngPanelOpen ? 'block' : 'none';
	if (icon) icon.textContent = ngPanelOpen ? '▼ Thu gọn' : '▶ Mở rộng';
	if (ngPanelOpen) buildNGCodesTable();
}
function buildNGCodesTable() {
	const el = document.getElementById('ng_codes_wrap');
	if (!el) return;
	el.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><b style="font-size:12px">Quality Code Table — ${NG_CODES.length} mã lỗi</b><div style="display:flex;gap:5px"><button class="btn sm" onclick="downloadTemplate('ng')">📥 Export CSV</button><label class="btn sm" style="cursor:pointer;margin:0">📂 Import<input type="file" accept=".csv" style="display:none" onchange="importNGCSV(this)"></label>${editMode ? '<button class="btn sm pri" onclick="saveNGCodes()">💾 Lưu</button>' : ''}</div></div>
  <div class="ng-codes-wrap"><table style="width:100%;border-collapse:collapse"><thead><tr><th class="ng-th" style="width:56px">CODE</th><th class="ng-th">Description VN</th><th class="ng-th">Description JP</th><th class="ng-th">Description CN</th>${editMode ? '<th class="ng-th" style="width:36px"></th>' : ''}</tr></thead><tbody>
  ${NG_CODES.map((c, i) => `<tr><td class="ng-td" style="font-weight:700;font-family:var(--mono);color:#0000cc">${c.code}</td><td class="ng-td" ${editMode ? `contenteditable="true" onblur="NG_CODES[${i}].vn=this.textContent"` : ''}>${c.vn}</td><td class="ng-td" style="font-family:'Meiryo',Arial" ${editMode ? `contenteditable="true" onblur="NG_CODES[${i}].jp=this.textContent"` : ''}>${c.jp}</td><td class="ng-td" ${editMode ? `contenteditable="true" onblur="NG_CODES[${i}].cn=this.textContent"` : ''}>${c.cn}</td>${editMode ? `<td class="ng-td" style="text-align:center"><button class="btn sm red" onclick="deleteNGCode(${i})" style="width:24px;padding:2px">✕</button></td>` : ''}</tr>`).join('')}
  </tbody></table></div>
  ${editMode ? `<div style="display:flex;gap:6px;margin-top:8px;align-items:center"><input type="number" id="new_ng_code" placeholder="CODE" class="inp" style="width:76px"><input type="text" id="new_ng_vn" placeholder="Tên lỗi VN" class="inp" style="flex:1"><input type="text" id="new_ng_jp" placeholder="日本語" class="inp" style="flex:1"><input type="text" id="new_ng_cn" placeholder="中文" class="inp" style="flex:1"><button class="btn grn sm" onclick="addNGCode()">+ Thêm</button></div>` : '<div style="margin-top:7px;font-size:10px;color:var(--t3)">💡 Bật Edit Mode để chỉnh sửa, thêm, xóa mã lỗi</div>'}`;
}
function addNGCode() {
	const code = +document.getElementById('new_ng_code').value;
	const vn = document.getElementById('new_ng_vn').value.trim();
	if (!code || !vn) {
		alert('Nhập CODE và tên VN!');
		return;
	}
	NG_CODES.push({
		code,
		vn,
		jp: document.getElementById('new_ng_jp').value || '',
		cn: document.getElementById('new_ng_cn').value || '',
	});
	NG_CODES.sort((a, b) => a.code - b.code);
	saveNGCodes();
	buildNGCodesTable();
	['new_ng_code', 'new_ng_vn', 'new_ng_jp', 'new_ng_cn'].forEach(
		(id) => (document.getElementById(id).value = ''),
	);
}
function deleteNGCode(i) {
	if (!confirm('Xóa mã ' + NG_CODES[i].code + '?')) return;
	NG_CODES.splice(i, 1);
	saveNGCodes();
	buildNGCodesTable();
}
function saveNGCodes() {
	localStorage.setItem('smc_ng_codes', JSON.stringify(NG_CODES));
	flashSave();
}
function importNGCSV(input) {
	const file = input.files[0];
	if (!file) return;
	const reader = new FileReader();
	reader.onload = (e) => {
		const lines = e.target.result
			.split('\n')
			.filter((l) => l.trim() && !l.startsWith('code') && !l.startsWith('#'));
		let cnt = 0;
		lines.forEach((l) => {
			const [code, vn, jp, cn] = l.split(',');
			if (code && vn) {
				NG_CODES.push({
					code: +code.trim(),
					vn: vn.trim(),
					jp: (jp || '').trim(),
					cn: (cn || '').trim(),
				});
				cnt++;
			}
		});
		NG_CODES.sort((a, b) => a.code - b.code);
		saveNGCodes();
		buildNGCodesTable();
		alert('✅ Import ' + cnt + ' codes');
	};
	reader.readAsText(file);
	input.value = '';
}

/* ── NG MULTI-MONTH SEARCH ── */
function ngSearchRun() {
	const from = document.getElementById('ng_from')?.value;
	const to = document.getElementById('ng_to')?.value;
	const ser = document.getElementById('ng_search_ser')?.value || 'ALL';
	const sku = document.getElementById('ng_search_sku')?.value || 'ALL';
	const kot = document.getElementById('ng_search_kotei')?.value || 'ALL';
	const kw = (
		document.getElementById('ng_search_kw')?.value || ''
	).toLowerCase();
	const allRecords = [];
	for (let i = 0; i < localStorage.length; i++) {
		const k = localStorage.key(i);
		if (k && k.startsWith('smc_ng_')) {
			const mo = k.replace('smc_ng_', '');
			if (from && mo < from) continue;
			if (to && mo > to) continue;
			try {
				const d = JSON.parse(localStorage.getItem(k));
				if (Array.isArray(d)) d.forEach((r) => allRecords.push({ mo, ...r }));
			} catch (e) {}
		}
	}
	const curMo = document.getElementById('ng_month')?.value || '2026-06';
	ngData.forEach((r) => allRecords.push({ mo: curMo, ...r }));
	/* dedupe current month */
	const seen = new Set();
	const records = allRecords.filter((r) => {
		const key = r.mo + r.date + r.sku + r.qty;
		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
	let results = records
		.filter((r) => {
			if (ser !== 'ALL' && PRODUCTS.find((p) => p.code === r.sku)?.s !== ser)
				return false;
			if (sku !== 'ALL' && r.sku !== sku) return false;
			if (kot !== 'ALL' && r.kotei !== kot) return false;
			if (
				kw &&
				!(r.cause || '').toLowerCase().includes(kw) &&
				!(r.ngCode || '').toString().includes(kw)
			)
				return false;
			return true;
		})
		.sort((a, b) => (a.mo > b.mo ? -1 : a.mo < b.mo ? 1 : 0));
	const totNG = results.reduce((s, r) => s + (+r.qty || 0), 0);
	const byMo = {};
	results.forEach((r) => {
		if (!byMo[r.mo]) byMo[r.mo] = 0;
		byMo[r.mo] += +r.qty || 0;
	});
	const byCause = {};
	results.forEach((r) => {
		const c = r.cause || '—';
		if (!byCause[c]) byCause[c] = 0;
		byCause[c] += +r.qty || 0;
	});
	const topCause = Object.entries(byCause).sort((a, b) => b[1] - a[1])[0];
	const mostMo = Object.entries(byMo).sort((a, b) => b[1] - a[1])[0];
	const kpiEl = document.getElementById('ng_search_kpis');
	if (kpiEl)
		kpiEl.innerHTML = [
			[`${results.length}`, 'Records', 'var(--navy)'],
			[`${totNG.toLocaleString()}`, 'Tổng NG (pcs)', 'var(--red-m)'],
			[`${Object.keys(byMo).length}`, 'Tháng', 'var(--blue)'],
			[
				mostMo ? mostMo[0] : '—',
				mostMo ? `${mostMo[1]} pcs` : 'Tháng cao nhất',
				'var(--amb-m)',
			],
			[
				topCause ? topCause[0].slice(0, 14) + '…' : '—',
				topCause ? `${topCause[1]} pcs` : 'Top nguyên nhân',
				'var(--pur-m)',
			],
		]
			.map(
				([v, l, c]) =>
					`<div style="border:1px solid var(--bdr);border-left:3px solid ${c};border-radius:8px;padding:8px 12px"><div style="font-size:14px;font-weight:700;color:${c};font-family:var(--mono)">${v}</div><div style="font-size:9px;color:var(--t3)">${l}</div></div>`,
			)
			.join('');
	const moL = Object.keys(byMo).sort();
	if (charts.ngMulti) charts.ngMulti.destroy();
	const ngMc = document.getElementById('ng_multi_chart');
	if (ngMc && moL.length)
		charts.ngMulti = new Chart(ngMc, {
			type: 'bar',
			data: {
				labels: moL,
				datasets: [
					{
						label: 'NG (pcs)',
						data: moL.map((m) => byMo[m]),
						backgroundColor: '#fca5a5',
						borderColor: '#dc2626',
						borderWidth: 1,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { position: 'bottom', labels: { font: { size: 9 } } },
				},
				scales: {
					x: { ticks: { font: { size: 8 } } },
					y: { min: 0, ticks: { font: { size: 9 } } },
				},
			},
		});
	const tbody2 = document.getElementById('ng_search_tbody');
	if (tbody2)
		tbody2.innerHTML =
			results
				.map((r) => {
					const sc = PRODUCTS.find((p) => p.code === r.sku)?.s;
					const sc_c =
						sc === 'MB'
							? 'var(--blue)'
							: sc === 'NCA'
								? 'var(--red-m)'
								: 'var(--grn-m)';
					return `<tr style="border-bottom:1px solid #f5f7fa"><td style="padding:4px 8px;font-family:var(--mono);color:var(--t3);font-size:9px">${r.mo}</td><td style="padding:4px 8px;font-size:9px">${r.date || '—'}</td><td style="padding:4px 8px;font-weight:700;color:${sc_c};font-size:10px">${r.sku || '—'}</td><td style="padding:4px 8px;font-size:9px">${r.kotei || '—'}</td><td style="padding:4px 8px;font-size:9px;font-family:var(--mono)">${r.ngCode || '—'}</td><td style="padding:4px 8px;text-align:right;font-weight:700;color:var(--red-m)">${r.qty || 0}</td><td style="padding:4px 8px;font-size:9px;color:var(--t2)">${r.cause || '—'}</td></tr>`;
				})
				.join('') ||
			'<tr><td colspan="7" style="padding:16px;text-align:center;color:var(--t3)">Không tìm thấy kết quả</td></tr>';
	const sumEl = document.getElementById('ng_search_summary');
	if (sumEl)
		sumEl.textContent = `Tìm thấy ${results.length} records · Tổng NG: ${totNG.toLocaleString()} pcs · Phạm vi: ${from || 'đầu'} → ${to || 'cuối'}`;
	const resEl = document.getElementById('ng_search_result');
	if (resEl) resEl.style.display = '';
}

/* NG INPUT TABLE */
function addNGRow() {
	ngData.push({
		date: new Date().toISOString().slice(0, 10),
		sku: PRODUCTS[0].code,
		kotei: '引抜',
		ngCode: 305,
		qty: 0,
		cause: NG_CAUSES[0],
		action: '',
	});
	buildNGTable();
}
function buildNGTable() {
	const tbody = document.getElementById('ng_body');
	if (!tbody) return;
	tbody.innerHTML =
		ngData
			.map(
				(r, i) =>
					`<tr><td><input type="date" value="${r.date}" class="inp" style="font-size:10px;width:110px" onchange="ngData[${i}].date=this.value"></td><td><select class="inp" style="font-size:10px" onchange="ngData[${i}].sku=this.value">${PRODUCTS.map((p) => `<option ${p.code === r.sku ? 'selected' : ''}>${p.code}</option>`).join('')}</select></td><td><select class="inp" style="font-size:10px" onchange="ngData[${i}].kotei=this.value">${KOTEI.map((k) => `<option ${k === r.kotei ? 'selected' : ''}>${k}</option>`).join('')}</select></td><td><select class="inp" style="font-size:10px;width:70px" onchange="ngData[${i}].ngCode=+this.value">${NG_CODES.map((c) => `<option value="${c.code}" ${c.code === r.ngCode ? 'selected' : ''}>${c.code}</option>`).join('')}</select></td><td style="font-size:10px;color:var(--t2)">${NG_CODES.find((c) => c.code === r.ngCode)?.vn || ''}</td><td><input type="number" value="${r.qty}" min="0" class="pi" style="width:54px" onchange="ngData[${i}].qty=+this.value"></td><td><select class="inp" style="font-size:10px" onchange="ngData[${i}].cause=this.value">${NG_CAUSES.map((c) => `<option ${c === r.cause ? 'selected' : ''}>${c}</option>`).join('')}</select></td><td><input type="text" value="${r.action}" class="inp" style="width:100px;font-size:10px" onchange="ngData[${i}].action=this.value"></td><td><button class="btn sm red" onclick="ngData.splice(${i},1);buildNGTable()">✕</button></td></tr>`,
			)
			.join('') ||
		'<tr><td colspan="9" style="text-align:center;color:var(--t3);padding:12px">Chưa có dữ liệu NG</td></tr>';
	buildNGCharts();
}
function saveQuality() {
	localStorage.setItem('smc_ng', JSON.stringify(ngData));
	flashSave();
}

