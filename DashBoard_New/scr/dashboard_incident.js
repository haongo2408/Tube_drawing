/* ════════════════════════════════════════════════════════════════════
   dashboard_incident.js  —  (file 11/15 — load order #11)
   ------------------------------------------------------------------
   TAB 🔧 SỰ CỐ TB (Incident — A10, rebuilt)
    - newIncident/clearIncEditor/_setIncLockState/incEnableEdit/closeIncEditor/
      incAddPhotos/incAttachExcel/_renderIncPhotos/saveCurrentIncident/saveIncidents/
      renderIncList/viewIncident/editIncidentById/_loadIncToEditor/exportIncidents
    - F2/F3 fixes: _workerKoteiChanged
    Cần: dashboard_core.js
   ════════════════════════════════════════════════════════════════════ */

/* ══ A10: INCIDENT FUNCTIONS (rebuilt) ══ */
let incPhotos = []; /* base64 photos for current editor session */
let incAttach = null; /* {name, data} for Excel attachment */
let incLocked = false;

function newIncident() {
	currentIncId = Date.now();
	incPhotos = [];
	incAttach = null;
	clearIncEditor();
	_setIncLockState(false);
	document.getElementById('inc_editor').style.display = 'block';
	document
		.getElementById('inc_editor')
		.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function clearIncEditor() {
	[
		'inc_date',
		'inc_machine',
		'inc_dt',
		'inc_phen',
		'inc_inv',
		'inc_act',
		'inc_res',
		'inc_hand',
	].forEach((id) => {
		const el = document.getElementById(id);
		if (!el) return;
		el.value = id === 'inc_date' ? new Date().toISOString().slice(0, 10) : '';
	});
	document.getElementById('inc_status').value = 'open';
	document.getElementById('inc_attach_name').textContent = '';
	_renderIncPhotos();
}
function _setIncLockState(locked) {
	incLocked = locked;
	const fields = [
		'inc_date',
		'inc_machine',
		'inc_dt',
		'inc_phen',
		'inc_inv',
		'inc_act',
		'inc_res',
		'inc_hand',
	];
	fields.forEach((id) => {
		const el = document.getElementById(id);
		if (!el) return;
		el.readOnly = locked;
		el.style.background = locked ? '#f8faff' : '';
	});
	document.getElementById('inc_status').disabled = locked;
	const saveBtn = document.querySelector('#inc_editor button.btn.sm.pri');
	if (saveBtn) saveBtn.style.display = locked ? 'none' : '';
	const editBtn = document.getElementById('inc_edit_btn');
	if (editBtn) editBtn.style.display = locked ? '' : 'none';
	const note = document.getElementById('inc_view_mode_note');
	if (note)
		note.textContent = locked ? '👁 Chế độ xem — nhấn ✏️ để chỉnh sửa' : '';
	/* Photo/attach controls */
	const addPhotoLabel = document.querySelector('#inc_editor label.btn.sm.grn');
	if (addPhotoLabel) addPhotoLabel.style.display = locked ? 'none' : 'block';
	const attachLabel = document.querySelector(
		'#inc_editor label[style*="cursor:pointer"]',
	);
	if (attachLabel) attachLabel.style.display = locked ? 'none' : '';
}
function incEnableEdit() {
	_setIncLockState(false);
}
function closeIncEditor() {
	document.getElementById('inc_editor').style.display = 'none';
	incPhotos = [];
	incAttach = null;
	renderIncList();
}
function incAddPhotos(input) {
	if (incLocked) return;
	const files = [...input.files].slice(0, 3 - incPhotos.length);
	let loaded = 0;
	files.forEach((file) => {
		if (!file.type.startsWith('image/')) return;
		const r = new FileReader();
		r.onload = (e) => {
			incPhotos.push({ name: file.name, data: e.target.result, caption: '' });
			loaded++;
			if (loaded === files.length) _renderIncPhotos();
		};
		r.readAsDataURL(file);
	});
	input.value = '';
}
function incAttachExcel(input) {
	if (incLocked) return;
	const file = input.files[0];
	if (!file) return;
	const r = new FileReader();
	r.onload = (e) => {
		incAttach = { name: file.name, data: e.target.result };
		const nameEl = document.getElementById('inc_attach_name');
		if (nameEl) nameEl.textContent = '📎 ' + file.name;
	};
	r.readAsDataURL(file);
	input.value = '';
}
function _renderIncPhotos() {
	const el = document.getElementById('inc_photos');
	if (!el) return;
	if (!incPhotos.length) {
		el.innerHTML =
			'<div style="font-size:10px;color:var(--t3);text-align:center;padding:20px 0;border:2px dashed var(--bdr);border-radius:6px">Chưa có ảnh</div>';
		return;
	}
	el.innerHTML = incPhotos
		.map(
			(ph, i) => `
    <div style="position:relative;border:1px solid var(--bdr);border-radius:6px;overflow:hidden">
      <img src="${ph.data}" style="width:100%;max-height:140px;object-fit:cover;display:block">
      <div style="padding:4px 6px;background:#f8faff">
        <input type="text" value="${ph.caption || ''}" placeholder="Chú thích ảnh..."
          style="width:100%;border:none;font-size:9.5px;background:transparent;outline:none"
          onchange="incPhotos[${i}].caption=this.value" ${incLocked ? 'readonly' : ''}>
      </div>
      ${
				!incLocked
					? `<button onclick="incPhotos.splice(${i},1);_renderIncPhotos()"
        style="position:absolute;top:3px;right:3px;background:#dc2626;color:#fff;border:none;border-radius:50%;width:18px;height:18px;cursor:pointer;font-size:10px;line-height:1;padding:0">×</button>`
					: ''
			}
    </div>`,
		)
		.join('');
}
function saveCurrentIncident() {
	const inc = {
		id: currentIncId || Date.now(),
		date: document.getElementById('inc_date')?.value,
		machine: document.getElementById('inc_machine')?.value,
		status: document.getElementById('inc_status')?.value,
		downtime: +document.getElementById('inc_dt')?.value || 0,
		phenomenon: document.getElementById('inc_phen')?.value,
		investigation: document.getElementById('inc_inv')?.value,
		action: document.getElementById('inc_act')?.value,
		result: document.getElementById('inc_res')?.value,
		handler: document.getElementById('inc_hand')?.value,
		photos: incPhotos.map((p) => ({
			data: p.data,
			caption: p.caption,
			name: p.name,
		})),
		attach: incAttach ? { name: incAttach.name, data: incAttach.data } : null,
		savedAt: new Date().toISOString(),
	};
	const idx = incidents.findIndex((x) => x.id === inc.id);
	if (idx >= 0) incidents[idx] = inc;
	else incidents.unshift(inc);
	saveIncidents();
	closeIncEditor();
	flashSave();
}
function saveIncidents() {
	localStorage.setItem('smc_incidents', JSON.stringify(incidents));
	flashSave();
}
function renderIncList() {
	const el = document.getElementById('inc_list');
	if (!el) return;
	const si = { open: '🔴', wip: '🟡', closed: '🟢' };
	if (!incidents.length) {
		el.innerHTML =
			'<p style="font-size:11px;color:var(--t3);padding:10px 0">Chưa có báo cáo. Nhấn <b>+ Báo cáo mới</b> để tạo.</p>';
		return;
	}
	el.innerHTML = incidents
		.map(
			(inc, i) => `
    <div class="inc-card" style="border-left:4px solid ${inc.status === 'closed' ? '#16a34a' : inc.status === 'wip' ? '#d97706' : '#dc2626'}">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:5px">
        <div style="flex:1">
          <span style="font-size:10px;font-family:var(--mono);color:var(--t3)">${inc.date || '—'}</span>
          &nbsp;&nbsp;<b>${inc.machine || '?'}</b>&nbsp;${si[inc.status] || '⚪'}
          ${inc.downtime ? `&nbsp;<span style="background:#fef2f2;color:#dc2626;padding:1px 6px;border-radius:10px;font-size:10px">⏱${inc.downtime}min</span>` : ''}
          ${inc.photos?.length ? `&nbsp;<span style="font-size:9px;background:#eff6ff;color:#1e5fa8;padding:1px 5px;border-radius:8px">📷${inc.photos.length}</span>` : ''}
          ${inc.attach ? `&nbsp;<span style="font-size:9px;background:#f0fdf4;color:#16a34a;padding:1px 5px;border-radius:8px">📎</span>` : ''}
        </div>
        <div style="display:flex;gap:4px;flex-shrink:0">
          <button class="btn sm" onclick="viewIncident(${i})">👁 Xem</button>
          <button class="btn sm" style="background:#f59e0b;color:#000;border-color:#f59e0b" onclick="editIncidentById(${i})">✏️</button>
          ${editMode ? `<button class="btn sm red" onclick="if(confirm('Xóa?')){incidents.splice(${i},1);saveIncidents();renderIncList()}">✕</button>` : ''}
        </div>
      </div>
      ${inc.phenomenon ? `<div style="font-size:11px;margin-bottom:3px"><span style="font-weight:700;color:var(--red-m)">【異常】</span>${inc.phenomenon.slice(0, 130)}${inc.phenomenon.length > 130 ? '…' : ''}</div>` : ''}
      ${inc.action ? `<div style="font-size:11px"><span style="font-weight:700;color:var(--blue)">【対策】</span>${inc.action.slice(0, 100)}${inc.action.length > 100 ? '…' : ''}</div>` : ''}
      ${inc.handler ? `<div style="font-size:10px;color:var(--t3);margin-top:3px">担当: ${inc.handler}${inc.savedAt ? ` · Lưu: ${inc.savedAt.slice(0, 16).replace('T', ' ')}` : ''}</div>` : ''}
    </div>`,
		)
		.join('');
}
function viewIncident(i) {
	currentIncId = incidents[i].id;
	const inc = incidents[i];
	_loadIncToEditor(inc);
	_setIncLockState(true);
	document.getElementById('inc_editor').style.display = 'block';
	document
		.getElementById('inc_editor')
		.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function editIncidentById(i) {
	currentIncId = incidents[i].id;
	const inc = incidents[i];
	_loadIncToEditor(inc);
	_setIncLockState(false);
	document.getElementById('inc_editor').style.display = 'block';
	document
		.getElementById('inc_editor')
		.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function _loadIncToEditor(inc) {
	document.getElementById('inc_date').value = inc.date || '';
	document.getElementById('inc_machine').value = inc.machine || '';
	document.getElementById('inc_dt').value = inc.downtime || 0;
	document.getElementById('inc_phen').value = inc.phenomenon || '';
	document.getElementById('inc_inv').value = inc.investigation || '';
	document.getElementById('inc_act').value = inc.action || '';
	document.getElementById('inc_res').value = inc.result || '';
	document.getElementById('inc_hand').value = inc.handler || '';
	document.getElementById('inc_status').value = inc.status || 'open';
	incPhotos = (inc.photos || []).map((p) => ({ ...p }));
	incAttach = inc.attach || null;
	const nameEl = document.getElementById('inc_attach_name');
	if (nameEl) nameEl.textContent = incAttach ? '📎 ' + incAttach.name : '';
	_renderIncPhotos();
}
function exportIncidents() {
	let txt = incidents
		.map((inc) =>
			[
				'='.repeat(60),
				`【日付】${inc.date}  【設備】${inc.machine}  ${inc.status}  DT:${inc.downtime || 0}min`,
				`【担当】${inc.handler || '—'}`,
				'',
				`【異常現象】`,
				inc.phenomenon || '—',
				'',
				`【確認・調査内容】`,
				inc.investigation || '—',
				'',
				`【対策】`,
				inc.action || '—',
				'',
				`【結果】`,
				inc.result || '—',
				'',
			].join('\n'),
		)
		.join('\n');
	const a = document.createElement('a');
	a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(txt);
	a.download = 'incidents_' + new Date().toISOString().slice(0, 10) + '.txt';
	a.click();
}
/* ══ end A10 ══ */

/* ══ F2: CT inputs rebuild properly on edit mode toggle ══ */
/* buildCTTable already rebuilt fully — ensure it's called in enterEdit which it is */

/* ══ F3: Worker kotei auto-save when select changes ══ */
function _workerKoteiChanged(wi, field, val) {
	WORKERS[wi][field] = val;
	saveWorkers(); /* F3: save immediately */
	buildWorkerKotei();
	buildSkillMatrix();
}
/* ══ end F3 ══ */

