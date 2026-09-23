# Backend source

The tested `main.go` source is stored as split Base64 chunks (`main.go.b64.01` ... `main.go.b64.05`).
The release workflow reconstructs it before testing and building:

```sh
cat main.go.b64.* | tr -d '\r\n' | base64 -d > main.go
```

Release archives include the decoded `SOURCE/backend/main.go`.
