/* ════════════════════════════════════════════════════════════════════
   dashboard_api.js  —  (file 2/15 — load order #2)
   ------------------------------------------------------------------
   PHASE 2 — API LAYER (kết nối MySQL qua api.php)
    - _checkApi(), apiLoadPlanActual, apiSaveKH, apiSaveTT, apiLoadProducts, apiLoadWorkers, apiImportExcel
    - CTSX (Step 5a): ctsxData, apiLoadCTSX, apiSaveCTSX, ctsxFilterChanged, renderCTSXTable,
      buildCTSXTable, addCTSXRow, saveCTSXAll
    Cần: dashboard_core.js (PRODUCTS, flashSave)
   ════════════════════════════════════════════════════════════════════ */

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

/**
 * ═══ CTSX (Chỉ thị sản xuất) — Step 5a ═══
 * Quản lý theo đơn hàng (m_ordersheet) — 1 SKU có thể có nhiều đơn,
 * mỗi đơn theo dõi tiến độ TT riêng (SUM qty_ok từ t_drawing).
 * API: get_ctsx / save_ctsx (api_ctsx.php)
 */
let ctsxData = [];

/**
 * GET danh sách CTSX theo tháng (+ filter SKU optional)
 * SQL: m_ordersheet JOIN m_production_numbers, t_drawing (xem api_ctsx.php)
 */
async function apiLoadCTSX(month, sku) {
	if (!(await _checkApi())) return false;
	try {
		let url = `${API_BASE}?action=get_ctsx&month=${month}`;
		if (sku && sku !== 'ALL') url += `&sku=${sku}`;
		const r = await fetch(url);
		const d = await r.json();
		if (!d.success) return false;
		ctsxData = d.data || [];
		return true;
	} catch (e) {
		console.warn('[API] get_ctsx failed:', e);
		return false;
	}
}

/**
 * POST tạo/cập nhật 1 đơn CTSX → DB
 * SQL: INSERT/UPDATE m_ordersheet (xem api_ctsx.php)
 * @param {object} row - 1 phần tử của ctsxData
 */
async function apiSaveCTSX(row) {
	try {
		const r = await fetch(`${API_BASE}?action=save_ctsx`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				ctsx_id: row.ctsx_id || 0,
				sku: row.sku,
				ordersheet_number: row.ordersheet_number || '',
				kh: row.kh || 0,
				issue_date: row.issue_date || null,
				delivery_date: row.delivery_date || null,
				note: row.note || '',
			}),
		});
		return await r.json();
	} catch (e) {
		console.warn('[API] save_ctsx failed:', e);
		return { success: false, error: e.message };
	}
}

/* Series filter → rebuild SKU dropdown (giống pattern ngFilterChanged) */
function ctsxFilterChanged() {
	const ser = document.getElementById('ctsx_series')?.value || 'ALL';
	const skuSel = document.getElementById('ctsx_sku');
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
	buildCTSXTable();
}

/* Render thuần từ ctsxData (không fetch) — dùng khi addCTSXRow() để giữ dòng mới chưa lưu */
function renderCTSXTable() {
	const tbody = document.getElementById('ctsx_body');
	if (!tbody) return;
	const statusFilter = document.getElementById('ctsx_status')?.value || 'ALL';
	let rows = ctsxData;
	if (statusFilter !== 'ALL')
		rows = rows.filter((r) => r.status === statusFilter);

	if (!rows.length) {
		tbody.innerHTML =
			'<tr><td colspan="9" style="text-align:center;padding:12px;color:var(--t3)">Không có đơn hàng nào tháng này</td></tr>';
	} else {
		tbody.innerHTML = rows
			.map((r) => {
				const i = ctsxData.indexOf(r);
				const pct = r.progress_pct || 0;
				const barColor =
					pct >= 100
						? 'var(--grn-m)'
						: pct >= 50
							? 'var(--amb-m)'
							: 'var(--blue)';
				const statusBadge =
					r.status === 'done' ? '✅' : r.status === 'running' ? '🔵' : '⏳';
				return `<tr style="border-bottom:1px solid #f0f2f6">
					<td><input type="text" class="inp" style="width:110px;font-size:10px" value="${r.ordersheet_number || ''}" onchange="ctsxData[${i}].ordersheet_number=this.value"></td>
					<td><select class="inp" style="font-size:10px" onchange="ctsxData[${i}].sku=this.value">${PRODUCTS.map((p) => `<option ${p.code === r.sku ? 'selected' : ''}>${p.code}</option>`).join('')}</select></td>
					<td><input type="number" class="pi" style="width:64px" min="0" value="${r.kh || 0}" onchange="ctsxData[${i}].kh=+this.value"></td>
					<td style="text-align:right;font-family:var(--mono)">${(r.tt || 0).toLocaleString()}</td>
					<td><div style="display:flex;align-items:center;gap:6px;min-width:110px"><div style="flex:1;height:8px;background:#e5e7eb;border-radius:3px"><div style="height:100%;width:${Math.min(100, pct)}%;background:${barColor};border-radius:3px"></div></div><span style="font-size:9.5px;font-weight:700;white-space:nowrap">${statusBadge} ${pct}%</span></div></td>
					<td><input type="date" class="inp" style="font-size:10px" value="${r.issue_date ? String(r.issue_date).slice(0, 10) : ''}" onchange="ctsxData[${i}].issue_date=this.value"></td>
					<td><input type="date" class="inp" style="font-size:10px" value="${r.delivery_date ? String(r.delivery_date).slice(0, 10) : ''}" onchange="ctsxData[${i}].delivery_date=this.value"></td>
					<td><input type="text" class="inp" style="font-size:10px;width:100px" value="${r.note || ''}" onchange="ctsxData[${i}].note=this.value"></td>
					<td style="font-size:9px;color:var(--t3);text-align:center">${r.tt_records || 0}</td>
				</tr>`;
			})
			.join('');
	}
	const totKH = rows.reduce((s, r) => s + (r.kh || 0), 0);
	const totTT = rows.reduce((s, r) => s + (r.tt || 0), 0);
	const sumEl = document.getElementById('ctsx_summary');
	if (sumEl)
		sumEl.textContent = `${rows.length} đơn · KH ${totKH.toLocaleString()} · TT ${totTT.toLocaleString()} pcs`;
}

/* Load lại từ DB theo filter month/sku rồi render — gọi từ goTab() và mọi onchange filter */
async function buildCTSXTable() {
	const tbody = document.getElementById('ctsx_body');
	if (!tbody) return;
	const month = document.getElementById('ctsx_month')?.value || '2026-06';
	const sku = document.getElementById('ctsx_sku')?.value || 'ALL';
	tbody.innerHTML =
		'<tr><td colspan="9" style="text-align:center;padding:12px;color:var(--t3)">⏳ Đang tải...</td></tr>';
	const ok = await apiLoadCTSX(month, sku);
	if (!ok) {
		tbody.innerHTML =
			'<tr><td colspan="9" style="text-align:center;padding:12px;color:var(--red-m)">❌ Không kết nối DB — chưa hỗ trợ CTSX offline</td></tr>';
		return;
	}
	renderCTSXTable();
}

/* Thêm dòng CTSX mới (chưa lưu DB, ctsx_id=null) — chỉ render, không fetch lại */
function addCTSXRow() {
	ctsxData.push({
		ctsx_id: null,
		ordersheet_number: '',
		sku: PRODUCTS[0].code,
		kh: 0,
		tt: 0,
		tt_records: 0,
		progress_pct: 0,
		issue_date: new Date().toISOString().slice(0, 10),
		delivery_date: '',
		note: '',
		status: 'pending',
	});
	renderCTSXTable();
}

/* Lưu toàn bộ ctsxData (mới + sửa) → DB, từng dòng 1 (POST save_ctsx), rồi reload lấy TT mới nhất */
async function saveCTSXAll() {
	if (!ctsxData.length) {
		flashSave();
		return;
	}
	let saved = 0,
		failed = 0;
	for (const row of ctsxData) {
		const res = await apiSaveCTSX(row);
		if (res && res.success) {
			saved++;
			if (res.id) row.ctsx_id = res.id; // gán id cho đơn mới tạo
		} else failed++;
	}
	if (failed)
		alert(`⚠ Lưu xong ${saved} đơn, lỗi ${failed} đơn — F12 xem console`);
	flashSave();
	await buildCTSXTable(); // reload để lấy TT/progress_pct mới nhất từ DB
}

/* ═══════════════════════════════════════════════════════════════════
   END PHASE 2 API LAYER
   ═══════════════════════════════════════════════════════════════════ */
