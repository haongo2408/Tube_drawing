<?php
/**
 * api_excel.php — Module import Excel (Step 4d)
 * Actions: import_excel, test_python
 * Format 1: 計画実績_YYYYMM.xlsx — KH/TT theo từng ngày (3 rows/SKU)
 * Format 2: 生産管理_Report_YYYYMM.xlsx — Chỉ có ΣKH/ΣTT tổng tháng (1 row/SKU)
 */

switch ($action) {

    // ── POST: Import Excel → t_plan_actual
    // SQL: INSERT INTO t_plan_actual ON DUPLICATE KEY UPDATE kh,tt
    //      INSERT INTO t_excel_import_log
    case 'import_excel':
        if ($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);echo json_encode(['success'=>false,'error'=>'POST only']);break;}
        if (!isset($_FILES['file'])){http_response_code(400);echo json_encode(['success'=>false,'error'=>'Không có file upload']);break;}
        $month    = $_POST['month'] ?? date('Y-m');
        $tmpFile  = $_FILES['file']['tmp_name'];
        $origName = $_FILES['file']['name'];

        // Copy .tmp → .xlsx (openpyxl không đọc .tmp)
        $xlsxFile = sys_get_temp_dir() . '/import_' . uniqid() . '.xlsx';
        copy($tmpFile, $xlsxFile);

        // Python script — tự detect format dựa vào header row
        $pyScript = <<<'PYEOF'
import json, sys, openpyxl

wb = openpyxl.load_workbook(sys.argv[1], data_only=True)
ws = None
for name in wb.sheetnames:
    if '計画' in name or 'plan' in name.lower():
        ws = wb[name]
        break
if ws is None:
    ws = wb.worksheets[0]

rows = list(ws.iter_rows(values_only=True))
result = []
SKU_LIST = ['MB32TD','MB40TD','MB50TD','MB63TD','MB80TD','MBA0TD',
            'NCA38TD','NCA51TD','NCA64TD','NCA83TD','NCAA0TD',
            'CG20TD','CG25TD','CG32TD','CG40TD','CG50TD','CG63TD','CG80TD','CGA0TD']

header_row = -1
fmt = 0
for i, row in enumerate(rows):
    col_a = str(row[0]).strip() if row[0] else ''
    col_c = str(row[2]).strip() if len(row)>2 and row[2] else ''
    if col_a == 'MÃ SP' and 'KH' in col_c:
        header_row = i
        fmt = 1 if (len(row) > 10) else 2
        break
    if col_a == 'Mã SP':
        header_row = i
        fmt = 2
        break

if header_row < 0:
    print(json.dumps({'error': 'Không tìm thấy header row'}))
    sys.exit(1)

data_start = header_row + 1

if fmt == 1:
    i = data_start
    while i < len(rows):
        row = rows[i]
        sku = str(row[0]).strip() if row[0] else ''
        if sku not in SKU_LIST:
            i += 1
            continue
        kh_days = {}
        for d in range(30):
            val = row[6+d] if 6+d < len(row) else None
            if val and str(val) not in ['休','—','None',''] and isinstance(val,(int,float)) and val > 0:
                kh_days[d+1] = int(val)
        tt_days = {}
        if i+1 < len(rows):
            row2 = rows[i+1]
            c2 = str(row2[2]).strip() if len(row2)>2 and row2[2] else ''
            if '↑KH' in c2 or '↑' in c2:
                for d in range(30):
                    val = row2[6+d] if 6+d < len(row2) else None
                    if val and str(val) not in ['休','—','None',''] and isinstance(val,(int,float)) and val > 0:
                        tt_days[d+1] = int(val)
        if kh_days or tt_days:
            result.append({'sku':sku,'kh':kh_days,'tt':tt_days,'fmt':1})
        i += 3
else:
    for row in rows[data_start:]:
        sku = str(row[0]).strip() if row[0] else ''
        if sku not in SKU_LIST:
            continue
        kh_total = int(row[2]) if len(row)>2 and row[2] and isinstance(row[2],(int,float)) else 0
        tt_total = int(row[3]) if len(row)>3 and row[3] and isinstance(row[3],(int,float)) else 0
        result.append({'sku':sku,'kh_total':kh_total,'tt_total':tt_total,'fmt':2})

print(json.dumps(result))
PYEOF;

        $pyFile = sys_get_temp_dir() . '/parse_excel_' . uniqid() . '.py';
        file_put_contents($pyFile, $pyScript);
        $jsonOut = shell_exec("C:\\python\\python-3.9\\python.exe " . escapeshellarg($pyFile) . " " . escapeshellarg($xlsxFile) . " 2>&1");
        unlink($pyFile);
        if (file_exists($xlsxFile)) unlink($xlsxFile);

        $parsed = json_decode($jsonOut, true);
        if (!is_array($parsed)) {
            $db->prepare("INSERT INTO t_excel_import_log (filename,month,rows_imported,rows_skipped,status,error_log) VALUES (?,?,0,0,'failed',?)")->execute([$origName,$month,$jsonOut]);
            echo json_encode(['success'=>false,'error'=>'Parse Excel thất bại: '.$jsonOut]);
            break;
        }

        $saved = 0; $skipped = 0;

        $stmtKH = $db->prepare("INSERT INTO t_plan_actual (month,day,sku_db,kh,source,updated_by) VALUES (?,?,?,?,'excel_import','excel_import') ON DUPLICATE KEY UPDATE kh=VALUES(kh),source='excel_import',updated_at=CURRENT_TIMESTAMP");
        $stmtTT = $db->prepare("INSERT INTO t_plan_actual (month,day,sku_db,tt,source,updated_by) VALUES (?,?,?,?,'excel_import','excel_import') ON DUPLICATE KEY UPDATE tt=VALUES(tt),source='excel_import',updated_at=CURRENT_TIMESTAMP");

        foreach ($parsed as $item) {
            $sku    = trim($item['sku']);
            $sku_db = $SKU_REVERSE[$sku] ?? null;
            if (!$sku_db) { $skipped++; continue; }
            $fmt = $item['fmt'] ?? 1;

            if ($fmt == 1) {
                foreach (($item['kh'] ?? []) as $day=>$kh) { $stmtKH->execute([$month,intval($day),$sku_db,intval($kh)]); $saved++; }
                foreach (($item['tt'] ?? []) as $day=>$tt) { $stmtTT->execute([$month,intval($day),$sku_db,intval($tt)]); $saved++; }
            } else {
                if (($item['kh_total'] ?? 0) > 0) { $stmtKH->execute([$month,0,$sku_db,intval($item['kh_total'])]); $saved++; }
                if (($item['tt_total'] ?? 0) > 0) { $stmtTT->execute([$month,0,$sku_db,intval($item['tt_total'])]); $saved++; }
            }
        }

        $db->prepare("INSERT INTO t_excel_import_log (filename,month,rows_imported,rows_skipped,status) VALUES (?,?,?,?,'success')")->execute([$origName,$month,$saved,$skipped]);
        echo json_encode(['success'=>true,'message'=>"Import xong: $saved cells, $skipped SKU bỏ qua",'rows_imported'=>$saved,'rows_skipped'=>$skipped]);
        break;

    // ── DEBUG: test Python availability trên server
    case 'test_python':
        $out  = shell_exec('python --version 2>&1');
        $out2 = shell_exec('python3 --version 2>&1');
        $out3 = shell_exec('where python 2>&1');
        echo json_encode(['python'=>$out,'python3'=>$out2,'where'=>$out3]);
        break;
}
