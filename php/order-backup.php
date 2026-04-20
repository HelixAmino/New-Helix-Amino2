<?php
/**
 * Helix Amino - Order Backup Email Endpoint
 *
 * Deploy this file to the WordPress/PHP host (e.g.
 * https://backend.helixamino.com/order-backup.php) and set the
 * Supabase edge function secret ORDER_BACKUP_PHP_URL to its full URL.
 *
 * The edge function POSTs JSON with:
 *   order_id, order_number, total, currency, payment_method,
 *   customer_name, customer_email, notes, items[{name, sku, quantity, lineTotal}]
 *
 * Optional shared-secret header: X-Backup-Secret (matches ORDER_BACKUP_PHP_SECRET).
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Backup-Secret');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$expectedSecret = getenv('ORDER_BACKUP_PHP_SECRET');
if ($expectedSecret) {
    $provided = isset($_SERVER['HTTP_X_BACKUP_SECRET']) ? $_SERVER['HTTP_X_BACKUP_SECRET'] : '';
    if (!hash_equals($expectedSecret, $provided)) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
}

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

$to        = 'orderbackups@helixamino.com';
$from      = isset($data['from']) ? $data['from'] : 'no-reply@helixamino.com';
$orderId   = isset($data['order_id']) ? $data['order_id'] : '';
$orderNum  = isset($data['order_number']) ? $data['order_number'] : '';
$total     = isset($data['total']) ? (float)$data['total'] : 0.0;
$currency  = isset($data['currency']) ? $data['currency'] : 'USD';
$payMethod = isset($data['payment_method']) ? $data['payment_method'] : 'unpaid';
$custName  = isset($data['customer_name']) ? $data['customer_name'] : '';
$custEmail = isset($data['customer_email']) ? $data['customer_email'] : '';
$notes     = isset($data['notes']) ? $data['notes'] : '';
$items     = isset($data['items']) && is_array($data['items']) ? $data['items'] : [];

$lines   = [];
$lines[] = "Order Backup - {$orderNum}";
$lines[] = "Order ID:       {$orderId}";
$lines[] = "Submitted:      " . gmdate('Y-m-d H:i:s') . ' UTC';
$lines[] = "Payment method: {$payMethod}";
$lines[] = '';
$lines[] = "Customer name:  " . ($custName !== '' ? $custName : '(not provided)');
$lines[] = "Customer email: " . ($custEmail !== '' ? $custEmail : '(not provided)');
if ($notes !== '') {
    $lines[] = "Notes:          {$notes}";
}
$lines[] = '';
$lines[] = 'Items:';
foreach ($items as $it) {
    $name = isset($it['name']) ? $it['name'] : '';
    $sku  = isset($it['sku']) && $it['sku'] !== '' ? $it['sku'] : 'n/a';
    $qty  = isset($it['quantity']) ? (int)$it['quantity'] : 0;
    $line = isset($it['lineTotal']) ? (float)$it['lineTotal'] : 0.0;
    $lines[] = sprintf('  - %s | SKU %s | qty %d | %s %0.2f', $name, $sku, $qty, $currency, $line);
}
$lines[] = '';
$lines[] = sprintf('Total: %s %0.2f', $currency, $total);

$body    = implode("\n", $lines);
$subject = sprintf('Order %s - %s %0.2f - %s', $orderNum, $currency, $total, $payMethod);

$headers   = [];
$headers[] = "From: {$from}";
$headers[] = "Reply-To: " . ($custEmail !== '' ? $custEmail : $from);
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'X-Mailer: HelixAmino-OrderBackup';

$ok = @mail($to, $subject, $body, implode("\r\n", $headers));

if (!$ok) {
    http_response_code(500);
    echo json_encode(['error' => 'mail() returned false']);
    exit;
}

echo json_encode(['success' => true, 'recipient' => $to]);
