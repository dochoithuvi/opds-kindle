# Backend source

The tested `main.go` source is stored as split Base64 text chunks. This was used for the initial publication because the repository connector handles text blobs only.

The release workflow reconstructs the source in an explicit order and then runs `gofmt` and `go test` before building ARM binaries. Release archives include the decoded `SOURCE/backend/main.go`.

Do not concatenate the chunks with a wildcard; use the order in `.github/workflows/release.yml`.
