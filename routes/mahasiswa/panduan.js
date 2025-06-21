const express = require('express');
const router = express.Router();

// API: Ambil panduan terbaru
router.get('/latest', async (req, res) => {
    try {
        const latest = await panduanService.getLatestPanduan(); // Panggil fungsi service

        if (!latest) {
            return res.status(404).json({ message: 'Tidak ada panduan ditemukan' });
        }

        res.json({
            id_panduan: latest.id_panduan,
            nama_file: latest.nama_file,
            tanggal_unggah: latest.tanggal_unggah,
        });
    } catch (error) {
        console.error("Error in /api/panduan/latest route:", error); // Log error spesifik rute
        res.status(500).json({ message: 'Gagal mengambil panduan terbaru' });
    }
});

// API: Tampilkan file PDF langsung dari BLOB
router.get('/file/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const panduan = await panduanService.getPanduanFile(parseInt(id)); // Panggil fungsi service

        if (!panduan || !panduan.file_pdf) {
            return res.status(404).send('File tidak ditemukan');
        }

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `inline; filename="${panduan.nama_file}"`,
        });

        res.send(panduan.file_pdf);
    } catch (error) {
        console.error("Error in /api/panduan/file/:id route:", error); // Log error spesifik rute
        res.status(500).send('Gagal menampilkan file PDF');
    }
});

module.exports = router;