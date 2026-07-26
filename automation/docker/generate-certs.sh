#!/usr/bin/env bash
# Generate a self-signed TLS cert for the qualification proxy (writes ./certs/server.{crt,key}).
# Self-signed is acceptable for a controlled, internal qualification environment; the
# harness sets ignoreHTTPSErrors. A real deployment uses an organisation-issued certificate.
#
#   bash generate-certs.sh            # -> ./certs/server.crt, ./certs/server.key
set -euo pipefail
CERT_DIR="$(dirname "$0")/certs"
mkdir -p "$CERT_DIR"
openssl req -x509 -newkey rsa:2048 -nodes \
  -keyout "$CERT_DIR/server.key" \
  -out    "$CERT_DIR/server.crt" \
  -days 825 \
  -subj "/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
echo "Wrote $CERT_DIR/server.crt and server.key"
