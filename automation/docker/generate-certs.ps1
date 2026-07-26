# Windows/PowerShell equivalent of generate-certs.sh (requires OpenSSL on PATH, e.g. via Git for Windows).
# Writes .\certs\server.crt and .\certs\server.key for the qualification proxy.
$ErrorActionPreference = 'Stop'
$certDir = Join-Path $PSScriptRoot 'certs'
New-Item -ItemType Directory -Force -Path $certDir | Out-Null
& openssl req -x509 -newkey rsa:2048 -nodes `
  -keyout (Join-Path $certDir 'server.key') `
  -out    (Join-Path $certDir 'server.crt') `
  -days 825 `
  -subj "/CN=localhost" `
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
Write-Host "Wrote $certDir\server.crt and server.key"
