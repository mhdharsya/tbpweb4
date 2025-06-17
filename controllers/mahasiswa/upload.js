const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs/promises');

// Menampilkan form upload
exports.getUploadForm = (req, res) => {
  res.render('mahasiswa/upload');
};

// Menangani upload file
exports.handleUpload = async (req, res) => {
  try {
    const { files } = req;
    const nim = req.body.nim || 12345678; // Ensure nim is passed from the form or use a default for testing
    const id_pendaftaran = req.body.id_pendaftaran || 6; // Replace this with the actual id_pendaftaran if available

    const updateData = {};

    console.log('id_pendaftaran:', id_pendaftaran);
    console.log('nim:', nim); // Log nim to confirm it's the correct value

    // Process KRS file
    if (files.krs && files.krs[0]) {
      updateData.nama_krs = files.krs[0].originalname;
      updateData.file_krs = await fs.readFile(files.krs[0].path); // Reading file as buffer
    } else {
      updateData.nama_krs = null;
      updateData.file_krs = null;
    }

    // Process PPT file
    if (files.ppt && files.ppt[0]) {
      updateData.nama_ppt = files.ppt[0].originalname;
      updateData.file_ppt = await fs.readFile(files.ppt[0].path); // Reading file as buffer
    } else {
      updateData.nama_ppt = null;
      updateData.file_ppt = null;
    }

    // Process Lampiran file (Pengesahan)
    if (files.lampiran && files.lampiran[0]) {
      updateData.nama_pengesahan = files.lampiran[0].originalname;
      updateData.file_pengesahan = await fs.readFile(files.lampiran[0].path); // Reading file as buffer
    } else {
      updateData.nama_pengesahan = null;
      updateData.file_pengesahan = null;
    }

    // Process Laporan file
    if (files.laporan && files.laporan[0]) {
      updateData.nama_laporan = files.laporan[0].originalname;
      updateData.file_laporan = await fs.readFile(files.laporan[0].path); // Reading file as buffer
    } else {
      updateData.nama_laporan = null;
      updateData.file_laporan = null;
    }

    // Check if no files are uploaded
    if (Object.keys(updateData).length === 0) {
      return res.status(400).send('❌ Tidak ada berkas yang diunggah.');
    }

    // Update the database using the unique id_pendaftaran
    const updatedRecord = await prisma.pendaftaran.update({
      where: {
        id_pendaftaran: id_pendaftaran, // Use id_pendaftaran as the unique identifier
      },
      data: updateData,
    });

    if (!updatedRecord) {
      return res.status(404).send('❌ Record not found for update.');
    }

    // Redirect to the dashboard after a successful update
    res.redirect('/dashboardMhs');
  } catch (error) {
    console.error('❌ Upload error:', error.message);
    res.status(500).json({ message: '❌ Gagal mengunggah berkas.', details: error.message });
  }
};
