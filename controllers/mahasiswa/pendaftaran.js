const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Menampilkan halaman form pendaftaran
exports.getFormPendaftaran = async (req, res) => {
  try {
    const dosenList = await prisma.dosen.findMany({
      select: {
        nip_dosen: true,
        nama_dosen: true
      }
    });

    const bidangList = [
      'Sistem Informasi',
      'Rekayasa Perangkat Lunak',
      'Data Science',
      'Kecerdasan Buatan',
      'Jaringan Komputer',
      'Keamanan Siber',
      'Interaksi Manusia dan Komputer'
    ];

    res.render('mahasiswa/pendaftaranMhs', { dosenList, bidangList });
  } catch (error) {
    console.error('Gagal mengambil data dosen:', error);
    res.status(500).send('Terjadi kesalahan dalam mengambil data dosen.');
  }
};

// Menyimpan data form pendaftaran
exports.submitFormPendaftaran = async (req, res) => {
  try {
    console.log('DATA YANG DITERIMA:', req.body); // Debugging
    const { nim, nama_lengkap, judul, bidangPenelitian, nipDosen } = req.body;

    if (!nim || !nama_lengkap || !judul || !bidangPenelitian || !nipDosen) {
      return res.status(400).send('Semua field wajib diisi.');
    }

    await prisma.pendaftaran.create({
      data: {
        nama_lengkap: nama_lengkap,
        nim_mhs: parseInt(nim),
        judul: judul.trim(),
        bidang_penelitian: bidangPenelitian,
        nip_dosen: parseInt(nipDosen),
      }
    });

    res.redirect('/dashboardMhs'); // Ganti sesuai halaman setelah submit
  } catch (error) {
    console.error('Gagal menyimpan pendaftaran:', error);
    res.status(500).send('Terjadi kesalahan saat menyimpan data.');
  }
};
