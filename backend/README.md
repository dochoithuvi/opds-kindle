# Backend source

The tested `main.go` source is stored as split Base64 chunks because the repository connector used for this initial publication handles text blobs only.

The release workflow reconstructs it in this exact order:

```sh
cat \
  main.go.b64.01 \
  main.go.b64.02 \
  main.go.b64.03a \
  main.go.b64.03b \
  main.go.b64.04 \
  main.go.b64.05 \
  | tr -d '\r\n' | base64 -d > main.go
```

Release archives include the decoded `SOURCE/backend/main.go`.
