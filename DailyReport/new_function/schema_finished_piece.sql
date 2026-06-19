-- ════════════════════════════════════════════════
-- Bảng mới: t_finished_piece
-- Lưu từng cây thành phẩm sinh ra từ 1 lần kéo (drawing record)
-- 1 input (phôi từ rack) → 2 cây thành phẩm (piece_order = 1 hoặc 2)
-- Mã định danh: piece_code = "{input_order}.{piece_order}" ví dụ "3.1", "3.2"
-- ════════════════════════════════════════════════
CREATE TABLE t_finished_piece (
    id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    drawing_id INT(10) UNSIGNED NOT NULL,         -- FK → t_drawing.id (biết ngày SX + mã SP qua JOIN)
    rack_id INT(10) UNSIGNED NOT NULL,             -- FK → t_using_aging_rack.id (bên DB extrusion, biết phôi gốc)
    input_order INT(10) UNSIGNED NOT NULL,         -- thứ tự cây phôi input (1, 2, 3...)
    piece_order TINYINT(1) UNSIGNED NOT NULL,      -- 1 hoặc 2 (mỗi input luôn ra đúng 2 cây)
    piece_code VARCHAR(10) NOT NULL,               -- "{input_order}.{piece_order}" — ví dụ "3.1"
    ok_flag TINYINT(1) DEFAULT NULL,                -- NULL = chưa kiểm tra, 1 = OK, 0 = NG (nhập sau ở tab Chất lượng)
    ng_code VARCHAR(20) DEFAULT NULL,               -- mã lỗi nếu NG (dùng sau)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_drawing (drawing_id),
    INDEX idx_rack (rack_id),
    UNIQUE KEY uq_piece (drawing_id, piece_code)    -- tránh trùng mã cây trong cùng 1 lần SX
);

-- Lý do thiết kế:
-- - drawing_id: để biết piece này thuộc ngày SX nào, mã SP nào (JOIN t_drawing)
-- - rack_id: để biết phôi gốc lấy từ rack nào (đối chiếu khi cần trace nguồn gốc)
-- - ok_flag/ng_code để NULL ban đầu — tab Chất lượng (Phase sau) sẽ update riêng,
--   không phải lúc nhập DailyReport vì lúc đó chưa kiểm tra xong
