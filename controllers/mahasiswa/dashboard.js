// controllers/mahasiswa/dashboard.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getFormDashboard = async (req, res) => {
  try {
    const user = req.user;  // Mengambil data pengguna yang sudah didecode dari JWT

    // Jika tidak ada user atau nama lengkap, kirimkan error
    if (!user || !user.nama_lengkap) {
      return res.status(400).send('User tidak ditemukan');
    }

    // Ambil data seminar yang berisi judul dan status dari pendaftaran
    const riwayat = await prisma.pendaftaran.findMany({
      where: {
        nama_laporan: {
          not: null, // Pastikan nama_laporan tidak null
        }
      },
      select: {
        id_pendaftaran: true, // ID seminar
        judul: true, // Judul seminar
        status: true,
      },
      orderBy: {
        id_pendaftaran: 'desc', // Urutkan berdasarkan id_pendaftaran jika perlu
      }
    });

    // Cek jika tidak ada data seminar
    if (riwayat.length === 0) {
      return res.render('mahasiswa/dashboardMhs', {
        nama_lengkap: user.nama_lengkap,
        emptyState: true,
      });
    }

    // Kirim data seminar ke halaman dashboard
    res.render('mahasiswa/dashboardMhs', {
      nama_lengkap: user.nama_lengkap,
      riwayat,
      emptyState: false,
    });

  } catch (error) {
    console.error('ERROR GET DASHBOARD:', error);
    return res.status(500).send('Terjadi kesalahan dalam dashboard');
  }
};
