/* ════════════════════════════════════════════════════════════════════
   dashboard_worker.js  —  (file 9/15 — load order #9)
   ------------------------------------------------------------------
   TAB 👷 NHÂN SỰ (Workers)
    - toggleWorkerList/buildWorkerListCompact/toggleWorkerDetail/buildWorkerCards/
      openWorkerDetail/saveWorkerDetail/removeWorker/addWorker
    - Attendance: buildAttendTable/updateAttend/stepAttend/rebuildAttendRow/saveAttend
    - saveWorkers/exportWorkersCSV/importWorkersCSV/buildWorkerKotei/buildSkillMatrix
    - Violations: syncViolSelect/addViol/renderViolList/removeViol/removeViolRefresh
    Cần: dashboard_core.js (WORKERS), dashboard_api.js (apiLoadWorkers)
   ════════════════════════════════════════════════════════════════════ */

/* WORKERS */
function toggleWorkerList(header) {
	const body = document.getElementById('worker_list_compact');
	const btn = document.getElementById('wk_list_toggle');
	if (!body) return;
	const hidden =
		body.style.display === 'none' || body.style.maxHeight === '0px';
	body.style.display = hidden ? '' : 'none';
	if (btn) btn.textContent = hidden ? '▲' : '▼';
}

function buildWorkerListCompact() {
	const el = document.getElementById('worker_list_compact');
	if (!el) return;
	const caF = document.getElementById('wk_ca_filter')?.value || 'ALL';
	const mo =
		document.getElementById('attend_month')?.value ||
		new Date().toISOString().slice(0, 7);
	let att = {};
	try {
		att = JSON.parse(localStorage.getItem('smc_attendance_' + mo) || '{}');
	} catch (e) {}

	let workers = WORKERS;
	if (caF !== 'ALL') workers = workers.filter((w) => w.ca === caF);

	const SC2 = {
		W1: '#dbeafe',
		W2: '#bfdbfe',
		W3: '#93c5fd',
		W4: '#3b82f6',
		W5: '#1e5fa8',
		S1: '#f3e8ff',
		S2: '#d8b4fe',
		S3: '#a855f7',
		S4: '#7c3aed',
		S5: '#581c87',
	};
	const FC2 = {
		W1: '#1e5fa8',
		W2: '#1e5fa8',
		W3: '#fff',
		W4: '#fff',
		W5: '#fff',
		S1: '#7c3aed',
		S2: '#7c3aed',
		S3: '#fff',
		S4: '#fff',
		S5: '#fff',
	};

	const cnt = document.getElementById('wk_count');
	if (cnt) cnt.textContent = `${workers.length} người`;

	el.innerHTML = `
  <table style="width:100%;border-collapse:collapse;font-size:10px">
    <thead style="position:sticky;top:0;z-index:2">
      <tr style="background:#f1f5f9">
        <th style="padding:5px 8px;text-align:left;font-weight:700;color:var(--t2);border-bottom:1px solid var(--bdr);width:32px">#</th>
        <th style="padding:5px 8px;text-align:left;font-weight:700;color:var(--t2);border-bottom:1px solid var(--bdr)">Nhân viên</th>
        <th style="padding:5px 8px;text-align:center;font-weight:700;color:var(--t2);border-bottom:1px solid var(--bdr);width:60px">Kotei</th>
        <th style="padding:5px 8px;text-align:center;font-weight:700;color:var(--t2);border-bottom:1px solid var(--bdr);width:55px">Ca</th>
        <th style="padding:5px 8px;text-align:center;font-weight:700;color:var(--t2);border-bottom:1px solid var(--bdr);width:55px">Nghỉ</th>
        <th style="padding:5px 8px;text-align:center;font-weight:700;color:var(--t2);border-bottom:1px solid var(--bdr);width:50px">NS%</th>
        <th style="padding:5px 8px;text-align:center;font-weight:700;color:var(--t2);border-bottom:1px solid var(--bdr);width:70px">Tỉ lệ</th>
        <th style="padding:5px 8px;width:60px;border-bottom:1px solid var(--bdr)"></th>
      </tr>
    </thead>
    <tbody>
      ${workers
				.map((w, i) => {
					const wi = WORKERS.indexOf(w);
					const yr = +mo.split('-')[0],
						m2 = +mo.split('-')[1];
					const wd = Array.from(
						{ length: new Date(yr, m2, 0).getDate() },
						(_, d) =>
							![0, 6].includes(new Date(yr, m2 - 1, d + 1).getDay()) ? 1 : 0,
					).reduce((a, b) => a + b, 0);
					const leftDays = wd - (w.leave || 0);
					const workRate = wd > 0 ? Math.round((leftDays / wd) * 100) : 100;
					const rC =
						w.leave > 3
							? 'var(--red-m)'
							: w.leave > 0
								? 'var(--amb-m)'
								: 'var(--grn-m)';
					const wC =
						workRate >= 90
							? 'var(--grn-m)'
							: workRate >= 70
								? 'var(--amb-m)'
								: 'var(--red-m)';
					const today = new Date();
					const todD = today.getDate();
					const todayAbs = (att[w.id]?.[todD] || 0) > 0;
					return `<tr style="border-bottom:1px solid #f5f7fa;cursor:pointer;transition:background .1s"
          onmouseenter="this.style.background='#f8faff'" onmouseleave="this.style.background=''"
          onclick="toggleWorkerDetail(${wi})">
          <td style="padding:6px 8px;color:var(--t3);font-size:9px">${i + 1}</td>
          <td style="padding:6px 8px">
            <div style="display:flex;align-items:center;gap:7px">
              ${
								w.photo
									? `<img src="${w.photo}" style="width:26px;height:26px;border-radius:50%;object-fit:cover;flex-shrink:0">`
									: `<div style="width:26px;height:26px;border-radius:50%;background:${SC2[w.rank] || '#e5e7eb'};color:${FC2[w.rank] || '#374151'};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0">${w.name.charAt(0)}</div>`
							}
              <div>
                <div style="font-weight:700;color:var(--navy);font-size:10.5px">${w.name}
                  <span style="background:${SC2[w.rank] || '#e5e7eb'};color:${FC2[w.rank] || '#374151'};font-size:7.5px;padding:0 4px;border-radius:8px;margin-left:3px">${w.rank}</span>
                  ${todayAbs ? '<span style="background:#fef2f2;color:var(--red-m);font-size:7.5px;padding:0 4px;border-radius:8px;margin-left:3px">Nghỉ hôm nay</span>' : ''}
                </div>
                <div style="font-size:8.5px;color:var(--t3)">${w.title || ''}</div>
              </div>
            </div>
          </td>
          <td style="padding:6px 8px;text-align:center"><span style="background:#eff6ff;color:var(--blue);padding:1px 6px;border-radius:3px;font-size:9px;font-weight:700">${w.main}</span></td>
          <td style="padding:6px 8px;text-align:center;font-size:9px;color:var(--t2)">${w.ca}</td>
          <td style="padding:6px 8px;text-align:center;font-weight:700;color:${rC};font-size:10px">${w.leave || 0}日</td>
          <td style="padding:6px 8px;text-align:center;font-weight:700;color:${w.perf >= 90 ? 'var(--grn-m)' : w.perf >= 75 ? 'var(--amb-m)' : 'var(--red-m)'};font-size:10px">${w.perf}%</td>
          <td style="padding:6px 8px">
            <div style="display:flex;align-items:center;gap:4px">
              <div style="flex:1;height:5px;background:#e5e7eb;border-radius:3px"><div style="height:100%;width:${workRate}%;background:${wC};border-radius:3px"></div></div>
              <span style="font-size:8.5px;font-weight:700;color:${wC};min-width:28px">${workRate}%</span>
            </div>
          </td>
          <td style="padding:6px 8px;text-align:center">
            <button class="btn sm" onclick="event.stopPropagation();openWorkerDetail(${wi})" style="font-size:8px;padding:2px 6px">Detail</button>
          </td>
        </tr>`;
				})
				.join('')}
    </tbody>
  </table>`;
}

function toggleWorkerDetail(wi) {
	/* Show/hide expanded card for specific worker */
	const cardsDiv = document.getElementById('worker_cards');
	if (!cardsDiv) return;
	cardsDiv.style.display = '';
	cardsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
	buildWorkerCards(); /* rebuild with this worker highlighted */
	/* Highlight selected */
	setTimeout(() => {
		const cards = cardsDiv.querySelectorAll('.wcard');
		if (cards[wi]) {
			cards[wi].classList.add('open');
			cards[wi].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
		}
	}, 100);
}

function buildWorkerCards() {
	buildWorkerListCompact(); /* Always rebuild compact list */
	const container = document.getElementById('worker_cards');
	if (!container) return;
	const mo =
		document.getElementById('plan_month')?.value ||
		new Date().toISOString().slice(0, 7);
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	let wd = 0;
	for (let d = 1; d <= days; d++) {
		if (!isWE(yr, m, d)) wd++;
	}
	const stars = (n) => '★'.repeat(n) + '☆'.repeat(4 - n);
	container.innerHTML = '';
	/* Group by Ca */
	const caGroups = {};
	WORKERS.forEach((w, wi) => {
		const c = w.ca || 'Ca1';
		if (!caGroups[c]) caGroups[c] = [];
		caGroups[c].push({ w, wi });
	});
	const caOrder = ['Ca1', 'Ca2', 'Ca3', 'Ca Hành chính', 'Ca1/Ca2', 'Ca2/Ca3'];
	caOrder.forEach((caName) => {
		if (!caGroups[caName]) return;
		const grpDiv = document.createElement('div');
		grpDiv.innerHTML = `<div style="font-size:10px;font-weight:700;color:var(--t2);text-transform:uppercase;letter-spacing:.5px;padding:5px 0 4px;margin-bottom:4px;border-bottom:1px solid var(--bdr)">${caName} (${caGroups[caName].length} người)</div>`;
		container.appendChild(grpDiv);
		caGroups[caName].forEach(({ w, wi }) => {
			const violCount = violations.filter((v) => v.wid === w.id).length;
			const workDays = Math.max(0, wd - (w.leave || 0));
			const workRate = wd > 0 ? Math.round((workDays / wd) * 100) : 100;
			const kc = PC[w.main] || '#888';
			const isEng = w.rank && w.rank.startsWith('S');
			const rankLabel = RANK_LABEL[w.rank] || w.rank;
			const rankColor = isEng ? 'var(--pur-m)' : 'var(--blue)';
			const div = document.createElement('div');
			div.className = 'wcard';
			div.style.borderLeft = `4px solid ${kc}`;
			if (isEng) div.style.background = '#faf7ff';
			div.onclick = null;
			div.innerHTML = `
        <!-- COMPACT ROW (always visible) -->
        <div class="wcard-compact">
          <!-- Avatar small -->
          <div style="flex-shrink:0;position:relative">
            ${
							w.photo
								? `<img src="${w.photo}" style="width:38px;height:38px;border-radius:50%;object-fit:cover;border:2px solid ${kc}">`
								: `<div style="width:38px;height:38px;border-radius:50%;background:${kc};display:flex;align-items:center;justify-content:center;font-size:15px;color:#fff;font-weight:700">${w.name.charAt(0)}</div>`
						}
            <span style="position:absolute;bottom:-2px;right:-4px;background:${isEng ? 'var(--pur-m)' : 'var(--blue)'};color:#fff;font-size:7.5px;font-weight:700;padding:0px 3px;border-radius:8px">${w.rank}</span>
          </div>
          <!-- Name + kotei + KPIs inline -->
          <div style="flex:1;min-width:0">
            <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap">
              ${
								editMode
									? `<input type="text" value="${w.name}" class="inp" style="font-size:11px;font-weight:700;width:100px"
      onclick="event.stopPropagation()"
      onchange="WORKERS[${wi}].name=this.value;saveWorkers()">`
									: `<b style="font-size:12px;color:var(--navy)">${w.name}</b>`
							}
              <span style="font-size:8.5px;color:var(--t3);font-family:var(--mono)">${w.id}</span>
              ${isEng ? `<span style="background:var(--pur-m);color:#fff;font-size:7.5px;padding:0 4px;border-radius:3px">KS</span>` : ''}
              <span style="background:${kc};color:#fff;padding:0 5px;border-radius:3px;font-size:9px;font-weight:700">${w.main}</span>
              <span style="font-size:9px;color:var(--t3);background:#f1f3f6;padding:0 4px;border-radius:3px">${w.ca}</span>
            </div>
            <div style="display:flex;align-items:center;gap:8px;margin-top:3px;flex-wrap:wrap">
              <span style="font-size:9px;color:var(--t3)">Nghỉ: <b style="color:${(w.leave || 0) > 0 ? 'var(--red-m)' : 'var(--grn-m)'}">${w.leave || 0}日</b></span>
              <span style="font-size:9px;color:var(--t3)">NS: <b style="color:${w.perf >= 90 ? 'var(--grn-m)' : 'var(--amb-m)'}">${w.perf}%</b></span>
              <span style="font-size:9px;color:var(--t3)">Tỉ lệ làm: <b style="color:${workRate >= 90 ? 'var(--grn-m)' : workRate >= 70 ? 'var(--amb-m)' : 'var(--red-m)'}">${workRate}%</b></span>
              <div style="flex:1;min-width:60px;height:4px;background:#e5e7eb;border-radius:2px"><div style="height:100%;width:${workRate}%;background:${workRate >= 90 ? 'var(--grn-m)' : workRate >= 70 ? 'var(--amb-m)' : 'var(--red-m)'};border-radius:2px"></div></div>
            </div>
          </div>
          <!-- Toggle + Detail buttons -->
          <div style="display:flex;gap:4px;flex-shrink:0;align-items:center">
            <button class="btn sm" onclick="event.stopPropagation();openWorkerDetail(${wi})" style="font-size:9px;padding:2px 7px">Detail</button>
            ${editMode ? `<button class="btn sm red" onclick="event.stopPropagation();removeWorker(${wi})" style="font-size:9px;padding:2px 6px">✕</button>` : ''}
            <span style="font-size:10px;color:var(--t3);padding:0 2px">▼</span>
          </div>
        </div>
        <!-- EXPANDED SECTION (hidden by default) -->
        <div class="wcard-expand">
          <div class="wcard-avatar" style="background:${kc}18;position:relative">
            ${
							w.photo
								? `<img src="${w.photo}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;border:2.5px solid ${kc};display:block;margin:0 auto">`
								: `<div style="width:64px;height:64px;border-radius:50%;background:${kc};display:flex;align-items:center;justify-content:center;font-size:24px;color:#fff;font-weight:700;margin:0 auto">${w.name.charAt(0)}</div>`
						}
            <div style="text-align:center;margin-top:4px">
              <span style="background:${rankColor};color:#fff;font-size:9px;font-weight:700;padding:1px 6px;border-radius:10px">${w.rank}</span>
            </div>
            <div style="text-align:center;font-size:8px;color:var(--t3);margin-top:2px">${rankLabel}</div>
            ${editMode ? `<label style="position:absolute;top:2px;right:2px;width:18px;height:18px;background:#fff;border-radius:50%;border:1px solid ${kc};cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:9px">📷<input type="file" accept="image/*" style="display:none" onchange="setWorkerPhoto(${wi},this)"></label>` : ''}
          </div>
          <div class="wcard-main">
            ${w.title ? `<div style="font-size:9.5px;color:var(--t3);margin-bottom:4px;font-style:italic">${editMode ? `<input type="text" value="${w.title}" class="inp" style="width:150px;font-size:9.5px" onchange="WORKERS[${wi}].title=this.value">` : w.title}</div>` : ''}
            <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:4px;align-items:center">
              ${
								editMode
									? `<select style="font-size:9px;padding:1px 4px;border-radius:3px;border:1px solid ${kc};color:${kc};font-weight:700" onchange="_workerKoteiChanged(${wi},'main',this.value)">${KOTEI.map((k) => `<option value="${k}" ${k === w.main ? 'selected' : ''}>${k}</option>`).join('')}</select>`
									: `<span style="background:${kc};color:#fff;padding:1px 6px;border-radius:3px;font-size:9px;font-weight:700">${w.main}</span>`
							}
              ${
								editMode
									? `<select style="font-size:9px;padding:1px 4px;border-radius:3px;border:1px solid var(--grn-m);color:var(--grn-m)" onchange="_workerKoteiChanged(${wi},'sub',this.value)">${KOTEI.map((k) => `<option value="${k}" ${k === w.sub ? 'selected' : ''}>${k}</option>`).join('')}</select>`
									: `<span style="background:var(--grn-l);color:var(--grn-m);padding:1px 5px;border-radius:3px;font-size:9px">副:${w.sub}</span>`
							}
              ${
								editMode
									? `<select style="font-size:9px;padding:1px 4px;border-radius:3px;border:1px solid var(--bdr)" onchange="WORKERS[${wi}].ca=this.value">${CA_LIST.map((c) => `<option ${c === w.ca ? 'selected' : ''}>${c}</option>`).join('')}</select>`
									: `<span style="font-size:9px;color:var(--t3);background:#f1f3f6;padding:1px 5px;border-radius:3px">${w.ca}</span>`
							}
              ${editMode ? `<select style="font-size:9px;padding:1px 4px;border-radius:3px;border:1px solid var(--bdr)" onchange="WORKERS[${wi}].rank=this.value;buildWorkerCards()">${RANKS.map((r) => `<option ${r === w.rank ? 'selected' : ''}>${r}</option>`).join('')}</select>` : ''}
            </div>
            <div style="font-size:10px;color:var(--t2);margin-bottom:3px">
              📦 ${editMode ? `<input type="text" value="${w.assign || ''}" class="inp" style="width:120px;font-size:10px" onchange="WORKERS[${wi}].assign=this.value">` : w.assign || '—'}
              &nbsp; Skill: ${editMode ? `<select style="font-size:9px" onchange="WORKERS[${wi}].skill=+this.value">${[1, 2, 3, 4].map((n) => `<option value="${n}" ${n === w.skill ? 'selected' : ''}>${'★'.repeat(n)}</option>`).join('')}</select>` : `<span style="color:#f59e0b">${stars(w.skill)}</span>`}
            </div>
          </div>
          <div class="wcard-kpi">
            ${[
							{
								l: 'Giờ công',
								v: workDays * 8 + 'h',
								s: workDays + '日',
								c: 'var(--navy)',
							},
							{
								l: 'Nghỉ',
								v: (w.leave || 0) + '日',
								s: w.leaveNote || 'OK',
								c:
									(w.leave || 0) > 3
										? 'var(--red-m)'
										: (w.leave || 0) > 0
											? 'var(--amb-m)'
											: 'var(--grn-m)',
							},
							{
								l: 'Vi phạm',
								v: violCount || '0',
								s: violCount ? '⚠' : '✓',
								c: violCount ? 'var(--red-m)' : 'var(--grn-m)',
							},
							{
								l: 'NS%',
								v: w.perf + '%',
								s: 'tháng',
								c:
									w.perf >= 90
										? 'var(--grn-m)'
										: w.perf >= 75
											? 'var(--amb-m)'
											: 'var(--red-m)',
							},
							{
								l: 'CL%',
								v: w.qual + '%',
								s: 'tháng',
								c: w.qual >= 95 ? 'var(--grn-m)' : 'var(--amb-m)',
							},
							{
								l: 'Tỉ lệ làm',
								v: workRate + '%',
								s: `${workDays}/${wd}日`,
								c:
									workRate >= 90
										? 'var(--grn-m)'
										: workRate >= 70
											? 'var(--amb-m)'
											: 'var(--red-m)',
							},
						]
							.map(
								(k) =>
									`<div class="wcard-kpi-item"><div style="font-size:8px;color:var(--t3);margin-bottom:1px">${k.l}</div><div style="font-family:var(--mono);font-size:12px;font-weight:700;color:${k.c}">${k.v}</div><div style="font-size:7.5px;color:var(--t3);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:58px">${k.s}</div></div>`,
							)
							.join('')}
          </div>
          <div class="wcard-actions">
            <button class="btn sm" onclick="event.stopPropagation();openWorkerDetail(${wi})">👁 Detail</button>
            ${editMode ? `<button class="btn sm red" onclick="event.stopPropagation();removeWorker(${wi})">✕</button>` : ''}
          </div>
        </div>`;
			container.appendChild(div);
		});
	});
	buildWorkerKotei();
	buildSkillMatrix();
	syncViolSelect();
}
function openWorkerDetail(wi) {
	currentWorkerIdx = wi;
	const w = WORKERS[wi];
	const violList = violations.filter((v) => v.wid === w.id);
	const mo =
		document.getElementById('plan_month')?.value ||
		new Date().toISOString().slice(0, 7);
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	let wd = 0;
	for (let d = 1; d <= days; d++) {
		if (!isWE(yr, m, d)) wd++;
	}
	const workDays = Math.max(0, wd - (w.leave || 0));
	const workRate = wd > 0 ? Math.round((workDays / wd) * 100) : 100;
	const ro = editMode ? '' : 'readonly';
	const dis = editMode ? '' : 'disabled';
	const kc = PC[w.main] || '#888';
	const isEng = w.rank && w.rank.startsWith('S');
	document.getElementById('mw_title').textContent = w.name + ' — ' + w.id;
	document.getElementById('mw_content').innerHTML = `
    <!-- Header: photo + basic info -->
    <div style="display:flex;gap:14px;align-items:flex-start;margin-bottom:12px">
      <div style="flex-shrink:0;text-align:center">
        ${
					w.photo
						? `<img src="${w.photo}" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:3px solid ${kc}">`
						: `<div style="width:80px;height:80px;border-radius:50%;background:${kc};display:flex;align-items:center;justify-content:center;font-size:32px;color:#fff;font-weight:700">${w.name.charAt(0)}</div>`
				}
        ${editMode ? `<label style="display:block;margin-top:5px;font-size:10px;cursor:pointer;color:var(--blue)">📷 Đổi ảnh<input type="file" accept="image/*" style="display:none" onchange="setWorkerPhoto(${wi},this)"></label>` : ''}
        <div style="margin-top:5px"><span style="background:${isEng ? 'var(--pur-m)' : 'var(--blue)'};color:#fff;font-size:10px;font-weight:700;padding:2px 8px;border-radius:10px">${w.rank}</span></div>
        <div style="font-size:9px;color:var(--t3);margin-top:2px">${RANK_LABEL[w.rank] || ''}</div>
      </div>
      <div style="flex:1">
	  // Note : Cho phep sua ten nhan vien

        <div style="font-size:16px;font-weight:700;margin-bottom:2px">
  ${
		editMode
			? `<input type="text" value="${w.name}" class="inp" style="font-size:15px;font-weight:700;width:180px" 
        onchange="WORKERS[${wi}].name=this.value;saveWorkers()">`
			: w.name
	}
</div>
        <div style="font-size:11px;color:var(--t3);margin-bottom:6px">${editMode ? `<input type="text" value="${w.title || ''}" class="inp" style="width:180px;font-size:11px" placeholder="Chức danh..." onchange="WORKERS[${wi}].title=this.value">` : w.title || '—'}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:5px;font-size:11px">
          <label>📞 SĐT: <input type="text" value="${w.phone || ''}" class="inp" style="width:110px;font-size:11px;margin-left:4px" ${ro} onchange="WORKERS[${wi}].phone=this.value"></label>
          <label>Ca: <select class="inp" style="margin-left:4px" ${dis} onchange="WORKERS[${wi}].ca=this.value">${CA_LIST.map((c) => `<option ${c === w.ca ? 'selected' : ''}>${c}</option>`).join('')}</select></label>
          <label>Rank: <select class="inp" style="width:60px;margin-left:4px" ${dis} onchange="WORKERS[${wi}].rank=this.value;buildWorkerCards()">${RANKS.map((r) => `<option ${r === w.rank ? 'selected' : ''}>${r}</option>`).join('')}</select></label>
          <label>Nghỉ(ngày): <input type="number" value="${w.leave || 0}" min="0" class="inp" style="width:50px;margin-left:4px" ${ro} onchange="WORKERS[${wi}].leave=+this.value"></label>
          <label>Lý do nghỉ: <input type="text" value="${w.leaveNote || ''}" class="inp" style="width:120px;font-size:10px;margin-left:4px" ${ro} onchange="WORKERS[${wi}].leaveNote=this.value"></label>
          <label>Thăng chức: <input type="month" value="${w.promotionDate || ''}" class="inp" style="width:120px;font-size:10px;margin-left:4px" ${ro} onchange="WORKERS[${wi}].promotionDate=this.value"></label>
          <label>NS%: <input type="number" value="${w.perf}" min="0" max="100" class="inp" style="width:55px;margin-left:4px" ${ro} onchange="WORKERS[${wi}].perf=+this.value"></label>
          <label>CL%: <input type="number" value="${w.qual}" min="0" max="100" class="inp" style="width:55px;margin-left:4px" ${ro} onchange="WORKERS[${wi}].qual=+this.value"></label>
        </div>
      </div>
    </div>
    <!-- KPI row -->
    <div class="mc-g" style="grid-template-columns:repeat(4,1fr);margin-bottom:10px">
      <div class="mc neu"><div class="mc-v">${workDays}</div><div class="mc-l">Ngày làm TT</div></div>
      <div class="mc info"><div class="mc-v">${workDays * 8}h</div><div class="mc-l">Giờ công/tháng</div></div>
      <div class="mc ${w.perf >= 90 ? 'ok' : w.perf >= 75 ? 'warn' : 'bn'}"><div class="mc-v">${w.perf}%</div><div class="mc-l">Năng suất</div></div>
      <div class="mc ${workRate >= 90 ? 'ok' : workRate >= 70 ? 'warn' : 'bn'}"><div class="mc-v">${workRate}%</div><div class="mc-l">Tỉ lệ làm việc</div></div>
    </div>
    <!-- Kotei + assign -->
    <div style="margin-bottom:10px;font-size:11px;padding:7px 10px;background:#f8faff;border-radius:6px">
      <b>Kotei:</b> <span style="background:${kc};color:#fff;padding:1px 7px;border-radius:3px">${w.main}</span>
      <span style="color:var(--t3)"> (phụ: ${w.sub})</span>
      &nbsp;|&nbsp; <b>Đảm trách:</b> ${w.assign || '—'}
    </div>
    <!-- Achievements / Improvements / Notes -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px">
      <div>
        <div style="font-size:10px;font-weight:700;color:var(--grn-m);margin-bottom:3px">🏆 Thành tựu / Đóng góp</div>
        ${
					editMode
						? `<textarea class="inp" style="width:100%;font-size:10px;resize:vertical;min-height:52px" onchange="WORKERS[${wi}].achievements=this.value">${w.achievements || ''}</textarea>`
						: `<div style="font-size:10px;color:var(--t2);background:#f0fdf4;padding:6px 8px;border-radius:5px;min-height:42px">${w.achievements || '<span style="color:var(--t3)">Chưa có</span>'}</div>`
				}
      </div>
      <div>
        <div style="font-size:10px;font-weight:700;color:var(--blue);margin-bottom:3px">💡 Cải tiến</div>
        ${
					editMode
						? `<textarea class="inp" style="width:100%;font-size:10px;resize:vertical;min-height:52px" onchange="WORKERS[${wi}].improvements=this.value">${w.improvements || ''}</textarea>`
						: `<div style="font-size:10px;color:var(--t2);background:#eff6ff;padding:6px 8px;border-radius:5px;min-height:42px">${w.improvements || '<span style="color:var(--t3)">Chưa có</span>'}</div>`
				}
      </div>
    </div>
    <label style="font-size:11px;display:block;margin-bottom:10px">📝 Ghi chú: <input type="text" value="${w.note || ''}" class="inp" style="width:95%;font-size:11px;margin-top:2px" ${ro} onchange="WORKERS[${wi}].note=this.value"></label>
    <!-- Violations -->
    ${
			violList.length
				? `<div><b style="font-size:11px;color:var(--red-m)">⚠ Vi phạm (${violList.length}):</b>
        ${violList
					.map(
						(
							v,
						) => `<div style="display:flex;align-items:center;gap:8px;padding:4px 8px;background:var(--red-l);border-radius:5px;margin-top:4px;font-size:11px">
          <span style="font-family:var(--mono);color:var(--t3)">${v.date}</span>
          <span>${v.type}${v.note ? ' — ' + v.note : ''}</span>
          ${editMode ? `<button class="btn sm red" style="margin-left:auto" onclick="removeViolRefresh(${v.id},${wi})">✕</button>` : ''}
        </div>`,
					)
					.join('')}</div>`
				: '<p style="font-size:11px;color:var(--grn-m)">✅ Không có vi phạm</p>'
		}
  `;
	openModal('modal_worker');
}
function saveWorkerDetail() {
	saveWorkers();
	closeModal('modal_worker');
	buildWorkerCards();
}
function removeWorker(i) {
	if (!confirm('Xóa?')) return;
	WORKERS.splice(i, 1);
	buildWorkerCards();
}
function addWorker() {
	WORKERS.push({
		id: 'W' + String(WORKERS.length + 1).padStart(2, '0'),
		name: 'Tên mới',
		rank: 'W1',
		main: '先付',
		sub: '矯正',
		assign: '',
		skill: 1,
		ca: 'Ca1',
		leave: 0,
		leaveNote: '',
		perf: 80,
		qual: 90,
		phone: '',
		note: '',
		title: '',
		achievements: '',
		improvements: '',
		promotionDate: '',
	});
	// PHASE 2: Insert worker mới lên DB
	// SQL: INSERT INTO m_staff (name, code, Role, kotei, ca, perf, qual, skill)
	if (_apiAvailable === true) {
		fetch(`${API_BASE}?action=add_worker`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				name: 'Tên mới',
				role: 'W1',
				kotei: '先付',
				ca: 'Ca1',
				perf: 80,
				qual: 90,
				skill: 1,
			}),
		})
			.then((r) => r.json())
			.then((d) => {
				if (d.success && d.id) {
					// Cập nhật id thật từ DB vào WORKERS cuối
					WORKERS[WORKERS.length - 1].id = d.id;
				}
			})
			.catch((e) => console.warn('[API] add_worker failed:', e));
	}
	buildWorkerCards();
}
/* ── A9: ATTENDANCE TABLE ── */
function buildAttendTable() {
	const tbl = document.getElementById('attend_table');
	if (!tbl) return;
	const mo =
		document.getElementById('attend_month')?.value ||
		new Date().toISOString().slice(0, 7);
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	const attendKey = 'smc_attendance_' + mo;
	let att = {};
	try {
		att = JSON.parse(localStorage.getItem(attendKey) || '{}');
	} catch (e) {}
	const now = new Date();
	const isToday = (d) =>
		yr === now.getFullYear() && m === now.getMonth() + 1 && d === now.getDate();
	const dayNums = Array.from({ length: days }, (_, i) => i + 1);
	const we = dayNums.map((d) => isWE(yr, m, d));
	const DOW = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
	/* CSS cho ô nhập */
	const CELL_W = 38;
	const NAME_W = 130;
	const TOT_W = 54;
	let html = `<thead><tr>
    <th style="position:sticky;left:0;background:var(--navy);color:#fff;padding:5px 10px;text-align:left;z-index:3;min-width:${NAME_W}px;font-size:10px">Nhân viên</th>
    <th style="position:sticky;left:${NAME_W}px;background:var(--navy);color:#fff;padding:5px 6px;z-index:3;min-width:${TOT_W}px;font-size:10px;text-align:center">Σ Nghỉ</th>
    ${dayNums
			.map((d, i) => {
				const tod = isToday(d);
				return `<th style="background:${we[i] ? '#374151' : tod ? '#78350f' : 'var(--navy)'};color:${we[i] ? '#9ca3af' : tod ? '#fbbf24' : '#fff'};padding:3px 2px;text-align:center;min-width:${CELL_W}px;font-size:9.5px;border-left:${tod ? '2px solid #fbbf24' : 'none'}">${d}<br><span style="font-size:7.5px;opacity:.7">${DOW[new Date(yr, m - 1, d).getDay()]}</span></th>`;
			})
			.join('')}
  </tr></thead><tbody>`;
	WORKERS.forEach((w) => {
		const wAtt = att[w.id] || {};
		const totalLeave = dayNums.reduce((s, d) => s + (wAtt[d] || 0), 0);
		const kc = PC[w.main] || '#888';
		html += `<tr>
      <td style="position:sticky;left:0;background:#fff;z-index:2;padding:4px 8px;border-bottom:1px solid #f0f2f6;white-space:nowrap;min-width:${NAME_W}px">
        <div style="display:flex;align-items:center;gap:5px">
          <span style="background:${kc};color:#fff;border-radius:50%;width:18px;height:18px;display:inline-flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;flex-shrink:0">${w.name.charAt(0)}</span>
          <div>
            <b style="font-size:10.5px;display:block;line-height:1.2">${w.name}</b>
            <span style="font-size:8.5px;color:var(--t3)">${w.rank} · ${w.ca || 'Ca1'}</span>
          </div>
        </div>
      </td>
      <td style="position:sticky;left:${NAME_W}px;background:#fff;z-index:2;text-align:center;font-family:var(--mono);font-size:13px;font-weight:700;color:${totalLeave >= 3 ? 'var(--red-m)' : totalLeave > 0 ? 'var(--amb-m)' : 'var(--grn-m)'};padding:4px 5px;border-bottom:1px solid #f0f2f6;border-right:2px solid var(--bdr)">${totalLeave || '0'}</td>
      ${dayNums
				.map((d, i) => {
					const isWEDay = we[i];
					const tod = isToday(d);
					const val = wAtt[d] || 0;
					if (isWEDay)
						return `<td style="background:#f3f4f6;text-align:center;color:#9ca3af;font-size:10px;padding:0;border-bottom:1px solid #f0f2f6">休</td>`;
					if (editMode) {
						const bg =
							val >= 1 ? '#fef2f2' : val >= 0.5 ? '#fff7ed' : '#f0fdf4';
						const fc =
							val >= 1 ? '#dc2626' : val >= 0.5 ? '#d97706' : '#16a34a';
						return `<td style="padding:2px 1px;text-align:center;background:${bg};border-bottom:1px solid #f0f2f6;border-left:${tod ? '2px solid #fbbf24' : '1px solid #f0f2f6'}">
            <div style="display:flex;flex-direction:column;align-items:center;gap:0">
              <button onclick="stepAttend('${mo}','${w.id}',${d},0.5)" style="width:${CELL_W - 4}px;height:14px;border:none;background:#e5e7eb;border-radius:2px 2px 0 0;cursor:pointer;font-size:9px;line-height:1;font-weight:700;color:#374151" title="+0.5">▲</button>
              <input type="number" id="att_${w.id}_${d}" value="${val || 0}" min="0" max="${days}" step="0.5"
                style="width:${CELL_W - 4}px;height:22px;border:none;border-top:1px solid #d1d5db;border-bottom:1px solid #d1d5db;text-align:center;font-size:12px;font-family:var(--mono);font-weight:700;color:${fc};background:${bg};padding:0"
                onchange="updateAttend('${mo}','${w.id}',${d},+this.value);rebuildAttendRow('${mo}','${w.id}',${days})">
              <button onclick="stepAttend('${mo}','${w.id}',${d},-0.5)" style="width:${CELL_W - 4}px;height:14px;border:none;background:#e5e7eb;border-radius:0 0 2px 2px;cursor:pointer;font-size:9px;line-height:1;font-weight:700;color:#374151" title="-0.5">▼</button>
            </div>
          </td>`;
					}
					const bg =
						val >= 1 ? '#fef2f2' : val >= 0.5 ? '#fff7ed' : 'transparent';
					const fc =
						val >= 1
							? 'var(--red-m)'
							: val >= 0.5
								? 'var(--amb-m)'
								: 'var(--t3)';
					return `<td style="text-align:center;font-size:11px;font-family:var(--mono);font-weight:700;color:${fc};background:${bg};padding:4px 2px;border-bottom:1px solid #f0f2f6;border-left:${tod ? '2px solid #fbbf24' : 'none'}">${val || '·'}</td>`;
				})
				.join('')}
    </tr>`;
	});
	/* Total row */
	html += `<tr>
    <td style="position:sticky;left:0;background:#0f2b4a;color:#fff;font-weight:700;font-size:10px;padding:4px 8px;z-index:2">Tổng nghỉ/ngày</td>
    <td style="position:sticky;left:${NAME_W}px;background:#0f2b4a;color:#fff;font-weight:700;text-align:center;z-index:2;border-right:2px solid #1e5fa8">—</td>
    ${dayNums
			.map((d, i) => {
				if (we[i])
					return `<td style="background:#374151;text-align:center;color:#6b7280;font-size:9px">休</td>`;
				const dayTotal = WORKERS.reduce((s, w) => {
					const wAtt = att[w.id] || {};
					return s + (wAtt[d] || 0);
				}, 0);
				const tod = isToday(d);
				return `<td style="background:${dayTotal >= 2 ? '#7f1d1d' : dayTotal >= 1 ? '#78350f' : dayTotal > 0 ? '#1c3a1c' : '#0f2b4a'};color:${dayTotal > 0 ? '#fca5a5' : '#374151'};text-align:center;font-family:var(--mono);font-size:10.5px;font-weight:700;padding:4px 2px;border-left:${tod ? '2px solid #fbbf24' : 'none'}">${dayTotal || ''}</td>`;
			})
			.join('')}
  </tr></tbody>`;
	tbl.innerHTML = html;
}
function updateAttend(mo, wid, day, val) {
	const attendKey = 'smc_attendance_' + mo;
	let att = {};
	try {
		att = JSON.parse(localStorage.getItem(attendKey) || '{}');
	} catch (e) {}
	if (!att[wid]) att[wid] = {};
	att[wid][day] = Math.max(0, val);
	const [yr, m2] = mo.split('-').map(Number);
	const days = new Date(yr, m2, 0).getDate();
	const total = Array.from(
		{ length: days },
		(_, i) => att[wid][i + 1] || 0,
	).reduce((a, b) => a + b, 0);
	const wi = WORKERS.findIndex((w) => w.id === wid);
	if (wi >= 0) WORKERS[wi].leave = total;
	localStorage.setItem(attendKey, JSON.stringify(att));
}
/* Step up/down 0.5 cho attendance cell */
function stepAttend(mo, wid, day, delta) {
	const attendKey = 'smc_attendance_' + mo;
	let att = {};
	try {
		att = JSON.parse(localStorage.getItem(attendKey) || '{}');
	} catch (e) {}
	if (!att[wid]) att[wid] = {};
	const [yr, m2] = mo.split('-').map(Number);
	const days = new Date(yr, m2, 0).getDate();
	const cur = att[wid][day] || 0;
	const newVal = Math.max(0, Math.min(1, Math.round((cur + delta) * 10) / 10));
	att[wid][day] = newVal;
	localStorage.setItem(attendKey, JSON.stringify(att));
	/* Update worker leave total */
	const wi = WORKERS.findIndex((w) => w.id === wid);
	if (wi >= 0) {
		WORKERS[wi].leave = Array.from(
			{ length: days },
			(_, i) => att[wid][i + 1] || 0,
		).reduce((a, b) => a + b, 0);
	}
	/* Refresh just the input + colors */
	const inp = document.getElementById('att_' + wid + '_' + day);
	if (inp) {
		inp.value = newVal || 0;
		const bg = newVal >= 1 ? '#fef2f2' : newVal >= 0.5 ? '#fff7ed' : '#f0fdf4';
		const fc = newVal >= 1 ? '#dc2626' : newVal >= 0.5 ? '#d97706' : '#16a34a';
		inp.style.color = fc;
		inp.style.background = bg;
		inp.parentElement.parentElement.style.background = bg;
	}
	/* Refresh total cell */
	rebuildAttendRow(mo, wid, days);
}
function rebuildAttendRow(mo, wid, days) {
	const attendKey = 'smc_attendance_' + mo;
	let att = {};
	try {
		att = JSON.parse(localStorage.getItem(attendKey) || '{}');
	} catch (e) {}
	const wAtt = att[wid] || {};
	const total = Array.from({ length: days }, (_, i) => wAtt[i + 1] || 0).reduce(
		(a, b) => a + b,
		0,
	);
	/* Find total cell: second sticky td in this worker's row */
	const rows = document.querySelectorAll('#attend_table tbody tr');
	rows.forEach((row) => {
		const nameCell = row.querySelector('td:first-child b');
		const w = WORKERS.find((w) => w.id === wid);
		if (nameCell && w && nameCell.textContent === w.name) {
			const totCell = row.querySelector('td:nth-child(2)');
			if (totCell) {
				totCell.textContent = total || '0';
				totCell.style.color =
					total >= 3
						? 'var(--red-m)'
						: total > 0
							? 'var(--amb-m)'
							: 'var(--grn-m)';
			}
		}
	});
}
function saveAttend() {
	const mo =
		document.getElementById('attend_month')?.value ||
		new Date().toISOString().slice(0, 7);
	const attendKey = 'smc_attendance_' + mo;
	/* Re-read leave totals into WORKERS */
	let att = {};
	try {
		att = JSON.parse(localStorage.getItem(attendKey) || '{}');
	} catch (e) {}
	const [yr, m2] = mo.split('-').map(Number);
	const days = new Date(yr, m2, 0).getDate();
	WORKERS.forEach((w) => {
		const wAtt = att[w.id] || {};
		w.leave = Array.from({ length: days }, (_, i) => wAtt[i + 1] || 0).reduce(
			(a, b) => a + b,
			0,
		);
	});
	saveWorkers();
	buildAttendTable();
	buildStaffSummary();
	flashSave();
	alert('✅ Đã lưu bảng ngày nghỉ và cập nhật tổng nghỉ vào Worker data.');
}
/* ── end attendance ── */
function saveWorkers() {
	// PHASE 2: Save lên DB thay vì localStorage
	// SQL: UPDATE m_staff SET name,Role,kotei,ca,perf,qual,skill WHERE id
	if (_apiAvailable !== true) return;
	WORKERS.forEach((w) => {
		fetch(`${API_BASE}?action=save_worker`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				id: w.id,
				name: w.name,
				role: w.rank,
				kotei: w.main,
				ca: w.ca,
				perf: w.perf,
				qual: w.qual,
				skill: w.skill,
			}),
		}).catch((e) => console.warn('[API] save_worker failed:', e));
	});
}
function exportWorkersCSV() {
	let csv =
		'id,name,rank,main,sub,assign,skill,ca,leave,perf,qual,phone,note\n';
	WORKERS.forEach(
		(w) =>
			(csv += `${w.id},"${w.name}",${w.rank},${w.main},${w.sub},"${w.assign || ''}",${w.skill},${w.ca},${w.leave || 0},${w.perf},${w.qual},"${w.phone || ''}","${w.note || ''}"\n`),
	);
	const a = document.createElement('a');
	a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
	a.download = 'workers.csv';
	a.click();
}
function importWorkersCSV(input) {
	const file = input.files[0];
	if (!file) return;
	const reader = new FileReader();
	reader.onload = (e) => {
		const lines = e.target.result
			.split('\n')
			.filter((l) => l.trim() && !l.startsWith('id'));
		WORKERS.length = 0;
		lines.forEach((l) => {
			const p = l.split(',');
			const cl = (s) => (s || '').replace(/^"|"$/g, '').trim();
			if (cl(p[0]))
				WORKERS.push({
					id: cl(p[0]),
					name: cl(p[1]),
					rank: cl(p[2]) || 'W1',
					main: cl(p[3]) || '先付',
					sub: cl(p[4]) || '矯正',
					assign: cl(p[5]),
					skill: +cl(p[6]) || 1,
					ca: cl(p[7]) || 'Ca1',
					leave: +cl(p[8]) || 0,
					perf: +cl(p[9]) || 80,
					qual: +cl(p[10]) || 90,
					phone: cl(p[11]),
					note: cl(p[12]),
				});
		});
		buildWorkerCards();
		saveWorkers();
		alert('✅ Import ' + WORKERS.length + ' workers');
	};
	reader.readAsText(file);
	input.value = '';
}
function buildWorkerKotei() {
	const kg = document.getElementById('worker_kotei');
	if (!kg) return;
	kg.innerHTML = '';
	PROCS.forEach((p) => {
		const key = p.name.split(' ')[0];
		const mains = WORKERS.filter((w) => w.main === key);
		const subs = WORKERS.filter((w) => w.sub === key);
		kg.innerHTML += `<div style="border:1px solid var(--bdr);border-radius:8px;padding:10px;border-top:3px solid ${p.color}"><div style="font-weight:700;color:${p.color};font-size:10.5px;margin-bottom:5px">${p.name}</div><div style="font-size:9.5px"><b>主(${mains.length}):</b>${mains.map((w) => `<span style="background:var(--blue-l);padding:1px 4px;border-radius:3px;margin:1px;display:inline-block">${w.name}</span>`).join('') || '—'}</div><div style="font-size:9.5px;margin-top:3px"><b>副(${subs.length}):</b>${subs.map((w) => `<span style="background:var(--grn-l);padding:1px 4px;border-radius:3px;margin:1px;display:inline-block">${w.name}</span>`).join('') || '—'}</div></div>`;
	});
}
function buildSkillMatrix() {
	const sm = document.getElementById('skill_matrix');
	if (!sm) return;
	const ks = PROCS.map((p) => p.name.split(' ')[0]);
	let h = `<thead><tr><th style="text-align:left">Worker</th>${ks.map((k, i) => `<th style="background:${PROCS[i].color}">${k}</th>`).join('')}</tr></thead><tbody>`;
	WORKERS.forEach((w) => {
		h += `<tr><td style="text-align:left;font-weight:700;font-size:10.5px">${w.name}</td>${ks
			.map((k) => {
				const iM = w.main === k,
					iS = w.sub === k;
				return `<td style="background:${iM ? 'var(--blue-l)' : iS ? 'var(--grn-l)' : '#fafafa'}">${iM ? '<b style="color:var(--blue)">主</b>' : iS ? '<span style="color:var(--grn-m)">副</span>' : '—'}</td>`;
			})
			.join('')}</tr>`;
	});
	sm.innerHTML = h + '</tbody>';
}
function syncViolSelect() {
	const sel = document.getElementById('viol_worker');
	if (!sel) return;
	sel.innerHTML =
		'<option value="">Chọn NV...</option>' +
		WORKERS.map((w) => `<option value="${w.id}">${w.name}</option>`).join('');
}
function addViol() {
	const wid = document.getElementById('viol_worker')?.value;
	if (!wid) {
		alert('Chọn NV!');
		return;
	}
	const type = document.getElementById('viol_type')?.value;
	const date =
		document.getElementById('viol_date')?.value ||
		new Date().toISOString().slice(0, 10);
	const note = document.getElementById('viol_note')?.value || '';
	const w = WORKERS.find((w) => w.id === wid);
	violations.unshift({
		wid,
		wname: w?.name || wid,
		type,
		date,
		note,
		id: Date.now(),
	});
	localStorage.setItem('smc_viol', JSON.stringify(violations));
	buildWorkerCards();
	renderViolList();
	document.getElementById('viol_note').value = '';
}
function renderViolList() {
	const el = document.getElementById('viol_list');
	if (!el) return;
	el.innerHTML =
		violations
			.slice(0, 8)
			.map(
				(v) =>
					`<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #f0f2f6;font-size:11px"><span style="font-family:var(--mono);color:var(--t3)">${v.date}</span><b>${v.wname}</b><span>${v.type}${v.note ? ' — ' + v.note : ''}</span><button class="btn sm" onclick="removeViol(${v.id})" style="margin-left:auto;color:var(--t3)">✕</button></div>`,
			)
			.join('') ||
		'<p style="font-size:11px;color:var(--t3);padding:7px 0">Không có vi phạm</p>';
}
function removeViol(id) {
	violations = violations.filter((x) => x.id !== id);
	localStorage.setItem('smc_viol', JSON.stringify(violations));
	buildWorkerCards();
	renderViolList();
}
function removeViolRefresh(id, wi) {
	removeViol(id);
	openWorkerDetail(wi);
}

