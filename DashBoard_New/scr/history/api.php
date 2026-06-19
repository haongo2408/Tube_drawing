<?php
/**
 * api.php — ROUTER CHÍNH
 * Nhận $action từ query string → include đúng module xử lý
 * Mỗi module nhận sẵn: $db, $action, $SKU_MAP, $SKU_REVERSE
 *
 * Modules:
 *   api_drawing.php      → kpi_summary, get_drawing, get_plan, get_summary
 *   api_products.php     → get_products, get_sku_map
 *   api_workers.php       → get_workers, save_worker, add_worker
 *   api_plan_actual.php  → get_plan_actual, save_plan, save_qty, get_washing
 *   api_ctsx.php          → get_ctsx, save_ctsx
 *   api_excel.php         → import_excel, test_python
 *   api_auth.php          → login, logout, check_session, change_password
 */

session_start(); // Cần cho login/logout (Step 6a)
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once('../../connection.php');
require_once('../../config.php');
require_once('sku_map.php'); // $SKU_MAP, $SKU_REVERSE, applyMap(), getSeries()

$action = $_GET['action'] ?? '';

// ── P3-A: chặn các action GHI DỮ LIỆU nếu chưa đăng nhập ──
// Đúng triết lý "xem tự do — sửa mới cần login" đã làm ở frontend (dashboard_auth.js).
// Các action GET (get_*, kpi_summary...) KHÔNG bị chặn — ai cũng xem được.
// Thêm action ghi mới vào đây nếu sau này có thêm module.
$writeActions = ['save_worker','add_worker','save_plan','save_qty','import_excel','save_ctsx'];
if (in_array($action, $writeActions) && !isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success'=>false,'error'=>'Cần đăng nhập trước khi sửa dữ liệu']);
    exit;
}
try {
    $dbh = new DBHandler();
    $db  = $dbh->getInstance();
    if (!$db) { echo json_encode(['success'=>false,'error'=>'DB connection failed']); exit; }

    // P3-A: audit log — ghi lại AI, LÚC NÀO, làm action GHI DATA nào.
    // Lưu ý: không đọc php://input ở đây vì stream chỉ đọc được 1 lần,
    // đọc trước sẽ làm rỗng body khi module bên dưới tự đọc lại → mất data khi save.
    if (in_array($action, $writeActions)) {
        $db->prepare("INSERT INTO t_audit_log (user_id,username,action,ip_address) VALUES (?,?,?,?)")
           ->execute([
               $_SESSION['user_id'] ?? null,
               $_SESSION['username'] ?? null,
               $action,
               $_SERVER['REMOTE_ADDR'] ?? null,
           ]);
    }

    // ── Route theo nhóm action → include đúng module ──
    $drawingActions     = ['kpi_summary','get_drawing','get_plan','get_summary'];
    $productActions     = ['get_products','get_sku_map'];
    $workerActions      = ['get_workers','save_worker','add_worker'];
    $planActualActions  = ['get_plan_actual','save_plan','save_qty','get_washing'];
    $ctsxActions        = ['get_ctsx','save_ctsx'];
    $excelActions       = ['import_excel','test_python'];
    $authActions        = ['login','logout','check_session','change_password','get_audit_log'];

    if (in_array($action, $drawingActions)) {
        require 'api_drawing.php';
    } elseif (in_array($action, $productActions)) {
        require 'api_products.php';
    } elseif (in_array($action, $workerActions)) {
        require 'api_workers.php';
    } elseif (in_array($action, $planActualActions)) {
        require 'api_plan_actual.php';
    } elseif (in_array($action, $ctsxActions)) {
        require 'api_ctsx.php';
    } elseif (in_array($action, $excelActions)) {
        require 'api_excel.php';
    } elseif (in_array($action, $authActions)) {
        require 'api_auth.php';
    } elseif ($action === 'show_tables') {
        // DEBUG: liệt kê tất cả tables trong DB
        $stmt = $db->query("SHOW TABLES");
        echo json_encode(['success'=>true,'data'=>$stmt->fetchAll(PDO::FETCH_COLUMN)]);
    } else {
        http_response_code(400);
        echo json_encode([
            'success'=>false,
            'error'=>'Unknown action: '.htmlspecialchars($action),
            'available'=>[
                'drawing'    => $drawingActions,
                'products'   => $productActions,
                'workers'    => $workerActions,
                'plan_actual'=> $planActualActions,
                'ctsx'       => $ctsxActions,
                'excel'      => $excelActions,
                'auth'       => $authActions,
                'debug'      => ['show_tables']
            ]
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'error'=>$e->getMessage()]);
}
