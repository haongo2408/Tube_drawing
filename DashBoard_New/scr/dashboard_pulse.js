/* ════════════════════════════════════════════════════════════════════
   dashboard_pulse.js  —  (file 8/15 — load order #8)
   ------------------------------------------------------------------
   TAB ⚡ CYCLE/PULSE + TAB 🔄 3 CA (Ca3)
    - CT TABLE: buildCTTable/saveCTData/resetCT
    - Pulse: parseHM/getShiftSegs/workSecToMin/buildXMapper/buildRTSummary/drawPulse/buildPulseSummary
    - 3 Ca: updateCa()
    Cần: dashboard_core.js (ctData, cascade())
   ════════════════════════════════════════════════════════════════════ */

/* CT TABLE */
function buildCTTable() {
	const el = document.getElementById('ct_table');
	if (!el) return;
	const ro = editMode ? '' : 'readonly';
	let h = `<thead><tr><th style="text-align:left">Mã SP</th><th>S</th>`;
	PROCS.forEach((p, i) => {
		h += `<th style="background:${p.color}cc;color:#fff">${p.name.split(' ')[0]}<br><span style="font-size:8px;font-weight:400">CT(s)</span></th><th style="background:${p.color}44;color:#444">移動(s)</th>`;
	});
	h += `</tr></thead><tbody>`;
	PRODUCTS.forEach((p) => {
		const w = SM[p.s] || { bg: '#fff', c: '#111' };
		h += `<tr><td style="font-weight:700;font-family:var(--mono);font-size:10px;color:${w.c}">${p.code}</td><td><span style="background:${w.bg};color:${w.c};padding:1px 4px;border-radius:3px;font-size:9px;font-weight:700">${p.s}</span></td>`;
		PROCS.forEach((proc, i) => {
			const defCT = Math.round(proc.ct * p.ctF);
			const stCT = ctData[`${p.code}_${i}`] || '';
			const stMv = ctData[`move_${p.code}_${i}`] || '';
			h += `<td><input type="number" value="${stCT}" placeholder="${defCT}" min="0" ${ro} style="width:48px;border:1px solid #e5e7eb;border-radius:3px;padding:2px 3px;font-size:10px;text-align:center;font-family:var(--mono);background:${editMode ? '#fffbeb' : '#fafafa'}" oninput="ctData['${p.code}_${i}']=+this.value||0;drawPulse()"></td><td><input type="number" value="${stMv}" placeholder="0" min="0" ${ro} style="width:42px;border:1px solid #e5e7eb;border-radius:3px;padding:2px 3px;font-size:10px;text-align:center;font-family:var(--mono);background:${editMode ? '#f0f0ff' : '#fafafa'}" oninput="ctData['move_${p.code}_${i}']=+this.value||0;drawPulse()"></td>`;
		});
		h += `</tr>`;
	});
	el.innerHTML = h + '</tbody>';
}
function saveCTData() {
	localStorage.setItem('smc_ct', JSON.stringify(ctData));
	flashSave();
	drawPulse();
	buildPulseSummary();
}
function resetCT() {
	if (!confirm('Reset CT về mặc định?')) return;
	ctData = {};
	localStorage.removeItem('smc_ct');
	buildCTTable();
}

/* PULSE */
function parseHM(str) {
	const [h, m] = (str || '08:00').split(':').map(Number);
	return h * 60 + m;
}
function getShiftSegs() {
	const s = parseHM(document.getElementById('pulse_start')?.value || '08:00');
	const e = parseHM(document.getElementById('pulse_end')?.value || '16:30');
	const bs = parseHM(document.getElementById('break_s')?.value || '11:45');
	const be = parseHM(document.getElementById('break_e')?.value || '12:30');
	const segs = [];
	if (bs > s && be < e) {
		segs.push({ s, e: bs, type: 'work' });
		segs.push({ s: bs, e: be, type: 'break' });
		segs.push({ s: be, e, type: 'work' });
	} else segs.push({ s, e, type: 'work' });
	const workMin = segs
		.filter((g) => g.type === 'work')
		.reduce((a, g) => a + (g.e - g.s), 0);
	return { segs, startMin: s, endMin: e, workMin };
}
function workSecToMin(ws, segs, startMin) {
	let rem = ws / 60;
	for (const seg of segs) {
		if (seg.type !== 'work') continue;
		const dur = seg.e - seg.s;
		if (rem <= dur) return seg.s + rem;
		rem -= dur;
	}
	return segs[segs.length - 1].e;
}
function buildXMapper(segs, startMin, endMin, ML, plotW) {
	const BREAK_PX = 12;
	const workMins = segs
		.filter((s) => s.type === 'work')
		.reduce((a, s) => a + (s.e - s.s), 0);
	const workPx =
		plotW - segs.filter((s) => s.type === 'break').length * BREAK_PX;
	return function (min) {
		let px = ML;
		for (const seg of segs) {
			if (min <= seg.s) break;
			const ins = Math.min(min, seg.e) - seg.s;
			if (seg.type === 'work') px += (ins / workMins) * workPx;
			else px += (ins / (seg.e - seg.s)) * BREAK_PX;
			if (min <= seg.e) break;
		}
		return px;
	};
}
function buildRTSummary() {
	const el = document.getElementById('rt_summary');
	if (!el) return;
	const skuCode = document.getElementById('pulse_sku')?.value || 'MB63TD';
	const { segs, startMin, endMin, workMin } = getShiftSegs();
	const totalWorkSec = workMin * 60;
	const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
	let elapsedWork = 0;
	for (const seg of segs) {
		if (seg.type !== 'work') continue;
		if (nowMin >= seg.e) elapsedWork += seg.e - seg.s;
		else if (nowMin >= seg.s) elapsedWork += nowMin - seg.s;
	}
	const elapsedSec = elapsedWork * 60;
	const remainSec = Math.max(0, totalWorkSec - elapsedSec);
	const bnIdx = gBN();
	const bnCT = gCtAdj(PROCS[bnIdx], skuCode) + gMv(PROCS[bnIdx], skuCode);
	const done = bnCT > 0 ? Math.floor(elapsedSec / bnCT) : 0;
	const remain = bnCT > 0 ? Math.floor(remainSec / bnCT) : 0;
	const { sys } = cascade(skuCode);
	const shiftPct = workMin > 0 ? Math.round((elapsedWork / workMin) * 100) : 0;
	el.innerHTML = `<div class="mc-g" style="grid-template-columns:repeat(4,1fr);margin-bottom:0">
    <div class="mc info"><div class="mc-v">${done}</div><div class="mc-l">Đã SX<br><span style="font-size:8px">đến NOW</span></div></div>
    <div class="mc ${remain > 0 ? 'ok' : 'warn'}"><div class="mc-v">${remain}</div><div class="mc-l">Còn SX được<br><span style="font-size:8px">đến cuối ca</span></div></div>
    <div class="mc neu"><div class="mc-v">${sys}</div><div class="mc-l">Dự kiến ca<br><span style="font-size:8px">sys capacity</span></div></div>
    <div class="mc warn"><div class="mc-v">${shiftPct}%</div><div class="mc-l">Ca đã trôi<br><span style="font-size:8px">${elapsedWork}/${workMin}ph</span></div></div>
  </div>`;
}
function drawPulse() {
	const canvas = document.getElementById('pulseCanvas');
	if (!canvas) return;
	const skuCode = document.getElementById('pulse_sku')?.value || 'MB63TD';
	const prod = PRODUCTS.find((p) => p.code === skuCode) || PRODUCTS[3];
	const showBatch = document.getElementById('show_batch')?.checked !== false;
	const showMove = document.getElementById('show_move')?.checked !== false;
	const { segs, startMin, endMin, workMin } = getShiftSegs();
	const totalWorkSec = workMin * 60;
	const bnIdx = gBN();
	PROCS.forEach((p, i) => (p.isBN = i === bnIdx));
	const bnCT = gCtAdj(PROCS[bnIdx], prod.code) + gMv(PROCS[bnIdx], prod.code);
	const maxPcs = Math.floor(totalWorkSec / bnCT);
	const rowH = 50,
		ML = 146,
		MT = 30,
		MB = 55;
	const W = canvas.offsetWidth || 1100;
	const H = MT + PROCS.length * rowH + MB;
	const plotW = W - ML - 14;
	const dpr = window.devicePixelRatio || 1;
	canvas.width = W * dpr;
	canvas.height = H * dpr;
	canvas.style.height = H + 'px';
	const ctx = canvas.getContext('2d');
	ctx.scale(dpr, dpr);
	ctx.clearRect(0, 0, W, H);
	const xMin = buildXMapper(segs, startMin, endMin, ML, plotW);
	/* Break zone */
	segs
		.filter((s) => s.type === 'break')
		.forEach((seg) => {
			const x1 = xMin(seg.s),
				x2 = xMin(seg.e);
			ctx.fillStyle = 'rgba(100,100,100,0.07)';
			ctx.fillRect(x1, MT, x2 - x1, H - MT - MB);
			ctx.fillStyle = 'rgba(80,80,80,0.5)';
			ctx.font = '700 8.5px "Segoe UI"';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText('休憩', (x1 + x2) / 2, MT + 10);
		});
	/* Hour grid */
	ctx.strokeStyle = 'rgba(0,0,0,0.05)';
	ctx.lineWidth = 0.5;
	for (let hr = startMin; hr <= endMin; hr += 60) {
		ctx.beginPath();
		ctx.moveTo(xMin(hr), MT + 18);
		ctx.lineTo(xMin(hr), H - MB);
		ctx.stroke();
	}
	PROCS.forEach((p, pi) => {
		const ctAdj = gCtAdj(p, prod.code);
		const mvAdj = gMv(p, prod.code);
		const ctTot = ctAdj + mvAdj;
		const rowY = MT + pi * rowH;
		if (pi % 2 === 0) {
			ctx.fillStyle = 'rgba(0,0,0,0.012)';
			ctx.fillRect(ML, rowY, plotW, rowH);
		}
		if (pi === bnIdx) {
			ctx.fillStyle = 'rgba(220,38,38,0.035)';
			ctx.fillRect(ML, rowY, plotW, rowH);
		}
		ctx.fillStyle = p.color;
		ctx.font = '700 11px "Segoe UI",Arial';
		ctx.textAlign = 'right';
		ctx.textBaseline = 'middle';
		ctx.fillText(p.name.split(' ')[0], ML - 32, rowY + rowH / 2);
		ctx.fillStyle = '#9aa3b0';
		ctx.font = '9px "Segoe UI"';
		ctx.fillText(
			ctAdj + 's' + (mvAdj > 0 ? '+' + mvAdj : ''),
			ML - 3,
			rowY + rowH / 2,
		);
		for (let i = 0; i < Math.min(maxPcs, 50); i++) {
			const wsStart = i * bnCT;
			if (wsStart + ctAdj > totalWorkSec) break;
			const minStart = workSecToMin(wsStart, segs, startMin);
			const minEnd = workSecToMin(wsStart + ctAdj, segs, startMin);
			const x1 = xMin(minStart);
			const bw = Math.max(2, xMin(minEnd) - x1 - 1.5);
			if (showBatch && p.batch > 1 && i % p.batch === 0 && i > 0) {
				ctx.strokeStyle = 'rgba(0,0,0,0.18)';
				ctx.lineWidth = 1.5;
				ctx.setLineDash([3, 2]);
				ctx.beginPath();
				ctx.moveTo(x1 - 1, rowY + 5);
				ctx.lineTo(x1 - 1, rowY + rowH - 5);
				ctx.stroke();
				ctx.setLineDash([]);
				ctx.lineWidth = 0.5;
			}
			ctx.fillStyle = p.color + (i % 2 === 0 ? 'EE' : '77');
			ctx.beginPath();
			if (ctx.roundRect) ctx.roundRect(x1, rowY + 4, bw, rowH - 8, 3);
			else ctx.rect(x1, rowY + 4, bw, rowH - 8);
			ctx.fill();
			if (showMove && mvAdj > 0) {
				const mx = xMin(workSecToMin(wsStart + ctAdj, segs, startMin));
				const mEnd = xMin(workSecToMin(wsStart + ctTot, segs, startMin));
				const mbw = Math.max(1, mEnd - mx);
				ctx.fillStyle = '#94a3b877';
				ctx.beginPath();
				if (ctx.roundRect) ctx.roundRect(mx, rowY + 4, mbw, rowH - 8, 2);
				else ctx.rect(mx, rowY + 4, mbw, rowH - 8);
				ctx.fill();
			}
			if (bw > 16 && (!showBatch || p.batch === 1)) {
				ctx.fillStyle = 'rgba(255,255,255,0.9)';
				ctx.font = '700 8px "Segoe UI"';
				ctx.textAlign = 'center';
				ctx.textBaseline = 'middle';
				ctx.fillText(i + 1, x1 + bw / 2, rowY + rowH / 2);
			}
		}
		const { res } = cascade(prod.code);
		const c = res[pi];
		const dispPcs = Math.min(c.effective, maxPcs);
		ctx.fillStyle = dispPcs >= maxPcs * 0.9 ? '#16a34a' : '#d97706';
		ctx.font = '700 10px "Segoe UI"';
		ctx.textAlign = 'right';
		ctx.textBaseline = 'middle';
		ctx.fillText(dispPcs + ' pcs', W - 4, rowY + rowH / 2 - 5);
		if (c.wip > 0) {
			ctx.fillStyle = '#94a3b8';
			ctx.font = '400 9px "Segoe UI"';
			ctx.fillText('+' + c.wip + 'wip', W - 4, rowY + rowH / 2 + 7);
		}
	});
	ctx.fillStyle = 'rgba(0,0,0,0.5)';
	ctx.font = '10px "Segoe UI"';
	ctx.textAlign = 'center';
	ctx.textBaseline = 'top';
	for (let hr = startMin; hr <= endMin; hr += 60) {
		const hh = Math.floor(hr / 60);
		const mm = hr % 60;
		ctx.fillText(
			`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
			xMin(hr),
			H - MB + 3,
		);
	}
	ctx.fillStyle = 'rgba(0,0,0,0.3)';
	ctx.font = '8.5px "Segoe UI"';
	for (let hr = startMin + 30; hr < endMin; hr += 60) {
		const hh = Math.floor(hr / 60);
		const mm = hr % 60;
		ctx.fillText(
			`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`,
			xMin(hr),
			H - MB + 3,
		);
	}
	const nowMin = new Date().getHours() * 60 + new Date().getMinutes();
	if (nowMin >= startMin && nowMin <= endMin) {
		const xNow = xMin(nowMin);
		ctx.strokeStyle = '#f59e0b';
		ctx.lineWidth = 2;
		ctx.setLineDash([4, 3]);
		ctx.beginPath();
		ctx.moveTo(xNow, MT + 18);
		ctx.lineTo(xNow, H - MB);
		ctx.stroke();
		ctx.setLineDash([]);
		ctx.fillStyle = '#f59e0b';
		ctx.font = '700 9px "Segoe UI"';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'bottom';
		ctx.fillText('NOW', xNow, MT + 18);
	}
	const { sys } = cascade(prod.code);
	ctx.fillStyle = '#dc2626';
	ctx.font = '700 10px "Segoe UI"';
	ctx.textAlign = 'right';
	ctx.textBaseline = 'top';
	ctx.fillText(`SYS:${sys} pcs/ca | ${prod.code}`, W - 4, 4);
	const leg = document.getElementById('plegend');
	if (leg)
		leg.innerHTML = PROCS.map(
			(p) =>
				`<span style="display:flex;align-items:center;gap:4px"><span class="leg-dot" style="background:${p.color}"></span>${p.name.split(' ')[0]} ${gCtAdj(p, prod.code)}s${gMv(p, prod.code) ? '+' + gMv(p, prod.code) + 'mv' : ''}${p.isBN ? ' ⚠' : ''}</span>`,
		).join('');
	buildRTSummary();
}
function buildPulseSummary() {
	const pb = document.getElementById('pulse_body'),
		pf = document.getElementById('pulse_foot');
	if (!pb) return;
	const skuCode = document.getElementById('pulse_sku')?.value || 'MB63TD';
	const { res, sys } = cascade(skuCode);
	const bnIdx = gBN();
	const bnEff = res[bnIdx].effective;
	pb.innerHTML = PROCS.map((p, i) => {
		const c = res[i];
		const pct = bnEff > 0 ? Math.round((c.effective / bnEff) * 100) : 0;
		return `<tr class="${p.isBN ? 'rbn' : c.effective >= bnEff * 0.95 ? 'rok' : 'rwarn'}"><td style="text-align:left;font-weight:700;color:${p.color}">${p.name}</td><td style="font-family:var(--mono)">${c.ctAdj}</td><td>${c.mvAdj || '—'}</td><td>${p.sta}</td><td style="font-family:var(--mono)">${c.raw}</td><td>${p.batch}</td><td style="font-family:var(--mono);font-weight:700">${c.effective}</td><td style="font-family:var(--mono);color:${c.wip > 0 ? 'var(--amb-m)' : 'var(--t3)'}">${c.wip || '—'}</td><td style="font-family:var(--mono)">${pct}%</td><td>${p.isBN ? '<span class="chip bn">⚠ BN</span>' : c.effective >= bnEff * 0.95 ? '<span class="chip ok">✓</span>' : '<span class="chip warn">△</span>'}</td></tr>`;
	}).join('');
	if (pf) {
		const ci = res.reduce(
			(mi, c, i) => (c.effective < res[mi].effective ? i : mi),
			0,
		);
		pf.innerHTML = `<tr style="background:var(--blue-l);font-weight:700"><td colspan="6" style="text-align:left">System</td><td style="font-family:var(--mono)">${sys}</td><td>—</td><td>—</td><td style="font-size:10px;color:var(--blue)">Constraint: ${PROCS[ci].name.split(' ')[0]}</td></tr>`;
	}
}

/* 3-CA */
function updateCa() {
	const { sys } = cascade('MB63TD');
	const nca = +document.getElementById('s_ca').value;
	const grid = document.getElementById('ca_mc');
	if (grid) {
		grid.innerHTML = '';
		['Ca1', 'Ca2', 'Ca3'].slice(0, nca).forEach((_, i) => {
			const kh = +document.getElementById(`ca${i + 1}_kh`).value;
			grid.innerHTML += `<div class="mc ${kh <= sys ? 'ok' : 'warn'}"><div class="mc-v">${sys}</div><div class="mc-l">${['Ca1', 'Ca2', 'Ca3'][i]}<br>KH:${kh}(${Math.round((kh / sys) * 100)}%)</div></div>`;
		});
		grid.innerHTML += `<div class="mc info"><div class="mc-v">${(sys * nca).toLocaleString()}</div><div class="mc-l">日計 ${nca}ca</div></div>`;
	}
	const ab = document.getElementById('ca_body'),
		af = document.getElementById('ca_foot');
	if (ab) {
		ab.innerHTML = '';
		['Ca1', 'Ca2', 'Ca3'].slice(0, nca).forEach((ca, i) => {
			const kh = +document.getElementById(`ca${i + 1}_kh`).value;
			const st = document.getElementById(`ca${i + 1}_s`)?.value || '';
			const d = caActual[i];
			const tot = d.s1 + d.s2 + d.s3 + d.s4 + d.s5;
			const pct = kh > 0 ? Math.round((tot / kh) * 100) : 0;
			ab.innerHTML += `<tr><td style="font-weight:700">${ca}</td><td style="font-family:var(--mono)">${st}</td><td>${kh}</td>${[1, 2, 3, 4, 5].map((j) => `<td><input class="pi" type="number" value="${d['s' + j] || ''}" min="0" style="width:46px" onchange="caActual[${i}].s${j}=+this.value;updateCa()"></td>`).join('')}<td style="font-family:var(--mono);font-weight:700">${tot}</td><td style="font-family:var(--mono);font-weight:700;color:${pct >= 90 ? 'var(--grn-m)' : pct >= 70 ? 'var(--amb-m)' : 'var(--red-m)'}">${pct}%</td></tr>`;
		});
		if (af) {
			const tk = ['ca1_kh', 'ca2_kh', 'ca3_kh']
				.slice(0, nca)
				.reduce((s, id) => s + +document.getElementById(id).value, 0);
			const tt = caActual
				.slice(0, nca)
				.reduce((s, d) => s + d.s1 + d.s2 + d.s3 + d.s4 + d.s5, 0);
			const tp = tk > 0 ? Math.round((tt / tk) * 100) : 0;
			af.innerHTML = `<tr style="font-weight:700;background:#f8faff"><td colspan="2">日計</td><td>${tk}</td><td colspan="5"></td><td style="font-family:var(--mono)">${tt}</td><td style="font-family:var(--mono);color:${tp >= 90 ? 'var(--grn-m)' : 'var(--red-m)'}">${tp}%</td></tr>`;
		}
	}
	if (charts.ca) charts.ca.destroy();
	const ce = document.getElementById('caChart');
	if (ce) {
		const caps = Array.from({ length: nca }, () => cascade('MB63TD').sys);
		const khs = ['ca1_kh', 'ca2_kh', 'ca3_kh']
			.slice(0, nca)
			.map((id) => +document.getElementById(id).value);
		const tts = caActual
			.slice(0, nca)
			.map((d) => d.s1 + d.s2 + d.s3 + d.s4 + d.s5);
		charts.ca = new Chart(ce, {
			type: 'bar',
			data: {
				labels: ['Ca1', 'Ca2', 'Ca3'].slice(0, nca),
				datasets: [
					{
						label: '能力',
						data: caps,
						backgroundColor: '#bfdbfe55',
						borderColor: '#bfdbfe',
						borderWidth: 1,
					},
					{
						label: 'KH',
						data: khs,
						backgroundColor: '#1e5fa888',
						borderWidth: 0,
					},
					{
						label: 'TT',
						data: tts,
						backgroundColor: tts.map((v, i) =>
							v >= khs[i] * 0.9 ? '#16a34acc' : '#dc2626cc',
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
				scales: { y: { ticks: { font: { size: 9 } } } },
			},
		});
	}
}

