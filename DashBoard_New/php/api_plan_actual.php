<?php
/**
 * api_plan_actual.php — Module KH/TT theo ngày (bảng core của Phase 2)
 * Actions: get_plan_actual, save_plan, save_qty, get_washing
 * Liên quan: t_plan_actual, t_drawing, t_washing
 */

switch ($action) {

    // ── GET: Plan actual KH+TT theo ngày từ t_plan_actual
    // SQL: SELECT month,day,sku_db,kh,tt,ng,source FROM t_plan_actual WHERE month=?
    case 'get_plan_actual':
        $month = $_GET['month'] ?? date('Y-m');
        $stmt = $db->prepare("
            SELECT pa.month, pa.day, pa.sku_db,
                pa.kh, pa.tt, pa.ng, pa.source, pa.updated_at
            FROM t_plan_actual pa
            WHERE pa.month=?
            ORDER BY pa.sku_db ASC, pa.day ASC
        ");
        $stmt->execute([$month]);
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $m = applyMap($r['sku_db'], $SKU_MAP);
            $r['sku'] = $m['sku']; $r['series'] = $m['series'];
        }
        echo json_encode(['success'=>true,'data'=>$rows]);
        break;

    // ── POST: Save KH/TT theo ngày — nguồn 'dashboard'
    // SQL: INSERT ... ON DUPLICATE KEY UPDATE kh/tt (UNIQUE month,day,sku_db)
    case 'save_plan':
        if ($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);echo json_encode(['success'=>false,'error'=>'POST only']);break;}
        $body    = json_decode(file_get_contents('php://input'),true);
        $month   = $body['month']      ?? '';
        $sku     = trim($body['sku']   ?? '');
        $kh_days = $body['kh_per_day'] ?? [];
        $tt_days = $body['tt_per_day'] ?? [];
        $sku_db  = $SKU_REVERSE[$sku] ?? $sku;
        if (!$month||!$sku_db||(empty($kh_days)&&empty($tt_days))){
            http_response_code(400);echo json_encode(['success'=>false,'error'=>'month,sku,kh_per_day/tt_per_day bắt buộc']);break;
        }
        $saved = 0;
        if (!empty($kh_days)) {
            $stmt = $db->prepare("INSERT INTO t_plan_actual (month,day,sku_db,kh,source,updated_by) VALUES (?,?,?,?,'dashboard','dashboard') ON DUPLICATE KEY UPDATE kh=VALUES(kh),source='dashboard',updated_at=CURRENT_TIMESTAMP");
            foreach ($kh_days as $day=>$kh){$stmt->execute([$month,intval($day),$sku_db,intval($kh)]);$saved++;}
        }
        if (!empty($tt_days)) {
            $stmt2 = $db->prepare("INSERT INTO t_plan_actual (month,day,sku_db,tt,source,updated_by) VALUES (?,?,?,?,'dashboard','dashboard') ON DUPLICATE KEY UPDATE tt=VALUES(tt),source='dashboard',updated_at=CURRENT_TIMESTAMP");
            foreach ($tt_days as $day=>$tt){$stmt2->execute([$month,intval($day),$sku_db,intval($tt)]);$saved++;}
        }
        echo json_encode(['success'=>true,'message'=>"Saved $saved entries for $sku"]);
        break;

    // ── POST: Save qty từ DailyReport — ghi vào t_drawing + upsert t_plan_actual
    // SQL: UPDATE t_drawing SET qty_ok,kotei; INSERT t_plan_actual ON DUPLICATE KEY UPDATE tt
    case 'save_qty':
        if ($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);echo json_encode(['success'=>false,'error'=>'POST only']);break;}
        $body       = json_decode(file_get_contents('php://input'),true);
        $drawing_id = intval($body['drawing_id'] ?? 0);
        $qty_total  = intval($body['qty_total']  ?? 0);
        $kotei      = trim($body['kotei'] ?? '引抜');
        if (!$drawing_id||$qty_total<0){http_response_code(400);echo json_encode(['success'=>false,'error'=>'drawing_id và qty_total bắt buộc']);break;}
        $db->prepare("UPDATE t_drawing SET qty_ok=?,kotei=? WHERE id=?")->execute([$qty_total,$kotei,$drawing_id]);
        $stmt2 = $db->prepare("SELECT d.production_date,p.production_number AS sku_db FROM t_drawing d LEFT JOIN m_production_numbers p ON p.id=d.production_number_id WHERE d.id=?");
        $stmt2->execute([$drawing_id]);
        $row = $stmt2->fetch();
        if ($row) {
            $month = substr($row['production_date'],0,7);
            $day   = intval(substr($row['production_date'],8,2));
            $db->prepare("INSERT INTO t_plan_actual (month,day,sku_db,tt,source,updated_by) VALUES (?,?,?,?,'daily_report','daily_report') ON DUPLICATE KEY UPDATE tt=tt+VALUES(tt),source='daily_report',updated_at=CURRENT_TIMESTAMP")->execute([$month,$day,trim($row['sku_db']),$qty_total]);
        }
        echo json_encode(['success'=>true,'message'=>"Saved qty=$qty_total for drawing_id=$drawing_id"]);
        break;

    // ── GET: Washing data theo tháng
    case 'get_washing':
        $month = $_GET['month'] ?? date('Y-m');
        $stmt = $db->prepare("
            SELECT w.*, p.production_number AS sku_db
            FROM t_washing w
            LEFT JOIN m_production_numbers p ON p.id=w.production_number_id
            WHERE DATE_FORMAT(w.wash_date,'%Y-%m')=?
            ORDER BY w.wash_date ASC
        ");
        $stmt->execute([$month]);
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $m = applyMap($r['sku_db'], $SKU_MAP);
            $r['sku'] = $m['sku']; $r['series'] = $m['series'];
        }
        echo json_encode(['success'=>true,'data'=>$rows]);
        break;
}
