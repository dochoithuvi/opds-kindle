# OPDS Library for Kindle

A native-library OPDS browser and downloader for jailbroken Kindle devices.

**Current release: v0.2.2**  
**Author: Dochoithuvi**

## Features

- Browse OPDS catalogs directly from a Kindle launcher.
- Built-in default catalog is shown only as **Kho sách mặc định**; its URL is hidden from the Kindle UI.
- Add, edit, delete, and switch between custom OPDS catalogs using friendly names.
- Custom catalogs and the selected source persist in `documents/OPDSLibrary/catalogs.json`.
- Search the whole catalog when the OPDS server exposes OpenSearch.
- Filter the current page by title or author.
- Download **MOBI, AZW3, PDF and TXT** into Kindle `documents/`.
- Download **EPUB** directly for reading with **KOReader**.
- E-Ink-friendly large controls and paging buttons.
- Includes static ARMv5 and ARMv7 backend builds in the release ZIP.
- Keeps the backend on `127.0.0.1` and validates local WAF origins for download requests.

## Tested device

The current build has been tested on **Kindle Basic 2022, firmware 5.19.2**.
Other Kindle models and firmware versions may behave differently.

## Install

1. Download the newest ZIP from **Releases**.
2. Back up and remove an older `documents/OPDSLibrary/` and `documents/OPDSLibrary.sh` if present.
3. Extract the ZIP.
4. Copy the **contents** of `COPY_TO_KINDLE_ROOT/` to the Kindle USB root.
5. Safely eject the Kindle and open **OPDS Library** from the native Library.

EPUB downloads are intended for KOReader. The stock Kindle Library may not index EPUB files.

## Catalog privacy

The built-in OPDS URL is hidden from the device UI, but it is not a secret and remains visible in the public source code. Custom catalog URLs are stored locally in `documents/OPDSLibrary/catalogs.json`.

## Source layout

- `backend/` — local HTTP backend and OPDS parser/downloader.
- `waf/` — Mesquite/WAF UI.
- `launcher/OPDSLibrary.sh` — Kindle launcher and app registration.
- `assets/` — launcher icon source encoded as base64 for release packaging.

## Status

Experimental software for jailbroken Kindle devices. Back up your installation before replacing files.

## Copyright

Copyright © 2026 **Dochoithuvi**. All rights reserved. See [COPYRIGHT.md](COPYRIGHT.md).
