Kindle OPDS Library 0.2.3 FULL + icon

Primary tested target: Kindle Basic 2022 / firmware 5.19.2.

Changes from 0.2.2:
- UI credit changed from “by Dochoithuvi” to “By Maydocsach.gitbook.io”.
- No catalog, search, download, EPUB, multi-catalog, or persistence behavior was intentionally changed.
- Built-in catalog remains hidden from the Kindle UI as “Kho sách mặc định”.
- Custom catalogs remain stored in documents/OPDSLibrary/catalogs.json.

Verification before release:
- JavaScript syntax check.
- config.xml parse check.
- go test ./...
- go vet ./...
- ARMv5 and ARMv7 backend cross-build.
- Release ZIP integrity check.

Install / upgrade:
1. Back up documents/OPDSLibrary/catalogs.json if you want to keep custom catalogs.
2. Copy the CONTENTS of COPY_TO_KINDLE_ROOT to the Kindle USB root.
3. Eject safely and launch OPDS Library from the native Kindle Library.

Copyright © 2026 Dochoithuvi. GPL-3.0 source release.
