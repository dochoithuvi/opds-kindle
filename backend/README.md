# Backend

Local loopback backend for OPDS Library for Kindle.

- Listens only on 127.0.0.1:18765.
- Parses OPDS 1 Atom and basic OPDS 2 JSON feeds.
- Sanitizes invalid XML 1.0 control characters found in some public feeds.
- Supports catalog search discovery/OpenSearch.
- Downloads PDF, MOBI, AZW3, TXT, and EPUB with file-container validation.
- Stores custom OPDS sources in documents/OPDSLibrary/catalogs.json.
- Keeps the built-in catalog URL out of the WAF/UI catalog-list response.

The v0.2.2 release workflow materializes the v0.2.1 source bundle and applies backend/v0.2.2.patch before testing and building.
