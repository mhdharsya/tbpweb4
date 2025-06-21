const express = require('express');
const router = express.Router();
const panduanService = require('../../services/panduanService'); // Pastikan path ini benar!


router.get('/', async (req, res) => { // Make this an async function
    try {
        // Fetch the list of all panduan from your service
        const panduanList = await panduanService.getAllPanduan(); // <--- THIS IS THE KEY FIX

        // Render the EJS template and pass the fetched data
        res.render('mahasiswa/panduan', {
            panduanList: panduanList // Pass the panduanList array to the EJS template
        });
    } catch (error) {
        console.error("Error rendering panduan page:", error);
        // It's good practice to send a meaningful error response to the client
        res.status(500).send("Gagal memuat halaman panduan. Silakan coba lagi nanti.");
    }
});
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