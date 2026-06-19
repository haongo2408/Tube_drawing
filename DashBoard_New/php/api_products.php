<?php
/**
 * api_products.php — Module quản lý danh mục sản phẩm (19 SKU)
 * Actions: get_products, get_sku_map
 */

switch ($action) {

    // ── GET: Danh sách 19 sản phẩm từ m_production_numbers
    // SQL: SELECT từ m_production_numbers
    case 'get_products':
        $stmt = $db->prepare("
            SELECT id, production_number AS sku_db,
                production_length, specific_weight,
                b_drawing_out_d, b_drawing_in_d,
                a_drawing_out_d, a_drawing_in_d
            FROM m_production_numbers ORDER BY production_number ASC
        ");
        $stmt->execute();
        $rows = $stmt->fetchAll();
        foreach ($rows as &$r) {
            $m = applyMap($r['sku_db'], $SKU_MAP);
            $r['sku'] = $m['sku']; $r['sku_display'] = $m['sku_display']; $r['series'] = $m['series'];
        }
        echo json_encode(['success'=>true,'data'=>$rows]);
        break;

    // ── DEBUG: Xem toàn bộ SKU map + reverse map
    case 'get_sku_map':
        echo json_encode(['success'=>true,'data'=>$SKU_MAP,'reverse'=>$SKU_REVERSE]);
        break;
}
