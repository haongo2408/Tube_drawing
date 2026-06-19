<?php
/**
 * PHASE 2 — Dashboard nav snippet
 * Include vào đầu mỗi trang PHP muốn có nút 📊 Dashboard
 * Usage: <?php include __DIR__ . '/dashboard_button_snippet.php'; ?>
 */
$host = $_SERVER['HTTP_HOST'];   // tự detect IP/port, không hardcode
$dash_url = '//' . $host . '/dashboard/';
?>
<div style="background:#0b1e36;color:#94a3b8;font-size:11px;padding:5px 14px;
            display:flex;align-items:center;gap:14px;font-family:sans-serif">
  <span style="font-weight:700;color:#e2e8f0">🏭 Tube Drawing</span>
  <span style="opacity:.35">|</span>
  <a href="<?= htmlspecialchars($dash_url) ?>"
     style="color:#7dd3fc;text-decoration:none;font-weight:700;
            background:rgba(125,211,252,.12);padding:3px 10px;border-radius:4px;
            border:1px solid rgba(125,211,252,.25)">
    📊 生産管理 Dashboard
  </a>
  <span style="margin-left:auto;opacity:.4;font-size:10px"><?= htmlspecialchars($host) ?></span>
</div>
