# Panduan Publish ke npm

Panduan lengkap untuk mempublish `@refkinscallv/create-node-framework` ke npm registry.

---

## Persiapan Awal (sekali saja)

### 1. Daftar / Login npm

```bash
# Daftar akun (jika belum punya)
npm adduser

# Login jika sudah punya akun
npm login

# Verifikasi login berhasil
npm whoami
# Output: refkinscallv
```

### 2. Aktifkan 2FA (wajib untuk publish)

Di browser: npmjs.com → Account Settings → Two-Factor Authentication → Enable

---

## Struktur Package `create-cli/`

```
create-cli/
├── index.js        ← entry point (bin)
├── package.json    ← metadata package
└── README.md       ← docs npm
```

**`package.json` harus memiliki:**
```json
{
  "name": "@refkinscallv/create-node-framework",
  "version": "3.0.0",
  "bin": {
    "create-node-framework": "./index.js"
  },
  "files": ["index.js", "README.md"]
}
```

> Field `files` menentukan file mana yang ikut di-publish. Sisanya diabaikan.

---

## Proses Publish

### Langkah 1 — Masuk ke folder create-cli

```bash
cd create-cli
```

### Langkah 2 — Dry run (simulasi tanpa publish)

```bash
npm publish --dry-run
```

Cek output — pastikan hanya `index.js` dan `README.md` yang masuk:

```
npm notice === Tarball Contents ===
npm notice 8.2kB index.js
npm notice 1.1kB README.md
npm notice === Tarball Details ===
npm notice name:          @refkinscallv/create-node-framework
npm notice version:       3.0.0
npm notice package size:  3.7 kB
npm notice unpacked size: 9.3 kB
```

### Langkah 3 — Publish ke npm

```bash
# Package scoped (@refkinscallv/...) harus pakai --access public
npm publish --access public
```

### Langkah 4 — Verifikasi berhasil

```bash
# Cek versi terbaru di registry
npm view @refkinscallv/create-node-framework version

# Test penggunaan langsung
npm create @refkinscallv/node-framework test-app
```

---

## Update Versi

Setiap kali ada perubahan, **wajib** update versi sebelum publish ulang.

### Semantic Versioning

| Tipe | Contoh | Kapan |
|------|--------|-------|
| **patch** `3.0.0 → 3.0.1` | Bug fix kecil |
| **minor** `3.0.0 → 3.1.0` | Fitur baru, backward-compatible |
| **major** `3.0.0 → 4.0.0` | Breaking change |

### Update versi otomatis

```bash
cd create-cli

npm version patch   # 3.0.0 → 3.0.1
npm version minor   # 3.0.0 → 3.1.0
npm version major   # 3.0.0 → 4.0.0
```

### Atau edit manual di `create-cli/package.json`:

```json
{
  "version": "3.0.1"
}
```

Lalu publish:

```bash
npm publish --access public
```

---

## Publish dari Root Project (Rekomendasi)

Tambahkan script di `package.json` root untuk kemudahan:

```json
{
  "scripts": {
    "publish:cli": "cd create-cli && npm publish --access public",
    "publish:cli:dry": "cd create-cli && npm publish --dry-run"
  }
}
```

Penggunaan:

```bash
npm run publish:cli:dry   # simulasi
npm run publish:cli       # publish sungguhan
```

---

## Checklist Sebelum Publish

```
[ ] npm whoami — pastikan sudah login sebagai refkinscallv
[ ] Version di create-cli/package.json sudah di-update
[ ] npm publish --dry-run — tidak ada file sensitif yang masuk
[ ] index.js shebang ada: #!/usr/bin/env node
[ ] index.js executable (chmod +x jika di Linux/Mac)
[ ] README.md create-cli sudah update
[ ] Test lokal: node create-cli/index.js test-project
```

---

## Troubleshooting

### Error: 403 Forbidden — You must be logged in

```bash
npm login
npm publish --access public
```

### Error: 403 Forbidden — Package name taken / not allowed

Nama package scoped (`@refkinscallv/...`) hanya bisa dipublish oleh pemilik scope.
Pastikan login sebagai `refkinscallv`.

### Error: 402 Payment Required

Package scoped di npm bersifat private by default.
Selalu tambahkan `--access public`:

```bash
npm publish --access public
```

### Error: You cannot publish over the previously published versions

Versi yang sama sudah ada di registry. Wajib increment versi:

```bash
npm version patch
npm publish --access public
```

### Cek apa saja yang akan di-publish

```bash
npm pack --dry-run
# atau
npx pkgfiles
```

---

## Unpublish (Darurat)

npm hanya mengizinkan unpublish dalam **72 jam** setelah publish:

```bash
# Unpublish versi spesifik
npm unpublish @refkinscallv/create-node-framework@3.0.1

# Unpublish seluruh package (tidak direkomendasikan)
npm unpublish @refkinscallv/create-node-framework --force
```

> Setelah 72 jam, gunakan `npm deprecate` untuk menandai versi bermasalah:
> ```bash
> npm deprecate @refkinscallv/create-node-framework@3.0.0 "Critical bug, use 3.0.1"
> ```

---

## Alur Lengkap Rilis

```bash
# 1. Dari root project — update versi di semua file
#    (package.json, create-cli/package.json, CHANGELOG.md, README.md, welcome.ejs)

# 2. Commit perubahan
git add -A
git commit -m "chore: release v3.0.1"
git tag v3.0.1

# 3. Publish CLI ke npm
cd create-cli
npm publish --access public

# 4. Push ke GitHub
cd ..
git push origin main --tags
```
