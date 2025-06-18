// controllers/panduanController.js
const panduanService = require('../../services/panduanService');
// Untuk handle multipart/form-data (upload file)
const multer = require('multer'); // Pastikan sudah diinstal: npm install multer
const upload = multer(); // Inisialisasi multer tanpa penyimpanan di disk, file masuk ke req.file/req.files

const fs = require('fs');   // <--- TAMBAHKAN INI
const path = require('path'); // <--- TAMBAHKAN INI

// Endpoint untuk mengunggah panduan
const uploadPanduanApi = async (req, res) => {
    try {
        // req.file akan berisi data file jika menggunakan multer single()
        if (!req.file) {
            return res.status(400).json({ message: 'Tidak ada file yang diunggah.' });
        }
        console.log(`DEBUG UPLOAD CONTROLLER: File diterima. Originalname: ${req.file.originalname}, Mimetype: ${req.file.mimetype}`);
        // Asumsi admin ID (niku) didapatkan dari sesi/token autentikasi
        // Untuk tujuan pengujian, kita bisa hardcode atau ambil dari body jika ada
        const nikuAdmin = req.user?.niku || 1; // Contoh: Ambil dari req.user setelah autentikasi, default 1

        const nama_file = req.file.originalname; // Nama file asli dari upload
        const file_buffer = req.file.buffer; // Data binary file sebagai Buffer

        const newPanduan = await panduanService.uploadPanduan(nama_file, file_buffer, nikuAdmin);
        res.status(201).json({ message: 'Panduan berhasil diunggah.', panduan: newPanduan });

    } catch (error) {
        console.error("Error in panduanController.uploadPanduanApi:", error.message);
        res.status(500).json({ message: 'Gagal mengunggah panduan.', details: error.message });
    }
};

// Endpoint untuk mendapatkan daftar semua panduan
const getAllPanduanApi = async (req, res) => {
    try {
        const panduanList = await panduanService.getAllPanduan();
        res.status(200).json(panduanList);
    } catch (error) {
        console.error("Error in panduanController.getAllPanduanApi:", error.message);
        res.status(500).json({ message: 'Gagal mengambil daftar panduan.', details: error.message });
    }
};

// Endpoint untuk mendapatkan panduan terbaru (untuk tampilan "Buku Panduan")
const getLatestPanduanApi = async (req, res) => {
    try {
        const latestPanduan = await panduanService.getLatestPanduan();
        if (latestPanduan) {
            res.status(200).json(latestPanduan);
        } else {
            res.status(404).json({ message: 'Tidak ada panduan terbaru ditemukan.' });
        }
    } catch (error) {
        console.error("Error in panduanController.getLatestPanduanApi:", error.message);
        res.status(500).json({ message: 'Gagal mengambil panduan terbaru.', details: error.message });
    }
};

// Endpoint untuk menampilkan/mendownload file PDF
const getPanduanFileApi = async (req, res) => {
    const id_panduan = parseInt(req.params.id);

    if (isNaN(id_panduan)) {
        return res.status(400).json({ message: 'ID Panduan tidak valid.' });
    }

    try {
    const panduan = await panduanService.getPanduanFile(id_panduan);

    if (!panduan || !panduan.file_data) {
        console.error(`DEBUG FILE CONTROLLER: Data file tidak ditemukan di service untuk ID: ${id_panduan}`);
        return res.status(404).json({ message: 'File panduan tidak ditemukan.' });
    }
    console.log(`DEBUG FILE CONTROLLER: Mengirim file: ${panduan.nama_file}, ukuran: ${panduan.file_data.length} bytes`);

    // --- TAMBAHKAN KODE DEBUG INI ---
    const tempFileName = `temp_debug_panduan_${Date.now()}.pdf`; // Nama unik
    const tempFilePath = path.join(__dirname, '..', '..', 'temp_files', tempFileName); // Path di root project Anda, buat folder 'temp_files'

    // Pastikan folder temp_files ada
    const tempDir = path.join(__dirname, '..', '..', 'temp_files');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    try {
        fs.writeFileSync(tempFilePath, panduan.file_data);
        console.log(`DEBUG FILE CONTROLLER: Buffer PDF dari DB berhasil ditulis ke: ${tempFilePath}`);
    } catch (writeErr) {
        console.error('DEBUG FILE CONTROLLER: Gagal menulis file temp:', writeErr);
    }
    // --- AKHIR KODE DEBUG ---

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${panduan.nama_file}"`); // Menggunakan attachment
    res.send(panduan.file_data); // Kirim buffer ke browser

} catch (error) {
    console.error("Error in panduanController.getPanduanFileApi:", error.message);
    res.status(500).json({ message: 'Gagal mengambil file panduan.', details: error.message });
}
};

module.exports = {
    uploadPanduanApi,
    getAllPanduanApi,
    getLatestPanduanApi,
    getPanduanFileApi,
    upload // Expose multer instance to use in route
};