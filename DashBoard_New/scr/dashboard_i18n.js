/* ════════════════════════════════════════════════════════════════════
   dashboard_i18n.js  —  (file 14/15 — load order #14)
   ------------------------------------------------------------------
   ĐA NGÔN NGỮ (VN/JP/EN) + 2 handler lẻ của tab Capacity
    - I18N{}, curLang, setLang(), _rebuildI18nSelects()
    - capFilterChanged()/capSkuChanged() (đặt cạnh đây do thứ tự gốc trong file, dùng cho tab ⚙ Năng lực)
    Cần: dashboard_core.js, dashboard_capacity.js
   ════════════════════════════════════════════════════════════════════ */

/* LANGUAGE */
/* ══════════════════════════════════════════════════════════════
   A2 — I18N ENGINE  (data-i18n attribute system)
   ══════════════════════════════════════════════════════════════ */
const I18N = {
	vi: {
		/* Tabs */
		overview: '📊 Tổng quan',
		plan: '📅 Kế hoạch',
		ctsx: '📦 CTSX',
		pulse: '⚡ Cycle/Pulse',
		heatmap: '🟩 Heatmap',
		compare: '📊 So sánh',
		ca3: '🔄 Ca sản xuất',
		worker:
			'👷 Thông tin<br><span style="margin-left:15px;display:inline-block">nhân sự</span>',
		quality: '❌ Tổng hợp lỗi:NG/QC',
		incident: '🔧Bảo trì/Sửa chữa',
		reports: '📋 Báo cáo',
		capacity: '⚙ Năng lực thiết bị',
		help: '❓Hướng dẫn',
		/* Header */
		btn_edit: '✏️ Edit Mode',
		btn_save_all: '💾 Save All',
		btn_templates: '📄 Templates',
		btn_export_html: '📦 Export HTML',
		btn_export_json: '💾 Export JSON',
		btn_import_json: '📂 Import JSON',
		lbl_shift_params: 'Thông số ca',
		lbl_avail: 'Làm việc',
		lbl_util: 'Utilization',
		lbl_ca: 'Ca/ngày',
		lbl_ca_unit: 'ca',
		/* Overview */
		ct_tiendo: 'Tiến độ tháng',
		ct_titrongsl: 'Tỉ trọng sản lượng',
		ct_luyk: 'Lũy kế tháng',
		ct_staff: '👷 Nhân sự hôm nay',
		ct_oee: 'OEE + Giờ công',
		ct_issues: 'Sự kiện / Vấn đề',
		ct_ng_summary: '⚠ NG Summary',
		/* Capacity */
		ct_ct_settings: 'CT Settings',
		ct_cascade: 'Output Cascade (Completed / WIP / Idle)',
		ct_cap_kotei: 'Capacity per kotei',
		/* Filters */
		opt_all: 'Tất cả',
		opt_all_sku: 'Mọi mã',
		lbl_view: 'Xem theo:',
		sort_series: 'Nhóm Series',
		sort_pct_desc: '% Đạt (cao→thấp)',
		sort_pct_asc: '% Đạt (thấp→cao)',
		sort_tt_desc: 'TT cao nhất',
		sort_kh_desc: 'KH cao nhất',
		sort_code: 'Mã SP (A-Z)',
		/* Table headers */
		th_kotei: 'Công đoạn',
		th_may: 'Máy',
		th_status: 'Trạng thái',
		th_note: 'Ghi chú',
		/* Edit bar */
		eb_editing: '✏️ Đang chỉnh sửa —',
		eb_save: '💾 Lưu & Thoát',
		eb_cancel: '✕ Hủy',
		/* Plan tab */
		plan_all_series: 'Tất cả series',
		plan_save: '💾 Lưu KH/TT',
		plan_export: '📊 Export XLSX',
		plan_import: '📂 Import CSV',
		plan_tpl: '📄 Template',
		plan_set_kh: '🔢 Set KH',
		plan_bulk_tt: '✏️ Nhập TT loạt',
		plan_history: '📚 Lịch sử',
		plan_summary: '📊 Tóm tắt',
		plan_add_sku: '➕ Thêm mã',
		plan_clear: '🗑 Xóa tháng',
		plan_chart_title: 'KH vs TT theo ngày',
		plan_cum_title: 'Lũy kế',
		/* Worker */
		ct_worker_cards: 'Danh sách nhân viên',
		ct_attend: 'Ngày nghỉ trong tháng',
		ct_kotei_assign: 'Phân bổ theo công đoạn SX',
		ct_skill_matrix: 'Skill Matrix',
		ct_violations: 'Vi phạm',
		btn_add_worker: '➕ Thêm nhân viên',
		/* NG */
		ct_ng_input: 'Nhập NG',
		ct_ng_trend: 'Xu hướng NG',
		ct_ng_pareto: 'Pareto nguyên nhân',
		ct_ng_series: 'Phân bổ theo Series',
		ct_ng_sku: 'Theo mã SP',
		ct_ng_codes: 'Bảng mã lỗi',
		/* Incident */
		ct_incidents: 'Equipment Incident Reports',
		btn_inc_new: '+ Báo cáo mới',
		/* Reports */
		ct_rpt_types: 'Loại báo cáo',
		/* Compare */
		ct_compare: 'So sánh đa tháng',
		lbl_add_month: 'Chọn tháng (tối đa 6):',
		btn_add_month: '+ Thêm',
		btn_clear_months: '✕ Xóa hết',
		/* Ca */
		ct_ca_settings: 'Cài đặt ca làm việc',
		ct_ca_actual: 'Thực tích theo ca',
		/* Help */
		ct_help: 'Hướng dẫn sử dụng',
		help_shortcuts: 'Phím tắt',
		help_data: 'Cách lưu & chia sẻ data',
		help_workflow: 'Workflow hàng ngày',
		th_sku: 'Mã SP',
		th_series: 'S',
		th_kh_day: 'KH/日',
		th_sum_kh: 'Σ KH',
		th_sum_tt: 'Σ TT',
		th_pct: '%',
	},
	jp: {
		overview: '📊 概要',
		plan: '📅 計画実績',
		ctsx: '📦 CTSX',
		pulse: '⚡ サイクル',
		heatmap: '🟩 ヒートマップ',
		compare: '📊 月次比較',
		ca3: '🔄 シフト',
		worker: '👷 人員',
		quality: '❌ NG品質',
		incident: '🔧 設備不具合',
		reports: '📋 報告書',
		capacity: '⚙ 能力分析',
		help: '❓ ガイド',
		btn_edit: '✏️ 編集モード',
		btn_save_all: '💾 全保存',
		btn_templates: '📄 テンプレ',
		btn_export_html: '📦 HTMLエクスポート',
		btn_export_json: '💾 JSONエクスポート',
		btn_import_json: '📂 JSONインポート',
		lbl_shift_params: 'シフト設定',
		lbl_avail: '稼働時間',
		lbl_util: '稼働率',
		lbl_ca: 'シフト数/日',
		lbl_ca_unit: 'シフト',
		ct_tiendo: '月次進捗',
		ct_titrongsl: '生産量比率',
		ct_luyk: '月次累計',
		ct_staff: '👷 本日人員',
		ct_oee: 'OEE + 工数',
		ct_issues: '事象 / 問題',
		ct_ng_summary: '⚠ NG サマリ',
		ct_ct_settings: 'CT設定',
		ct_cascade: '出力カスケード',
		ct_cap_kotei: '工程別能力',
		opt_all: '全て',
		opt_all_sku: '全品番',
		lbl_view: '表示:',
		sort_series: 'シリーズ別',
		sort_pct_desc: '達成率 (高→低)',
		sort_pct_asc: '達成率 (低→高)',
		sort_tt_desc: '実績 (多→少)',
		sort_kh_desc: '計画 (多→少)',
		sort_code: '品番 (A-Z)',
		th_kotei: '工程',
		th_may: '設備台数',
		th_status: 'ステータス',
		th_note: '備考',
		eb_editing: '✏️ 編集中 —',
		eb_save: '💾 保存して終了',
		eb_cancel: '✕ キャンセル',
		plan_all_series: '全シリーズ',
		plan_save: '💾 計画/実績保存',
		plan_export: '📊 Excelエクスポート',
		plan_import: '📂 CSVインポート',
		plan_tpl: '📄 テンプレート',
		plan_set_kh: '🔢 計画設定',
		plan_bulk_tt: '✏️ 実績一括',
		plan_history: '📚 履歴',
		plan_summary: '📊 集計',
		plan_add_sku: '➕ 品番追加',
		plan_clear: '🗑 月データ削除',
		plan_chart_title: '計画 vs 実績/日',
		plan_cum_title: '累計',
		ct_worker_cards: '作業者一覧',
		ct_attend: '休暇カレンダー',
		ct_kotei_assign: '工程配置',
		ct_skill_matrix: 'スキルマトリクス',
		ct_violations: '違反記録',
		btn_add_worker: '➕ 追加',
		ct_ng_input: 'NG入力',
		ct_ng_trend: 'NG推移',
		ct_ng_pareto: 'NG原因パレート',
		ct_ng_series: 'シリーズ別NG',
		ct_ng_sku: '品番別NG',
		ct_ng_codes: 'NG코드表',
		ct_incidents: '設備不具合報告',
		btn_inc_new: '+ 新規報告',
		ct_rpt_types: 'レポート種別',
		ct_compare: '月次比較',
		lbl_add_month: '比較月 (最大6ヶ月):',
		btn_add_month: '+ 追加',
		btn_clear_months: '✕ 全削除',
		ct_ca_settings: 'シフト設定',
		ct_ca_actual: 'シフト実績',
		ct_help: '使用ガイド',
		help_shortcuts: 'ショートカット',
		help_data: 'データ保存・共有方法',
		help_workflow: '日次作業フロー',
		th_sku: '品番',
		th_series: 'S',
		th_kh_day: '計画/日',
		th_sum_kh: '計画合計',
		th_sum_tt: '実績合計',
		th_pct: '達成率',
	},
	en: {
		overview: '📊 Overview',
		plan: '📅 Schedule',
		ctsx: '📦 CTSX',
		pulse: '⚡ Cycle/Pulse',
		heatmap: '🟩 Heatmap',
		compare: '📊 Compare',
		ca3: '🔄 Shifts',
		worker: '👷 Workers',
		quality: '❌ NG/Quality',
		incident: '🔧 Equipment',
		reports: '📋 Reports',
		capacity: '⚙ Capacity',
		help: '❓ Guide',
		btn_edit: '✏️ Edit Mode',
		btn_save_all: '💾 Save All',
		btn_templates: '📄 Templates',
		btn_export_html: '📦 Export HTML',
		btn_export_json: '💾 Export JSON',
		btn_import_json: '📂 Import JSON',
		lbl_shift_params: 'Shift Parameters',
		lbl_avail: 'Working Time',
		lbl_util: 'Utilization',
		lbl_ca: 'Shifts/Day',
		lbl_ca_unit: 'shifts',
		ct_tiendo: 'Monthly Progress',
		ct_titrongsl: 'Output Distribution',
		ct_luyk: 'Monthly Cumulative',
		ct_staff: '👷 Staff Today',
		ct_oee: 'OEE + Man-hours',
		ct_issues: 'Events / Issues',
		ct_ng_summary: '⚠ NG Summary',
		ct_ct_settings: 'CT Settings',
		ct_cascade: 'Output Cascade (Done / WIP / Idle)',
		ct_cap_kotei: 'Capacity per Process',
		opt_all: 'All',
		opt_all_sku: 'All SKUs',
		lbl_view: 'View by:',
		sort_series: 'Group by Series',
		sort_pct_desc: '% Achievement (Hi→Lo)',
		sort_pct_asc: '% Achievement (Lo→Hi)',
		sort_tt_desc: 'Actual (Most)',
		sort_kh_desc: 'Plan (Most)',
		sort_code: 'SKU (A-Z)',
		th_kotei: 'Process',
		th_may: 'Machines',
		th_status: 'Status',
		th_note: 'Notes',
		eb_editing: '✏️ Editing —',
		eb_save: '💾 Save & Exit',
		eb_cancel: '✕ Cancel',
		plan_all_series: 'All series',
		plan_save: '💾 Save Plan/Actual',
		plan_export: '📊 Export XLSX',
		plan_import: '📂 Import CSV',
		plan_tpl: '📄 Template',
		plan_set_kh: '🔢 Set Plan',
		plan_bulk_tt: '✏️ Bulk Actual',
		plan_history: '📚 History',
		plan_summary: '📊 Summary',
		plan_add_sku: '➕ Add SKU',
		plan_clear: '🗑 Clear Month',
		plan_chart_title: 'Plan vs Actual/Day',
		plan_cum_title: 'Cumulative',
		ct_worker_cards: 'Worker List',
		ct_attend: 'Attendance Calendar',
		ct_kotei_assign: 'Kotei Assignment',
		ct_skill_matrix: 'Skill Matrix',
		ct_violations: 'Violations',
		btn_add_worker: '➕ Add Worker',
		ct_ng_input: 'NG Entry',
		ct_ng_trend: 'NG Trend',
		ct_ng_pareto: 'NG Cause Pareto',
		ct_ng_series: 'NG by Series',
		ct_ng_sku: 'NG per SKU',
		ct_ng_codes: 'NG Code Table',
		ct_incidents: 'Equipment Incident Reports',
		btn_inc_new: '+ New Report',
		ct_rpt_types: 'Report Types',
		ct_compare: 'Multi-month Compare',
		lbl_add_month: 'Months to Compare (max 6):',
		btn_add_month: '+ Add',
		btn_clear_months: '✕ Clear',
		ct_ca_settings: 'Shift Settings',
		ct_ca_actual: 'Shift Actuals',
		ct_help: 'User Guide',
		help_shortcuts: 'Shortcuts',
		help_data: 'Data Save & Share',
		help_workflow: 'Daily Workflow',
		th_sku: 'Products ID',
		th_series: 'S',
		th_kh_day: 'Quantity/day',
		th_sum_kh: 'Σ Plan',
		th_sum_tt: 'Σ Atual',
		th_pct: 'Rate%',
	},
};
let curLang = localStorage.getItem('smc_lang') || 'vi';

function setLang(lang) {
	curLang = lang;
	localStorage.setItem('smc_lang', lang);
	const L = I18N[lang] || I18N.vi;
	/* 1. Apply data-i18n attributes */
	document.querySelectorAll('[data-i18n]').forEach((el) => {
		const k = el.getAttribute('data-i18n');
		if (L[k] !== undefined) el.textContent = L[k];
	});
	/* 2. Tab labels — đọc tên tab TRỰC TIẾP từ onclick="goTab('xxx', this)" của từng nút,
	   KHÔNG dùng mảng cứng theo vị trí nữa (mảng cứng dễ lệch index mỗi khi thêm/xóa/đổi
	   thứ tự tab — đã từng gây bug nhãn bị xô lệch khi thêm tab CTSX, sửa tận gốc ở đây). */
	document.querySelectorAll('.tab').forEach((btn) => {
		const m = (btn.getAttribute('onclick') || '').match(/goTab\('([^']+)'/);
		const name = m && m[1];
		if (name && L[name]) btn.innerHTML = L[name];
	});
	/* 3. Lang button highlight - new compact toggle style */
	['vi', 'jp', 'en'].forEach((l) => {
		const b = document.getElementById('lang_' + l);
		if (b) {
			b.className = l === lang ? 'lang-btn act' : 'lang-btn';
		}
	});
	/* 4. Edit bar buttons */
	const eb = document.querySelector('.edit-bar');
	if (eb) {
		const spans = eb.querySelectorAll('span');
		if (spans[0]) spans[0].textContent = L.eb_editing || '✏️ Editing —';
		const btns = eb.querySelectorAll('button');
		if (btns[0]) btns[0].textContent = L.eb_save || '💾 Save & Exit';
		if (btns[1]) btns[1].textContent = L.eb_cancel || '✕ Cancel';
	}
	/* 5. Rebuild selects that have data-i18n options */
	_rebuildI18nSelects(L);
	buildHelpTab();
	buildPlanTable();
}

function _rebuildI18nSelects(L) {
	/* Rebuild sort select options */
	const sortMap = [
		['series', 'sort_series'],
		['pct_desc', 'sort_pct_desc'],
		['pct_asc', 'sort_pct_asc'],
		['tt_desc', 'sort_tt_desc'],
		['kh_desc', 'sort_kh_desc'],
		['code', 'sort_code'],
	];
	['ov_sort', 'plan_sort'].forEach((id) => {
		const sel = document.getElementById(id);
		if (!sel) return;
		const cur = sel.value;
		sel.querySelectorAll('option').forEach((opt) => {
			const hit = sortMap.find(([v]) => v === opt.value);
			if (hit && L[hit[1]]) opt.textContent = L[hit[1]];
		});
		sel.value = cur;
	});
	/* Rebuild "Tất cả series" in plan_series */
	const ps = document.getElementById('plan_series');
	if (ps) {
		const first = ps.querySelector('option[value="ALL"]');
		if (first) first.textContent = L.plan_all_series || 'All series';
	}
}

/* ── A1: Capacity tab filter ── */
function capFilterChanged() {
	const ser = document.getElementById('cap_series')?.value || 'ALL';
	const skuSel = document.getElementById('cap_sku');
	const noteEl = document.getElementById('cap_sku_ct_note');
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
	capSkuChanged();
}
function capSkuChanged() {
	const ser = document.getElementById('cap_series')?.value || 'ALL';
	const sku = document.getElementById('cap_sku')?.value || 'ALL';
	/* Pick representative SKU for cascade calc */
	let refSku = 'MB63TD';
	if (sku !== 'ALL') refSku = sku;
	else if (ser !== 'ALL') {
		const first = PRODUCTS.find((p) => p.s === ser);
		if (first) refSku = first.code;
	}
	const noteEl = document.getElementById('cap_sku_ct_note');
	if (noteEl) noteEl.textContent = `CT ref: ${refSku}`;
	/* Rebuild capacity display with new ref SKU */
	const { res: caps, sys } = cascade(refSku);
	buildProcTable(caps, sys);
	buildSOBBars(caps, sys);
	buildCapCharts(refSku);
}
/* Update buildCapCharts to accept optional sku param — done above */

