<?php
require_once('../../connection.php');
$dbh = new DBHandler();
if ($dbh->getInstance() === null) {
    die("No database connection");
}

/*
 * UpdateSummaryQty.php — Admin sửa tay tổng OK/NG của 1 record t_drawing
 * 
 * Cơ chế: KHÔNG xóa các dòng t_profile_cut chi tiết cũ (giữ lịch sử nhập gốc).
 * Thay vào đó: xóa các dòng is_manual=1 cũ (nếu có) của record này,
 * rồi insert 1 dòng "override" mới với is_manual=1.
 * SelSummary.php SUM tất cả dòng → tổng sẽ ra đúng số admin gõ
 * vì dòng is_manual=1 mới được tính là 1 phần của SUM.
 * 
 * ⚠️ Để tổng KHỚP với số admin nhập (không bị cộng nhầm số cũ),
 * cách an toàn nhất là: xóa hết các dòng cũ của drawing_id này,
 * rồi insert lại 1 dòng duy nhất = số admin gõ, is_manual=1.
 * Nhược điểm: mất breakdown rack/order chi tiết — nhưng đây là
 * hành vi "override tổng" mà admin chủ động chọn, nên chấp nhận được.
 */

$drawing_id = $_POST['drawing_id'];
$ok_quantity = $_POST['ok_quantity'];
$ng_quantity = $_POST['ng_quantity'];
$editor_staff_id = $_POST['editor_staff_id']; // ai sửa, để log nếu cần mở rộng sau

if (!$drawing_id || $ok_quantity === null || $ng_quantity === null) {
    echo json_encode(["error" => "Thiếu dữ liệu drawing_id / ok_quantity / ng_quantity"]);
    exit;
}

try {
    $dbh->getInstance()->beginTransaction();

    // Xóa toàn bộ dòng cut cũ của record này (cả tự nhập và manual cũ)
    $del = $dbh->getInstance()->prepare(
        "DELETE FROM t_profile_cut WHERE drawing_id = :drawing_id"
    );
    $del->execute([':drawing_id' => $drawing_id]);

    // Insert 1 dòng override duy nhất, is_manual=1
    $ins = $dbh->getInstance()->prepare(
        "INSERT INTO t_profile_cut (drawing_id, rack_number, order_number, ok_quantity, ng_quantity, is_manual)
         VALUES (:drawing_id, 0, 0, :ok_quantity, :ng_quantity, 1)"
    );
    $ins->execute([
        ':drawing_id'  => $drawing_id,
        ':ok_quantity' => $ok_quantity,
        ':ng_quantity' => $ng_quantity
    ]);

    $dbh->getInstance()->commit();
    echo json_encode(["status" => "OK", "drawing_id" => $drawing_id]);
} catch (PDOException $e) {
    $dbh->getInstance()->rollBack();
    echo json_encode(["error" => $e->getMessage()]);
}
?>
