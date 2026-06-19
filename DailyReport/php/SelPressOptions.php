<?php
require_once('../../connection.php');
$dbh = new DBHandler();
if ($dbh->getInstance() === null) {
    die("No database connection");
}

/*
 * SelPressOptions.php — Endpoint MỚI thay thế quy trình gõ tay press_date.
 *
 * Input: production_number_id (id trong tube_drawing.m_production_numbers)
 *
 * Logic chain liên kết 2 database:
 *   tube_drawing.m_production_numbers.ex_production_numbers_id
 *     ↓ map sang
 *   extrusion.m_dies.production_number_id
 *     ↓ JOIN
 *   extrusion.t_press.dies_id = m_dies.id
 *     ↓ tính rack còn dùng được (logic giống SelRack.php gốc)
 *   extrusion.t_using_aging_rack.t_press_id = t_press.id
 *
 * Output: mỗi dòng = 1 lô ép (t_press), kèm:
 *   - press_date_at, press_start_at, press_finish_at
 *   - die_number (tên khuôn)
 *   - total_rack: tổng số rack thuộc lô này
 *   - available_qty: tổng SL còn dùng được (SUM theo từng rack, đã trừ NG + đã dùng)
 *   - ordersheet_id, ordersheet_number, delivery_date_at (nếu có)
 */

$production_number_id = $_POST['production_number_id'];

if (!$production_number_id) {
    echo json_encode([]);
    exit;
}

try {
    // Bước 1: lấy ex_production_numbers_id tương ứng (khóa map sang DB extrusion)
    $stmt0 = $dbh->getInstance()->prepare(
        "SELECT ex_production_numbers_id FROM tube_drawing.m_production_numbers WHERE id = :pnid"
    );
    $stmt0->execute([':pnid' => $production_number_id]);
    $row0 = $stmt0->fetch(PDO::FETCH_ASSOC);
    if (!$row0 || !$row0['ex_production_numbers_id']) {
        echo json_encode([]);
        exit;
    }
    $ex_id = $row0['ex_production_numbers_id'];

    // Bước 2: lấy danh sách lô ép + rack còn dùng được + ordersheet liên quan
    $sql = "SELECT
    t_press.id AS press_id,
    t_press.press_date_at,
    t_press.press_start_at,
    t_press.press_finish_at,
    m_dies.die_number,
    t_press.ordersheet_id,
    m_ordersheet.ordersheet_number,
    m_ordersheet.delivery_date_at,
    rack_sum.total_rack,
    rack_sum.available_qty
FROM
    extrusion.t_press
JOIN
    extrusion.m_dies ON extrusion.m_dies.id = extrusion.t_press.dies_id
LEFT JOIN
    tube_drawing.m_ordersheet ON tube_drawing.m_ordersheet.id = extrusion.t_press.ordersheet_id
LEFT JOIN
    (SELECT
        rack.t_press_id,
        COUNT(*) AS total_rack,
        SUM(
            rack.work_quantity
            - IFNULL((SELECT SUM(pq.ng_quantities)
                      FROM extrusion.t_press_quality pq
                      WHERE pq.using_aging_rack_id = rack.id), 0)
            - IFNULL(used.used_qty, 0)
        ) AS available_qty
     FROM extrusion.t_using_aging_rack rack
     LEFT JOIN
        (SELECT using_aging_rack_id AS idd, SUM(quantity) AS used_qty
         FROM tube_drawing.t_used_extrusion_rack
         GROUP BY using_aging_rack_id) used
        ON used.idd = rack.id
     GROUP BY rack.t_press_id) rack_sum
    ON rack_sum.t_press_id = extrusion.t_press.id
WHERE
    extrusion.m_dies.production_number_id = :exid
ORDER BY
    extrusion.t_press.press_date_at DESC,
    extrusion.t_press.press_start_at DESC
LIMIT 100";

    $stmt = $dbh->getInstance()->prepare($sql);
    $stmt->execute([':exid' => $ex_id]);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
