<?php
/**
 * api_auth.php — Module Auth cơ bản (Step 6a)
 * Actions: login, logout, check_session
 * SQL: t_users (username, password_hash bcrypt, role)
 * Session được start ở router chính (api.php)
 */

switch ($action) {

    // ── POST: Login — verify username/password, tạo session
    case 'login':
        if ($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);echo json_encode(['success'=>false,'error'=>'POST only']);break;}
        $body = json_decode(file_get_contents('php://input'), true);
        $username = trim($body['username'] ?? '');
        $password = $body['password'] ?? '';

        if (!$username || !$password) {
            http_response_code(400);
            echo json_encode(['success'=>false,'error'=>'Cần username và password']);
            break;
        }

        $stmt = $db->prepare("SELECT * FROM t_users WHERE username=? AND is_active=1");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            http_response_code(401);
            echo json_encode(['success'=>false,'error'=>'Sai username hoặc password']);
            break;
        }

        $_SESSION['user_id']      = $user['id'];
        $_SESSION['username']     = $user['username'];
        $_SESSION['display_name'] = $user['display_name'];
        $_SESSION['role']         = $user['role'];

        $db->prepare("UPDATE t_users SET last_login=NOW() WHERE id=?")->execute([$user['id']]);

        echo json_encode([
            'success' => true,
            'user' => [
                'username'     => $user['username'],
                'display_name' => $user['display_name'],
                'role'         => $user['role']
            ]
        ]);
        break;

    // ── POST: Đổi password — yêu cầu đã login (session), verify old password trước khi đổi
    case 'change_password':
        if ($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);echo json_encode(['success'=>false,'error'=>'POST only']);break;}
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['success'=>false,'error'=>'Chưa đăng nhập']);
            break;
        }
        $body = json_decode(file_get_contents('php://input'), true);
        $old_password = $body['old_password'] ?? '';
        $new_password = $body['new_password'] ?? '';

        if (!$old_password || !$new_password) {
            http_response_code(400);
            echo json_encode(['success'=>false,'error'=>'Cần old_password và new_password']);
            break;
        }
        if (strlen($new_password) < 6) {
            http_response_code(400);
            echo json_encode(['success'=>false,'error'=>'Password mới phải >= 6 ký tự']);
            break;
        }

        $stmt = $db->prepare("SELECT password_hash FROM t_users WHERE id=?");
        $stmt->execute([$_SESSION['user_id']]);
        $row = $stmt->fetch();

        if (!$row || !password_verify($old_password, $row['password_hash'])) {
            http_response_code(401);
            echo json_encode(['success'=>false,'error'=>'Password cũ không đúng']);
            break;
        }

        $newHash = password_hash($new_password, PASSWORD_BCRYPT);
        $db->prepare("UPDATE t_users SET password_hash=? WHERE id=?")
           ->execute([$newHash, $_SESSION['user_id']]);

        echo json_encode(['success'=>true,'message'=>'Đổi password thành công']);
        break;

    // ── GET: Xem lịch sử audit log — chỉ user đã login mới xem được
    case 'get_audit_log':
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            echo json_encode(['success'=>false,'error'=>'Cần đăng nhập']);
            break;
        }
        $limit = min(200, max(1, intval($_GET['limit'] ?? 100)));
        $stmt = $db->prepare("SELECT username, action, ip_address, created_at FROM t_audit_log ORDER BY created_at DESC LIMIT $limit");
        $stmt->execute();
        echo json_encode(['success'=>true, 'data'=>$stmt->fetchAll(PDO::FETCH_ASSOC)]);
        break;

    // ── POST: Logout — xóa session
    case 'logout':
        $_SESSION = [];
        session_destroy();
        echo json_encode(['success'=>true,'message'=>'Đã đăng xuất']);
        break;

    // ── GET: Check session hiện tại — dashboard dùng để biết ai đang login
    case 'check_session':
        if (isset($_SESSION['user_id'])) {
            echo json_encode([
                'success'   => true,
                'logged_in' => true,
                'user' => [
                    'username'     => $_SESSION['username'],
                    'display_name' => $_SESSION['display_name'],
                    'role'         => $_SESSION['role']
                ]
            ]);
        } else {
            echo json_encode(['success'=>true,'logged_in'=>false]);
        }
        break;
}
