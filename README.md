# 💍 Digital Wedding Invitation

## ✨ Fitur Utama

- **Desain Responsif** .
- **Data Dinamis (JSON):** Ubah teks, nama, dan tanggal cukup dari satu file `data.json`.
- **Tailwind CSS v4:**.
- **Background Music:**.
- **Galeri Lightbox:**.
- **RSVP System:** Menggunakan Local Storage.

## 🛠️ Persyaratan Sistem (Prerequisites)

Sebelum menjalankan project ini, pastikan komputermu sudah terinstall:

1. [Node.js](https://nodejs.org/) (Untuk menjalankan perintah `npm`).
2. Local Web Server seperti **Laragon** atau **XAMPP**.
3. Text Editor.

## 🚀 Cara Menjalankan Project (Development)

**1. Simpan di Folder Localhost**
Letakkan folder project ini (`wedding`) di dalam direktori server lokal kamu.

- Jika pakai Laragon: `C:\laragon\www\wedding`
- Jika pakai XAMPP: `C:\xampp\htdocs\wedding`

**2. Install Dependencies (Tailwind)**
Buka folder project ini di VS Code. Buka Terminal (`Ctrl` + `~`), lalu jalankan:

```bash
npm install
```

**3. Jalankan Tailwind**
Untuk meng-compile Tailwind CSS secara real-time setiap kali kamu mengubah HTML/CSS, jalankan:

```bash
npm run dev
```

**4. Buka di Browser**
Pastikan Laragon/XAMPP kamu sudah menyala (Start), lalu buka browser dan akses:

```bash
http://localhost/wedding
```

## 📝 Cara Mengubah Data Pengantin

1. Buka folder data/
2. Edit file wedding-data.json.
3. Sesuaikan nama, tanggal, alamat, dan link Google Maps di sana.
4. Save, dan refresh browser!
