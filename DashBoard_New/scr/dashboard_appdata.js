/* ════════════════════════════════════════════════════════════════════
   dashboard_appdata.js  —  (file 3/15 — load order #3)
   ------------------------------------------------------------------
   APP DATA — LOAD/SAVE/EXPORT TOÀN BỘ DASHBOARD
    - loadAll(), downloadHTML() (export HTML kèm data)
    - UI STATE: saveUIState()/restoreUIState() (nhớ tab đang mở, filter...)
    - exportJSON()/importJSON() (backup/restore toàn bộ)
    - Toggle UI: togglePlanTable/toggleCard/toggleSection/initCardToggles
    - Custom report types: loadCustomRptTypes/renderCustomRptTypes/addCustomReportType/deleteCustomRptType
    Cần: dashboard_core.js, dashboard_api.js
   ════════════════════════════════════════════════════════════════════ */


function loadAll() {
	try {
		const lbl = JSON.parse(localStorage.getItem('smc_labels') || '{}');
		Object.entries(lbl).forEach(([k, v]) => {
			const el = document.getElementById(k);
			if (el) el.textContent = v;
		});
	} catch (e) {}
	try {
		const w = JSON.parse(localStorage.getItem('smc_workers') || 'null');
		if (w && w.length) WORKERS.splice(0, WORKERS.length, ...w);
	} catch (e) {}
	try {
		Object.assign(ctData, JSON.parse(localStorage.getItem('smc_ct') || '{}'));
	} catch (e) {}
	try {
		const p = JSON.parse(localStorage.getItem('smc_products') || 'null');
		if (p && p.length) PRODUCTS.splice(0, PRODUCTS.length, ...p);
	} catch (e) {}
	try {
		const ng = JSON.parse(localStorage.getItem('smc_ng_codes') || 'null');
		if (ng && ng.length) NG_CODES.splice(0, NG_CODES.length, ...ng);
	} catch (e) {}
	try {
		issues = JSON.parse(localStorage.getItem('smc_issues') || '[]');
	} catch (e) {}
	try {
		violations = JSON.parse(localStorage.getItem('smc_viol') || '[]');
	} catch (e) {}
	try {
		incidents = JSON.parse(localStorage.getItem('smc_incidents') || '[]');
	} catch (e) {}
	try {
		const r = JSON.parse(localStorage.getItem('smc_reports') || 'null');
		if (r) Object.assign(reportData, r);
	} catch (e) {}
	try {
		const ng2 = JSON.parse(localStorage.getItem('smc_ng') || 'null');
		if (ng2 && ng2.length) ngData = ng2;
	} catch (e) {}
	try {
		customRptTypes = JSON.parse(
			localStorage.getItem('smc_custom_rpt_types') || '[]',
		);
	} catch (e) {}
	for (let i = 0; i < localStorage.length; i++) {
		const k = localStorage.key(i);
		if (k && k.startsWith('smc_plan_'))
			try {
				Object.assign(planData, JSON.parse(localStorage.getItem(k)));
			} catch (e) {}
	}
	/* Restore ctrl sliders */
	try {
		const c = JSON.parse(localStorage.getItem('smc_ctrl') || 'null');
		if (c) {
			const sa = document.getElementById('s_avail');
			if (sa) {
				sa.value = c.avail;
				document.getElementById('v_avail').textContent = c.avail;
			}
			const su = document.getElementById('s_util');
			if (su) {
				su.value = c.util;
				document.getElementById('v_util').textContent = c.util;
			}
			const sc = document.getElementById('s_ca');
			if (sc) {
				sc.value = c.ca;
				document.getElementById('v_ca').textContent = c.ca;
			}
		}
	} catch (e) {}
	/* Restore PROCS */
	try {
		const pr = JSON.parse(localStorage.getItem('smc_procs') || 'null');
		if (pr && pr.length)
			pr.forEach((p, i) => {
				if (PROCS[i]) {
					PROCS[i].ct = +p.ct || PROCS[i].ct;
					PROCS[i].ct_set = +p.ct_set || PROCS[i].ct_set;
					PROCS[i].sta = +p.sta || PROCS[i].sta;
					PROCS[i].batch = +p.batch || PROCS[i].batch;
					PROCS[i].move = +p.move || 0;
				}
			});
	} catch (e) {}
	/* PHASE 2: Gọi API sau khi localStorage load xong
     Ưu tiên: DB > localStorage
     SQL đọc: t_plan_actual, m_production_numbers, m_staff */
	const _mo =
		document.getElementById('plan_month')?.value ||
		new Date().toISOString().slice(0, 7);
	Promise.all([
		apiLoadProducts(), // GET m_production_numbers → replace PRODUCTS[]
		apiLoadWorkers(), // GET m_staff → replace WORKERS[]
		apiLoadPlanActual(_mo), // GET t_plan_actual → merge planData
	]).then(([prodOk, workOk, planOk]) => {
		if (planOk) {
			buildPlanTable();
			renderOverview();
			buildHeatmap();
		}
		if (prodOk || workOk) {
			renderOverview();
		}
		if (prodOk) {
			initSelects();
		}
		if (workOk) {
			buildWorkerCards();
		}
	});
}
function downloadHTML() {
	/* Save everything first so export always has latest data */
	saveAll();
	const data = {};
	for (let i = 0; i < localStorage.length; i++) {
		const k = localStorage.key(i);
		if (k && k.startsWith('smc_')) data[k] = localStorage.getItem(k);
	}
	const script = `<script id="__d__">(function(){const d=${JSON.stringify(data)};Object.entries(d).forEach(([k,v])=>localStorage.setItem(k,v));})();<\/script>`;
	let h = document.documentElement.outerHTML;
	h = h.replace(/<script id="__d__">[\s\S]*?<\/script>/, '');
	h = h.replace('</head>', script + '</head>');
	const a = document.createElement('a');
	a.href = 'data:text/html;charset=utf-8,' + encodeURIComponent(h);
	a.download = '生産管理_' + new Date().toISOString().slice(0, 10) + '.html';
	a.click();
}

/* ── UI STATE PERSISTENCE ──────────────────────────────────────────────────
   Lưu mọi preferences của user vào localStorage:
   - Tab đang xem, tháng đang chọn, sort/filter, hide/show table, ngôn ngữ
   ─────────────────────────────────────────────────────────────────────── */
let _uiStateDirty = false;
const UI_STATE_KEY = 'smc_ui_state';

function saveUIState() {
	try {
		const st = {
			/* Active tab */
			tab:
				document.querySelector('.panel.act')?.id?.replace('tab-', '') ||
				'overview',
			/* Plan tab */
			plan_month: document.getElementById('plan_month')?.value,
			plan_series: document.getElementById('plan_series')?.value,
			plan_sku: document.getElementById('plan_sku')?.value,
			plan_sort: document.getElementById('plan_sort')?.value,
			plan_table_hidden:
				document.getElementById('plan_table_body')?.style.display === 'none',
			/* Overview */
			ov_month: document.getElementById('ov_month')?.value,
			ov_filter: document.getElementById('ov_filter')?.value,
			ov_sort: document.getElementById('ov_sort')?.value,
			ov_sku: document.getElementById('ov_sku')?.value,
			/* Language */
			lang: curLang,
			/* Heatmap */
			hm_month: document.getElementById('hm_month')?.value,
			hm_series: document.getElementById('hm_series')?.value,
			/* Compare */
			cmp_months: cmpMonths,
			cmp_view: cmpView,
			/* Capacity */
			cap_series: document.getElementById('cap_series')?.value,
			cap_sku: document.getElementById('cap_sku')?.value,
			/* Worker */
			wk_ca: document.getElementById('wk_ca_filter')?.value,
			/* NG */
			ng_month: document.getElementById('ng_month')?.value,
			/* Saved at */
			_ts: Date.now(),
		};
		localStorage.setItem(UI_STATE_KEY, JSON.stringify(st));
	} catch (e) {}
}

function restoreUIState() {
	try {
		const raw = localStorage.getItem(UI_STATE_KEY);
		if (!raw) return;
		const st = JSON.parse(raw);

		/* Language */
		if (st.lang) setLang(st.lang);

		/* Overview */
		if (st.ov_month) {
			const el = document.getElementById('ov_month');
			if (el) el.value = st.ov_month;
		}
		if (st.ov_filter) {
			const el = document.getElementById('ov_filter');
			if (el) el.value = st.ov_filter;
		}
		if (st.ov_sort) {
			const el = document.getElementById('ov_sort');
			if (el) el.value = st.ov_sort;
		}

		/* Plan */
		if (st.plan_month) {
			const el = document.getElementById('plan_month');
			if (el) el.value = st.plan_month;
		}
		if (st.plan_sort) {
			const el = document.getElementById('plan_sort');
			if (el) el.value = st.plan_sort;
		}
		if (st.plan_series) {
			const el = document.getElementById('plan_series');
			if (el) el.value = st.plan_series;
			/* Rebuild SKU dropdown for this series */
			if (st.plan_series !== 'ALL') planFilterChanged();
		}
		if (st.plan_sku) {
			const el = document.getElementById('plan_sku');
			if (el) {
				el.value = st.plan_sku;
				el.style.display =
					st.plan_series && st.plan_series !== 'ALL' ? '' : 'none';
			}
		}
		if (st.plan_table_hidden) {
			const body = document.getElementById('plan_table_body');
			const btn = document.getElementById('plan_table_toggle');
			if (body) body.style.display = 'none';
			if (btn) btn.textContent = '▼';
		}

		/* Heatmap */
		if (st.hm_month) {
			const el = document.getElementById('hm_month');
			if (el) el.value = st.hm_month;
		}
		if (st.hm_series) {
			const el = document.getElementById('hm_series');
			if (el) el.value = st.hm_series;
		}

		/* Compare */
		if (st.cmp_months && Array.isArray(st.cmp_months))
			cmpMonths = st.cmp_months;
		if (st.cmp_view) cmpView = st.cmp_view;

		/* Capacity */
		if (st.cap_series) {
			const el = document.getElementById('cap_series');
			if (el) el.value = st.cap_series;
		}

		/* NG */
		if (st.ng_month) {
			const el = document.getElementById('ng_month');
			if (el) el.value = st.ng_month;
		}

		/* Restore active tab LAST */
		if (st.tab && st.tab !== 'overview') {
			const btn = document.querySelector(`.tab[onclick*="goTab('${st.tab}'"]`);
			if (btn) setTimeout(() => goTab(st.tab, btn), 200);
		} else {
			renderOverview();
			buildStaffSummary();
		}
	} catch (e) {
		console.warn('restoreUIState error', e);
	}
}

function exportJSON() {
	saveAll();
	const data = {};
	for (let i = 0; i < localStorage.length; i++) {
		const k = localStorage.key(i);
		if (k && k.startsWith('smc_')) data[k] = localStorage.getItem(k);
	}
	const meta = {
		_version: 'v7',
		_exported: new Date().toISOString(),
		_keys: Object.keys(data).length,
	};
	const out = JSON.stringify({ meta, data }, null, 2);
	const a = document.createElement('a');
	a.href = 'data:application/json;charset=utf-8,' + encodeURIComponent(out);
	a.download = 'smc_backup_' + new Date().toISOString().slice(0, 10) + '.json';
	a.click();
	setTimeout(
		() =>
			alert(
				'✅ Đã export ' +
					meta._keys +
					' keys.\nDùng file này để import vào version mới mà không mất data.',
			),
		100,
	);
}
function importJSON(input) {
	const file = input.files[0];
	if (!file) return;
	const reader = new FileReader();
	reader.onload = (e) => {
		try {
			const parsed = JSON.parse(e.target.result);
			/* Support both {meta,data} format and flat {smc_xxx:...} format */
			const src = parsed.data || parsed;
			const keys = Object.keys(src).filter((k) => k.startsWith('smc_'));
			if (!keys.length) {
				alert('❌ File JSON không hợp lệ hoặc không có data smc_.');
				input.value = '';
				return;
			}
			const overwrite = confirm(
				`📂 Tìm thấy ${keys.length} keys trong file:\n` +
					keys.slice(0, 8).join(', ') +
					(keys.length > 8 ? `\n...và ${keys.length - 8} keys khác` : '') +
					'\n\n⚠️ Import sẽ GHI ĐÈ data hiện tại.\nBạn có muốn tiếp tục không?',
			);
			if (!overwrite) {
				input.value = '';
				return;
			}
			keys.forEach((k) => localStorage.setItem(k, src[k]));
			loadAll();
			refreshActiveTab();
			alert(
				'✅ Import thành công ' +
					keys.length +
					' keys!\nData đã được nạp vào dashboard.',
			);
		} catch (err) {
			alert('❌ Lỗi đọc file JSON:\n' + err.message);
		}
		input.value = '';
	};
	reader.readAsText(file);
}
/* ── end A3 ── */

/* ── A4: Global card collapse toggle ── */
function togglePlanTable(header) {
	const body = document.getElementById('plan_table_body');
	const btn = document.getElementById('plan_table_toggle');
	if (!body) return;
	const hidden = body.style.display === 'none';
	body.style.display = hidden ? '' : 'none';
	if (btn) btn.textContent = hidden ? '▲' : '▼';
	if (hidden) {
		setTimeout(() => updatePlanCharts(), 100);
	}
	saveUIState();
}

function toggleCard(btn) {
	const card = btn.closest('.card');
	if (!card) return;
	/* Find all direct children after ct */
	const ct = card.querySelector('.ct');
	if (!ct) return;
	let next = ct.nextElementSibling;
	const collapsed = btn.getAttribute('data-collapsed') === '1';
	while (next) {
		next.style.display = collapsed ? '' : ' none';
		next = next.nextElementSibling;
	}
	btn.setAttribute('data-collapsed', collapsed ? '0' : '1');
	btn.style.transform = collapsed ? '' : 'rotate(-90deg)';
	btn.title = collapsed ? 'Thu gọn' : 'Hiện nội dung';
}
function toggleSection(id, btn) {
	const el = document.getElementById(id);
	if (!el) return;
	const hidden = el.style.display === 'none';
	el.style.display = hidden ? '' : 'none';
	if (btn) {
		btn.textContent = hidden ? '▲ Ẩn' : '▼ Hiện';
	}
}
/* Init collapse buttons for all cards */
function initCardToggles() {
	document.querySelectorAll('.card').forEach((card) => {
		const ct = card.querySelector('.ct');
		if (!ct || ct.querySelector('.card-toggle')) return;
		if (card.querySelector('.plan-scroll')) return; /* skip plan table */
		const btn = document.createElement('button');
		btn.className = 'card-toggle';
		btn.innerHTML = '&#9660;';
		btn.title = 'Thu gọn';
		btn.setAttribute('data-collapsed', '0');
		btn.style.cssText =
			'background:none;border:none;cursor:pointer;color:var(--t3);font-size:10px;padding:0 0 0 6px;flex-shrink:0;transition:transform .2s;line-height:1';
		btn.onclick = (e) => {
			e.stopPropagation();
			toggleCard(btn);
		};
		ct.appendChild(btn);
	});
}

/* ── Custom report types ── */
let customRptTypes = [];
function loadCustomRptTypes() {
	try {
		customRptTypes = JSON.parse(
			localStorage.getItem('smc_custom_rpt_types') || '[]',
		);
	} catch (e) {}
	renderCustomRptTypes();
}
function renderCustomRptTypes() {
	const el = document.getElementById('custom_rpt_types');
	if (!el) return;
	if (!customRptTypes.length) {
		el.innerHTML = '';
		return;
	}
	el.innerHTML = customRptTypes
		.map(
			(t, i) => `
    <div style="display:flex;gap:4px;align-items:center">
      <button class="btn" onclick="selectReport('custom_${i}')" style="text-align:left;padding:8px 12px;flex:1">${t.icon || '📋'} ${t.label}</button>
      ${editMode ? `<button class="btn sm red" onclick="deleteCustomRptType(${i})">✕</button>` : ''}
    </div>`,
		)
		.join('');
	customRptTypes.forEach((t, i) => {
		REPORT_CFG['custom_' + i] = {
			label: (t.icon || '📋') + ' ' + t.label,
			color: t.color || '#6b7280',
			sections: [
				{ id: 'body', l: '【内容】Nội dung', r: 8 },
				{ id: 'conc', l: '【結論】Kết luận', r: 4 },
			],
		};
	});
}
function addCustomReportType() {
	const label = prompt('Tên hạng mục báo cáo mới:');
	if (!label?.trim()) return;
	const icon = prompt('Icon emoji (vd: 📊 🔧 📝):', '📋') || '📋';
	customRptTypes.push({
		label: label.trim(),
		icon: icon.trim(),
		color: '#0891b2',
	});
	localStorage.setItem('smc_custom_rpt_types', JSON.stringify(customRptTypes));
	renderCustomRptTypes();
}
function deleteCustomRptType(i) {
	if (!confirm('Xóa hạng mục này?')) return;
	customRptTypes.splice(i, 1);
	localStorage.setItem('smc_custom_rpt_types', JSON.stringify(customRptTypes));
	renderCustomRptTypes();
}

