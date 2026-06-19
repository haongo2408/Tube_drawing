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
/* ═══════════════════════════════════════════════════════════════════
   PHASE 2 — API LAYER
   Kết nối Dashboard ↔ MySQL qua api.php (DashBoard_New/api.php)
   Nguyên tắc: Fallback localStorage nếu API lỗi — không crash dashboard
   SQL liên quan: t_plan_actual, m_production_numbers, m_staff, m_ordersheet
   ═══════════════════════════════════════════════════════════════════ */

const API_BASE = 'php/api.php'; // Đường dẫn tương đối từ DashBoard_New/
let _apiAvailable = null; // null=chưa check, true=online, false=offline

/**
 * Kiểm tra kết nối DB 1 lần lúc load trang
 * SQL: SHOW TABLES → tube_drawing DB
 * Cập nhật badge 🟢/🔴 trên header
 */
async function _checkApi() {
	if (_apiAvailable !== null) return _apiAvailable;
	try {
		const r = await fetch(API_BASE + '?action=show_tables', {
			signal: AbortSignal.timeout(3000),
		});
		const d = await r.json();
		_apiAvailable = d.success === true;
	} catch (e) {
		_apiAvailable = false;
	}
	const badge = document.getElementById('api_badge');
	if (badge) {
		badge.textContent = _apiAvailable ? '🟢 DB' : '🔴 Local';
		badge.title = _apiAvailable
			? 'Kết nối MySQL thành công'
			: 'Offline — dùng localStorage';
		badge.style.background = _apiAvailable
			? 'rgba(22,163,74,.25)'
			: 'rgba(220,38,38,.25)';
	}
	return _apiAvailable;
}

/**
 * GET plan_actual từ DB → merge vào planData
 * SQL: SELECT month,day,sku_db,kh,tt FROM t_plan_actual WHERE month=?
 * Map sku_db (S409...) → tên tắt (MB63TD) qua api.php SKU_MAP
 * @param {string} month - format 'YYYY-MM'
 */
async function apiLoadPlanActual(month) {
	if (!(await _checkApi())) return false;
	try {
		const r = await fetch(`${API_BASE}?action=get_plan_actual&month=${month}`);
		const d = await r.json();
		if (!d.success || !d.data.length) return false;
		let count = 0;
		d.data.forEach((row) => {
			// planData key format: 'YYYY-MM_SKU_kh_DD' (KH) hoặc 'YYYY-MM_SKU_DD' (TT)
			if (row.kh > 0) {
				planData[`${row.month}_${row.sku}_kh_${row.day}`] = +row.kh;
				count++;
			}
			if (row.tt > 0) {
				planData[`${row.month}_${row.sku}_${row.day}`] = +row.tt;
				count++;
			}
		});
		console.log(`[API] Loaded ${count} cells plan_actual for ${month}`);
		return true;
	} catch (e) {
		console.warn('[API] get_plan_actual failed:', e);
		return false;
	}
}

/**
 * POST KH 1 ngày → DB (gọi từ _autoSavePlan khi user nhập ô KH)
 * SQL: INSERT INTO t_plan_actual (month,day,sku_db,kh,source)
 *      ON DUPLICATE KEY UPDATE kh=VALUES(kh)
 * @param {string} month - 'YYYY-MM'
 * @param {string} sku   - 'MB63TD'
 * @param {number} day   - 1~31
 * @param {number} kh    - số pcs KH
 */
async function apiSaveKH(month, sku, day, kh) {
	if (!(await _checkApi())) return; // Fallback: localStorage đã save rồi
	try {
		await fetch(`${API_BASE}?action=save_plan`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ month, sku, kh_per_day: { [day]: kh } }),
		});
	} catch (e) {
		console.warn('[API] save_plan KH failed:', e);
	}
}

/**
 * POST TT 1 ngày → DB (gọi từ _autoSavePlan khi user nhập ô TT)
 * SQL: INSERT INTO t_plan_actual (month,day,sku_db,tt,source)
 *      ON DUPLICATE KEY UPDATE tt=VALUES(tt)
 */
async function apiSaveTT(month, sku, day, tt) {
	if (!(await _checkApi())) return;
	try {
		await fetch(`${API_BASE}?action=save_plan`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ month, sku, tt_per_day: { [day]: tt } }),
		});
	} catch (e) {
		console.warn('[API] save_plan TT failed:', e);
	}
}

/**
 * GET products từ DB → replace PRODUCTS[]
 * SQL: SELECT id,production_number,a_drawing_out_d,a_drawing_in_d FROM m_production_numbers
 * Giữ ctF từ PRODUCTS cũ (không có trong DB)
 */
async function apiLoadProducts() {
	if (!(await _checkApi())) return false;
	try {
		const r = await fetch(`${API_BASE}?action=get_products`);
		const d = await r.json();
		if (!d.success || !d.data.length) return false;
		const ctfMap = {};
		PRODUCTS.forEach((p) => {
			ctfMap[p.code] = p.ctF || 1.0;
		}); // Giữ ctF hardcode
		PRODUCTS.splice(
			0,
			PRODUCTS.length,
			...d.data.map((p) => ({
				code: p.sku,
				s: p.series,
				od: parseFloat(p.a_drawing_out_d) || 0,
				id: parseFloat(p.a_drawing_in_d) || 0,
				ctF: ctfMap[p.sku] || 1.0, // ctF không có trong DB → giữ hardcode
			})),
		);
		console.log(`[API] Loaded ${PRODUCTS.length} products from DB`);
		return true;
	} catch (e) {
		console.warn('[API] get_products failed:', e);
		return false;
	}
}

/**
 * GET workers từ DB → replace WORKERS[]
 * SQL: SELECT * FROM m_staff ORDER BY id ASC
 */
async function apiLoadWorkers() {
	if (!(await _checkApi())) return false;
	try {
		const r = await fetch(`${API_BASE}?action=get_workers`);
		const d = await r.json();
		if (!d.success || !d.data.length) return false;
		WORKERS.splice(
			0,
			WORKERS.length,
			...d.data.map((w) => ({
				id: w.staff_id || w.id,
				name: w.name || '—',
				rank: w.Role || 'W1',
				code: w.code || '',
				main: w.kotei || '引抜',
				sub: '矯正',
				ca: w.ca || 'Ca1',
				skill: w.skill || 1,
				perf: w.perf || 80,
				qual: w.qual || 90,
				leave: 0,
				assign: '',
				phone: '',
				note: '',
			})),
		);

		console.log(`[API] Loaded ${WORKERS.length} workers from DB`);
		return true;
	} catch (e) {
		console.warn('[API] get_workers failed:', e);
		return false;
	}
}

/**
 * POST import file Excel 計画実績 → DB
 * SQL: INSERT INTO t_plan_actual (month,day,sku_db,kh,tt,source='excel_import')
 *      ON DUPLICATE KEY UPDATE kh=VALUES(kh), tt=VALUES(tt)
 *      INSERT INTO t_excel_import_log (filename,month,rows_imported,status)
 * @param {File} file  - file .xlsx chọn từ input
 * @param {string} month - 'YYYY-MM'
 */
async function apiImportExcel(file, month) {
	if (!(await _checkApi())) {
		alert('❌ Không kết nối được DB');
		return;
	}
	const fd = new FormData();
	fd.append('file', file);
	fd.append('month', month);
	try {
		const r = await fetch(`${API_BASE}?action=import_excel`, {
			method: 'POST',
			body: fd,
		});
		const d = await r.json();
		if (d.success) {
			alert(
				`✅ Import thành công: ${d.rows_imported} cells\nFile: ${file.name}`,
			);
			// Reload plan_actual sau import
			await apiLoadPlanActual(month);
			buildPlanTable();
			renderOverview();
		} else {
			alert('❌ Import lỗi: ' + (d.error || 'Unknown error'));
		}
	} catch (e) {
		alert('❌ Kết nối thất bại: ' + e.message);
	}
}

/* ═══════════════════════════════════════════════════════════════════
   END PHASE 2 API LAYER
   ═══════════════════════════════════════════════════════════════════ */

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

/* ══════════════════════════════════════════════════════════════
   A7 — SO SÁNH ĐA THÁNG
   ══════════════════════════════════════════════════════════════ */
let cmpMonths = [];
let cmpView = 'trend';
const CMP_COLORS = [
	'#1e5fa8',
	'#dc2626',
	'#16a34a',
	'#d97706',
	'#7c3aed',
	'#0891b2',
];

function cmpAddMonth() {
	const mo = document.getElementById('cmp_add_month')?.value;
	if (!mo) {
		alert('Chọn tháng trước.');
		return;
	}
	if (cmpMonths.includes(mo)) {
		alert('Tháng này đã có.');
		return;
	}
	if (cmpMonths.length >= 6) {
		alert('Tối đa 6 tháng.');
		return;
	}
	cmpMonths.push(mo);
	cmpMonths.sort();
	buildCompare();
}
function cmpRemoveMonth(mo) {
	cmpMonths = cmpMonths.filter((m) => m !== mo);
	buildCompare();
}
function cmpClearAll() {
	cmpMonths = [];
	buildCompare();
}

function setCmpView(v) {
	cmpView = v;
	['trend', 'bar', 'table'].forEach((x) => {
		const panel = document.getElementById('cmp_view_' + x + '_panel');
		const btn = document.getElementById('cmp_view_' + x);
		if (panel) panel.style.display = x === v ? '' : 'none';
		if (btn) {
			btn.style.background = x === v ? 'var(--navy)' : '';
			btn.style.color = x === v ? '#fff' : '';
		}
	});
	buildCompare();
}

function buildCompare() {
	const tagsEl = document.getElementById('cmp_month_tags');
	if (tagsEl)
		tagsEl.innerHTML = cmpMonths.length
			? cmpMonths
					.map(
						(mo, i) =>
							`<span style="display:inline-flex;align-items:center;gap:4px;background:${CMP_COLORS[i]};color:#fff;padding:2px 8px;border-radius:12px;font-size:9.5px;font-weight:700">${mo}<button onclick="cmpRemoveMonth('${mo}')" style="background:none;border:none;color:#fff;cursor:pointer;font-size:11px;padding:0;margin-left:2px;line-height:1">×</button></span>`,
					)
					.join('')
			: '<span style="font-size:10px;color:var(--t3)">Chưa chọn tháng — nhập và nhấn + Thêm</span>';
	if (!cmpMonths.length) {
		const ks = document.getElementById('cmp_kpi_strip');
		if (ks) ks.innerHTML = '';
		return;
	}
	const series = document.getElementById('cmp_series')?.value || 'ALL';
	const skuV = document.getElementById('cmp_sku')?.value || 'ALL';
	let prods = PRODUCTS;
	if (series !== 'ALL') prods = prods.filter((p) => p.s === series);
	if (skuV !== 'ALL') prods = prods.filter((p) => p.code === skuV);
	const skuSel = document.getElementById('cmp_sku');
	if (skuSel) {
		if (series !== 'ALL') {
			skuSel.style.display = '';
			const sp = PRODUCTS.filter((p) => p.s === series);
			skuSel.innerHTML =
				'<option value="ALL">Mọi mã ' +
				series +
				'</option>' +
				sp.map((p) => `<option value="${p.code}">${p.code}</option>`).join('');
		} else {
			skuSel.style.display = 'none';
			skuSel.value = 'ALL';
		}
	}
	const moData = cmpMonths.map((mo) => {
		const [yr, m] = mo.split('-').map(Number);
		const days = new Date(yr, m, 0).getDate();
		let totTT = 0,
			totKH = 0;
		const skuBreakdown = {};
		prods.forEach((p) => {
			let tt = 0,
				kh = 0;
			for (let d = 1; d <= days; d++) {
				tt += getTT(mo, p.code, d);
				kh += getKH(mo, p.code, d);
			}
			totTT += tt;
			totKH += kh;
			skuBreakdown[p.code] = {
				tt,
				kh,
				pct: kh > 0 ? Math.round((tt / kh) * 100) : 0,
			};
		});
		const ngQty = ngData
			.filter((r) => r.date && r.date.startsWith(mo))
			.reduce((s, r) => s + (r.qty || 0), 0);
		let leaveDays = 0;
		try {
			const att = JSON.parse(
				localStorage.getItem('smc_attendance_' + mo) || '{}',
			);
			WORKERS.forEach((w) => {
				const wAtt = att[w.id] || {};
				leaveDays += Object.values(wAtt).reduce((a, b) => a + b, 0);
			});
		} catch (e) {}
		const cumDays = Array.from({ length: days }, (_, i) =>
			prods.reduce((s, p) => s + getTT(mo, p.code, i + 1), 0),
		).reduce((acc, v, i) => {
			acc.push((acc[i - 1] || 0) + v);
			return acc;
		}, []);
		return {
			mo,
			totTT,
			totKH,
			pct: totKH > 0 ? Math.round((totTT / totKH) * 100) : 0,
			ngQty,
			leaveDays,
			skuBreakdown,
			cumDays,
			days,
		};
	});
	/* KPI Strip */
	const kpiEl = document.getElementById('cmp_kpi_strip');
	if (kpiEl)
		kpiEl.innerHTML = moData
			.map(
				(d, i) =>
					`<div class="card" style="padding:8px 12px;flex:1;min-width:130px;border-top:3px solid ${CMP_COLORS[i]}"><div style="font-size:9px;font-weight:700;color:${CMP_COLORS[i]};margin-bottom:4px">${d.mo}</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:3px"><div><div style="font-size:16px;font-weight:700;font-family:var(--mono);color:var(--navy)">${d.totTT.toLocaleString()}</div><div style="font-size:8px;color:var(--t3)">TT (pcs)</div></div><div><div style="font-size:16px;font-weight:700;font-family:var(--mono);color:${d.pct >= 90 ? 'var(--grn-m)' : d.pct >= 70 ? 'var(--amb-m)' : 'var(--red-m)'}">${d.pct}%</div><div style="font-size:8px;color:var(--t3)">% KH</div></div><div><div style="font-size:13px;font-weight:700;font-family:var(--mono);color:var(--red-m)">${d.ngQty}</div><div style="font-size:8px;color:var(--t3)">NG pcs</div></div><div><div style="font-size:13px;font-weight:700;font-family:var(--mono);color:var(--amb-m)">${d.leaveDays}</div><div style="font-size:8px;color:var(--t3)">Nghỉ (ngày)</div></div></div></div>`,
			)
			.join('');
	if (cmpView === 'trend') _buildCmpTrend(moData, prods);
	else if (cmpView === 'bar') _buildCmpBar(moData, prods);
	else if (cmpView === 'table') _buildCmpTable(moData, prods);
}

function _buildCmpTrend(moData, prods) {
	if (charts.cmpCum) charts.cmpCum.destroy();
	const cumEl = document.getElementById('cmpCumChart');
	if (cumEl) {
		const maxDays = Math.max(...moData.map((d) => d.days));
		charts.cmpCum = new Chart(cumEl, {
			type: 'line',
			data: {
				labels: Array.from({ length: maxDays }, (_, i) => i + 1),
				datasets: moData.map((d, i) => ({
					label: d.mo,
					data: Array.from({ length: maxDays }, (_, j) => d.cumDays[j] ?? null),
					borderColor: CMP_COLORS[i],
					backgroundColor: CMP_COLORS[i] + '20',
					borderWidth: 2,
					pointRadius: 0,
					tension: 0.3,
					fill: false,
					spanGaps: false,
				})),
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'bottom',
						labels: { font: { size: 9 }, boxWidth: 12 },
					},
				},
				scales: {
					x: { title: { display: true, text: 'Ngày', font: { size: 9 } } },
					y: { title: { display: true, text: 'pcs', font: { size: 9 } } },
				},
			},
		});
	}
	if (charts.cmpPct) charts.cmpPct.destroy();
	const pctEl = document.getElementById('cmpPctChart');
	if (pctEl)
		charts.cmpPct = new Chart(pctEl, {
			type: 'bar',
			data: {
				labels: moData.map((d) => d.mo),
				datasets: [
					{
						label: '% Đạt KH',
						data: moData.map((d) => d.pct),
						backgroundColor: moData.map((d) =>
							d.pct >= 90
								? '#16a34acc'
								: d.pct >= 70
									? '#d97706cc'
									: '#dc2626cc',
						),
						borderRadius: 4,
						borderWidth: 0,
					},
					{
						label: 'Target 90%',
						data: moData.map(() => 90),
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
						labels: { font: { size: 9 }, boxWidth: 10 },
					},
				},
				scales: { y: { min: 0, max: 130 } },
			},
		});
	if (charts.cmpNG) charts.cmpNG.destroy();
	const ngEl = document.getElementById('cmpNGChart');
	if (ngEl)
		charts.cmpNG = new Chart(ngEl, {
			type: 'bar',
			data: {
				labels: moData.map((d) => d.mo),
				datasets: [
					{
						label: 'NG (pcs)',
						data: moData.map((d) => d.ngQty),
						backgroundColor: '#dc262688',
						borderRadius: 4,
						borderWidth: 0,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: { legend: { display: false } },
				scales: {
					y: { title: { display: true, text: 'pcs', font: { size: 9 } } },
				},
			},
		});
	if (charts.cmpLeave) charts.cmpLeave.destroy();
	const lvEl = document.getElementById('cmpLeaveChart');
	if (lvEl)
		charts.cmpLeave = new Chart(lvEl, {
			type: 'bar',
			data: {
				labels: moData.map((d) => d.mo),
				datasets: [
					{
						label: 'Ngày nghỉ',
						data: moData.map((d) => d.leaveDays),
						backgroundColor: '#d9780688',
						borderRadius: 4,
						borderWidth: 0,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: { legend: { display: false } },
				scales: {
					y: { title: { display: true, text: 'ngày', font: { size: 9 } } },
				},
			},
		});
}

function _buildCmpBar(moData, prods) {
	if (charts.cmpBar) charts.cmpBar.destroy();
	const el = document.getElementById('cmpBarChart');
	if (el)
		charts.cmpBar = new Chart(el, {
			type: 'bar',
			data: {
				labels: prods.map((p) => p.code),
				datasets: moData.map((d, i) => ({
					label: d.mo,
					data: prods.map((p) => d.skuBreakdown[p.code]?.tt || 0),
					backgroundColor: CMP_COLORS[i] + '99',
					borderRadius: 3,
					borderWidth: 0,
				})),
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'bottom',
						labels: { font: { size: 9 }, boxWidth: 10 },
					},
				},
				scales: {
					x: { ticks: { font: { size: 8 } } },
					y: { title: { display: true, text: 'pcs', font: { size: 9 } } },
				},
			},
		});
	if (charts.cmpBarPct) charts.cmpBarPct.destroy();
	const el2 = document.getElementById('cmpBarPctChart');
	if (el2)
		charts.cmpBarPct = new Chart(el2, {
			type: 'bar',
			data: {
				labels: prods.map((p) => p.code),
				datasets: moData.map((d, i) => ({
					label: d.mo,
					data: prods.map((p) => d.skuBreakdown[p.code]?.pct || 0),
					backgroundColor: CMP_COLORS[i] + '99',
					borderRadius: 3,
					borderWidth: 0,
				})),
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'bottom',
						labels: { font: { size: 9 }, boxWidth: 10 },
					},
				},
				scales: {
					x: { ticks: { font: { size: 8 } } },
					y: {
						min: 0,
						max: 150,
						title: { display: true, text: '%', font: { size: 9 } },
					},
				},
			},
		});
}

function _buildCmpTable(moData, prods) {
	const tbl = document.getElementById('cmp_table');
	if (!tbl) return;
	let html = `<thead><tr><th style="position:sticky;left:0;background:var(--navy);color:#fff;padding:4px 8px;font-size:10px;text-align:left;z-index:2;min-width:100px">Mã SP</th><th style="position:sticky;left:100px;background:var(--navy);color:#fff;padding:4px 5px;font-size:9px;z-index:2;min-width:46px">Series</th>${moData.map((d, i) => `<th colspan="3" style="background:${CMP_COLORS[i]};color:#fff;padding:4px 8px;font-size:9.5px;text-align:center">${d.mo}</th>`).join('')}</tr><tr><th style="position:sticky;left:0;background:#1a3d6b;color:#fff;padding:3px 8px;z-index:2"></th><th style="position:sticky;left:100px;background:#1a3d6b;color:#fff;padding:3px 5px;z-index:2"></th>${moData.map(() => '<th style="background:#1a3d6b;color:#aac4e8;font-size:8.5px;padding:3px 4px;text-align:center;min-width:46px">TT</th><th style="background:#1a3d6b;color:#aac4e8;font-size:8.5px;padding:3px 4px;text-align:center;min-width:46px">KH</th><th style="background:#1a3d6b;color:#aac4e8;font-size:8.5px;padding:3px 4px;text-align:center;min-width:38px">%</th>').join('')}</tr></thead><tbody>`;
	prods.forEach((p) => {
		const w = SM[p.s] || { bg: '#fff', c: '#111' };
		html += `<tr><td style="position:sticky;left:0;background:#fff;z-index:1;font-weight:700;font-family:var(--mono);font-size:9.5px;color:${w.c};padding:3px 8px;border-bottom:1px solid #f0f2f6">${p.code}</td><td style="position:sticky;left:100px;background:#fff;z-index:1;padding:3px 5px;border-bottom:1px solid #f0f2f6"><span style="background:${w.bg};color:${w.c};padding:1px 4px;border-radius:2px;font-size:8px;font-weight:700">${p.s}</span></td>${moData
			.map((d, mi) => {
				const bd = d.skuBreakdown[p.code] || { tt: 0, kh: 0, pct: 0 };
				const pc = bd.pct;
				const bg =
					pc >= 90
						? '#f0fdf4'
						: pc >= 70
							? '#fffbeb'
							: bd.tt > 0
								? '#fef2f2'
								: '';
				const fc =
					pc >= 90
						? 'var(--grn-m)'
						: pc >= 70
							? 'var(--amb-m)'
							: 'var(--red-m)';
				return `<td style="text-align:right;font-family:var(--mono);font-size:9.5px;padding:3px 6px;background:${mi % 2 ? '#fafbff' : ''};border-bottom:1px solid #f0f2f6">${bd.tt || '—'}</td><td style="text-align:right;font-family:var(--mono);font-size:9.5px;padding:3px 6px;color:var(--t3);background:${mi % 2 ? '#fafbff' : ''};border-bottom:1px solid #f0f2f6">${bd.kh || '—'}</td><td style="text-align:center;font-family:var(--mono);font-size:9.5px;font-weight:700;padding:3px 5px;background:${bg};color:${bd.tt > 0 ? fc : 'var(--t3)'};border-bottom:1px solid #f0f2f6">${bd.tt > 0 ? pc + '%' : '—'}</td>`;
			})
			.join('')}</tr>`;
	});
	html += `<tr><td style="position:sticky;left:0;background:#0f2b4a;color:#fff;padding:4px 8px;font-size:10px;font-weight:700;z-index:2">TỔNG</td><td style="position:sticky;left:100px;background:#0f2b4a;color:#fff;padding:4px 5px;z-index:2">—</td>${moData
		.map((d, mi) => {
			const bg = d.pct >= 90 ? '#16a34a' : d.pct >= 70 ? '#d97706' : '#dc2626';
			return `<td style="text-align:right;font-family:var(--mono);font-size:10px;padding:4px 6px;font-weight:700;color:var(--navy);background:${mi % 2 ? '#e8f0ff' : ''}">${d.totTT.toLocaleString()}</td><td style="text-align:right;font-family:var(--mono);font-size:10px;padding:4px 6px;color:var(--t3);background:${mi % 2 ? '#e8f0ff' : ''}">${d.totKH.toLocaleString()}</td><td style="text-align:center;font-family:var(--mono);font-size:11px;font-weight:700;padding:4px 5px;background:${bg};color:#fff">${d.pct}%</td>`;
		})
		.join('')}</tr></tbody>`;
	tbl.innerHTML = html;
}
/* ── end A7 ── */

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

/* OVERVIEW */
function renderOverview() {
	const mo = document.getElementById('ov_month')?.value || '2026-06';
	/* planData always current — managed by _autoSavePlan */
	const filter = document.getElementById('ov_filter')?.value || 'ALL';
	const skuFilter = document.getElementById('ov_sku')?.value || 'ALL';
	const sort = document.getElementById('ov_sort')?.value || 'series';
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	let prods = PRODUCTS;
	if (filter !== 'ALL') prods = prods.filter((p) => p.s === filter);
	if (skuFilter !== 'ALL') prods = prods.filter((p) => p.code === skuFilter);
	const stats = prods.map((p) => {
		const t = Array.from({ length: days }, (_, i) =>
			getTT(mo, p.code, i + 1),
		).reduce((a, b) => a + b, 0);
		const k = Array.from({ length: days }, (_, i) =>
			getKH(mo, p.code, i + 1),
		).reduce((a, b) => a + b, 0);
		return { ...p, _t: t, _k: k, _p: k > 0 ? Math.round((t / k) * 100) : 0 };
	});
	if (sort === 'pct_desc') stats.sort((a, b) => b._p - a._p);
	else if (sort === 'pct_asc') stats.sort((a, b) => a._p - b._p);
	else if (sort === 'tt_desc') stats.sort((a, b) => b._t - a._t);
	else if (sort === 'kh_desc') stats.sort((a, b) => b._k - a._k);
	else if (sort === 'code') stats.sort((a, b) => a.code.localeCompare(b.code));
	else
		/* series */ stats.sort(
			(a, b) => a.s.localeCompare(b.s) || a.code.localeCompare(b.code),
		);
	const gTT = stats.reduce((s, p) => s + p._t, 0);
	const gKH = stats.reduce((s, p) => s + p._k, 0);
	const gP = gKH > 0 ? Math.round((gTT / gKH) * 100) : 0;
	const { sys } = cascade('MB63TD');
	/* KPI + Series strip combined */
	const kpi = document.getElementById('ov_kpi');
	if (kpi)
		kpi.innerHTML = `
    <div class="mc ${gP >= 90 ? 'ok' : gP >= 70 ? 'warn' : 'bn'}"><div class="mc-v" style="font-size:26px">${gP}%</div><div class="mc-l">% Đạt KH</div></div>
    <div class="mc neu"><div class="mc-v" style="font-size:22px">${gTT.toLocaleString()}</div><div class="mc-l">TT tháng (pcs)</div></div>
    <div class="mc neu"><div class="mc-v" style="font-size:22px">${gKH.toLocaleString()}</div><div class="mc-l">KH (đơn hàng)</div></div>
    <div class="mc info"><div class="mc-v" style="font-size:22px">${sys}</div><div class="mc-l">SYS Cap pcs/ca</div></div>
    ${['MB', 'NCA', 'CG']
			.map((s) => {
				const ps = stats.filter((p) => p.s === s);
				const t = ps.reduce((a, p) => a + p._t, 0);
				const k = ps.reduce((a, p) => a + p._k, 0);
				const pct = k > 0 ? Math.round((t / k) * 100) : 0;
				const w = SM[s];
				return `<div class="mc ser-card" style="border-left:4px solid ${w.c};background:#fff"><div style="font-size:11px;font-weight:700;color:${w.c};margin-bottom:5px">${s} Series (${ps.length} mã)</div><div style="font-family:var(--mono);font-size:18px;font-weight:700;color:var(--navy)">${t.toLocaleString()} <span style="font-size:10px;color:var(--t3)">pcs</span></div><div style="font-size:10px;color:var(--t3);margin:2px 0">KH: ${k.toLocaleString()}</div><div style="display:flex;align-items:center;gap:6px;margin-top:4px"><div style="flex:1;height:5px;background:#e5e7eb;border-radius:3px"><div style="height:100%;width:${Math.min(100, pct)}%;background:${w.c};border-radius:3px"></div></div><span style="font-size:11px;font-weight:700;color:${pct >= 90 ? 'var(--grn-m)' : pct >= 70 ? 'var(--amb-m)' : 'var(--red-m)'}">${pct}%</span></div></div>`;
			})
			.join('')}`;
	/* Hide row 2 series strip (now embedded in kpi) */
	const ser = document.getElementById('ov_series');
	if (ser) ser.style.display = 'none';
	const pb = document.getElementById('ov_progress_bars');
	if (pb)
		pb.innerHTML =
			stats
				.map((p) => {
					const w = SM[p.s] || { c: '#888', bg: '#eee' };
					return `<div class="ov-prog-row"><div style="min-width:130px;max-width:160px;font-size:10px;font-weight:700;color:var(--navy);font-family:var(--mono);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.code}</div><span style="background:${w.bg};color:${w.c};padding:1px 4px;border-radius:3px;font-size:8.5px;font-weight:700;width:34px;text-align:center;flex-shrink:0">${p.s}</span><div class="ov-bar-bg"><div class="ov-bar" style="width:${Math.min(100, p._p)}%;background:${p._p >= 90 ? 'var(--grn-m)' : p._p >= 70 ? 'var(--amb-m)' : 'var(--red-m)'}"></div></div><div style="min-width:110px;font-size:9.5px;font-family:var(--mono);color:var(--t2);text-align:right">${p._t.toLocaleString()}/${p._k.toLocaleString()}</div><div style="width:38px;font-size:9.5px;font-weight:700;font-family:var(--mono);color:${p._p >= 90 ? 'var(--grn-m)' : p._p >= 70 ? 'var(--amb-m)' : 'var(--red-m)'};text-align:right">${p._p}%</div></div>`;
				})
				.join('') ||
			'<p style="font-size:11px;color:var(--t3)">Chưa có data</p>';
	/* Man hours */
	const mo2 = document.getElementById('plan_month')?.value || mo;
	const [yr2, m2] = mo2.split('-').map(Number);
	const days2 = new Date(yr2, m2, 0).getDate();
	let wd = 0;
	for (let d = 1; d <= days2; d++) {
		if (!isWE(yr2, m2, d)) wd++;
	}
	const wTotal = WORKERS.reduce(
		(s, w) => s + Math.max(0, wd - (w.leave || 0)) * 8,
		0,
	);
	const wPerf = WORKERS.length
		? Math.round(WORKERS.reduce((s, w) => s + w.perf, 0) / WORKERS.length)
		: 0;
	const mh = document.getElementById('ov_manhour');
	if (mh)
		mh.innerHTML = `<div style="display:flex;gap:16px;flex-wrap:wrap"><div><div style="font-family:var(--mono);font-size:22px;font-weight:700;color:var(--navy)">${wTotal}</div><div style="font-size:10px;color:var(--t3)">Giờ công/tháng<br>(${WORKERS.length} NV)</div></div><div><div style="font-family:var(--mono);font-size:22px;font-weight:700;color:var(--grn-m)">${wPerf}%</div><div style="font-size:10px;color:var(--t3)">Năng suất TB</div></div></div>`;
	buildPieChart();
	buildOvCumChart();
	renderIssues();
	updateStatusBar();
	buildNGSummary();
}
function buildPieChart() {
	const mo = document.getElementById('ov_month')?.value || '2026-06';
	const f = document.getElementById('ov_pie_f')?.value || 'ALL';
	const skuF = document.getElementById('ov_sku')?.value || 'ALL';
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	const SCFG = {
		MB: {
			shades: [
				'#1e3a8a',
				'#1e5fa8',
				'#2563eb',
				'#3b82f6',
				'#60a5fa',
				'#93c5fd',
			],
		},
		NCA: { shades: ['#7f1d1d', '#991b1b', '#dc2626', '#ef4444', '#f87171'] },
		CG: {
			shades: [
				'#14532d',
				'#166534',
				'#16a34a',
				'#22c55e',
				'#4ade80',
				'#86efac',
				'#bbf7d0',
				'#dcfce7',
			],
		},
	};
	const centerTextPlugin = {
		id: 'centerText',
		afterDraw(chart) {
			const {
				ctx,
				chartArea: { left, top, width, height },
			} = chart;
			const total = chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
			if (!total) return;
			ctx.save();
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			const cx = left + width / 2,
				cy = top + height / 2;
			ctx.font = '700 13px "Segoe UI"';
			ctx.fillStyle = '#0f2b4a';
			ctx.fillText(total.toLocaleString(), cx, cy - 6);
			ctx.font = '9px "Segoe UI"';
			ctx.fillStyle = '#64748b';
			ctx.fillText('pcs', cx, cy + 8);
			ctx.restore();
		},
	};
	/* Destroy old */
	['pie', 'pie_MB', 'pie_NCA', 'pie_CG'].forEach((k) => {
		if (charts[k]) {
			charts[k].destroy();
			charts[k] = null;
		}
	});
	const commonOpts = (label) => ({
		responsive: true,
		maintainAspectRatio: false,
		cutout: '58%',
		plugins: {
			legend: { display: false },
			tooltip: {
				callbacks: {
					label: (ctx) => {
						const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
						const pct = total > 0 ? Math.round((ctx.parsed / total) * 100) : 0;
						return ` ${ctx.label}: ${ctx.parsed.toLocaleString()} pcs (${pct}%)`;
					},
				},
			},
		},
	});
	/* Per-series small pies */
	['MB', 'NCA', 'CG'].forEach((s) => {
		const el = document.getElementById('pieChart_' + s);
		if (!el) return;
		let prods = PRODUCTS.filter((p) => p.s === s);
		if (skuF !== 'ALL') prods = prods.filter((p) => p.code === skuF);
		const data = prods
			.map((p) => ({
				code: p.code,
				t: Array.from({ length: days }, (_, i) =>
					getTT(mo, p.code, i + 1),
				).reduce((a, b) => a + b, 0),
			}))
			.filter((d) => d.t > 0);
		const isDim =
			f !== 'ALL' &&
			f !== s &&
			!PRODUCTS.some((p) => p.code === f && p.s === s);
		el.parentElement.style.opacity = isDim ? '0.2' : '1';
		el.parentElement.style.transition = 'opacity .2s';
		if (!data.length) {
			const ctx2 = el.getContext('2d');
			ctx2.clearRect(0, 0, el.width, el.height);
			ctx2.font = '9px Segoe UI';
			ctx2.fillStyle = '#9ca3af';
			ctx2.textAlign = 'center';
			ctx2.fillText('No data', el.width / 2, el.height / 2);
			return;
		}
		const cfg = SCFG[s];
		charts['pie_' + s] = new Chart(el, {
			type: 'doughnut',
			data: {
				labels: data.map((d) => d.code),
				datasets: [
					{
						data: data.map((d) => d.t),
						backgroundColor: data.map(
							(_, i) => cfg.shades[i % cfg.shades.length],
						),
						borderWidth: 2,
						borderColor: '#fff',
						hoverOffset: 4,
					},
				],
			},
			options: commonOpts(s),
			plugins: [centerTextPlugin],
		});
		/* Side legend - vertical beside pie */
		const legEl = document.getElementById('pie_leg_' + s);
		if (legEl)
			legEl.innerHTML = data
				.map(
					(d, i) =>
						`<div style="display:flex;align-items:center;gap:4px;white-space:nowrap"><span style="width:8px;height:8px;border-radius:50%;background:${cfg.shades[i % cfg.shades.length]};display:inline-block;flex-shrink:0"></span><span style="color:#374151;font-size:8px">${d.code.replace(/TD$/, '')}</span><span style="color:var(--t3);font-family:var(--mono);font-size:8px;margin-left:auto;padding-left:4px">${d.t.toLocaleString()}</span></div>`,
				)
				.join('');
	});
	/* Total pie */
	const totalEl = document.getElementById('pieChart');
	if (!totalEl) return;
	let allProds = PRODUCTS;
	if (f !== 'ALL' && !PRODUCTS.some((p) => p.code === f))
		allProds = allProds.filter((p) => p.s === f);
	else if (PRODUCTS.some((p) => p.code === f))
		allProds = allProds.filter((p) => p.code === f);
	if (skuF !== 'ALL') allProds = allProds.filter((p) => p.code === skuF);
	const totalData = allProds
		.map((p) => ({
			code: p.code,
			s: p.s,
			t: Array.from({ length: days }, (_, i) =>
				getTT(mo, p.code, i + 1),
			).reduce((a, b) => a + b, 0),
		}))
		.filter((d) => d.t > 0);
	if (!totalData.length) {
		totalEl.parentElement.innerHTML =
			'<p style="text-align:center;color:var(--t3);padding:20px;font-size:10px">No data</p>';
		return;
	}
	/* Group by series for total pie: 3 slices MB/NCA/CG */
	const serTotals = { MB: 0, NCA: 0, CG: 0 };
	totalData.forEach((d) => (serTotals[d.s] = (serTotals[d.s] || 0) + d.t));
	const serData = Object.entries(serTotals).filter(([, v]) => v > 0);
	const serColors = { MB: '#1e5fa8', NCA: '#dc2626', CG: '#16a34a' };
	charts.pie = new Chart(totalEl, {
		type: 'doughnut',
		data: {
			labels: serData.map(([s]) => s),
			datasets: [
				{
					data: serData.map(([, v]) => v),
					backgroundColor: serData.map(([s]) => serColors[s]),
					borderWidth: 2,
					borderColor: '#fff',
					hoverOffset: 6,
				},
			],
		},
		options: {
			...commonOpts('ALL'),
			plugins: { ...commonOpts('ALL').plugins, legend: { display: false } },
		},
		plugins: [centerTextPlugin],
	});
	/* Total legend - vertical beside total pie */
	const totalLeg = document.getElementById('pie_leg_total');
	if (totalLeg)
		totalLeg.innerHTML = serData
			.map(
				([s, v]) =>
					`<div style="display:flex;align-items:center;gap:6px;margin-bottom:2px"><span style="width:10px;height:10px;border-radius:50%;background:${serColors[s]};display:inline-block;flex-shrink:0"></span><span style="font-size:10px;font-weight:700;color:${serColors[s]}">${s}</span><span style="font-family:var(--mono);font-size:10px;color:var(--navy);margin-left:4px">${v.toLocaleString()}</span><span style="font-size:8.5px;color:var(--t3)">pcs</span></div>`,
			)
			.join('');
}
function buildOvCumChart() {
	const mo = document.getElementById('ov_month')?.value || '2026-06';
	/* Follow same filter as progress bars (ov_filter + ov_sku) */
	const f = document.getElementById('ov_filter')?.value || 'ALL';
	const skuF = document.getElementById('ov_sku')?.value || 'ALL';
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	let prods = PRODUCTS;
	if (f !== 'ALL') prods = prods.filter((p) => p.s === f);
	if (skuF !== 'ALL') prods = prods.filter((p) => p.code === skuF);
	const lbls = Array.from({ length: days }, (_, i) => i + 1);
	const dayTT = lbls.map((d) =>
		prods.reduce((s, p) => s + getTT(mo, p.code, d), 0),
	);
	const dayKH = lbls.map((d) =>
		prods.reduce((s, p) => s + getKH(mo, p.code, d), 0),
	);
	const _td2 = new Date();
	const _isCur2 = _td2.getFullYear() === yr && _td2.getMonth() + 1 === m;
	const _cut2 = _isCur2 ? _td2.getDate() : days;
	const cumTT = dayTT.reduce((a, v, i) => {
		a.push(i + 1 <= _cut2 ? (a[i - 1] || 0) + v : null);
		return a;
	}, []);
	const cumKH = dayKH.reduce((a, v, i) => {
		a.push((a[i - 1] || 0) + v);
		return a;
	}, []);
	const yMax = Math.max(...cumKH.filter((v) => v != null)) || 1000;
	/* Update filter label */
	const cumF = document.getElementById('ov_cum_f');
	if (cumF) cumF.value = f;
	if (charts.ovcum) charts.ovcum.destroy();
	const el = document.getElementById('ovCumChart');
	if (!el) return;
	charts.ovcum = new Chart(el, {
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
				y: { min: 0, suggestedMax: yMax * 1.1, ticks: { font: { size: 9 } } },
			},
		},
	});
}

/* ISSUES */
function addIssue() {
	const txt = document.getElementById('issue_txt').value.trim();
	if (!txt) return;
	issues.unshift({
		type: document.getElementById('issue_type').value,
		txt,
		date:
			document.getElementById('issue_date').value ||
			new Date().toISOString().slice(0, 10),
		id: Date.now(),
	});
	localStorage.setItem('smc_issues', JSON.stringify(issues));
	renderIssues();
	document.getElementById('issue_txt').value = '';
}
function renderIssues() {
	const el = document.getElementById('issues_list');
	if (!el) return;
	const cols = {
		'⚠': 'var(--red-m)',
		'👷': 'var(--blue)',
		'📦': 'var(--amb-m)',
		'❌': 'var(--red-m)',
		'🔧': 'var(--org-m)',
		ℹ: 'var(--t3)',
	};
	el.innerHTML =
		issues
			.slice(0, 6)
			.map(
				(is) =>
					`<div style="display:flex;align-items:flex-start;gap:7px;padding:5px 0;border-bottom:1px solid #f0f2f6"><div style="width:7px;height:7px;border-radius:50%;background:${cols[is.type] || 'var(--t3)'};margin-top:4px;flex-shrink:0"></div><div style="flex:1;font-size:11px"><span style="font-size:10px;margin-right:3px">${is.type}</span>${is.txt}<div style="font-size:9px;color:var(--t3)">${is.date}</div></div><button class="btn sm" onclick="issues=issues.filter(i=>i.id!==${is.id});localStorage.setItem('smc_issues',JSON.stringify(issues));renderIssues()" style="color:var(--t3)">✕</button></div>`,
			)
			.join('') ||
		'<p style="font-size:11px;color:var(--t3);padding:6px 0">Chưa có sự kiện</p>';
}
function calcOEE() {
	const a = +(document.getElementById('oee_a')?.value || 89) / 100,
		p2 = +(document.getElementById('oee_p')?.value || 90) / 100,
		q = +(document.getElementById('oee_q')?.value || 98) / 100;
	const oee = (a * p2 * q * 100).toFixed(1);
	const el = document.getElementById('oee_val');
	if (el) {
		el.textContent = oee + '%';
		el.parentElement.className =
			'mc ' + (oee >= 85 ? 'ok' : oee >= 60 ? 'warn' : 'bn');
	}
}

/* HEATMAP */
function buildHeatmap() {
	const el = document.getElementById('hm_content');
	if (!el) return;
	const mo =
		document.getElementById('hm_month')?.value ||
		document.getElementById('plan_month')?.value ||
		'2026-06';
	const series = document.getElementById('hm_series')?.value || 'ALL';
	const [yr, m] = mo.split('-').map(Number);
	const days = new Date(yr, m, 0).getDate();
	let prods = PRODUCTS;
	if (series !== 'ALL') prods = prods.filter((p) => p.s === series);
	const dows = ['日', '月', '火', '水', '木', '金', '土'];
	const nca = +document.getElementById('s_ca').value;
	let html = `<table style="border-collapse:collapse;font-size:9.5px"><thead><tr><th style="text-align:left;background:var(--navy);color:#fff;padding:3px 6px;font-size:9px">Mã SP</th><th style="background:var(--navy);color:#fff;padding:3px 4px;font-size:9px">S</th>`;
	Array.from({ length: days }, (_, i) => i + 1).forEach((d) => {
		const we = isWE(yr, m, d);
		const dow = dows[new Date(yr, m - 1, d).getDay()];
		html += `<th style="background:${we ? '#374151' : 'var(--navy)'};color:#fff;padding:3px 2px;font-size:8.5px;min-width:20px">${d}<br><span style="opacity:.6">${dow}</span></th>`;
	});
	html += `<th style="background:#1a3d6b;color:#fff;padding:3px 5px;font-size:8.5px">%</th></tr></thead><tbody>`;
	prods.forEach((p) => {
		const { sys: sc } = cascade(p.code);
		const dkh = sc * nca;
		let t = 0,
			k = 0;
		const w = SM[p.s] || { bg: '#fff', c: '#111' };
		html += `<tr><td style="text-align:left;font-weight:700;font-size:9.5px;font-family:var(--mono);color:${w.c}">${p.code}</td><td><span style="background:${w.bg};color:${w.c};padding:1px 3px;border-radius:2px;font-size:8px;font-weight:700">${p.s}</span></td>`;
		Array.from({ length: days }, (_, i) => i + 1).forEach((d) => {
			const we = isWE(yr, m, d);
			const v = planData[`${mo}_${p.code}_${d}`];
			k += dkh;
			if (we && (!v || v === 0)) {
				html += `<td style="background:#e5e7eb;font-size:8px;color:#9aa3b0;text-align:center">休</td>`;
				return;
			}
			if (!v) {
				html += `<td style="background:#f3f4f6"></td>`;
				return;
			}
			t += v;
			const pct = dkh > 0 ? v / dkh : 0;
			const bg = pct >= 0.9 ? '#bbf7d0' : pct >= 0.7 ? '#fde68a' : '#fecaca';
			const fc = pct >= 0.9 ? '#14532d' : pct >= 0.7 ? '#78350f' : '#7f1d1d';
			html += `<td style="background:${bg};color:${fc};font-size:8px;font-weight:700;text-align:center">${Math.round(pct * 100)}</td>`;
		});
		const pT = k > 0 ? Math.round((t / k) * 100) : 0;
		const bt = pT >= 90 ? '#bbf7d0' : pT >= 70 ? '#fde68a' : '#fecaca';
		const ft = pT >= 90 ? '#14532d' : pT >= 70 ? '#78350f' : '#7f1d1d';
		html += `<td style="background:${bt};color:${ft};font-weight:700;font-size:9px;text-align:center">${pT}%</td></tr>`;
	});
	el.innerHTML = html + '</tbody></table>';
}

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

/* LANGUAGE */
/* ══════════════════════════════════════════════════════════════
   A2 — I18N ENGINE  (data-i18n attribute system)
   ══════════════════════════════════════════════════════════════ */
const I18N = {
	vi: {
		/* Tabs */
		overview: '📊 Tổng quan',
		plan: '📅 Kế hoạch',
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
	/* 2. Tab labels */
	const order = [
		'overview',
		'plan',
		'pulse',
		'heatmap',
		'compare',
		'ca3',
		'worker',
		'quality',
		'incident',
		'reports',
		'capacity',
		'help',
	];
	document.querySelectorAll('.tab').forEach((btn, i) => {
		if (order[i] && L[order[i]]) btn.innerHTML = L[order[i]];
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

/* MAIN UPDATE + TAB SWITCH */
function update() {
	const bnIdx = gBN();
	PROCS.forEach((p, i) => (p.isBN = i === bnIdx));
	const { res: caps, sys } = cascade('MB63TD');
	document.getElementById('hdr_shift').textContent =
		`${gA()} ph/ca · ${Math.round(gU() * 100)}% util · ${document.getElementById('s_ca').value} ca/ngày`;
	document.getElementById('hdr_bn').textContent =
		`${PROCS[bnIdx].name.split(' ')[0]} BN ⚠ ${PROCS[bnIdx].ct}s×${PROCS[bnIdx].sta}台 | SYS:${sys}`;
	const at = document.querySelector('.panel.act');
	if (at) {
		const n = at.id.replace('tab-', '');
		if (n === 'overview') renderOverview();
		if (n === 'capacity') {
			buildProcTable(caps, sys);
			buildSOBBars(caps, sys);
		}
		if (n === 'pulse') {
			drawPulse();
			buildPulseSummary();
		}
		if (n === 'ca3') updateCa();
	}
	calcOEE();
	updateStatusBar();
}
function goTab(name, btn) {
	document
		.querySelectorAll('.panel')
		.forEach((el) => el.classList.remove('act'));
	document.querySelectorAll('.tab').forEach((el) => el.classList.remove('act'));
	const panel = document.getElementById('tab-' + name);
	if (panel) panel.classList.add('act');
	btn.classList.add('act');
	saveUIState(); /* Persist active tab */
	setTimeout(() => {
		if (name === 'overview') {
			renderOverview();
			buildStaffSummary();
		}
		if (name === 'plan') {
			buildPlanTable();
			setTimeout(() => updatePlanCharts(), 100);
		}
		/* F4: resize all charts after tab switch */
		setTimeout(
			() =>
				Object.values(charts).forEach((c) => {
					try {
						if (c && typeof c.resize === 'function') c.resize();
					} catch (e) {}
				}),
			120,
		);
		if (name === 'pulse') {
			drawPulse();
			buildPulseSummary();
		}
		if (name === 'heatmap') buildHeatmap();
		if (name === 'compare') buildCompare();
		if (name === 'ca3') updateCa();
		if (name === 'worker') {
			buildWorkerCards();
			buildAttendTable();
		}
		if (name === 'quality') {
			buildNGTable();
			if (ngPanelOpen) buildNGCodesTable();
			buildNGCharts();
		}
		if (name === 'incident') renderIncList();
		if (name === 'capacity') {
			/* Init cap_sku dropdown if not done */
			const capSku = document.getElementById('cap_sku');
			if (capSku && capSku.options.length <= 1) {
				PRODUCTS.forEach((p) => {
					const o = document.createElement('option');
					o.value = p.code;
					o.textContent = p.code;
					capSku.appendChild(o);
				});
			}
			const ser = document.getElementById('cap_series')?.value || 'ALL';
			const sku = document.getElementById('cap_sku')?.value || 'ALL';
			let refSku = 'MB63TD';
			if (sku !== 'ALL') refSku = sku;
			else if (ser !== 'ALL') {
				const f = PRODUCTS.find((p) => p.s === ser);
				if (f) refSku = f.code;
			}
			const { res: c, sys: s } = cascade(refSku);
			buildProcTable(c, s);
			buildSOBBars(c, s);
			buildCapCharts(refSku);
		}
		if (name === 'help') buildHelpTab();
		calcOEE();
	}, 50);
}

/* INIT */
function initSelects() {
	['pulse_sku', 'tt_sku'].forEach((id) => {
		const el = document.getElementById(id);
		if (!el) return;
		el.innerHTML = PRODUCTS.map(
			(p) => `<option value="${p.code}">${p.code}</option>`,
		).join('');
		el.value = 'MB63TD';
	});
}

document.addEventListener('keydown', (e) => {
	if ((e.ctrlKey || e.metaKey) && e.key === 's') {
		e.preventDefault();
		saveAll();
	}
	if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
		e.preventDefault();
		editMode ? exitEdit(false) : enterEdit();
	}
	if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
		e.preventDefault();
		window.print();
	}
	if (e.key === 'Escape' && editMode) exitEdit(false);
});

/* Worker photo */
function setWorkerPhoto(wi, input) {
	const file = input.files[0];
	if (!file) return;
	const reader = new FileReader();
	reader.onload = (e) => {
		WORKERS[wi].photo = e.target.result;
		saveWorkers();
		buildWorkerCards();
	};
	reader.readAsDataURL(file);
}

function ngFilterChanged() {
	const ser = document.getElementById('ng_filter_ser')?.value || 'ALL';
	const skuSel = document.getElementById('ng_filter_sku');
	if (skuSel) {
		if (ser !== 'ALL') {
			skuSel.style.display = '';
			const prods = PRODUCTS.filter((p) => p.s === ser);
			skuSel.innerHTML =
				'<option value="ALL">Mọi mã</option>' +
				prods
					.map((p) => `<option value="${p.code}">${p.code}</option>`)
					.join('');
		} else {
			skuSel.style.display = 'none';
			skuSel.value = 'ALL';
		}
	}
	buildNGCharts();
}

/* ── FILTER HELPERS ── */
/* F1 fix: ovFilterChanged sync tất cả charts trong Overview */
function ovFilterChanged() {
	saveUIState();
	const ser = document.getElementById('ov_filter')?.value || 'ALL';
	const skuSel = document.getElementById('ov_sku');
	/* Rebuild SKU dropdown */
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
	/* Sync pie filter */
	const pf = document.getElementById('ov_pie_f');
	if (pf) {
		_syncSeriesSelect(pf, ser);
		pf.value = ser;
	}
	/* Sync cum filter */
	const cf = document.getElementById('ov_cum_f');
	if (cf) {
		_syncSeriesSelect(cf, ser);
		cf.value = ser;
	}
	renderOverview();
}
/* Khi SKU select thay đổi → sync pie + cum theo SKU đó */
function ovSkuChanged() {
	saveUIState();
	const ser = document.getElementById('ov_filter')?.value || 'ALL';
	const sku = document.getElementById('ov_sku')?.value || 'ALL';
	/* Pie và cum không có SKU-level filter → chỉ sync series */
	const pf = document.getElementById('ov_pie_f');
	if (pf) {
		_syncSeriesSelect(pf, ser);
		pf.value = ser;
	}
	const cf = document.getElementById('ov_cum_f');
	if (cf) {
		_syncSeriesSelect(cf, ser);
		cf.value = ser;
	}
	renderOverview();
}
/* Helper: rebuild a series select to match current series, optionally include SKU options */
function _syncSeriesSelect(sel, ser) {
	if (!sel) return;
	const base =
		'<option value="ALL">Tất cả</option><option value="MB">MB</option><option value="NCA">NCA</option><option value="CG">CG</option>';
	if (ser === 'ALL') {
		sel.innerHTML = base;
	} else {
		const prods = PRODUCTS.filter((p) => p.s === ser);
		sel.innerHTML =
			`<option value="ALL">Tất cả</option><option value="MB">MB</option><option value="NCA">NCA</option><option value="CG">CG</option>` +
			'<optgroup label="── ' +
			ser +
			' ──">' +
			prods
				.map((p) => `<option value="${p.code}">${p.code}</option>`)
				.join('') +
			'</optgroup>';
	}
}
/* Khi pie filter đổi → sync ov_filter nếu là series level */
function ovPieChanged() {
	const v = document.getElementById('ov_pie_f')?.value || 'ALL';
	const isSkuLevel = PRODUCTS.some((p) => p.code === v);
	if (!isSkuLevel) {
		const of = document.getElementById('ov_filter');
		if (of && of.value !== v) {
			of.value = v;
			ovFilterChanged();
			return;
		}
	}
	buildPieChart();
}
/* Khi cum filter đổi → sync */
function ovCumChanged() {
	const v = document.getElementById('ov_cum_f')?.value || 'ALL';
	const isSkuLevel = PRODUCTS.some((p) => p.code === v);
	if (!isSkuLevel) {
		const of = document.getElementById('ov_filter');
		if (of && of.value !== v) {
			of.value = v;
			ovFilterChanged();
			return;
		}
	}
	buildOvCumChart();
}
function planFilterChanged() {
	const ser = document.getElementById('plan_series')?.value || 'ALL';
	const skuSel = document.getElementById('plan_sku');
	/* Rebuild SKU select */
	if (skuSel) {
		if (ser !== 'ALL') {
			skuSel.style.display = '';
			const prods2 = PRODUCTS.filter((p) => p.s === ser);
			skuSel.innerHTML =
				`<option value="ALL">Mọi mã ${ser}</option>` +
				prods2
					.map((p) => `<option value="${p.code}">${p.code}</option>`)
					.join('');
		} else {
			skuSel.style.display = 'none';
			skuSel.value = 'ALL';
		}
	}
	buildPlanTable();
	updatePlanCharts();
	saveUIState();
}
function planSkuChanged() {
	buildPlanTable();
	updatePlanCharts();
	saveUIState();
}

/* ── NG CHARTS IMPROVED ── */
function buildNGCharts() {
	/* Chart 1: NG xu hướng theo ngày + filter by series/SKU */
	const ngSer = document.getElementById('ng_filter_ser')?.value || 'ALL';
	const ngSku = document.getElementById('ng_filter_sku')?.value || 'ALL';
	let filtered = ngData;
	if (ngSer !== 'ALL')
		filtered = filtered.filter(
			(r) => PRODUCTS.find((p) => p.code === r.sku)?.s === ngSer,
		);
	if (ngSku !== 'ALL') filtered = filtered.filter((r) => r.sku === ngSku);

	/* Trend chart */
	if (charts.ngTrend) charts.ngTrend.destroy();
	const te = document.getElementById('ng_trend');
	if (te) {
		if (!filtered.length) {
			te.parentElement.innerHTML =
				'<p style="text-align:center;color:var(--t3);padding:40px;font-size:11px">Chưa có dữ liệu NG</p>';
			return;
		}
		const g = {};
		filtered.forEach((r) => {
			if (!g[r.date]) g[r.date] = 0;
			g[r.date] += r.qty;
		});
		const dates = Object.keys(g).sort();
		charts.ngTrend = new Chart(te, {
			type: 'bar',
			data: {
				labels: dates,
				datasets: [
					{
						label: 'NG qty/ngày',
						data: dates.map((d) => g[d]),
						backgroundColor: '#fca5a5',
						borderWidth: 0,
					},
					{
						label: 'Trend',
						data: dates.map((d) => g[d]),
						type: 'line',
						borderColor: '#dc2626',
						pointRadius: 3,
						borderWidth: 2,
						fill: false,
						tension: 0.3,
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
					y: { ticks: { font: { size: 9 } } },
				},
			},
		});
	}

	/* Pareto chart */
	if (charts.ngPareto) charts.ngPareto.destroy();
	const pe = document.getElementById('ng_pareto');
	if (pe && filtered.length) {
		const gc = {};
		filtered.forEach((r) => {
			const lbl = r.ngCode
				? NG_CODES.find((c) => c.code === r.ngCode)?.vn || 'Code ' + r.ngCode
				: r.cause || 'Khác';
			if (!gc[lbl]) gc[lbl] = 0;
			gc[lbl] += r.qty;
		});
		const sorted = Object.entries(gc)
			.sort((a, b) => b[1] - a[1])
			.slice(0, 10);
		const total = sorted.reduce((s, [, v]) => s + v, 0);
		let cum = 0;
		const cp = sorted.map(([, v]) => {
			cum += v;
			return +((cum / total) * 100).toFixed(1);
		});
		charts.ngPareto = new Chart(pe, {
			type: 'bar',
			data: {
				labels: sorted.map(([k]) => k),
				datasets: [
					{
						label: 'NG qty',
						data: sorted.map(([, v]) => v),
						backgroundColor: '#fca5a5',
						borderWidth: 0,
					},
					{
						label: '累計%',
						data: cp,
						type: 'line',
						borderColor: '#dc2626',
						yAxisID: 'y2',
						pointRadius: 3,
						borderWidth: 2,
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
					x: { ticks: { font: { size: 8 }, maxRotation: 35 } },
					y: { ticks: { font: { size: 9 } } },
					y2: {
						position: 'right',
						min: 0,
						max: 100,
						ticks: { font: { size: 9 }, callback: (v) => v + '%' },
					},
				},
			},
		});
	}

	/* NEW: NG by Series pie */
	if (charts.ngPie) charts.ngPie.destroy();
	const pie = document.getElementById('ng_pie_chart');
	if (pie && filtered.length) {
		const gs = { MB: 0, NCA: 0, CG: 0, Unknown: 0 };
		filtered.forEach((r) => {
			const s = PRODUCTS.find((p) => p.code === r.sku)?.s || 'Unknown';
			gs[s] = (gs[s] || 0) + r.qty;
		});
		const entries = Object.entries(gs).filter(([, v]) => v > 0);
		charts.ngPie = new Chart(pie, {
			type: 'doughnut',
			data: {
				labels: entries.map(([k]) => k),
				datasets: [
					{
						data: entries.map(([, v]) => v),
						backgroundColor: entries.map(
							([k]) =>
								({
									MB: '#1e5fa8',
									NCA: '#dc2626',
									CG: '#16a34a',
									Unknown: '#9aa3b0',
								})[k] || '#888',
						),
						borderWidth: 2,
						borderColor: '#fff',
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
			},
		});
	}

	/* NEW: NG by SKU bar */
	if (charts.ngBySku) charts.ngBySku.destroy();
	const bsk = document.getElementById('ng_bysku_chart');
	if (bsk && filtered.length) {
		const gs2 = {};
		filtered.forEach((r) => {
			if (!gs2[r.sku]) gs2[r.sku] = 0;
			gs2[r.sku] += r.qty;
		});
		const sorted2 = Object.entries(gs2).sort((a, b) => b[1] - a[1]);
		const skuColors = sorted2.map(
			([k]) => SM[PRODUCTS.find((p) => p.code === k)?.s]?.c || '#888',
		);
		charts.ngBySku = new Chart(bsk, {
			type: 'bar',
			data: {
				labels: sorted2.map(([k]) => k),
				datasets: [
					{
						label: 'NG qty',
						data: sorted2.map(([, v]) => v),
						backgroundColor: skuColors,
						borderWidth: 0,
					},
				],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				indexAxis: 'y',
				plugins: { legend: { display: false } },
				scales: {
					x: { ticks: { font: { size: 8 } } },
					y: { ticks: { font: { size: 9 } } },
				},
			},
		});
	}
}

/* ── REALTIME REFRESH — save triggers immediate rebuild ── */
/* refreshActiveTab below */
function refreshActiveTab() {
	const at = document.querySelector('.panel.act');
	if (!at) return;
	const n = at.id.replace('tab-', '');
	if (n === 'overview') renderOverview();
	if (n === 'plan') {
		buildPlanTable();
		setTimeout(() => {
			updatePlanCharts();
			Object.values(charts).forEach((c) => {
				try {
					c.resize();
				} catch (e) {}
			});
		}, 120);
	}
	if (n === 'heatmap') buildHeatmap();
	if (n === 'worker') buildWorkerCards();
	if (n === 'quality') {
		buildNGTable();
		buildNGCharts();
	}
	if (n === 'capacity') {
		const { res: c, sys: s } = cascade('MB63TD');
		buildProcTable(c, s);
		buildSOBBars(c, s);
	}
}

/* ── OVERVIEW: staff attendance ── */
/* ── A5: NG SUMMARY (mini) cho Overview ── */
function buildNGSummary() {
	const el = document.getElementById('ov_ng_summary');
	if (!el) return;
	const mo =
		document.getElementById('ov_month')?.value ||
		new Date().toISOString().slice(0, 7);
	const moEl = document.getElementById('ng_sum_mo');
	if (moEl) moEl.textContent = mo;
	/* Filter ngData by month */
	const rows = ngData.filter((r) => r.date && r.date.startsWith(mo));
	if (!rows.length) {
		el.innerHTML =
			'<p style="font-size:11px;color:var(--t3);padding:4px 0">Chưa có data NG tháng này</p>';
		return;
	}
	/* Aggregate by ngCode */
	const byCode = {};
	rows.forEach((r) => {
		const k = r.ngCode || '?';
		if (!byCode[k]) byCode[k] = { code: k, qty: 0, desc: '', causes: {} };
		byCode[k].qty += r.qty || 0;
		if (r.cause)
			byCode[k].causes[r.cause] =
				(byCode[k].causes[r.cause] || 0) + (r.qty || 0);
		const codeInfo = NG_CODES.find((c) => c.code === k);
		if (codeInfo) byCode[k].desc = codeInfo.vn || codeInfo.jp || '';
	});
	const sorted = Object.values(byCode)
		.sort((a, b) => b.qty - a.qty)
		.slice(0, 3);
	const totalNG = rows.reduce((s, r) => s + (r.qty || 0), 0);
	el.innerHTML = `
    <div style="font-size:10px;color:var(--t3);margin-bottom:6px">Tổng NG: <b style="color:var(--red-m);font-family:var(--mono)">${totalNG} pcs</b> | ${rows.length} records</div>
    ${sorted
			.map((c, i) => {
				const topCause = Object.entries(c.causes).sort(
					(a, b) => b[1] - a[1],
				)[0];
				const pct = totalNG > 0 ? Math.round((c.qty / totalNG) * 100) : 0;
				return `<div style="margin-bottom:7px">
        <div style="display:flex;align-items:center;gap:5px;margin-bottom:2px">
          <span style="background:${i === 0 ? '#fef2f2' : i === 1 ? '#fffbeb' : '#f0fdf4'};color:${i === 0 ? 'var(--red-m)' : i === 1 ? 'var(--amb-m)' : 'var(--grn-m)'};font-size:9px;font-weight:700;padding:1px 5px;border-radius:3px">#${i + 1}</span>
          <span style="font-size:10px;font-weight:700;font-family:var(--mono)">${c.code}</span>
          <span style="font-size:9.5px;color:var(--t2);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.desc}</span>
          <span style="font-family:var(--mono);font-size:10px;font-weight:700;color:var(--red-m)">${c.qty}</span>
        </div>
        <div style="height:4px;background:#f0f2f6;border-radius:2px;overflow:hidden">
          <div style="height:100%;width:${pct}%;background:${i === 0 ? 'var(--red-m)' : i === 1 ? 'var(--amb-m)' : 'var(--grn-m)'};border-radius:2px"></div>
        </div>
        ${topCause ? `<div style="font-size:9px;color:var(--t3);margin-top:1px">↳ ${topCause[0]}</div>` : ''}
      </div>`;
			})
			.join('')}
    <div style="margin-top:6px;padding-top:6px;border-top:1px dashed var(--bdr)">
      <span style="font-size:9px;color:var(--t3)">💡 Đối ứng: </span>
      <span id="ng_sum_action" style="font-size:9px;color:var(--t2)" contenteditable="false">${localStorage.getItem('smc_ng_sum_action_' + mo) || 'Chưa cập nhật'}</span>
    </div>`;
	/* Enable edit on click in edit mode */
	const actionEl = document.getElementById('ng_sum_action');
	if (actionEl) {
		actionEl.addEventListener('blur', () => {
			localStorage.setItem('smc_ng_sum_action_' + mo, actionEl.textContent);
		});
		if (document.body.classList.contains('edit-mode'))
			actionEl.contentEditable = 'true';
	}
}

function buildStaffSummary() {
	const el = document.getElementById('ov_staff');
	if (!el) return;
	const now = new Date();
	const todayY = now.getFullYear(),
		todayM = now.getMonth() + 1,
		todayD = now.getDate();
	const todayMo = `${todayY}-${String(todayM).padStart(2, '0')}`;
	let att = {};
	try {
		att = JSON.parse(localStorage.getItem('smc_attendance_' + todayMo) || '{}');
	} catch (e) {}
	/* ONLY use actual attendance data for today — never fallback to monthly leave total */
	const hasAttData = Object.keys(att).length > 0;
	const todayAbsent = WORKERS.filter((w) => (att[w.id]?.[todayD] || 0) > 0);
	const onLeave = todayAbsent; /* strict: only today's real data */
	const workers = WORKERS.length;
	const present = workers - onLeave.length;
	const pct = workers > 0 ? Math.round((present / workers) * 100) : 100;
	el.innerHTML = `
    <div style="display:flex;gap:10px;align-items:flex-start;flex-wrap:wrap;margin-bottom:8px">
      <div style="text-align:center;min-width:50px">
        <div style="font-size:28px;font-weight:700;color:var(--grn-m);font-family:var(--mono)">${present}</div>
        <div style="font-size:9px;color:var(--t3)">Đi làm</div>
      </div>
      <div style="width:1px;height:40px;background:var(--bdr);align-self:center"></div>
      <div style="text-align:center;min-width:50px">
        <div style="font-size:28px;font-weight:700;color:${onLeave.length ? 'var(--red-m)' : 'var(--t3)'};font-family:var(--mono)">${onLeave.length}</div>
        <div style="font-size:9px;color:var(--t3)">Nghỉ</div>
      </div>
      <div style="width:1px;height:40px;background:var(--bdr);align-self:center"></div>
      <div style="text-align:center;min-width:50px">
        <div style="font-size:28px;font-weight:700;color:var(--t2);font-family:var(--mono)">${workers}</div>
        <div style="font-size:9px;color:var(--t3)">Tổng</div>
      </div>
      <div style="flex:1;min-width:100px;align-self:center">
        <div style="font-size:9px;color:var(--t3);margin-bottom:3px">Hôm nay ${todayD}/${todayM} — ${hasAttData ? pct + '%' : '?'}</div>
        <div style="height:7px;background:#e5e7eb;border-radius:4px;overflow:hidden">
          <div style="height:100%;width:${hasAttData ? pct : 100}%;background:${hasAttData ? (pct >= 80 ? 'var(--grn-m)' : 'var(--amb-m)') : '#d1d5db'};border-radius:4px"></div>
        </div>
        ${!hasAttData ? `<div style="font-size:8.5px;color:var(--amb-m);margin-top:2px">⚠ Chưa nhập điểm danh tháng ${todayMo}<br>→ Tab Nhân sự → Bảng ngày nghỉ</div>` : '<div style="font-size:8.5px;color:var(--grn-m);margin-top:2px">✓ Từ bảng điểm danh</div>'}
      </div>
    </div>
    <!-- Worker dots: green=present, red=absent today, grey=no data -->
    <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:7px">
      ${WORKERS.map((w) => {
				const val = att[w.id]?.[todayD] || 0;
				const absent = val > 0;
				const noData = !hasAttData;
				const bg = noData ? '#f3f4f6' : absent ? '#fecaca' : '#bbf7d0';
				const border = noData
					? '#d1d5db'
					: absent
						? 'var(--red-m)'
						: 'var(--grn-m)';
				const fc = noData
					? '#9ca3af'
					: absent
						? 'var(--red-m)'
						: 'var(--grn-m)';
				return `<div title="${w.name}${absent ? ' — Nghỉ hôm nay' : noData ? ' — Chưa có data' : ' — Đi làm'}" style="width:24px;height:24px;border-radius:50%;background:${bg};border:2px solid ${border};display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:${fc};cursor:default">${w.name.charAt(0)}</div>`;
			}).join('')}
    </div>
    ${
			onLeave.length
				? `
    <div style="border-top:1px dashed var(--bdr);padding-top:6px">
      <div style="font-size:9px;font-weight:700;color:var(--red-m);margin-bottom:4px">Người nghỉ hôm nay (${todayD}/${todayM}):</div>
      ${onLeave
				.map((w) => {
					const val = att[w.id]?.[todayD] || 0;
					return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:3px">
          <span style="font-size:10px;font-weight:700">${w.name}</span>
          <span style="font-size:9px;background:#f1f3f6;padding:1px 5px;border-radius:10px;color:var(--t3)">${w.ca || 'Ca1'}</span>
          <span style="font-size:9px;color:var(--t3)">— ${w.leaveNote || 'Nghỉ phép'}</span>
          <span style="font-size:9px;font-family:var(--mono);font-weight:700;color:var(--red-m);margin-left:auto">${val}d</span>
        </div>`;
				})
				.join('')}
    </div>`
				: `<div style="font-size:10px;color:${hasAttData ? 'var(--grn-m)' : 'var(--t3)'};font-weight:700">${hasAttData ? '✅ Toàn bộ đi làm hôm nay' : 'Nhập điểm danh để xem thực tế'}</div>`
		}`;
}
function buildHelpTab() {
	const el = document.getElementById('help_content');
	if (!el) return;
	const L = I18N[curLang] || I18N.vi;
	const tabs = [
		{
			icon: '📊',
			key: 'overview',
			desc: {
				vi: '(1)Tổng quan tiến độ tháng. <br>(2)KPI + tiến độ từng mã SP.<br> (3)Biểu đồ tỉ trọng, lũy kế.<br> (4)Thông tin nhân sự đi làm.',
				jp: '月次生産進捗の概要。KPI、品番別進捗、生産比率グラフ、累計、人員。',
				en: 'Monthly production overview. KPI, per-SKU progress, output distribution, cumulative, staff.',
			},
		},
		{
			icon: '📅',
			key: 'plan',
			desc: {
				vi: '(1)Nhập số lượng SP theo KH và cập nhập TT. <br> (2)Bộ lọc cho phép phân loại theo : SP/Tỉ lệ/Số lg.<br>(3)Bảng dữ liệu thực tích theo từng ngày và lũy kế.',
				jp: '受注から計画入力、日次実績入力。品番ごとに計画/実績/%の3行。CSV出力/入力。',
				en: 'Enter plan from orders and daily actual. 3 rows per SKU: Plan/Actual/%. Export/Import CSV.',
			},
		},
		{
			icon: '⚡',
			key: 'pulse',
			desc: {
				vi: 'Timeline sản xuất (8:00~16:30). CT database per mã x công đoạn. NOW marker realtime.',
				jp: 'リアルタイムタイムライン (8:00~16:30)。品番x工程別CT。NOWマーカー。',
				en: 'Production timeline (8:00~16:30). CT per SKU x process. Real-time NOW marker.',
			},
		},
		{
			icon: '🟩',
			key: 'heatmap',
			desc: {
				vi: 'Ma trận ngày x mã SP, màu theo % KH. Xanh=OK, Vàng=Chú ý, Đỏ=Cảnh báo.',
				jp: '日付x品番マトリクス、計画達成率色分け。緑=OK、黄=注意、赤=警告。',
				en: 'Day x SKU matrix, colored by plan %. Green=OK, Yellow=Watch, Red=Alert.',
			},
		},
		{
			icon: '📊',
			key: 'compare',
			desc: {
				vi: 'So sánh tối đa 6 tháng. 3 views: Trend, Cột per SKU, Bảng tóm tắt.',
				jp: '最大6ヶ月比較。3ビュー：トレンド、棒グラフ、サマリー。',
				en: 'Compare up to 6 months. 3 views: Trend lines, Bar per SKU, Summary table.',
			},
		},
		{
			icon: '🔄',
			key: 'ca3',
			desc: {
				vi: 'Cài đặt Ca1/Ca2/Ca3/Hành chính. Thực tích per công đoạn per ca.',
				jp: 'シフト1/2/3/管理設定。工程別・シフト別実績。',
				en: 'Setup shifts Ca1/Ca2/Ca3/Office. Actuals per process per shift.',
			},
		},
		{
			icon: '👷',
			key: 'worker',
			desc: {
				vi: '(1)Hồ sơ nhân viên:Kỹ năng, thông tin cá nhân.<br> (2)Bảng diểm danh tháng.<br>(3)Ghi nhận vi phạm tháng .',
				jp: '作業者プロフィール、工程、スキル。出欠表 (0.5日単位)。スキルマトリクス。',
				en: 'Worker profiles, kotei, skills. Attendance table (0.5 day). Skill matrix.',
			},
		},
		{
			icon: '❌',
			key: 'quality',
			desc: {
				vi: 'Nhập NG theo ngày/mã/lỗi. 4 biểu đồ: Xu hướng, Pareto, Series, per mã. Bảng mã 301-401.',
				jp: 'NG入力。4グラフ：推移、パレート、シリーズ別、品番別。不良コード表。',
				en: 'NG entry by date/SKU/code. 4 charts. Code table 301-401.',
			},
		},
		{
			icon: '🔧',
			key: 'incident',
			desc: {
				vi: 'Báo cáo sự cố: Hiện tượng/Điều tra/Đối sách/Kết quả. Đính kèm ảnh & Excel.',
				jp: '設備不具合：現象/調査/対策/結果。写真・Excel添付可。',
				en: 'Incident reports: Phenomenon/Investigation/Action/Result. Attach photos & Excel.',
			},
		},
		{
			icon: '📋',
			key: 'reports',
			desc: {
				vi: 'Template báo cáo + thêm tùy chỉnh. Lưu riêng từng báo cáo, export TXT.',
				jp: '報告書テンプレ＋カスタム追加可。個別保存、TXT出力。',
				en: 'Report templates + custom types. Save individually, export TXT.',
			},
		},
		{
			icon: '⚙',
			key: 'capacity',
			desc: {
				vi: 'CT thực đo vs cài đặt. Cascade: SYS = MIN(effective/kotei). Filter Series/SKU.',
				jp: '実測CT vs 設定CT。カスケード: SYS=MIN(各工程)。フィルタ対応。',
				en: 'Measured vs set CT. Cascade: SYS=MIN(effective/process). Filter Series/SKU.',
			},
		},
	];
	const sc = [
		['Ctrl+S', { vi: 'Lưu tất cả', jp: '全保存', en: 'Save All' }],
		[
			'Ctrl+E',
			{ vi: 'Toggle Edit Mode', jp: '編集切替', en: 'Toggle Edit Mode' },
		],
		['Ctrl+P', { vi: 'In báo cáo', jp: '印刷', en: 'Print' }],
		['Esc', { vi: 'Thoát Edit', jp: '編集終了', en: 'Exit Edit' }],
	];
	el.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px;margin-bottom:10px">
      ${tabs
				.map(
					(
						t,
					) => `<div class="card" style="padding:10px 12px;margin-bottom:0;border-left:3px solid var(--blue)">
        <div style="font-size:18px;margin-bottom:3px">${t.icon} <span style="font-size:11px;font-weight:700;color:var(--navy)">${L[t.key] || t.key}</span></div>
        <div style="font-size:10px;color:var(--t2);line-height:1.5">${t.desc[curLang] || t.desc.vi}</div>
      </div>`,
				)
				.join('')}
    </div>
    <div class="g2">
      <div class="card" style="padding:12px"><div class="ct"><span class="dot" style="background:var(--blue)"></span>${L.help_shortcuts || 'Phím tắt'}</div>
        ${sc.map(([k, d]) => `<div style="display:flex;gap:8px;align-items:center;margin-bottom:5px"><code style="background:#f1f5f9;padding:2px 8px;border-radius:4px;font-size:10px;border:1px solid var(--bdr);flex-shrink:0">${k}</code><span style="font-size:11px;color:var(--t2)">${d[curLang] || d.vi}</span></div>`).join('')}
      </div>
      <div class="card" style="padding:12px"><div class="ct"><span class="dot" style="background:var(--grn-m)"></span>${L.help_data || 'Lưu & Chia sẻ'}</div>
        <div style="font-size:10.5px;color:var(--t2);line-height:1.9">${{ vi: '<b>Lưu:</b> Ctrl+S vào localStorage.<br><b>Chia sẻ:</b> Export HTML (file có data).<br><b>Migrate:</b> Export JSON sang version mới.<br><b>CSV:</b> Tab Kế hoạch, Export CSV/tháng.', jp: '<b>保存:</b> Ctrl+S でlocalStorageへ。<br><b>共有:</b> HTMLエクスポート（データ込み）。<br><b>移行:</b> JSONエクスポートで新版へ。<br><b>CSV:</b> 計画タブから月次エクスポート。', en: '<b>Save:</b> Ctrl+S to localStorage.<br><b>Share:</b> Export HTML (includes data).<br><b>Migrate:</b> Export JSON to new version.<br><b>CSV:</b> Schedule tab, export per month.' }[curLang] || ''}</div>
      </div>
    </div>`;
}

/* BOOTSTRAP — correct order */
loadAll();
initSelects();
buildStaffSummary();
renderCustomRptTypes();
setTimeout(initCardToggles, 300);
setTimeout(restoreUIState, 100); /* Restore UI preferences after DOM ready */
buildCTTable();
buildWorkerCards();
buildPlanTable();
/* Lock plan inputs at startup (edit mode is off) */
document
	.querySelectorAll('.pt-in')
	.forEach((el) => el.setAttribute('readonly', ''));
buildHeatmap();
buildNGTable();
renderIssues();
renderViolList();
renderIncList();
update();
const savedLang = localStorage.getItem('smc_lang');
if (savedLang && savedLang !== 'vi') setLang(savedLang);
const idate = document.getElementById('issue_date');
if (idate) idate.value = new Date().toISOString().slice(0, 10);
const vdate = document.getElementById('viol_date');
if (vdate) vdate.value = new Date().toISOString().slice(0, 10);
setInterval(updateStatusBar, 1000);
setInterval(() => {
	if (document.getElementById('tab-pulse')?.classList.contains('act')) {
		drawPulse();
	}
	const rc = document.getElementById('rt_clock');
	if (rc)
		rc.textContent = new Date().toLocaleTimeString('vi-VN', {
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
		});
}, 60000);
window.addEventListener('resize', () => {
	if (document.getElementById('tab-pulse')?.classList.contains('act'))
		drawPulse();
	Object.values(charts).forEach((c) => {
		try {
			c.resize();
		} catch (e) {}
	});
});
