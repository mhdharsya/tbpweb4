const express = require('express');
const router = express.Router();

// HANYA UBAH BARIS INI
const { auth: authMiddleware } = require('../../middleware/authMiddleware');
// BARIS LAINNYA BIARKAN SAMA
const dosenMiddleware = require('../../middleware/dosen');
const penilaianController = require('../../controllers/dosen/penilaian');


// Rute untuk menampilkan halaman (view)
// Tidak perlu ada perubahan di sini, karena variabel `authMiddleware` sekarang sudah benar
router.get(
    '/',
    authMiddleware,
    dosenMiddleware,
    penilaianController.renderPenilaianPage
);

// Rute API untuk data mahasiswa
router.get(
    '/api/mahasiswa-bimbingan',
    authMiddleware,
    dosenMiddleware,
    penilaianController.getMahasiswaBimbingan
);

// Rute API untuk mengambil nilai yang sudah ada
router.get(
    '/api/nilai/:mahasiswaId',
    authMiddleware,
    dosenMiddleware,
    penilaianController.getExistingNilai
);

// Rute API untuk mengirim/menyimpan penilaian
router.post(
    '/api/penilaian',
    authMiddleware,
    dosenMiddleware,
    penilaianController.submitPenilaian
);

module.exports = router;