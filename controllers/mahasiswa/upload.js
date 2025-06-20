const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Menampilkan form upload
exports.getUploadForm = async (req, res) => {
  try {
    const { id_pendaftaran } = req.params;  // Ambil id_pendaftaran dari URL

    console.log("id_pendaftaran di getUploadForm:", id_pendaftaran);  // Cek id_pendaftaran

    if (!id_pendaftaran) {
      return res.status(400).send('❌ ID Pendaftaran tidak ditemukan.');
    }

    // Query untuk mengambil data pendaftaran berdasarkan id_pendaftaran
    const pendaftaran = await prisma.pendaftaran.findUnique({
      where: {
        id_pendaftaran: parseInt(id_pendaftaran),  // Menggunakan id_pendaftaran dari URL
      },
    });

    if (!pendaftaran) {
      return res.status(404).send('❌ Pendaftaran tidak ditemukan.');
    }

    // Jika data pendaftaran ditemukan, render halaman upload dan pass data pendaftaran ke view
    res.render('mahasiswa/upload', { id_pendaftaran, pendaftaran });

  } catch (error) {
    console.error('❌ Gagal mengambil data pendaftaran:', error);
    res.status(500).send('Terjadi kesalahan saat mengambil data pendaftaran.');
  }
};


// Tentukan folder untuk menyimpan file
const uploadPath = path.join(__dirname, 'uploads');  // Ganti dengan lokasi folder yang diinginkan

// Pastikan folder upload ada
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

exports.handleUpload = async (req, res) => {
  try {
    const { id_pendaftaran } = req.params;  // Ambil id_pendaftaran dari URL

    if (!id_pendaftaran) {
      return res.status(400).send('❌ ID Pendaftaran tidak ditemukan.');
    }

    // Membuat objek updateData untuk menyimpan file yang diupload
    const updateData = {};

    // Fungsi untuk menyimpan file dan mengupdate nama file
    const saveFile = (fileField, dbField) => {
      if (req.files[fileField] && req.files[fileField][0]) {
        const file = req.files[fileField][0];
        const fileName = `${Date.now()}_${file.originalname}`;
        const filePath = path.join(uploadPath, fileName);

        // Simpan file ke dalam folder upload
        fs.writeFileSync(filePath, file.buffer);

        // Update nama file di database
        updateData[dbField] = fileName;
      } else {
        updateData[dbField] = null;
      }
    };

    // Memproses file KRS
    saveFile('krs', 'nama_krs');
    
    // Memproses file PPT
    saveFile('ppt', 'nama_ppt');
    
    // Memproses file Lampiran Pengesahan
    saveFile('lampiran', 'nama_pengesahan');
    
    // Memproses file Laporan Penelitian
    saveFile('laporan', 'nama_laporan');

    // Jika tidak ada file yang diupload
    if (Object.keys(updateData).length === 0) {
      return res.status(400).send('❌ Tidak ada berkas yang diunggah.');
    }

    // Melakukan update di database berdasarkan id_pendaftaran
    await prisma.pendaftaran.update({
      where: { id_pendaftaran: parseInt(id_pendaftaran) },
      data: updateData,
    });

    res.redirect('/dashboard');  // Setelah berhasil, redirect ke halaman dashboard
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ message: '❌ Gagal mengunggah berkas.', details: error.message });
  }
};