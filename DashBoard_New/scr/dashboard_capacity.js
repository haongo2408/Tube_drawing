/* ════════════════════════════════════════════════════════════════════
   dashboard_capacity.js  —  (file 13/15 — load order #13)
   ------------------------------------------------------------------
   TAB ⚙ NĂNG LỰC (Capacity) + STATUS BAR
    - buildProcTable/buildSOBBars/buildCapCharts
    - updateStatusBar() (thanh trạng thái header, chạy setInterval mỗi giây)
    Cần: dashboard_core.js (cascade(), PROCS)
   ════════════════════════════════════════════════════════════════════ */

/* CAPACITY */
function buildProcTable(caps, sys) {
	const el = document.getElementById('proc_body');
	if (!el) return;
	el.innerHTML = '';
	caps.forEach((c, i) => {
		const p = PROCS[i];
		const d = p.ct - p.ct_set;
		el.innerHTML += `<tr class="${p.isBN ? 'rbn' : c.effective < sys * 1.05 ? 'rwarn' : ''}"><td style="text-align:left;font-weight:700;color:${p.color}">${p.name}</td><td>${p.ct_set}</td><td><input class="pi" type="number" value="${p.ct}" min="1" max="300" id="pct_${i}" oninput="PROCS[${i}].ct=+this.value;update()"></td><td style="font-family:var(--mono);color:${d > 0 ? 'var(--red-m)' : d < 0 ? 'var(--grn-m)' : 'inherit'}">${d > 0 ? '+' : ''}${d}</td><td><input class="pi" type="number" value="${p.sta}" min="1" max="10" id="pst_${i}" oninput="PROCS[${i}].sta=+this.value;update()"></td><td>${p.batch}</td><td style="font-family:var(--mono)">${c.raw}</td><td style="font-family:var(--mono);font-weight:700">${c.effective}${c.wip > 0 ? `<span style="color:var(--t3);font-size:9px"> +${c.wip}wip</span>` : ''}</td><td>${c.wip || '—'}</td><td>${p.isBN ? '<span class="chip bn">⚠ BN</span>' : c.effective >= sys ? '<span class="chip ok">✓</span>' : '<span class="chip warn">△</span>'}</td><td style="text-align:left;color:var(--t3);font-size:9.5px">${p.note}</td></tr>`;
	});
}
function buildSOBBars(caps, sys) {
	const el = document.getElementById('sob_bars'),
		ne = document.getElementById('sys_note');
	if (!el) return;
	const max = Math.max(...caps.map((c) => c.raw));
	el.innerHTML = PROCS.map((p, i) => {
		const c = caps[i];
		const pd = c.raw > 0 ? +((c.effective / max) * 100).toFixed(1) : 0;
		const pw = c.raw > 0 ? +((c.wip / max) * 100).toFixed(1) : 0;
		const pi2 = Math.max(0, 100 - pd - pw).toFixed(1);
		return `<div class="sob-row"><div class="sob-lbl" style="color:${p.color}">${p.name.split(' ')[0]}</div><div class="sob-track"><div class="sob-done" style="width:${pd}%;background:${p.color}">${c.effective}</div><div style="width:${pw}%;height:100%;background:${p.color};opacity:.6;display:flex;align-items:center;justify-content:center;font-size:8.5px;color:#fff">${c.wip || ''}</div><div class="sob-idle" style="width:${pi2}%"></div></div><div class="sob-val">${c.effective}✓${c.wip > 0 ? ' +' + c.wip + '⏳' : ''}</div></div>`;
	}).join('');
	if (ne) {
		const ci = caps.reduce(
			(mi, c, i) => (c.effective < caps[mi].effective ? i : mi),
			0,
		);
		ne.innerHTML = `System: <b>${sys} pcs/ca</b> — Constraint: <b>${PROCS[ci].name}</b>. ${sys < caps[gBN()].effective ? `⚡ +1台 → ↑cap` : '✓ OK'}`;
	}
}
function buildCapCharts(refSku) {
	refSku = refSku || 'MB63TD';
	const { res: caps } = cascade(refSku);
	const lbl = PROCS.map((p) => p.name.split(' ')[0]);
	if (charts.ct) charts.ct.destroy();
	const be = document.getElementById('ctChart');
	if (be)
		charts.ct = new Chart(be, {
			type: 'bar',
			data: {
				labels: lbl,
				datasets: [
					{
						label: '設定CT',
						data: PROCS.map((p) => p.ct_set),
						backgroundColor: '#bfdbfe',
						borderWidth: 0,
					},
					{
						label: '正味CT',
						data: PROCS.map((p) => p.ct),
						backgroundColor: PROCS.map((p) => (p.isBN ? '#dc2626' : '#f97316')),
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
					y: { title: { display: true, text: 'sec/pcs', font: { size: 9 } } },
				},
			},
		});
	if (charts.cap) charts.cap.destroy();
	const ce = document.getElementById('capChart');
	const bnCap = caps[gBN()].effective;
	if (ce)
		charts.cap = new Chart(ce, {
			type: 'bar',
			data: {
				labels: lbl,
				datasets: [
					{
						label: 'Effective',
						data: caps.map((c) => c.effective),
						backgroundColor: PROCS.map((p, i) =>
							p.isBN
								? '#dc2626cc'
								: caps[i].effective < bnCap
									? '#f59e0bcc'
									: '#16a34acc',
						),
						borderWidth: 0,
					},
					{
						label: 'BN',
						data: PROCS.map(() => bnCap),
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
						labels: { font: { size: 9 }, boxWidth: 8 },
					},
				},
				scales: {
					y: { title: { display: true, text: 'pcs/ca', font: { size: 9 } } },
				},
			},
		});
}

/* STATUS BAR */
function updateStatusBar() {
	const { sys } = cascade('MB63TD');
	const sb = document.getElementById('sb_sys');
	if (sb) {
		sb.querySelector('.v').textContent = sys;
		sb.className =
			'sb-item ' + (sys >= 544 ? 'ok' : sys >= 400 ? 'warn' : 'bad');
	}
	const mo = document.getElementById('plan_month')?.value || '2026-06';
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	let gTT = 0,
		gKH = 0;
	PRODUCTS.forEach((p) => {
		for (let d = 1; d <= days; d++) {
			gTT += getTT(mo, p.code, d);
			gKH += getKH(mo, p.code, d);
		}
	});
	const gP = gKH > 0 ? Math.round((gTT / gKH) * 100) : 0;
	const sbP = document.getElementById('sb_pct');
	if (sbP) {
		sbP.querySelector('.v').textContent = gP + '%';
		sbP.className = 'sb-item ' + (gP >= 90 ? 'ok' : gP >= 70 ? 'warn' : 'bad');
	}
	const a = +(document.getElementById('oee_a')?.value || 89) / 100,
		p2 = +(document.getElementById('oee_p')?.value || 90) / 100,
		q = +(document.getElementById('oee_q')?.value || 98) / 100;
	const oee = (a * p2 * q * 100).toFixed(0);
	const sbO = document.getElementById('sb_oee');
	if (sbO) {
		sbO.querySelector('.v').textContent = oee + '%';
		sbO.className =
			'sb-item ' + (oee >= 85 ? 'ok' : oee >= 60 ? 'warn' : 'bad');
	}
	const andon = document.getElementById('andon'),
		andonTxt = document.getElementById('andon_txt');
	if (andon && andonTxt) {
		if (gP >= 90) {
			andon.className = 'andon grn';
			andonTxt.textContent = 'OK';
		} else if (gP >= 70) {
			andon.className = 'andon amb';
			andonTxt.textContent = '注意';
		} else {
			andon.className = 'andon red';
			andonTxt.textContent = 'NG';
		}
	}
	const sbC = document.getElementById('sb_clock');
	if (sbC)
		sbC.textContent = new Date().toLocaleTimeString('vi-VN', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
	const hd = document.getElementById('hdr_date');
	if (hd)
		hd.textContent = new Date().toLocaleDateString('vi-VN', {
			weekday: 'short',
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		});
}

