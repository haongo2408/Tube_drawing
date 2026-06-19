<?php
/**
 * sku_map.php — Mapping SKU dùng chung cho tất cả module
 * DB key (S409/S183/S163) → tên tắt (MB63TD) + display (S410...)
 * Include file này trước khi dùng $SKU_MAP, $SKU_REVERSE, applyMap(), getSeries()
 */

$SKU_MAP = [
    'S409A63T36X32X30'   => ['short'=>'MB32TD',  'display'=>'S410A63T36X32X30'],
    'S409A63T45X40X30'   => ['short'=>'MB40TD',  'display'=>'S410A63T45X40X30'],
    'S409A63T55X50X30'   => ['short'=>'MB50TD',  'display'=>'S410A63T55X50X30'],
    'S409A63T68X63X30'   => ['short'=>'MB63TD',  'display'=>'S410A63T68X63X30'],
    'S409A63T86X80X30'   => ['short'=>'MB80TD',  'display'=>'S410A63T86X80X30'],
    'S409A63T107X100X30' => ['short'=>'MBA0TD',  'display'=>'S410A63T107X100X30'],
    'S183A63T43X38X30'   => ['short'=>'NCA38TD', 'display'=>'S184A63T43X38X30'],
    'S183A63T56X51X30'   => ['short'=>'NCA51TD', 'display'=>'S184A63T56X51X30'],
    'S183A63T68X64X30'   => ['short'=>'NCA64TD', 'display'=>'S184A63T68X64X30'],
    'S183A63T89X83X30'   => ['short'=>'NCA83TD', 'display'=>'S184A63T89X83X30'],
    'S183A63T108X102X30' => ['short'=>'NCAA0TD', 'display'=>'S184A63T108X102X30'],
    'S163A63T26X20X20'   => ['short'=>'CG20TD',  'display'=>'S165A63T26X20X20'],
    'S163A63T31X25X30'   => ['short'=>'CG25TD',  'display'=>'S165A63T31X25X20'],
    'S163A63T38X32X30'   => ['short'=>'CG32TD',  'display'=>'S165A63T38X32X30'],
    'S163A63T47X40X30'   => ['short'=>'CG40TD',  'display'=>'S165A63T47X40X30'],
    'S163AD63T58X50X30'  => ['short'=>'CG50TD',  'display'=>'S165A63T58X50X30'],
    'S163A63T72X63X30'   => ['short'=>'CG63TD',  'display'=>'S165A63T72X63X30'],
    'S163A63T89X80X30'   => ['short'=>'CG80TD',  'display'=>'S165A63T89X80X30'],
    'S163T63A110X100X30' => ['short'=>'CGA0TD',  'display'=>'S165A63T110X100X30'],
];

// Reverse map: 'MB63TD' → 'S409A63T68X63X30'
$SKU_REVERSE = [];
foreach ($SKU_MAP as $db_key => $info) {
    $SKU_REVERSE[$info['short']] = $db_key;
}

/**
 * Map sku_db (S409...) → ['sku'=>short, 'sku_display'=>S410, 'series'=>MB/NCA/CG]
 */
function applyMap($sku_db, $map) {
    $sku_db = trim($sku_db);
    if (isset($map[$sku_db])) {
        return [
            'sku'         => $map[$sku_db]['short'],
            'sku_display' => $map[$sku_db]['display'],
            'sku_db'      => $sku_db,
            'series'      => getSeries($map[$sku_db]['short'])
        ];
    }
    return ['sku'=>$sku_db,'sku_display'=>$sku_db,'sku_db'=>$sku_db,'series'=>'OTHER'];
}

function getSeries($short) {
    if (strpos($short,'MB')===0)  return 'MB';
    if (strpos($short,'NCA')===0) return 'NCA';
    if (strpos($short,'CG')===0)  return 'CG';
    return 'OTHER';
}
