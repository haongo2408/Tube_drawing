<?php
/**
 * setup_admin.php — Chạy 1 LẦN để tạo user admin đầu tiên
 * Sau khi chạy xong, XÓA FILE NÀY khỏi server (bảo mật)
 * Đặt cùng folder với connection.php
 */
require_once('../../connection.php');
require_once('../../config.php');

// ⚠️ ĐỔI password này trước khi chạy!
$username     = 'admin';
$password     = 'admin123';  // ĐỔI NGAY sau khi setup xong
$display_name = 'Nguyễn Hải Đăng';
$role         = 'admin';

$dbh = new DBHandler();
$db  = $dbh->getInstance();

if (!$db) { die('DB connection failed'); }

// Check user đã tồn tại chưa
$stmt = $db->prepare("SELECT id FROM t_users WHERE username=?");
$stmt->execute([$username]);
if ($stmt->fetch()) {
    die("User '$username' đã tồn tại. Xóa file này hoặc đổi username.");
}

$hash = password_hash($password, PASSWORD_BCRYPT);
$stmt = $db->prepare("INSERT INTO t_users (username,password_hash,display_name,role) VALUES (?,?,?,?)");
$stmt->execute([$username, $hash, $display_name, $role]);

echo "<h2>✅ Tạo admin thành công!</h2>";
echo "<p>Username: <b>$username</b></p>";
echo "<p>Password: <b>$password</b></p>";
echo "<p style='color:red'>⚠️ XÓA FILE setup_admin.php này ngay sau khi đăng nhập lần đầu!</p>";
