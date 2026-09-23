# OPDS Library for Kindle

Native-library launcher and OPDS browser for jailbroken Kindle devices.

Current version: **0.2.1**

## Highlights
- Browse OPDS catalogs from the Kindle UI
- Full-catalog search when the server exposes search
- Download PDF, MOBI, AZW3, TXT
- Download EPUB directly for **KOReader**
- Large E-Ink-friendly controls
- Includes ARMv5 and ARMv7 backends
- UI credit: **by Dochoithuvi**

## Tested target
Kindle Basic 2022, firmware 5.19.2. Other models/firmwares may behave differently.

## Install
1. Copy the contents of `COPY_TO_KINDLE_ROOT/` to the Kindle USB root.
2. Open `OPDSLibrary.sh` from the Kindle Library.
3. Enter an OPDS catalog URL and open it.

EPUB files are saved under Kindle `documents/` for KOReader. The stock Kindle Library may not index EPUB.

## Status
Experimental. Back up your current installation before replacing files.
