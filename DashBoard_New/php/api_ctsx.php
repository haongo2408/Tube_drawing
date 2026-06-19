<?php
/**
 * api_ctsx.php — Module CTSX (Chỉ thị sản xuất / đơn hàng) — Step 5a
 * Actions: get_ctsx, save_ctsx
 * 1 SKU có thể có nhiều CTSX/đơn hàng → mỗi đơn theo dõi tiến độ riêng
 */

switch ($action) {

    // ── GET: Danh sách CTSX (đơn hàng) kèm tiến độ TT
    // SQL: m_ordersheet JOIN m_production_numbers
    //      TT = SUM qty_ok từ t_drawing có cùng ordersheet_id
    case 'get_ctsx':
        $month = $_GET['month'] ?? null;
        $sku   = $_GET['sku']   ?? null; // tên tắt, ví dụ MB63TD

        $sql = "
            SELECT
                o.id AS ctsx_id,
                o.ordersheet_number,
                p.production_number AS sku_db,
                o.production_quantity AS kh,
                o.issue_date_at,
                o.delivery_date_at,
                o.note,
                COUNT(d.id) AS tt_records,
                SUM(COALESCE(d.qty_ok,0)) AS tt_qty
            FROM m_ordersheet o
            LEFT JOIN m_production_numbers p ON p.id = o.production_numbers_id
            LEFT JOIN t_drawing d ON d.ordersheet_id = o.id
            WHERE 1=1
        ";
        $params = [];
        if ($month) { $sql .= " AND DATE_FORMAT(o.issue_date_at,'%Y-%m')=?"; $params[] = $month; }

        $sql .= " GROUP BY o.id, o.ordersheet_number, p.production_number,
                  o.production_quantity, o.issue_date_at, o.delivery_date_at, o.note
                  ORDER BY o.issue_date_at DESC";

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        $result = [];
        foreach ($rows as $r) {
            $m = applyMap($r['sku_db'], $SKU_MAP);
            if ($sku && $m['sku'] !== $sku) continue; // filter theo SKU tên tắt

            $kh  = intval($r['kh']);
            $tt  = intval($r['tt_qty']);
            $pct = $kh > 0 ? round($tt / $kh * 100, 1) : 0;

            $result[] = [
                'ctsx_id'           => $r['ctsx_id'],
                'ordersheet_number' => $r['ordersheet_number'],
                'sku'               => $m['sku'],
                'sku_display'       => $m['sku_display'],
                'series'            => $m['series'],
                'kh'                => $kh,
                'tt'                => $tt,
                'tt_records'        => intval($r['tt_records']),
                'progress_pct'      => $pct,
                'issue_date'        => $r['issue_date_at'],
                'delivery_date'     => $r['delivery_date_at'],
                'note'              => $r['note'],
                'status'            => $pct >= 100 ? 'done' : ($tt > 0 ? 'running' : 'pending')
            ];
        }
        echo json_encode(['success'=>true,'data'=>$result]);
        break;

    // ── POST: Tạo/cập nhật CTSX (đơn hàng)
    // SQL: INSERT/UPDATE m_ordersheet
    case 'save_ctsx':
        if ($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);echo json_encode(['success'=>false,'error'=>'POST only']);break;}
        $body = json_decode(file_get_contents('php://input'), true);
        $ctsx_id  = intval($body['ctsx_id'] ?? 0);
        $sku      = trim($body['sku']  ?? '');
        $sku_db   = $SKU_REVERSE[$sku] ?? null;
        $os_num   = trim($body['ordersheet_number'] ?? '');
        $qty      = intval($body['kh'] ?? 0);
        $issue    = $body['issue_date']    ?? null;
        $delivery = $body['delivery_date'] ?? null;
        $note     = trim($body['note'] ?? '');

        if (!$sku_db) { http_response_code(400); echo json_encode(['success'=>false,'error'=>'SKU không hợp lệ']); break; }

        $stmtP = $db->prepare("SELECT id FROM m_production_numbers WHERE production_number=?");
        $stmtP->execute([$sku_db]);
        $prodRow = $stmtP->fetch();
        if (!$prodRow) { http_response_code(400); echo json_encode(['success'=>false,'error'=>'Không tìm thấy SKU trong DB']); break; }
        $prod_id = $prodRow['id'];

        if ($ctsx_id) {
            $stmt = $db->prepare("
                UPDATE m_ordersheet
                SET ordersheet_number=?, production_numbers_id=?, production_quantity=?,
                    issue_date_at=?, delivery_date_at=?, note=?, updated_at=NOW()
                WHERE id=?
            ");
            $stmt->execute([$os_num,$prod_id,$qty,$issue,$delivery,$note,$ctsx_id]);
            echo json_encode(['success'=>true,'message'=>"Updated CTSX id=$ctsx_id"]);
        } else {
            $stmt = $db->prepare("
                INSERT INTO m_ordersheet
                    (ordersheet_number, production_numbers_id, production_quantity,
                     issue_date_at, delivery_date_at, note)
                VALUES (?,?,?,?,?,?)
            ");
            $stmt->execute([$os_num,$prod_id,$qty,$issue,$delivery,$note]);
            $newId = $db->lastInsertId();
            echo json_encode(['success'=>true,'id'=>$newId,'message'=>"Created CTSX id=$newId"]);
        }
        break;
}
