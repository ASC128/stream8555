<?php
if (!isset($_GET['url'])) {
    http_response_code(400);
    echo "Missing URL";
    exit;
}

$targetUrl = $_GET['url'];
$headers = [
    "Referer: https://v.567440.com",
    "Origin: https://v.567440.com",
    "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36"
];

$opts = [
    "http" => [
        "method" => "GET",
        "header" => implode("\r\n", $headers),
        "ignore_errors" => true
    ]
];

$context = stream_context_create($opts);
$stream = @fopen($targetUrl, 'rb', false, $context);

if (!$stream) {
    http_response_code(502);
    echo "Unable to open stream.";
    exit;
}

header("Content-Type: video/x-flv");
header("Access-Control-Allow-Origin: *");
header("Cache-Control: no-cache");
header("Connection: keep-alive");

while (!feof($stream)) {
    echo fread($stream, 8192);
    flush();
    if (connection_aborted()) break;
}
fclose($stream);
