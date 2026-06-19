/* ════════════════════════════════════════════════════════════════════
   dashboard_auth.js  —  AUTH (Phase 3 — P3-A, MVP)
   ------------------------------------------------------------------
   API: login / logout / check_session / change_password (api_auth.php)
   - Login modal CHẶN dùng dashboard cho tới khi đăng nhập (UI-level gate)
   - Đổi password cho user đang login

   ⚠ LƯU Ý QUAN TRỌNG — phạm vi bản này:
   Các action khác (get_workers, get_ctsx, save_plan...) HIỆN CHƯA check
   session ở phía server. Login ở đây là bước đầu (P3-A) để có chỗ đổi
   password an toàn — CHƯA phải kiểm soát quyền truy cập thật theo 4 role.
   Việc đó để làm tiếp ở bước "P3-A: Roles 4 cấp" sau, cần thêm session-check
   vào từng module api_*.php.

   Cần: dashboard_core.js (openModal/closeModal), dashboard_api.js (API_BASE)
   ════════════════════════════════════════════════════════════════════ */

let currentUser = null;

async function apiLogin(username, password) {
	try {
		const r = await fetch(`${API_BASE}?action=login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, password }),
		});
		return await r.json();
	} catch (e) {
		return { success: false, error: 'Không kết nối được server' };
	}
}

async function apiLogout() {
	try {
		const r = await fetch(`${API_BASE}?action=logout`);
		return await r.json();
	} catch (e) {
		return { success: false };
	}
}

async function apiCheckSession() {
	try {
		const r = await fetch(`${API_BASE}?action=check_session`);
		return await r.json();
	} catch (e) {
		return { success: false, logged_in: false };
	}
}

async function apiChangePassword(oldPw, newPw) {
	try {
		const r = await fetch(`${API_BASE}?action=change_password`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ old_password: oldPw, new_password: newPw }),
		});
		return await r.json();
	} catch (e) {
		return { success: false, error: 'Không kết nối được server' };
	}
}

/* Render badge 👤 tên + role + nút đổi password / đăng xuất ở header */
function updateUserBadge() {
	const badge = document.getElementById('user_badge');
	if (!badge) return;
	if (currentUser) {
		badge.innerHTML =
			`👤 ${currentUser.display_name} <span style="opacity:.75">(${currentUser.role})</span> ` +
			`<button class="btn sm" style="padding:2px 6px" onclick="showChangePwModal()">🔑 Đổi password</button> ` +
			`<button class="btn sm" style="padding:2px 6px" onclick="doLogout()">🚪 Đăng xuất</button>`;
	} else {
		badge.innerHTML = '';
	}
}

async function doLogin() {
	const u = document.getElementById('login_user')?.value.trim();
	const p = document.getElementById('login_pass')?.value;
	const err = document.getElementById('login_err');
	if (err) err.textContent = '';
	if (!u || !p) {
		if (err) err.textContent = 'Nhập đủ username + password';
		return;
	}
	const res = await apiLogin(u, p);
	if (res.success) {
		currentUser = res.user;
		closeModal('modal_login');
		updateUserBadge();
	} else {
		if (err) err.textContent = '❌ ' + (res.error || 'Sai username/password');
	}
}

async function doLogout() {
	await apiLogout();
	currentUser = null;
	updateUserBadge();
	openModal('modal_login');
}

function showChangePwModal() {
	['changepw_old', 'changepw_new', 'changepw_confirm'].forEach((id) => {
		const el = document.getElementById(id);
		if (el) el.value = '';
	});
	const err = document.getElementById('changepw_err');
	if (err) err.textContent = '';
	openModal('modal_changepw');
}

async function doChangePassword() {
	const oldPw = document.getElementById('changepw_old')?.value;
	const newPw = document.getElementById('changepw_new')?.value;
	const confirmPw = document.getElementById('changepw_confirm')?.value;
	const err = document.getElementById('changepw_err');
	if (err) err.textContent = '';

	if (!oldPw || !newPw || !confirmPw) {
		if (err) err.textContent = 'Nhập đủ 3 ô';
		return;
	}
	if (newPw.length < 6) {
		if (err) err.textContent = 'Password mới phải ≥ 6 ký tự';
		return;
	}
	if (newPw !== confirmPw) {
		if (err) err.textContent = 'Password mới (2 ô) không khớp nhau';
		return;
	}

	const res = await apiChangePassword(oldPw, newPw);
	if (res.success) {
		closeModal('modal_changepw');
		alert('✅ Đổi password thành công! Lần đăng nhập sau dùng password mới.');
	} else {
		if (err) err.textContent = '❌ ' + (res.error || 'Lỗi đổi password');
	}
}

/* Cho phép Enter để submit form trong 2 modal, đỡ phải bấm nút */
function loginKeydown(ev) {
	if (ev.key === 'Enter') doLogin();
}
function changepwKeydown(ev) {
	if (ev.key === 'Enter') doChangePassword();
}

/* Bootstrap riêng của module Auth — check session ngay khi file này load
   (chạy async, không block các script load sau — nên login modal sẽ hiện
   ra sau khi trang đã render, không phải chặn render hoàn toàn) */
(async function initAuth() {
	const res = await apiCheckSession();
	if (res.success && res.logged_in) {
		currentUser = res.user;
		updateUserBadge();
	} else {
		openModal('modal_login');
	}
})();
