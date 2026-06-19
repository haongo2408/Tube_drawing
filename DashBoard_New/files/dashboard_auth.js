/* ════════════════════════════════════════════════════════════════════
   dashboard_auth.js  —  AUTH (Phase 3 — P3-A, MVP v2)
   ------------------------------------------------------------------
   API: login / logout / check_session / change_password (api_auth.php)

   THIẾT KẾ: "Xem tự do — Sửa mới cần login"
   - KHÔNG chặn xem dashboard (không tự mở modal login khi load trang)
   - Bấm ✏️ Edit Mode → nếu chưa login thì hỏi login trước, login xong
     tự động vào Edit Mode luôn (không cần bấm lại)
   - Đổi password chỉ hiện khi đã login

   ⚠ LƯU Ý PHẠM VI: vẫn CHƯA phân quyền theo 4 role ở server (các API như
   get_workers, save_plan... hiện chưa check session) — đây mới là lớp UI,
   để dễ biết "ai đang sửa" + có chỗ đổi password an toàn. Phân quyền thật làm sau.

   Cần: dashboard_core.js (openModal/closeModal/enterEdit), dashboard_api.js (API_BASE)
   ════════════════════════════════════════════════════════════════════ */

let currentUser = null;
let _pendingEditAfterLogin = false;

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

/* Chưa login → hiện nút "Đăng nhập" nhỏ gọn. Đã login → hiện tên + nút đổi pass/đăng xuất */
function updateUserBadge() {
	const badge = document.getElementById('user_badge');
	if (!badge) return;
	if (currentUser) {
		badge.innerHTML =
			`👤 ${currentUser.display_name} <span style="opacity:.75">(${currentUser.role})</span> ` +
			`<button class="btn sm" style="padding:2px 6px" onclick="showChangePwModal()">🔑 Đổi password</button> ` +
			`<button class="btn sm" style="padding:2px 6px" onclick="doLogout()">🚪 Đăng xuất</button>`;
	} else {
		badge.innerHTML = `<button class="btn sm" style="padding:2px 6px" onclick="openModal('modal_login')">🔑 Đăng nhập</button>`;
	}
}

/* Gọi từ nút ✏️ Edit Mode thay vì gọi enterEdit() trực tiếp —
   chỉ hỏi login khi THỰC SỰ muốn sửa, xem thì không hỏi */
function requestEdit() {
	if (currentUser) {
		enterEdit();
	} else {
		_pendingEditAfterLogin = true;
		openModal('modal_login');
	}
}

function cancelLogin() {
	_pendingEditAfterLogin = false;
	closeModal('modal_login');
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
		if (_pendingEditAfterLogin) {
			_pendingEditAfterLogin = false;
			enterEdit(); /* login để bấm Edit Mode → vào Edit Mode luôn, khỏi bấm lại */
		}
	} else {
		if (err) err.textContent = '❌ ' + (res.error || 'Sai username/password');
	}
}

async function doLogout() {
	await apiLogout();
	currentUser = null;
	updateUserBadge();
	if (typeof editMode !== 'undefined' && editMode) exitEdit(false); /* đang sửa mà đăng xuất → thoát Edit Mode luôn */
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

/* Bootstrap riêng của module Auth — check session NGẦM khi file load,
   CHỈ để hiện badge tên nếu đã login sẵn (session còn) — KHÔNG ép mở modal,
   vì xem dashboard không cần login (chỉ Edit Mode mới cần, xem requestEdit()) */
(async function initAuth() {
	const res = await apiCheckSession();
	if (res.success && res.logged_in) {
		currentUser = res.user;
	}
	updateUserBadge();
})();

