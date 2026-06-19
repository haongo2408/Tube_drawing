<?php
require_once('../../connection.php');
$dbh = new DBHandler();
if ($dbh->getInstance() === null) {
    die("No database connection");
}
$data = file_get_contents('php://input');
$data_json = json_decode($data);
$targetId = array_pop($data_json);

/*
 * v2 — Bổ sung: mỗi rack input được lưu, tự sinh N×2 dòng t_finished_piece
 * tương ứng (N = quantity lấy từ rack đó). Mã piece_code = "{order}.{1|2}",
 * với "order" là số thứ tự TĂNG DẦN xuyên suốt toàn bộ record này
 * (không reset theo từng rack riêng — input_order cộng dồn qua nhiều rack
 * trong cùng 1 lần Save, vì 1 lần SX có thể lấy từ nhiều rack khác nhau).
 *
 * Ví dụ: rack A lấy 3 → input_order 1,2,3 → piece 1.1,1.2,2.1,2.2,3.1,3.2
 *        rack B lấy 2 (cùng lần Save) → input_order tiếp tục 4,5 → 4.1,4.2,5.1,5.2
 */

try {
    $dbh->getInstance()->beginTransaction();

    // Lấy input_order lớn nhất đã tồn tại cho drawing_id này (để cộng dồn nếu Update thêm rack)
    $stmtMax = $dbh->getInstance()->prepare(
        "SELECT COALESCE(MAX(input_order), 0) AS max_order FROM t_finished_piece WHERE drawing_id = :did"
    );
    $stmtMax->execute([':did' => $targetId]);
    $currentOrder = (int) $stmtMax->fetch(PDO::FETCH_ASSOC)['max_order'];

    if (count($data_json) > 0) {
        foreach ($data_json as $val) {
            $rackId   = $val[0];
            $quantity = (int) $val[3];
            $ordinal  = $val[4];

            // Lưu rack đã dùng — giữ nguyên logic gốc
            $sql = "INSERT INTO tube_drawing.t_used_extrusion_rack 
                (using_aging_rack_id, quantity, drawing_id, ordinal) VALUES 
                (:rack_id, :qty, :did, :ordinal)";
            $stmt = $dbh->getInstance()->prepare($sql);
            $stmt->execute([
                ':rack_id' => $rackId,
                ':qty'     => $quantity,
                ':did'     => $targetId,
                ':ordinal' => $ordinal
            ]);

            // Sinh N×2 cây thành phẩm cho rack này
            for ($i = 1; $i <= $quantity; $i++) {
                $currentOrder++;
                foreach ([1, 2] as $pieceOrder) {
                    $pieceCode = $currentOrder . '.' . $pieceOrder;
                    $sqlPiece = "INSERT INTO t_finished_piece
                        (drawing_id, rack_id, input_order, piece_order, piece_code)
                        VALUES (:did, :rack_id, :input_order, :piece_order, :piece_code)";
                    $stmtPiece = $dbh->getInstance()->prepare($sqlPiece);
                    $stmtPiece->execute([
                        ':did'         => $targetId,
                        ':rack_id'     => $rackId,
                        ':input_order' => $currentOrder,
                        ':piece_order' => $pieceOrder,
                        ':piece_code'  => $pieceCode
                    ]);
                }
            }
        }
    }

    $dbh->getInstance()->commit();
    echo json_encode(["status" => "INSERTED", "total_pieces" => $currentOrder * 2]);
} catch (PDOException $e) {
    $dbh->getInstance()->rollBack();
    echo json_encode(["error" => $e->errorInfo[2]]);
}
?>
