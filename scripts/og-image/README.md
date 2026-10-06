# scripts/og-image — gambar preview link

Gambar yang muncul saat link portofolio dibagikan di LinkedIn, WhatsApp, X, dll. (1200×630).
Hasilnya sudah tersimpan di `public/images/og.jpg`.

Mau mengubah? Edit `og.html` (teks, warna, stiker), lalu jalankan:

```bash
pip install playwright
playwright install chromium
python scripts/og-image/generate.py
```

Atau cara manual: buka `og.html` di Chrome, atur ukuran jendela ke 1200×630, screenshot, simpan sebagai `public/images/og.jpg`.

Setelah deploy, ganti `content="/images/og.jpg"` di `index.html` menjadi URL lengkap
(mis. `https://evansuryadinata.vercel.app/images/og.jpg`) — beberapa platform (Facebook, LinkedIn) hanya membaca URL lengkap.
