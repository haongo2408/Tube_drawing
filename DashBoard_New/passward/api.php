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

try {
    $dbh = new DBHandler();
    $db  = $dbh->getInstance();
    if (!$db) { echo json_encode(['success'=>false,'error'=>'DB connection failed']); exit; }

    // ── Route theo nhóm action → include đúng module ──
    $drawingActions     = ['kpi_summary','get_drawing','get_plan','get_summary'];
    $productActions     = ['get_products','get_sku_map'];
    $workerActions      = ['get_workers','save_worker','add_worker'];
    $planActualActions  = ['get_plan_actual','save_plan','save_qty','get_washing'];
    $ctsxActions        = ['get_ctsx','save_ctsx'];
    $excelActions       = ['import_excel','test_python'];
    $authActions        = ['login','logout','check_session','change_password'];

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
