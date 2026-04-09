<?php
/**
 * Domenico Talarico — Impresa Edile
 * Contact Form Handler
 */

// ============================================================
// CONFIG
// ============================================================
define('RECIPIENT_EMAIL',  'talarico1966@gmail.com');
define('RECIPIENT_NAME',   'Domenico Talarico');
define('FROM_EMAIL',       'noreply@domenicotalarico.com');
define('FROM_NAME',        'Modulo Contatto Sito');
define('SUBJECT_PREFIX',   '[Contatto Sito] ');
define('RATE_LIMIT_MAX',   3);
define('RATE_LIMIT_TTL',   3600);
define('CSRF_TOKEN_NAME',  'csrf_token');
define('CSRF_SESSION_KEY', 'jw_csrf_token');
define('HONEYPOT_FIELD',   'website');
// ============================================================

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'message' => 'Metodo non consentito.']));
}

if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) !== 'xmlhttprequest') {
    http_response_code(403);
    exit(json_encode(['success' => false, 'message' => 'Richiesta non valida.']));
}

if (session_status() === PHP_SESSION_NONE) {
    session_start([
        'cookie_httponly' => true,
        'cookie_samesite' => 'Strict',
    ]);
}

function respond(bool $success, string $message, int $httpCode = 200): void
{
    http_response_code($httpCode);
    exit(json_encode(['success' => $success, 'message' => $message]));
}

function sanitize_string(string $value, int $maxLength = 500): string
{
    $value = strip_tags($value);
    $value = htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
    return mb_substr(trim($value), 0, $maxLength);
}

function sanitize_email(string $value): string
{
    return filter_var(trim($value), FILTER_SANITIZE_EMAIL);
}

function validate_email(string $email): bool
{
    return (bool) filter_var($email, FILTER_VALIDATE_EMAIL);
}

function get_client_ip(): string
{
    $candidates = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'HTTP_X_REAL_IP', 'REMOTE_ADDR'];
    foreach ($candidates as $key) {
        if (!empty($_SERVER[$key])) {
            $ip = explode(',', $_SERVER[$key])[0];
            $ip = trim($ip);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    return 'unknown';
}

// Honeypot
$honeypot = $_POST[HONEYPOT_FIELD] ?? '';
if (!empty($honeypot)) {
    respond(true, 'Messaggio inviato con successo!');
}

// CSRF
$submittedToken = $_POST[CSRF_TOKEN_NAME] ?? '';
$sessionToken   = $_SESSION[CSRF_SESSION_KEY] ?? '';
$newToken = bin2hex(random_bytes(32));
$_SESSION[CSRF_SESSION_KEY] = $newToken;
if (!empty($sessionToken)) {
    if (!hash_equals($sessionToken, $submittedToken)) {
        respond(false, 'Token di sicurezza non valido. Ricarica la pagina e riprova.', 403);
    }
}

// Rate limiting
$clientIp = get_client_ip();
$rateLimitKey = 'jw_rate_' . md5($clientIp);
$now = time();
$rateData = $_SESSION[$rateLimitKey] ?? ['count' => 0, 'window_start' => $now];
if (($now - $rateData['window_start']) > RATE_LIMIT_TTL) {
    $rateData = ['count' => 0, 'window_start' => $now];
}
$rateData['count']++;
if ($rateData['count'] > RATE_LIMIT_MAX) {
    $retryAfter = RATE_LIMIT_TTL - ($now - $rateData['window_start']);
    header('Retry-After: ' . $retryAfter);
    respond(false, 'Hai inviato troppi messaggi. Attendi un\'ora e riprova.', 429);
}
$_SESSION[$rateLimitKey] = $rateData;

// Collect & validate
$name    = sanitize_string($_POST['name']    ?? '', 150);
$email   = sanitize_email($_POST['email']    ?? '');
$phone   = sanitize_string($_POST['phone']   ?? '', 30);
$subject = sanitize_string($_POST['subject'] ?? 'Richiesta dal sito', 200);
$message = sanitize_string($_POST['message'] ?? '', 2000);
$privacy = !empty($_POST['privacy']);

$errors = [];
if (mb_strlen($name) < 2) $errors[] = 'Il nome deve contenere almeno 2 caratteri.';
if (!validate_email($email)) $errors[] = 'Indirizzo email non valido.';
if (!empty($phone) && !preg_match('/^[\d\s\+\-\(\)]{7,20}$/', $_POST['phone'])) $errors[] = 'Numero di telefono non valido.';
if (mb_strlen($message) < 10) $errors[] = 'Il messaggio deve contenere almeno 10 caratteri.';
if (!$privacy) $errors[] = 'Devi accettare la Privacy Policy per procedere.';
if (!empty($errors)) respond(false, implode(' ', $errors), 422);

// Build email
$emailSubject = SUBJECT_PREFIX . $subject;
$now_formatted = date('d/m/Y H:i:s');
$phone_display = !empty($phone) ? $phone : 'Non fornito';

$bodyText = <<<EOT
Nuovo messaggio dal modulo di contatto
========================================

Data/ora:   {$now_formatted}
IP:         {$clientIp}

MITTENTE
--------
Nome:       {$name}
Email:      {$email}
Telefono:   {$phone_display}

MESSAGGIO
---------
{$message}

========================================
Inviato tramite il modulo di contatto di domenicotalarico.com
EOT;

$bodyHtml = <<<EOHTML
<!DOCTYPE html>
<html lang="it">
<head><meta charset="utf-8"><title>Nuovo messaggio</title></head>
<body style="font-family: -apple-system, Arial, sans-serif; color: #1f2937; background: #f0f0f0; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 4px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">
    <div style="background: #1f2937; padding: 32px 40px;">
      <h1 style="color: #ea580c; font-size: 22px; font-weight: 700; margin: 0;">Nuovo Messaggio di Contatto</h1>
      <p style="color: rgba(255,255,255,0.6); font-size: 13px; margin: 8px 0 0;">{$now_formatted}</p>
    </div>
    <div style="padding: 32px 40px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #6b7280; font-size: 13px; width: 100px;">Nome</td><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 600;">{$name}</td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #6b7280; font-size: 13px;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;"><a href="mailto:{$email}" style="color: #ea580c;">{$email}</a></td></tr>
        <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #6b7280; font-size: 13px;">Telefono</td><td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">{$phone_display}</td></tr>
      </table>
      <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; margin: 0 0 12px;">Messaggio</h3>
      <div style="background: #f9fafb; border-left: 3px solid #ea580c; border-radius: 2px; padding: 20px 24px; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">{$message}</div>
      <div style="margin-top: 32px; text-align: center;">
        <a href="mailto:{$email}?subject=Re: Richiesta dal sito" style="display: inline-block; background: #ea580c; color: #fff; font-weight: 700; padding: 14px 32px; border-radius: 2px; text-decoration: none; font-size: 14px; letter-spacing: 0.05em; text-transform: uppercase;">Rispondi a {$name}</a>
      </div>
    </div>
    <div style="background: #f0f0f0; padding: 20px 40px; text-align: center;">
      <p style="font-size: 12px; color: #9ca3af; margin: 0;">IP: {$clientIp} &bull; Inviato dal sito domenicotalarico.com</p>
    </div>
  </div>
</body>
</html>
EOHTML;

// Send
$boundary = '----=_JW_' . md5(uniqid('', true));
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: multipart/alternative; boundary="' . $boundary . '"';
$headers[] = 'From: ' . FROM_NAME . ' <' . FROM_EMAIL . '>';
$headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . PHP_VERSION;

$emailBody  = "--{$boundary}\r\n";
$emailBody .= "Content-Type: text/plain; charset=UTF-8\r\n";
$emailBody .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$emailBody .= $bodyText . "\r\n\r\n";
$emailBody .= "--{$boundary}\r\n";
$emailBody .= "Content-Type: text/html; charset=UTF-8\r\n";
$emailBody .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$emailBody .= $bodyHtml . "\r\n\r\n";
$emailBody .= "--{$boundary}--";

$recipient = RECIPIENT_NAME . ' <' . RECIPIENT_EMAIL . '>';
$sent = mail($recipient, $emailSubject, $emailBody, implode("\r\n", $headers));

if ($sent) {
    respond(true, 'Grazie, ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '! Il tuo messaggio e stato inviato con successo. Ti risponderemo entro 24 ore.');
} else {
    error_log('[Form Handler] mail() failed for: ' . $email . ' at ' . date('c'));
    respond(false, 'Si e verificato un errore durante l\'invio. Contattaci direttamente al +39 349 6134656.', 500);
}
