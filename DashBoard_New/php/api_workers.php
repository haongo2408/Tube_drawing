<?php
/**
 * api_workers.php — Module quản lý nhân sự (m_staff)
 * Actions: get_workers, save_worker, add_worker
 */

switch ($action) {

    // ── GET: Workers từ m_staff (có fields mới sau ALTER TABLE Step 3d)
    // SQL: SELECT id,name,staff_id,code,Role,kotei,ca,perf,qual,skill FROM m_staff
    case 'get_workers':
        $stmt = $db->prepare("
            SELECT id, name, staff_id, code, Role,
                   kotei, ca, perf, qual, skill
            FROM m_staff ORDER BY id ASC
        ");
        $stmt->execute();
        echo json_encode(['success'=>true,'data'=>$stmt->fetchAll()]);
        break;

    // ── POST: Cập nhật worker đã có
    // SQL: UPDATE m_staff SET name,Role,kotei,ca,perf,qual,skill WHERE id
    case 'save_worker':
        if ($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);echo json_encode(['success'=>false,'error'=>'POST only']);break;}
        $body  = json_decode(file_get_contents('php://input'),true);
        $id    = intval($body['id']    ?? 0);
        $name  = trim($body['name']    ?? '');
        $role  = trim($body['role']    ?? '');
        $kotei = trim($body['kotei']   ?? '');
        $ca    = trim($body['ca']      ?? '');
        $perf  = intval($body['perf']  ?? 80);
        $qual  = intval($body['qual']  ?? 90);
        $skill = intval($body['skill'] ?? 1);
        if (!$id){http_response_code(400);echo json_encode(['success'=>false,'error'=>'id bắt buộc']);break;}
        $stmt = $db->prepare("UPDATE m_staff SET name=?,Role=?,kotei=?,ca=?,perf=?,qual=?,skill=? WHERE id=?");
        $stmt->execute([$name,$role,$kotei,$ca,$perf,$qual,$skill,$id]);
        echo json_encode(['success'=>true,'message'=>"Updated worker id=$id"]);
        break;

    // ── POST: Thêm worker mới
    // SQL: INSERT INTO m_staff (name,Role,kotei,ca,perf,qual,skill)
    case 'add_worker':
        if ($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);echo json_encode(['success'=>false,'error'=>'POST only']);break;}
        $body  = json_decode(file_get_contents('php://input'),true);
        $name  = trim($body['name']  ?? 'Tên mới');
        $role  = trim($body['role']  ?? 'W1');
        $kotei = trim($body['kotei'] ?? '');
        $ca    = trim($body['ca']    ?? 'Ca1');
        $perf  = intval($body['perf']  ?? 80);
        $qual  = intval($body['qual']  ?? 90);
        $skill = intval($body['skill'] ?? 1);
        $stmt  = $db->prepare("INSERT INTO m_staff (name,Role,kotei,ca,perf,qual,skill) VALUES (?,?,?,?,?,?,?)");
        $stmt->execute([$name,$role,$kotei,$ca,$perf,$qual,$skill]);
        $newId = $db->lastInsertId();
        echo json_encode(['success'=>true,'id'=>$newId,'message'=>"Added worker id=$newId"]);
        break;
}
