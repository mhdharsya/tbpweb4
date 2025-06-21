const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const path = require('path');
const prisma = new PrismaClient();

// Konfigurasi multer untuk menyimpan file di temp_files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './temp_files'); // Simpan file di folder temp_files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nama file unik dengan timestamp
  },
});
const upload = multer({ storage: storage });

// Route untuk menampilkan daftar panduan
router.get('/', async (req, res) => {
  try {
    // Mengambil panduan terbaru, diurutkan berdasarkan tanggal unggah
    const panduanList = await prisma.panduan.findMany({
      orderBy: { tanggal_unggah: 'desc' }, // Mengurutkan berdasarkan tanggal unggah terbaru
      take: 1, // Mengambil hanya 1 data panduan terbaru
    });

    if (panduanList.length > 0) {
      const panduan = panduanList[0]; // Ambil panduan terbaru
      res.render('mahasiswa/panduan', { panduan: panduan });
    } else {
      res.render('mahasiswa/panduan', { panduan: null });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal mengambil data panduan');
  }
});



// Route untuk menangani upload file panduan
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    // Simpan informasi file ke database (misalnya nama file dan tanggal unggah)
    const newPanduan = await prisma.panduan.create({
      data: {
        nama_file: req.file.filename,  // Nama file PDF yang di-upload
        file_path: `/temp_files/${req.file.filename}`,  // Path file yang di-upload
        tanggal_unggah: new Date(),  // Tanggal unggah file
      },
    });

    res.redirect('/panduan'); // Redirect ke halaman panduan setelah upload berhasil
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal meng-upload file');
  }
});

module.exports = router;
