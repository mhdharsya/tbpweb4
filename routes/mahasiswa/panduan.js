const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const panduanList = await prisma.panduan.findMany({
      orderBy: { tanggal_unggah: 'desc' }
    });
    res.render('mahasiswa/panduan', { panduan: panduanList });
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal mengambil data panduan');
  }
});

module.exports = router;
