Kindle OPDS Library 0.2.2 FULL + icon

Primary tested target: Kindle Basic 2022 / firmware 5.19.2.

What is new in 0.2.2:
- The built-in catalog is now shown only as “Kho sách mặc định”; its URL is not displayed in the Kindle UI.
- Adds a catalog manager: + THÊM KHO, SỬA, XÓA.
- Tap a catalog name to select it and immediately open that catalog.
- Custom catalogs use a friendly name plus an http(s) OPDS URL.
- Selected catalog and custom catalog list are persisted in documents/OPDSLibrary/catalogs.json.
- Deleting the selected custom catalog automatically falls back to Kho sách mặc định.
- Keeps global search, page filtering, large paging controls, MOBI/AZW3/PDF/TXT download, and EPUB download for KOReader from 0.2.1.
- UI credit remains: by Dochoithuvi.

Privacy / visibility note:
- The built-in OPDS URL is hidden from the device UI, not treated as a secret. It remains present in the public source code.
- Custom catalog URLs are stored locally in documents/OPDSLibrary/catalogs.json.

Clean install / upgrade:
1. Back up documents/OPDSLibrary/catalogs.json first if you want to preserve custom catalogs.
2. Delete old documents/OPDSLibrary and documents/OPDSLibrary.sh for a clean install.
3. Copy the CONTENTS of COPY_TO_KINDLE_ROOT to the Kindle USB root.
4. Eject safely and launch OPDS Library from the native Kindle Library.

Copyright © 2026 Dochoithuvi. GPL-3.0 source release.
