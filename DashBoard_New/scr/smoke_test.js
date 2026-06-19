/**
 * SMOKE TEST v2 — load Dashboard_New.html thật + 15 file JS đã tách, chạy trong jsdom
 * Dùng <script> element thật (không dùng eval()) để giả lập ĐÚNG cách browser
 * share let/const giữa nhiều <script> tag — đã verify riêng, eval() KHÔNG làm đúng
 * việc này trong jsdom nên smoke_test.js bản đầu báo lỗi giả (false positive).
 */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = '/home/claude/ctsx_work';
let html = fs.readFileSync(path.join(ROOT, 'Dashboard_New.html'), 'utf8');

// Bỏ hết <script>...</script> gốc trong HTML (CDN + 15 file local) —
// để jsdom không tự đi fetch (sandbox không có mạng ra ngoài tới cdnjs / file server).
// Giữ nguyên 100% phần còn lại (toàn bộ DOM thật: tab, panel, form, input...).
html = html.replace(/<script[^>]*src="[^"]*"[^>]*><\/script>/g, '');

const SCRIPT_ORDER = [
	'dashboard_core.js',
	'dashboard_api.js',
	'dashboard_auth.js',
	'dashboard_appdata.js',
	'dashboard_compare.js',
	'dashboard_plan.js',
	'dashboard_overview.js',
	'dashboard_heatmap.js',
	'dashboard_pulse.js',
	'dashboard_worker.js',
	'dashboard_quality.js',
	'dashboard_incident.js',
	'dashboard_reports.js',
	'dashboard_capacity.js',
	'dashboard_i18n.js',
	'dashboard_main.js',
];

const dom = new JSDOM(html, {
	runScripts: 'dangerously',
	url: 'http://localhost/DashBoard_New/Dashboard_New.html',
	pretendToBeVisual: true,
});
const { window } = dom;
const { document } = window;

const errors = [];
window.onerror = (msg, src, line) => {
	errors.push(`${msg}${line ? ' (script line ' + line + ')' : ''}`);
};

// ── Stub các thứ mà sandbox không gọi mạng/không có thật được (KHÔNG phải lỗi code mình) ──
window.fetch = () => Promise.reject(new Error('[stub] no network trong sandbox test'));
window.alert = (msg) => {};
window.confirm = () => true;
window.prompt = () => null;
class FakeChart {
	constructor() {}
	resize() {}
	destroy() {}
	update() {}
}
window.Chart = FakeChart;
window.ExcelJS = {
	Workbook: function () {
		return {
			addWorksheet: () => ({
				addRow: () => ({}),
				getRow: () => ({ values: [], eachCell: () => {} }),
				columns: [],
				mergeCells: () => {},
				getCell: () => ({}),
			}),
			xlsx: { writeBuffer: () => Promise.resolve(new ArrayBuffer(0)) },
		};
	},
};
window.HTMLCanvasElement.prototype.getContext = function () {
	return new Proxy({}, { get: () => () => {} });
};

function runInlineScript(code, label) {
	const before = errors.length;
	const s = document.createElement('script');
	s.textContent = code;
	document.body.appendChild(s);
	if (errors.length > before) {
		console.log(`  ✗ ${label} THROW: ${errors[errors.length - 1]}`);
		return false;
	}
	console.log(`  ✓ ${label} chạy OK`);
	return true;
}

console.log('═══ SMOKE TEST v2: load + run 15 file JS (dùng <script> thật, không dùng eval) ═══\n');

let stopped = false;
for (const fname of SCRIPT_ORDER) {
	if (stopped) break;
	const code = fs.readFileSync(path.join(ROOT, 'split', fname), 'utf8');
	const ok = runInlineScript(code, fname);
	if (!ok) stopped = true;
}

async function checkAuthGate() {
	await new Promise((r) => setTimeout(r, 100));
	const loginModal = document.getElementById('modal_login');
	if (loginModal && loginModal.classList.contains('open')) {
		console.log('  ✓ Login modal tự mở (vì fetch stub fail → coi như chưa login) — đúng kỳ vọng');
	} else {
		console.log('  ✗ Login modal KHÔNG mở — sai kỳ vọng (lẽ ra phải mở khi check_session fail)');
		errors.push('Login modal không tự mở khi chưa đăng nhập');
	}
}

console.log('\n═══ Gọi goTab() cho từng tab (giả lập bấm hết nút tab) ═══\n');
const tabs = [
	'overview', 'plan', 'ctsx', 'pulse', 'ca3', 'heatmap',
	'compare', 'worker', 'quality', 'incident', 'reports', 'capacity',
];
const fakeBtn = { classList: { add: () => {}, remove: () => {} } };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runTabTests() {
	console.log('\n═══ Đợi initAuth() chạy xong (check_session async) ═══\n');
	await checkAuthGate();

	if (stopped) {
		console.log('  (Bỏ qua — file JS lỗi ở bước load, sửa trước đã)');
		return;
	}
	for (const t of tabs) {
		const before = errors.length;
		try {
			window.goTab(t, fakeBtn);
			await sleep(80); // goTab dùng setTimeout 50ms bên trong để gọi build*() — đợi nó chạy xong
		} catch (e) {
			errors.push(`goTab('${t}'): ${e.message}`);
		}
		if (errors.length > before) {
			console.log(`  ✗ goTab('${t}') lỗi: ${errors[errors.length - 1]}`);
		} else {
			console.log(`  ✓ goTab('${t}') OK`);
		}
	}

	console.log('\n═══ Thử Edit Mode (enterEdit/exitEdit) ═══\n');
	try {
		window.enterEdit();
		console.log('  ✓ enterEdit() OK');
		await sleep(20);
		window.exitEdit(false);
		console.log('  ✓ exitEdit(false) OK');
	} catch (e) {
		errors.push(`editMode: ${e.message}`);
		console.log('  ✗ editMode lỗi:', e.message);
	}

	console.log('\n═══ Thử luồng Login + Đổi password (mock fetch trả response giả) ═══\n');
	try {
		document.getElementById('login_user').value = 'admin';
		document.getElementById('login_pass').value = 'wrongpass';
		window.fetch = () =>
			Promise.resolve({ json: () => Promise.resolve({ success: false, error: 'Sai username hoặc password' }) });
		await window.doLogin();
		const errTxt1 = document.getElementById('login_err').textContent;
		console.log(errTxt1.includes('Sai') ? '  ✓ Login sai password → hiện lỗi đúng' : '  ✗ Không thấy lỗi khi login sai: ' + errTxt1);

		document.getElementById('login_pass').value = 'admin123';
		window.fetch = () =>
			Promise.resolve({
				json: () =>
					Promise.resolve({ success: true, user: { username: 'admin', display_name: 'Nguyễn Hải Đăng', role: 'admin' } }),
			});
		await window.doLogin();
		const badgeOk = document.getElementById('user_badge').innerHTML.includes('Nguyễn Hải Đăng');
		console.log(
			badgeOk
				? '  ✓ Login đúng → currentUser set đúng (xác nhận qua badge, vì let-scope currentUser không lên window)'
				: '  ✗ Login đúng nhưng currentUser có vẻ không được set (badge trống)',
		);
		console.log(
			document.getElementById('modal_login').classList.contains('open')
				? '  ✗ Modal login lẽ ra phải đóng sau khi login thành công'
				: '  ✓ Modal login đóng đúng sau login thành công',
		);
		console.log(badgeOk ? '  ✓ User badge hiện đúng tên' : '  ✗ User badge không hiện tên');

		document.getElementById('changepw_old').value = 'admin123';
		document.getElementById('changepw_new').value = '123';
		document.getElementById('changepw_confirm').value = '123';
		await window.doChangePassword();
		console.log(
			document.getElementById('changepw_err').textContent.includes('6 ký tự')
				? '  ✓ Validate password mới quá ngắn → chặn đúng (chưa gọi API)'
				: '  ✗ Không chặn password ngắn',
		);

		document.getElementById('changepw_new').value = 'newpass456';
		document.getElementById('changepw_confirm').value = 'KHONGKHOP';
		await window.doChangePassword();
		console.log(
			document.getElementById('changepw_err').textContent.includes('khớp')
				? '  ✓ Validate 2 ô password mới không khớp → chặn đúng'
				: '  ✗ Không chặn 2 ô không khớp',
		);

		document.getElementById('changepw_confirm').value = 'newpass456';
		window.fetch = () => Promise.resolve({ json: () => Promise.resolve({ success: true }) });
		await window.doChangePassword();
		console.log(
			!document.getElementById('modal_changepw').classList.contains('open')
				? '  ✓ Đổi password thành công → modal đóng đúng'
				: '  ✗ Modal đổi password lẽ ra phải đóng',
		);
	} catch (e) {
		errors.push(`auth flow: ${e.message}`);
		console.log('  ✗ Lỗi trong luồng auth:', e.message);
	}

	console.log('\n═══ KẾT QUẢ CUỐI ═══');
	if (errors.length === 0) {
		console.log('✅ PASS — 15 file load đúng thứ tự, mọi tab + edit mode chạy không lỗi ReferenceError/TypeError.');
		process.exit(0);
	} else {
		console.log(`❌ FAIL — ${errors.length} lỗi:`);
		errors.forEach((e) => console.log('  -', e));
		process.exit(1);
	}
}

runTabTests();
