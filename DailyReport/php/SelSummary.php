<?php
require_once('../../connection.php');
$dbh = new DBHandler();
if ($dbh->getInstance() === null) {
    die("No database connection");
}
$datetime = date("Y-m-d H:i:s");
try {
    /* 
     * v2: Thêm 3 cột mới so với bản gốc:
     *   - staff_name      : JOIN m_staff lấy tên người báo cáo
     *   - total_qty       : SUM(ok_quantity + ng_quantity) từ t_profile_cut, GROUP theo drawing_id
     *   - total_ok / total_ng : SUM riêng OK/NG
     *   - is_manual       : nếu admin đã sửa tay thì = 1, FE hiển thị icon khác
     * Dùng LEFT JOIN subquery để không loại record nào chưa có profile_cut (total=NULL→0 ở FE)
     */
    $sql = "SELECT 
    tube_drawing.t_drawing.id,
    tube_drawing.t_drawing.production_date,
    tube_drawing.m_production_numbers.production_number,
    tube_drawing.t_drawing.production_time_start,
    tube_drawing.t_drawing.production_time_end,
    tube_drawing.m_dies.die_number,
    tube_drawing.m_plugs.plug_number,
    tube_drawing.m_staff.name AS staff_name,
    COALESCE(cut_sum.total_ok, 0) AS total_ok,
    COALESCE(cut_sum.total_ng, 0) AS total_ng,
    COALESCE(cut_sum.total_ok, 0) + COALESCE(cut_sum.total_ng, 0) AS total_qty,
    cut_sum.is_manual AS is_manual
FROM
    tube_drawing.t_drawing
LEFT JOIN
    tube_drawing.m_production_numbers ON tube_drawing.m_production_numbers.id = tube_drawing.t_drawing.production_number_id
LEFT JOIN
    tube_drawing.m_dies ON tube_drawing.m_dies.id = tube_drawing.t_drawing.die_number_id
LEFT JOIN
    tube_drawing.m_plugs ON tube_drawing.m_plugs.id = tube_drawing.t_drawing.plug_number_id
LEFT JOIN
    tube_drawing.m_staff ON tube_drawing.m_staff.id = tube_drawing.t_drawing.staff_id
LEFT JOIN
    (SELECT drawing_id,
            SUM(ok_quantity) AS total_ok,
            SUM(ng_quantity) AS total_ng,
            MAX(is_manual)   AS is_manual
     FROM tube_drawing.t_profile_cut
     GROUP BY drawing_id) AS cut_sum
    ON cut_sum.drawing_id = tube_drawing.t_drawing.id
ORDER BY production_date DESC";
    $stmt = $dbh->getInstance()->prepare($sql);
    $stmt->execute();
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
} 
catch(PDOException $e) {
    echo ($e->errorInfo[2]);
}
?>
