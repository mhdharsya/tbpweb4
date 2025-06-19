const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.viewPdfById = async (req, res) => {
  const { id } = req.params;
  try {
    const panduan = await prisma.panduan.findUnique({
      where: { id: parseInt(id) }
    });

    if (!panduan || !panduan.fileBlob) {
      return res.status(404).send('File tidak ditemukan.');
    }

    // Kirim PDF langsung ke browser
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${panduan.namaFile}"`);
    res.send(Buffer.from(panduan.fileBlob));
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menampilkan file.');
  }
};
