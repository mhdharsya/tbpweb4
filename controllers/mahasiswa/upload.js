const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs/promises');

// Menampilkan form upload
exports.getUploadForm = (req, res) => {
  res.render('mahasiswa/upload');
};

exports.handleUpload = async (req, res) => {
  try {
    const { files } = req;
    // const nim = req.body.nim || 12345678; // Pastikan NIM ada atau gunakan nilai default
    // const id_pendaftaran = 7; // Gantilah dengan id_pendaftaran yang valid

    const updateData = {};

    // Memproses file KRS
    if (files.krs && files.krs[0]) {
      updateData.nama_krs = files.krs[0].originalname;
      updateData.file_krs = files.krs[0].buffer;  // Menggunakan buffer langsung
    } else {
      updateData.nama_krs = null;
      updateData.file_krs = null;
    }

    // Memproses file PPT
    if (files.ppt && files.ppt[0]) {
      updateData.nama_ppt = files.ppt[0].originalname;
      updateData.file_ppt = files.ppt[0].buffer;  // Menggunakan buffer langsung
    } else {
      updateData.nama_ppt = null;
      updateData.file_ppt = null;
    }

    // Memproses file Lampiran Pengesahan
    if (files.lampiran && files.lampiran[0]) {
      updateData.nama_pengesahan = files.lampiran[0].originalname;
      updateData.file_pengesahan = files.lampiran[0].buffer;  // Menggunakan buffer langsung
    } else {
      updateData.nama_pengesahan = null;
      updateData.file_pengesahan = null;
    }

    // Memproses file Laporan Penelitian
    if (files.laporan && files.laporan[0]) {
      updateData.nama_laporan = files.laporan[0].originalname;
      updateData.file_laporan = files.laporan[0].buffer;  // Menggunakan buffer langsung
    } else {
      updateData.nama_laporan = null;
      updateData.file_laporan = null;
    }

    // Jika tidak ada file yang diupload
    if (Object.keys(updateData).length === 0) {
      return res.status(400).send('❌ Tidak ada berkas yang diunggah.');
    }

    // Melakukan update di database berdasarkan id_pendaftaran
    const updatedRecord = await prisma.pendaftaran.update({
      where: {
        id_pendaftaran: 7,  // Menggunakan id_pendaftaran sebagai identifier unik
      },
      data: updateData,
    });

    if (!updatedRecord) {
      return res.status(404).send('❌ Record not found for update.');
    }

    // Mengarahkan pengguna ke halaman dashboard setelah berhasil
    res.redirect('/dashboardMhs');
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ message: '❌ Gagal mengunggah berkas.', details: error.message });
  }
};
