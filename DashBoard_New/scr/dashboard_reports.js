/* ════════════════════════════════════════════════════════════════════
   dashboard_reports.js  —  (file 12/15 — load order #12)
   ------------------------------------------------------------------
   TAB 📋 BÁO CÁO (Reports)
    - selectReport/renderRptList/newReport/openRptEditor/viewReport/editReport/
      closeRptEditor/saveCurrentReport/deleteReport/exportReport
    Cần: dashboard_core.js, dashboard_appdata.js (customRptTypes)
   ════════════════════════════════════════════════════════════════════ */

/* REPORTS */
function selectReport(type) {
	currentRptType = type;
	const cfg = REPORT_CFG[type];
	document.getElementById('rpt_list_title').textContent = cfg.label;
	document.getElementById('rpt_dot').style.background = cfg.color;
	const nb = document.getElementById('rpt_new_btn');
	if (nb) nb.style.display = '';
	renderRptList(type);
}
function renderRptList(type) {
	const el = document.getElementById('rpt_list');
	if (!el) return;
	const list = reportData[type] || [];
	const cfg = REPORT_CFG[type];
	el.innerHTML = list.length
		? list
				.map(
					(r, i) =>
						`<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;border:1px solid var(--bdr);border-radius:6px;margin-bottom:5px;border-left:3px solid ${cfg.color}"><div style="flex:1"><b style="font-size:11px">${r.title || '(Không tiêu đề)'}</b><span style="font-size:10px;color:var(--t3);margin-left:8px">${r.date || ''}</span><span style="font-size:10px;margin-left:8px;background:#f1f5f9;padding:1px 5px;border-radius:3px">${r.status || ''}</span></div>${editMode ? `<button class="btn sm" onclick="editReport('${type}',${i})">✏️</button><button class="btn sm red" onclick="deleteReport('${type}',${i})">✕</button>` : `<button class="btn sm" onclick="viewReport('${type}',${i})">👁 Xem</button>`}</div>`,
				)
				.join('')
		: '<p style="font-size:11px;color:var(--t3)">Chưa có. ' +
			(editMode ? 'Click + Mới.' : 'Bật Edit Mode để tạo.') +
			'</p>';
}
function newReport() {
	if (!currentRptType) {
		alert('Chọn loại!');
		return;
	}
	currentRptId = Date.now();
	openRptEditor(currentRptType, null);
}
function openRptEditor(type, r) {
	const cfg = REPORT_CFG[type];
	const ro = !editMode;
	document.getElementById('rpt_editor_title').textContent = cfg.label;
	document.getElementById('rpt_title').value = r?.title || '';
	document.getElementById('rpt_date').value =
		r?.date || new Date().toISOString().slice(0, 10);
	document.getElementById('rpt_status').value = r?.status || 'Đang tiến hành';
	document.getElementById('rpt_sections').innerHTML = cfg.sections
		.map(
			(s) =>
				`<div class="rpt-section"><label style="color:${cfg.color}">${s.l}</label><textarea id="rpt_s_${s.id}" rows="${s.r}" ${ro ? 'readonly' : ''}>${r?.sections?.[s.id] || ''}</textarea></div>`,
		)
		.join('');
	document.getElementById('rpt_editor_card').style.display = 'block';
}
function viewReport(type, i) {
	currentRptType = type;
	currentRptId = reportData[type]?.[i]?.id;
	openRptEditor(type, reportData[type]?.[i]);
}
function editReport(type, i) {
	currentRptType = type;
	currentRptId = reportData[type]?.[i]?.id;
	openRptEditor(type, reportData[type]?.[i]);
}
function closeRptEditor() {
	document.getElementById('rpt_editor_card').style.display = 'none';
}
function saveCurrentReport() {
	if (!currentRptType) return;
	const cfg = REPORT_CFG[currentRptType];
	const sections = {};
	cfg.sections.forEach((s) => {
		sections[s.id] = document.getElementById('rpt_s_' + s.id)?.value || '';
	});
	const rpt = {
		id: currentRptId || Date.now(),
		title: document.getElementById('rpt_title').value,
		date: document.getElementById('rpt_date').value,
		status: document.getElementById('rpt_status').value,
		sections,
	};
	if (!reportData[currentRptType]) reportData[currentRptType] = [];
	const idx = reportData[currentRptType].findIndex((r) => r.id === rpt.id);
	if (idx >= 0) reportData[currentRptType][idx] = rpt;
	else reportData[currentRptType].unshift(rpt);
	localStorage.setItem('smc_reports', JSON.stringify(reportData));
	flashSave();
	renderRptList(currentRptType);
}
function deleteReport(type, i) {
	if (!confirm('Xóa?')) return;
	reportData[type].splice(i, 1);
	localStorage.setItem('smc_reports', JSON.stringify(reportData));
	renderRptList(type);
}
function exportReport() {
	if (!currentRptType) return;
	const list = reportData[currentRptType] || [];
	const cfg = REPORT_CFG[currentRptType];
	let txt = list
		.map((r) =>
			[cfg.label, `Title:${r.title} Date:${r.date} Status:${r.status}`, '']
				.concat(cfg.sections.map((s) => [s.l, r.sections?.[s.id] || '—', '']))
				.flat()
				.join('\n'),
		)
		.join('\n' + '='.repeat(60) + '\n');
	const a = document.createElement('a');
	a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(txt);
	a.download = `report_${currentRptType}.txt`;
	a.click();
}

