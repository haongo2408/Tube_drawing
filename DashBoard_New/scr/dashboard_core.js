/* ════════════════════════════════════════════════════════════════════
   dashboard_core.js  —  (file 1/15 — load order #1)
   ------------------------------------------------------------------
   STATE TOÀN CỤC + HELPERS + EDIT MODE + SAVE/LOAD CƠ BẢN
    - Biến global: PROCS, PRODUCTS, WORKERS, NG_CODES, REPORT_CFG, SM, PC, KOTEI,
      RANKS, CA_LIST, RANK_LABEL, NG_CAUSES, planData, caActual, charts, _planLoadedMonths...
    - Helpers: gA/gU/gE/gBN/gCtAdj/gMv/isWE/todayObj/closeModal/openModal/flashSave/cascade()
    - enterEdit()/exitEdit()/confirmSave() — khóa View/Edit mode
    - saveAll()/savePlan()
    ⚠ PHẢI load ĐẦU TIÊN — mọi file khác đều dùng biến/hàm ở đây.
   ════════════════════════════════════════════════════════════════════ */

/* ================================================================
   生産管理 v7 — CLEAN BUILD — one definition per function
   ================================================================ */
let PROCS = [
	{
		name: '先付 Bóp đầu',
		ct: 35,
		ct_set: 30,
		sta: 1,
		batch: 1,
		move: 0,
		color: '#1e5fa8',
		note: 'Bóp đầu → khuôn kéo',
	},
	{
		name: '引抜 Kéo',
		ct: 60,
		ct_set: 54,
		sta: 3,
		batch: 1,
		move: 0,
		color: '#dc2626',
		note: 'BN — 3台 song song',
	},
	{
		name: '切断 Cắt',
		ct: 44,
		ct_set: 45,
		sta: 1,
		batch: 4,
		move: 0,
		color: '#ea580c',
		note: 'Batch=4, cần 2台 vs 引抜×3',
	},
	{
		name: '矯正 Nắn',
		ct: 30,
		ct_set: 30,
		sta: 1,
		batch: 1,
		move: 0,
		color: '#16a34a',
		note: 'Đo và nắn thẳng',
	},
	{
		name: '洗浄 Rửa',
		ct: 30,
		ct_set: 30,
		sta: 1,
		batch: 12,
		move: 0,
		color: '#7c3aed',
		note: 'Batch=12, WIP cuối ca',
	},
];
let PRODUCTS = [
	{ code: 'MB32TD', s: 'MB', od: 36, id: 32.1, ctF: 0.9 },
	{ code: 'MB40TD', s: 'MB', od: 45, id: 40.1, ctF: 0.93 },
	{ code: 'MB50TD', s: 'MB', od: 55.05, id: 50.1, ctF: 0.97 },
	{ code: 'MB63TD', s: 'MB', od: 68.05, id: 63.11, ctF: 1.0 },
	{ code: 'MB80TD', s: 'MB', od: 86.06, id: 80.14, ctF: 1.08 },
	{ code: 'MBA0TD', s: 'MB', od: 107.06, id: 100.16, ctF: 1.18 },
	{ code: 'NCA38TD', s: 'NCA', od: 43, id: 38.17, ctF: 0.91 },
	{ code: 'NCA51TD', s: 'NCA', od: 55.7, id: 50.89, ctF: 0.96 },
	{ code: 'NCA64TD', s: 'NCA', od: 68.4, id: 63.65, ctF: 1.0 },
	{ code: 'NCA83TD', s: 'NCA', od: 89, id: 82.7, ctF: 1.1 },
	{ code: 'NCAA0TD', s: 'NCA', od: 108, id: 101.73, ctF: 1.2 },
	{ code: 'CG20TD', s: 'CG', od: 20.08, id: 2.91, ctF: 0.82 },
	{ code: 'CG25TD', s: 'CG', od: 25.08, id: 2.91, ctF: 0.84 },
	{ code: 'CG32TD', s: 'CG', od: 32.09, id: 2.93, ctF: 0.88 },
	{ code: 'CG40TD', s: 'CG', od: 40.09, id: 3.405, ctF: 0.92 },
	{ code: 'CG50TD', s: 'CG', od: 50.1, id: 3.9, ctF: 0.96 },
	{ code: 'CG63TD', s: 'CG', od: 63.12, id: 4.39, ctF: 1.01 },
	{ code: 'CG80TD', s: 'CG', od: 80.15, id: 4.375, ctF: 1.08 },
	{ code: 'CGA0TD', s: 'CG', od: 100.16, id: 4.87, ctF: 1.16 },
];
let WORKERS = [
	{
		id: 'W01',
		name: 'Lê Vẵn Dũng',
		rank: 'W3',
		main: '引抜',
		sub: '先付',
		assign: 'MB63TD,MB80TD',
		skill: 4,
		ca: 'Ca1',
		leave: 0,
		leaveNote: '',
		perf: 95,
		qual: 98,
		phone: '',
		note: '',
		title: 'Công nhân Kéo',
		achievements: 'Đạt target 400pcs/ngày liên tục 3 tháng',
		improvements: 'Cải tiến fixture khuôn kéo',
		promotionDate: '2025-01',
	},
	{
		id: 'W02',
		name: 'Trương Công An',
		rank: 'W2',
		main: '引抜',
		sub: '切断',
		assign: 'NCA64TD',
		skill: 4,
		ca: 'Ca1',
		leave: 0,
		leaveNote: '',
		perf: 93,
		qual: 97,
		phone: '',
		note: '',
		title: 'Công nhân Kéo',
		achievements: '',
		improvements: '',
		promotionDate: '2024-06',
	},
	{
		id: 'W03',
		name: 'Lê C',
		rank: 'W2',
		main: '引抜',
		sub: '矯正',
		assign: '',
		skill: 3,
		ca: 'Ca1',
		leave: 1,
		leaveNote: 'Nghỉ phép năm',
		perf: 90,
		qual: 96,
		phone: '',
		note: '',
		title: 'Công nhân Kéo',
		achievements: '',
		improvements: '',
		promotionDate: '',
	},
	{
		id: 'W04',
		name: 'Phạm D',
		rank: 'W2',
		main: '先付',
		sub: '切断',
		assign: 'MB32TD,MB40TD',
		skill: 3,
		ca: 'Ca2',
		leave: 0,
		leaveNote: '',
		perf: 88,
		qual: 95,
		phone: '',
		note: '',
		title: 'Công nhân Bóp đầu',
		achievements: '',
		improvements: '',
		promotionDate: '',
	},
	{
		id: 'W05',
		name: 'Hoàng E',
		rank: 'W2',
		main: '切断',
		sub: '洗浄',
		assign: 'CG series',
		skill: 3,
		ca: 'Ca2',
		leave: 2,
		leaveNote: 'Nghỉ ốm',
		perf: 85,
		qual: 94,
		phone: '',
		note: '',
		title: 'Công nhân Cắt',
		achievements: '',
		improvements: '',
		promotionDate: '',
	},
	{
		id: 'W06',
		name: 'Vũ F',
		rank: 'W1',
		main: '矯正',
		sub: '引抜',
		assign: '',
		skill: 2,
		ca: 'Ca2',
		leave: 0,
		leaveNote: '',
		perf: 80,
		qual: 93,
		phone: '',
		note: '',
		title: 'Công nhân Nắn thẳng',
		achievements: '',
		improvements: '',
		promotionDate: '',
	},
	{
		id: 'W07',
		name: 'Đặng G',
		rank: 'W1',
		main: '洗浄',
		sub: '矯正',
		assign: '',
		skill: 2,
		ca: 'Ca1/Ca2',
		leave: 3,
		leaveNote: 'Nghỉ không lương',
		perf: 78,
		qual: 92,
		phone: '',
		note: '',
		title: 'Công nhân Rửa',
		achievements: '',
		improvements: '',
		promotionDate: '',
	},
	{
		id: 'S01',
		name: 'Nguyễn H.Đăng',
		rank: 'S3',
		main: '引抜',
		sub: '先付',
		assign: 'All',
		skill: 4,
		ca: 'Ca Hành chính',
		leave: 0,
		leaveNote: '',
		perf: 98,
		qual: 99,
		phone: '',
		note: '',
		title: 'Production Manager',
		achievements: 'Thiết kế hệ thống dashboard v7',
		improvements: 'Tối ưu CT kéo -8%',
		promotionDate: '2023-04',
	},
	{
		id: 'S02',
		name: 'Kỹ sư B',
		rank: 'S2',
		main: '矯正',
		sub: '切断',
		assign: 'All',
		skill: 3,
		ca: 'Ca Hành chính',
		leave: 0,
		leaveNote: '',
		perf: 92,
		qual: 97,
		phone: '',
		note: '',
		title: 'Production Technologist',
		achievements: '',
		improvements: '',
		promotionDate: '2024-01',
	},
];
let NG_CODES = [
	{ code: 301, vn: 'Lỗi tạo hình', jp: '成形不良', cn: '成形不良' },
	{
		code: 302,
		vn: 'Lỗi dấu khuôn (diemark)',
		jp: 'ダイスマーク不良',
		cn: '表面模具伤不良',
	},
	{
		code: 303,
		vn: 'Lỗi mặt trong bóng khí',
		jp: 'エアー巻込不良（内）',
		cn: '内壁气泡不良',
	},
	{ code: 304, vn: 'Lỗi trầy xước', jp: '搬送で付く打痕', cn: '碰碰伤不良' },
	{
		code: 305,
		vn: 'Lỗi độ nhám (Rz)',
		jp: '粗さ不良',
		cn: '粗糙度不良 (Rz、Ry)',
	},
	{ code: 306, vn: 'Lỗi độ tròn', jp: '真円度不良', cn: '真圆度不良' },
	{ code: 307, vn: 'Lỗi kích thước', jp: '寸法不良', cn: '尺寸不良' },
	{ code: 308, vn: 'Lỗi độ cong', jp: '曲がり不良', cn: '弯曲度不良' },
	{ code: 309, vn: 'Lỗi độ xoắn', jp: 'ねじれ不良', cn: '扭曲度不良' },
	{ code: 310, vn: 'Lỗi cơ học', jp: '硬度不良', cn: '性能不良' },
	{ code: 311, vn: 'Lỗi ăn mòn', jp: 'エッチング不良', cn: '浸蚀裂纹不良' },
	{ code: 312, vn: 'Lỗi nứt', jp: 'エッチング不良', cn: '裂纹不良' },
	{ code: 313, vn: 'Độ bám dính kém', jp: '粘铝不良', cn: '粘铝不良' },
	{ code: 314, vn: 'Vết sần sùi', jp: '押出振動による不良', cn: '挤压痕不良' },
	{
		code: 315,
		vn: 'Tổn thương mặt trong',
		jp: '内径ダイスマーク',
		cn: '内壁模具伤',
	},
	{ code: 316, vn: 'Rỗ bề mặt', jp: '表面坑', cn: '表面坑' },
	{
		code: 317,
		vn: 'Lỗi mặt ngoài bóng khí',
		jp: 'エアー巻込不良（外）',
		cn: '外壁气泡不良',
	},
	{ code: 318, vn: 'Đen bề mặt', jp: '型材表面黒線', cn: '型材表面黑线' },
	{
		code: 319,
		vn: 'Lỗi ngâm tẩm',
		jp: 'エッチング不良（不純物）',
		cn: '浸卷入良',
	},
	{
		code: 320,
		vn: 'Lỗi vết nứt cạnh',
		jp: 'エッチング不良（溶着ライン）',
		cn: '浸蚀边部裂纹不良',
	},
	{ code: 321, vn: 'Lỗi đường dọc', jp: '線不良', cn: '拉伤不良' },
	{ code: 322, vn: 'Lỗi dính vải nỉ', jp: '布付く', cn: '粘毛毡不良' },
	{
		code: 323,
		vn: 'Lỗi điểm dừng',
		jp: '停止不良（押出機停止）',
		cn: '停机痕不良',
	},
	{ code: 324, vn: 'Lỗi đóng gói', jp: '梱包不良', cn: '卷裂不良' },
	{ code: 351, vn: 'Lỗi khác', jp: '他不良', cn: '其他不良' },
	{ code: 401, vn: 'Lỗi xi mạ', jp: 'アルマイト不良', cn: '' },
];
const REPORT_CFG = {
	air: {
		label: '💨 Giảm áp lực khí',
		color: '#0284c7',
		sections: [
			{ id: 'bg', l: '【背景・目的】Mục đích', r: 4 },
			{ id: 'cur', l: '【現状】Hiện trạng', r: 4 },
			{ id: 'tgt', l: '【目標】Mục tiêu', r: 3 },
			{ id: 'act', l: '【対策】Biện pháp', r: 5 },
			{ id: 'res', l: '【結果】Kết quả', r: 4 },
		],
	},
	kaizen: {
		label: '🔄 Cải tiến 2026',
		color: '#16a34a',
		sections: [
			{ id: 'theme', l: '【テーマ】Chủ đề', r: 2 },
			{ id: 'prob', l: '【問題点】Vấn đề', r: 4 },
			{ id: 'tgt', l: '【目標】KPI', r: 3 },
			{ id: 'anal', l: '【原因分析】5Why/4M', r: 5 },
			{ id: 'act', l: '【対策】PDCA', r: 5 },
			{ id: 'sched', l: '【スケジュール】Lịch', r: 3 },
			{ id: 'res', l: '【効果】Hiệu quả', r: 4 },
		],
	},
	renovation: {
		label: '🏗 Cải tạo / 改修計画',
		color: '#ea580c',
		sections: [
			{ id: 'scope', l: '【範囲】Phạm vi', r: 3 },
			{ id: 'why', l: '【理由】Lý do', r: 3 },
			{ id: 'plan', l: '【計画】Nội dung', r: 5 },
			{ id: 'budget', l: '【予算】Chi phí', r: 3 },
			{ id: 'sched', l: '【工程】Tiến độ', r: 4 },
			{ id: 'risk', l: '【リスク】Rủi ro', r: 3 },
			{ id: 'res', l: '【結果】Kết quả', r: 4 },
		],
	},
	tech: {
		label: '🔬 Báo cáo thí nghiệm',
		color: '#7c3aed',
		sections: [
			{ id: 'obj', l: '【目的】Mục đích', r: 3 },
			{ id: 'spec', l: '【試験仕様】Điều kiện', r: 4 },
			{ id: 'meth', l: '【方法】Phương pháp đo', r: 4 },
			{ id: 'data', l: '【データ】Dữ liệu & kết quả', r: 6 },
			{ id: 'anal', l: '【分析】Phân tích & nhận xét', r: 4 },
			{ id: 'conc', l: '【結論】Kết luận', r: 3 },
			{ id: 'ref', l: '【参考】JIS/ISO/ASTM', r: 2 },
		],
	},
	other: {
		label: '📄 Báo cáo khác',
		color: '#6b7280',
		sections: [
			{ id: 'title2', l: '【件名】Tiêu đề', r: 2 },
			{ id: 'body', l: '【内容】Nội dung', r: 8 },
			{ id: 'conc', l: '【結論】Kết luận', r: 4 },
		],
	},
};
const SM = {
	MB: { c: '#1e5fa8', bg: '#ddeeff' },
	NCA: { c: '#dc2626', bg: '#fef2f2' },
	CG: { c: '#16a34a', bg: '#f0fdf4' },
};
const PC = {
	先付: '#1e5fa8',
	引抜: '#dc2626',
	切断: '#ea580c',
	矯正: '#16a34a',
	洗浄: '#7c3aed',
};
const KOTEI = ['先付', '引抜', '切断', '矯正', '洗浄'];
const RANKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'S1', 'S2', 'S3', 'S4', 'S5'];
const CA_LIST = ['Ca1', 'Ca2', 'Ca3', 'Ca Hành chính', 'Ca1/Ca2', 'Ca2/Ca3'];
const RANK_LABEL = {
	W1: 'Học việc',
	W2: 'Cơ bản',
	W3: 'Thành thục',
	W4: 'Giỏi',
	W5: 'Chuyên gia',
	S1: 'Kỹ sư Jr',
	S2: 'Kỹ sư',
	S3: 'Kỹ sư Sr',
	S4: 'Chuyên viên',
	S5: 'Chuyên gia KT',
};
const NG_CAUSES = [
	'Khuôn mòn',
	'Dầu bôi trơn',
	'Material NG',
	'Sai setup CT',
	'Di chuyển va đập',
	'Khác',
];

let planData = {},
	ctData = {},
	issues = [],
	violations = [],
	ngData = [],
	incidents = [],
	reportData = {};
let caActual = [
	{ s1: 0, s2: 0, s3: 0, s4: 0, s5: 0 },
	{ s1: 0, s2: 0, s3: 0, s4: 0, s5: 0 },
	{ s1: 0, s2: 0, s3: 0, s4: 0, s5: 0 },
];
let charts = {},
	editMode = false,
	ngPanelOpen = false;
let _planLoadedMonths = {};
let currentIncId = null,
	currentRptType = null,
	currentRptId = null,
	currentWorkerIdx = null;

/* HELPERS */
const gA = () => +document.getElementById('s_avail').value;
const gU = () => +document.getElementById('s_util').value / 100;
const gE = () => gA() * 60 * gU();
const gBN = () =>
	PROCS.reduce(
		(mi, p, i) => (p.ct / p.sta > PROCS[mi].ct / PROCS[mi].sta ? i : mi),
		0,
	);
const gCtAdj = (p, code) => {
	const k = `${code}_${PROCS.indexOf(p)}`;
	const v = ctData[k];
	return v > 0
		? v
		: Math.round(
				p.ct * (PRODUCTS.find((pr) => pr.code === code) || { ctF: 1 }).ctF,
			);
};
const gMv = (p, code) => {
	const k = `move_${code}_${PROCS.indexOf(p)}`;
	return ctData[k] || p.move || 0;
};
const isWE = (yr, m, d) => {
	const w = new Date(yr, m - 1, d).getDay();
	return w === 0 || w === 6;
};
const todayObj = () => {
	const n = new Date();
	return { d: n.getDate(), m: n.getMonth() + 1, y: n.getFullYear() };
};
const closeModal = (id) => {
	const el = document.getElementById(id);
	if (el) el.classList.remove('open');
};
const openModal = (id) => {
	const el = document.getElementById(id);
	if (el) el.classList.add('open');
};
const flashSave = () => {
	const i = document.getElementById('save_ind');
	if (i) {
		i.classList.add('show');
		setTimeout(() => i.classList.remove('show'), 1800);
	}
};

function cascade(code) {
	const prod = PRODUCTS.find((p) => p.code === code) || PRODUCTS[3];
	const eff = gE();
	const res = PROCS.map((p) => {
		const ct = gCtAdj(p, prod.code) + gMv(p, prod.code);
		const raw = Math.round((eff / ct) * p.sta);
		const effective = p.batch > 1 ? Math.floor(raw / p.batch) * p.batch : raw;
		return {
			raw,
			effective,
			wip: raw - effective,
			ctAdj: gCtAdj(p, prod.code),
			mvAdj: gMv(p, prod.code),
		};
	});
	return { res, sys: Math.min(...res.map((r) => r.effective)) };
}

function syncCtrl() {
	['avail', 'util', 'ca'].forEach(
		(k) =>
			(document.getElementById('v_' + k).textContent = document.getElementById(
				's_' + k,
			).value),
	);
	update();
}

/* EDIT MODE */
function enterEdit() {
	editMode = true;
	document.body.classList.add('edit-mode');
	document.getElementById('edit_btn').textContent = '🔒 Đang Edit...';
	['lbl_title', 'lbl_subtitle', 'lbl_dept', 'lbl_unit', 'lbl_pic'].forEach(
		(id) => {
			const el = document.getElementById(id);
			if (el) el.contentEditable = 'true';
		},
	);
	const abtn = document.getElementById('add_worker_btn');
	if (abtn) abtn.style.display = '';
	const incbtn = document.getElementById('inc_new_btn');
	if (incbtn) incbtn.style.display = '';
	const cbtn = document.getElementById('ctsx_add_btn');
	if (cbtn) cbtn.style.display = '';
	document
		.querySelectorAll('.pt-in')
		.forEach((el) => el.removeAttribute('readonly'));
	buildWorkerCards();
	buildCTTable();
	buildAttendTable();
	if (ngPanelOpen) buildNGCodesTable();
}
function exitEdit(save) {
	if (save) saveAll();
	else if (!confirm('Thoát mà không lưu?')) return;
	editMode = false;
	document.body.classList.remove('edit-mode');
	document.getElementById('edit_btn').textContent = '✏️ Edit Mode';
	['lbl_title', 'lbl_subtitle', 'lbl_dept', 'lbl_unit', 'lbl_pic'].forEach(
		(id) => {
			const el = document.getElementById(id);
			if (el) el.contentEditable = 'false';
		},
	);
	const abtn = document.getElementById('add_worker_btn');
	if (abtn) abtn.style.display = 'none';
	const incbtn = document.getElementById('inc_new_btn');
	if (incbtn) incbtn.style.display = 'none';
	const cbtn = document.getElementById('ctsx_add_btn');
	if (cbtn) cbtn.style.display = 'none';
	document
		.querySelectorAll('.pt-in')
		.forEach((el) => el.setAttribute('readonly', ''));
	buildWorkerCards();
	buildCTTable();
	buildAttendTable();
	if (ngPanelOpen) buildNGCodesTable();
}
function confirmSave() {
	exitEdit(true);
}

/* SAVE / LOAD */
function saveAll() {
	/* Save ctrl sliders */
	try {
		const ctrl = {
			avail: document.getElementById('s_avail')?.value || 450,
			util: document.getElementById('s_util')?.value || 89,
			ca: document.getElementById('s_ca')?.value || 2,
		};
		localStorage.setItem('smc_ctrl', JSON.stringify(ctrl));
	} catch (e) {}
	/* Save PROCS */
	try {
		localStorage.setItem(
			'smc_procs',
			JSON.stringify(
				PROCS.map((p) => ({
					ct: p.ct,
					ct_set: p.ct_set,
					sta: p.sta,
					batch: p.batch,
					move: p.move,
				})),
			),
		);
	} catch (e) {}
	const lbl = {};
	['lbl_title', 'lbl_subtitle', 'lbl_dept', 'lbl_unit', 'lbl_pic'].forEach(
		(id) => {
			const el = document.getElementById(id);
			if (el) lbl[id] = el.textContent;
		},
	);
	localStorage.setItem('smc_labels', JSON.stringify(lbl));
	localStorage.setItem('smc_workers', JSON.stringify(WORKERS));
	localStorage.setItem('smc_ct', JSON.stringify(ctData));
	localStorage.setItem('smc_products', JSON.stringify(PRODUCTS));
	localStorage.setItem('smc_ng_codes', JSON.stringify(NG_CODES));
	localStorage.setItem('smc_issues', JSON.stringify(issues));
	localStorage.setItem('smc_viol', JSON.stringify(violations));
	localStorage.setItem('smc_incidents', JSON.stringify(incidents));
	localStorage.setItem('smc_reports', JSON.stringify(reportData));
	savePlan();
	flashSave();
	refreshActiveTab();
}
function savePlan() {
	const mo = document.getElementById('plan_month')?.value || '2026-06';
	const slice = {};
	Object.entries(planData).forEach(([k, v]) => {
		if (k.startsWith(mo)) slice[k] = v;
	});
	localStorage.setItem('smc_plan_' + mo, JSON.stringify(slice));
	const ts = document.getElementById('plan_save_ts');
	const n = new Date();
	if (ts)
		ts.textContent = `💾 ${n.getHours()}:${String(n.getMinutes()).padStart(2, '0')}`;
	flashSave();
	/* Don't call refreshActiveTab here — causes loop when on plan tab */
}
