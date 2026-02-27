<?php
/**
 * JARVISWEBSITES — Contact Form Handler
 * Handles POST submissions from the form-handler component.
 *
 * Configuration: update the values in the CONFIG section below.
 */

// ============================================================
// CONFIG — Edit these values for each project
// ============================================================
define('RECIPIENT_EMAIL',  'identistisrl@gmail.com');          // Where to send emails
define('RECIPIENT_NAME',   'IDentisti SRL');             // Recipient display name
define('FROM_EMAIL',       'noreply@identistiacquapendente.it');        // Sender address (must exist on your server)
define('FROM_NAME',        'Modulo Contatto');             // Sender display name
define('SUBJECT_PREFIX',   '[Contatto Sito] ');           // Prepended to email subject
define('RATE_LIMIT_MAX',   3);                            // Max submissions per IP per hour
define('RATE_LIMIT_TTL',   3600);                         // Time window in seconds
define('CSRF_TOKEN_NAME',  'csrf_token');
define('CSRF_SESSION_KEY', 'jw_csrf_token');
define('HONEYPOT_FIELD',   'website');
// ============================================================

// Headers — allow AJAX only, no direct browser navigation
header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['success' => false, 'message' => 'Metodo non consentito.']));
}

// Only accept AJAX requests
if (empty($_SERVER['HTTP_X_REQUESTED_WITH']) || strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) !== 'xmlhttprequest') {
    http_response_code(403);
    exit(json_encode(['success' => false, 'message' => 'Richiesta non valida.']));
}

// ============================================================
// Session start (for CSRF + rate limiting)
// ============================================================
if (session_status() === PHP_SESSION_NONE) {
    session_start([
        'cookie_httponly' => true,
        'cookie_samesite' => 'Strict',
    ]);
}

// ============================================================
// HELPERS
// ============================================================

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
    $candidates = [
        'HTTP_CLIENT_IP',
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_REAL_IP',
        'REMOTE_ADDR',
    ];
    foreach ($candidates as $key) {
        if (!empty($_SERVER[$key])) {
            // Take first IP (for X-Forwarded-For lists)
            $ip = explode(',', $_SERVER[$key])[0];
            $ip = trim($ip);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
    }
    return 'unknown';
}

// ============================================================
// HONEYPOT CHECK
// ============================================================
$honeypot = $_POST[HONEYPOT_FIELD] ?? '';
if (!empty($honeypot)) {
    // Silently succeed — don't reveal honeypot to bots
    respond(true, 'Messaggio inviato con successo!');
}

// ============================================================
// CSRF VALIDATION
// ============================================================
$submittedToken = $_POST[CSRF_TOKEN_NAME] ?? '';
$sessionToken   = $_SESSION[CSRF_SESSION_KEY] ?? '';

// Generate a token for the next request regardless
$newToken = bin2hex(random_bytes(32));
$_SESSION[CSRF_SESSION_KEY] = $newToken;

// If a session token exists, validate the submitted one
if (!empty($sessionToken)) {
    if (!hash_equals($sessionToken, $submittedToken)) {
        respond(false, 'Token di sicurezza non valido. Ricarica la pagina e riprova.', 403);
    }
}

// ============================================================
// RATE LIMITING (session-based per IP per hour)
// ============================================================
$clientIp      = get_client_ip();
$rateLimitKey  = 'jw_rate_' . md5($clientIp);
$now           = time();

$rateData = $_SESSION[$rateLimitKey] ?? ['count' => 0, 'window_start' => $now];

// Reset if window expired
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

// ============================================================
// COLLECT & VALIDATE INPUT
// ============================================================
$name    = sanitize_string($_POST['name']    ?? '', 150);
$email   = sanitize_email($_POST['email']    ?? '');
$phone   = sanitize_string($_POST['phone']   ?? '', 30);
$subject = sanitize_string($_POST['subject'] ?? '', 200);
$message = sanitize_string($_POST['message'] ?? '', 2000);
$privacy = !empty($_POST['privacy']);

$errors = [];

if (mb_strlen($name) < 2) {
    $errors[] = 'Il nome deve contenere almeno 2 caratteri.';
}

if (!validate_email($email)) {
    $errors[] = 'Indirizzo email non valido.';
}

if (!empty($phone) && !preg_match('/^[\d\s\+\-\(\)]{7,20}$/', $_POST['phone'])) {
    $errors[] = 'Numero di telefono non valido.';
}

if (mb_strlen($subject) < 2) {
    $errors[] = 'L\'oggetto deve contenere almeno 2 caratteri.';
}

if (mb_strlen($message) < 10) {
    $errors[] = 'Il messaggio deve contenere almeno 10 caratteri.';
}

if (!$privacy) {
    $errors[] = 'Devi accettare la Privacy Policy per procedere.';
}

if (!empty($errors)) {
    respond(false, implode(' ', $errors), 422);
}

// ============================================================
// BUILD EMAIL
// ============================================================
$emailSubject = SUBJECT_PREFIX . $subject;

$now_formatted = date('d/m/Y H:i:s');
$phone_display = !empty($phone) ? $phone : 'Non fornito';

// Plain text body
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

OGGETTO
-------
{$subject}

MESSAGGIO
---------
{$message}

========================================
Questo messaggio è stato inviato tramite il modulo di contatto del sito web.
EOT;

// HTML body
$bodyHtml = <<<EOHTML
<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <title>Nuovo messaggio di contatto</title>
</head>
<body style="font-family: -apple-system, Arial, sans-serif; color: #1a1a2e; background: #f5f5f7; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background: #1a1a2e; padding: 32px 40px;">
      <h1 style="color: #c9a96e; font-size: 22px; font-weight: 700; margin: 0;">
        Nuovo Messaggio di Contatto
      </h1>
      <p style="color: rgba(255,255,255,0.6); font-size: 13px; margin: 8px 0 0;">{$now_formatted}</p>
    </div>

    <!-- Body -->
    <div style="padding: 32px 40px;">

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #6b6b80; font-size: 13px; width: 100px;">Nome</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; font-weight: 600;">{$name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #6b6b80; font-size: 13px;">Email</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
            <a href="mailto:{$email}" style="color: #c9a96e;">{$email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0; color: #6b6b80; font-size: 13px;">Telefono</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">{$phone_display}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; color: #6b6b80; font-size: 13px;">Oggetto</td>
          <td style="padding: 10px 0; font-weight: 600;">{$subject}</td>
        </tr>
      </table>

      <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b6b80; margin: 0 0 12px;">Messaggio</h3>
      <div style="background: #f8f8fa; border-left: 3px solid #c9a96e; border-radius: 4px; padding: 20px 24px; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">{$message}</div>

      <!-- Reply button -->
      <div style="margin-top: 32px; text-align: center;">
        <a href="mailto:{$email}?subject=Re: {$subject}" style="display: inline-block; background: #c9a96e; color: #1a1a2e; font-weight: 700; padding: 14px 32px; border-radius: 4px; text-decoration: none; font-size: 14px; letter-spacing: 0.05em; text-transform: uppercase;">
          Rispondi a {$name}
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f5f5f7; padding: 20px 40px; text-align: center;">
      <p style="font-size: 12px; color: #9b9bab; margin: 0;">
        IP: {$clientIp} &nbsp;&bull;&nbsp; Inviato tramite il modulo di contatto del sito web.
      </p>
    </div>
  </div>
</body>
</html>
EOHTML;

// ============================================================
// SEND EMAIL
// ============================================================
$boundary  = '----=_JW_' . md5(uniqid('', true));
$headers   = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: multipart/alternative; boundary="' . $boundary . '"';
$headers[] = 'From: ' . FROM_NAME . ' <' . FROM_EMAIL . '>';
$headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . PHP_VERSION;
$headers[] = 'X-Originating-IP: ' . $clientIp;

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
$sent      = mail($recipient, $emailSubject, $emailBody, implode("\r\n", $headers));

// ============================================================
// RESPOND
// ============================================================
if ($sent) {
    respond(true, 'Grazie, ' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '! Il tuo messaggio è stato inviato con successo. Ti risponderemo entro 24 ore.');
} else {
    // Log error server-side (customize as needed)
    error_log('[JW Form Handler] mail() failed for: ' . $email . ' at ' . date('c'));
    respond(false, 'Si è verificato un errore durante l\'invio. Ti preghiamo di contattarci direttamente via email.', 500);
}
