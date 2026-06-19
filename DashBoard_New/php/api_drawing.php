<?php
/**
 * api_drawing.php — Module xử lý data sản xuất (t_drawing) và kế hoạch (m_ordersheet)
 * Actions: kpi_summary, get_drawing, get_plan, get_summary
 * Biến có sẵn từ router: $db, $action, $SKU_MAP (từ sku_map.php)
 */

switch ($action) {

    // ── GET: KPI summary tháng — đếm số records, ngày làm, SKU, operator
    // SQL: COUNT(*) FROM t_drawing WHERE month=?
    case 'kpi_summary':
        $month = $_GET['month'] ?? date('Y-m');
        $stmt = $db->prepare("
            SELECT COUNT(*) AS total_records,
                COUNT(DISTINCT production_date) AS working_days,
                COUNT(DISTINCT production_number_id) AS sku_count,
                COUNT(DISTINCT staff_id) AS operator_count
            FROM t_drawing
            WHERE DATE_FORMAT(production_date,'%Y-%m')=?
        ");
        $stmt->execute([$month]);
        echo json_encode(['success'=>true,'data'=>$stmt->fetch()]);
        break;

    // ── GET: Drawing records theo tháng — chi tiết từng lần kéo
    // SQL: t_drawing JOIN m_production_numbers
    case 'get_drawing':
        $month = $_GET['month'] ?? date('Y-m');
        $stmt = $db->prepare("
            SELECT d.id, d.production_date, d.production_time_start,
                d.production_time_end, p.production_number AS sku_db,
                d.staff_id, d.die_number_id, d.plug_number_id,
                d.ordersheet_id, d.start_pull_speed, d.main_pull_speed,
                d.end_pull_speed, d.qty_ok, d.qty_ng, d.kotei
            FROM t_drawing d
            LEFT JOIN m_production_numbers p ON p.id=d.production_number_id
            WHERE DATE_FORMAT(d.production_date,'%Y-%m')=?
            ORDER BY d.production_date ASC
        ");
        $stmt->execute([$month]);
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $m = applyMap($r['sku_db'], $SKU_MAP);
            $r['sku'] = $m['sku']; $r['sku_display'] = $m['sku_display']; $r['series'] = $m['series'];
        }
        echo json_encode(['success'=>true,'data'=>$rows]);
        break;

    // ── GET: Kế hoạch từ m_ordersheet (KH theo đơn hàng, không theo ngày)
    // SQL: m_ordersheet JOIN m_production_numbers
    case 'get_plan':
        $month = $_GET['month'] ?? date('Y-m');
        $stmt = $db->prepare("
            SELECT o.id, o.ordersheet_number, p.production_number AS sku_db,
                o.production_quantity AS kh, o.issue_date_at, o.delivery_date_at, o.note
            FROM m_ordersheet o
            LEFT JOIN m_production_numbers p ON p.id=o.production_numbers_id
            WHERE DATE_FORMAT(o.issue_date_at,'%Y-%m')=?
            ORDER BY p.production_number ASC
        ");
        $stmt->execute([$month]);
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $m = applyMap($r['sku_db'], $SKU_MAP);
            $r['sku'] = $m['sku']; $r['series'] = $m['series'];
        }
        echo json_encode(['success'=>true,'data'=>$rows]);
        break;

    // ── GET: Summary TT vs KH per SKU — dùng cho Overview tab
    // SQL: m_production_numbers LEFT JOIN m_ordersheet + t_drawing (đếm records)
    case 'get_summary':
        $month = $_GET['month'] ?? date('Y-m');
        $stmt = $db->prepare("
            SELECT p.production_number AS sku_db,
                COALESCE(o.production_quantity,0) AS kh,
                COUNT(d.id) AS tt_records,
                o.ordersheet_number, o.delivery_date_at
            FROM m_production_numbers p
            LEFT JOIN m_ordersheet o ON o.production_numbers_id=p.id
                AND DATE_FORMAT(o.issue_date_at,'%Y-%m')=?
            LEFT JOIN t_drawing d ON d.production_number_id=p.id
                AND DATE_FORMAT(d.production_date,'%Y-%m')=?
            GROUP BY p.id,p.production_number,o.production_quantity,o.ordersheet_number,o.delivery_date_at
            ORDER BY p.production_number ASC
        ");
        $stmt->execute([$month,$month]);
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $m = applyMap($r['sku_db'], $SKU_MAP);
            $r['sku'] = $m['sku']; $r['sku_display'] = $m['sku_display']; $r['series'] = $m['series'];
        }
        echo json_encode(['success'=>true,'data'=>$rows]);
        break;
}
