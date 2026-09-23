Kindle OPDS Library 0.2.1 FULL + icon

Primary test target: Kindle Basic 2022 / firmware 5.19.2.

Changes from 0.1.9:
- Keeps the stable catalog browsing, XML sanitizer, Mesquite tap fix, global search and larger paging controls.
- Fixes the download failure "invalid browser origin" seen on the real Kindle. The failure came from this app's loopback CORS guard before the remote book server was contacted.
- Accepts Mesquite/WAF local origins used by file://, app://, widget:// and loopback localhost while continuing to reject ordinary remote http(s) web origins.
- Keeps POST download protection via X-OPDS-Library and keeps the backend bound to 127.0.0.1 only.
- Logs a blocked Origin value to documents/OPDSLibrary/backend.log if an unexpected firmware uses a different origin.
- Does not change the OPDS parsing/search UI that was already stable in 0.1.9.

Clean install / upgrade:
1. Back up documents/OPDSLibrary if desired.
2. Delete old documents/OPDSLibrary and documents/OPDSLibrary.sh.
3. Copy the CONTENTS of COPY_TO_KINDLE_ROOT to the Kindle USB root.
4. Eject safely and launch OPDS Library from the Kindle Library.

Test order:
1. Open catalog.
2. Search for a known book.
3. Tap one TẢI MOBI/PDF/AZW3 button.
4. If it fails again, send the exact status text plus documents/OPDSLibrary/backend.log.

This remains a test build; it has not been validated on every Kindle model/firmware.

0.2.1: EPUB links are downloadable and saved into /mnt/us/documents for KOReader. Native Kindle Library may not index EPUB. UI credit: by Dochoithuvi.
