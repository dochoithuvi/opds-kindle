#!/bin/sh
# Name: OPDS Library
# Icon: data:image/png;base64,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
# Version: 0.2.2 FULL hidden-default catalog manager
# Author: Dochoithuvi
# Purpose: Launch an OPDS browser that downloads native-format books into Library.

set -u
SRC="/mnt/us/documents/OPDSLibrary"
APP="com.kindleopds.library"
TARGET="/var/local/mesquite/OPDSLibrary"
DB="/var/local/appreg.db"

error() { echo "OPDS Library: $*"; exit 1; }
[ -d "$SRC/waf" ] || error "Missing documents/OPDSLibrary/waf. Copy the entire package."
[ -f "$DB" ] || error "Missing Kindle appreg.db. Jailbreak/hotfix may be incomplete."
command -v sqlite3 >/dev/null 2>&1 || error "sqlite3 is not installed."
command -v curl >/dev/null 2>&1 || error "curl is not installed."
command -v lipc-set-prop >/dev/null 2>&1 || error "Kindle LIPC unavailable."

# Copy to internal filesystem: Kindle's USB userstore may be mounted noexec.
mkdir -p "$TARGET/bin" || error "Cannot create Mesquite app folder."
cp "$SRC/waf/config.xml" "$SRC/waf/index.html" "$SRC/waf/style.css" "$SRC/waf/app.js" "$TARGET/" || error "Cannot install app UI."
cp "$SRC/bin/opds-arm7" "$SRC/bin/opds-arm5" "$TARGET/bin/" || error "Cannot install backend."
chmod 755 "$TARGET/bin/opds-arm7" "$TARGET/bin/opds-arm5" || error "Cannot set backend executable permission."
# Both binaries are static ARM Linux; prefer ARMv7, fall back to soft-float ARMv5.
BIN=""
for TRY in "$TARGET/bin/opds-arm7" "$TARGET/bin/opds-arm5"; do
  if "$TRY" --check >/dev/null 2>&1; then BIN="$TRY"; break; fi
done
[ -n "$BIN" ] || error "No compatible ARM binary. This prototype requires a supported 32-bit ARM Linux Kindle."

# Back up registry once using SQLite's consistent online backup.
if [ ! -f "$SRC/appreg-pre-opds.db" ]; then
  sqlite3 "$DB" ".backup '$SRC/appreg-pre-opds.db'" || error "Cannot back up app registry."
fi
sqlite3 "$DB" <<SQL || error "Cannot register app."
BEGIN;
INSERT OR IGNORE INTO interfaces(interface) VALUES('application');
INSERT OR IGNORE INTO handlerIds(handlerId) VALUES('$APP');
INSERT OR REPLACE INTO properties(handlerId,name,value) VALUES('$APP','lipcId','$APP');
INSERT OR REPLACE INTO properties(handlerId,name,value) VALUES('$APP','command','/usr/bin/mesquite -l $APP -c file://$TARGET/');
INSERT OR REPLACE INTO properties(handlerId,name,value) VALUES('$APP','supportedOrientation','U');
COMMIT;
SQL

# Restart an older OPDS backend after an in-place upgrade. Otherwise the old
# process keeps port 18765 and the new UI would silently talk to old code.
HEALTH="$(curl -fsS --max-time 2 http://127.0.0.1:18765/api/health 2>/dev/null || true)"
case "$HEALTH" in
  *'"version":"0.2.2"'*|*'"version": "0.2.2"'*) : ;;
  *)
    if [ -f "$SRC/backend.pid" ]; then
      OLD="$(cat "$SRC/backend.pid" 2>/dev/null || true)"
      [ -n "$OLD" ] && kill "$OLD" >/dev/null 2>&1 || true
    fi
    # Fallback for users who deleted the previous USB folder (and its pid file).
    for OLD in $(ps 2>/dev/null | awk '/\/var\/local\/mesquite\/OPDSLibrary\/bin\/opds-arm[57]/ && !/awk/ {print $1}'); do
      kill "$OLD" >/dev/null 2>&1 || true
    done
    sleep 1
    : > "$SRC/backend.log" 2>/dev/null || true
    nohup "$BIN" >> "$SRC/backend.log" 2>&1 </dev/null &
    echo "$!" > "$SRC/backend.pid"
    sleep 2
    ;;
esac
HEALTH="$(curl -fsS --max-time 3 http://127.0.0.1:18765/api/health 2>/dev/null || true)"
case "$HEALTH" in
  *'"version":"0.2.2"'*|*'"version": "0.2.2"'*) : ;;
  *) error "Backend 0.2.2 did not start. Check documents/OPDSLibrary/backend.log." ;;
esac
echo "Opening OPDS Library..."
nohup lipc-set-prop com.lab126.appmgrd start "app://$APP" >/dev/null 2>&1 &
exit 0
