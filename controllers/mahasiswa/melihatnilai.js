const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.showNilai = async (req, res) => {
  try {
    const nim = req.user.nim; // jika login sebagai mahasiswa
    const data = await prisma.nilai_semhas.findMany({
      where: {
        pendaftaran: {
          nim: nim
        }
      },
      include: {
        pendaftaran: true
      }
    });

    res.render('mahasiswa/nilai', { data });
  } catch (error) {
    console.error(error);
    res.status(500).send('Gagal memuat nilai');
  }
};
