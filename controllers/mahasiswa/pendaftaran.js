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

    console.log("id cookie dari JWT : ", req.user.userId);
    console.log("email cookie dari JWT : ", req.user.email);
    console.log("role cookie dari JWT : ", req.user.role);

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
    const { judul, bidangPenelitian, nipDosen } = req.body;

    if (!judul || !bidangPenelitian || !nipDosen) {
      return res.status(400).send('Semua field wajib diisi.');
    }

    const id_user = req.user.userId;

    const nama = await prisma.mahasiswa.findUnique({
      where: {nim: id_user},
      select: {
        nama_lengkap:true
      }
    })

    await prisma.pendaftaran.create({
      data: {
        nama_lengkap: nama.nama_lengkap,
        nim_mhs: id_user,
        judul: judul.trim(),
        bidang_penelitian: bidangPenelitian,
        nip_dosen: parseInt(nipDosen),
      }
    });

    res.redirect('/mahasiswa/upload'); // Ganti sesuai halaman setelah submit
  } catch (error) {
    console.error('Gagal menyimpan pendaftaran:', error);
    res.status(500).send('Terjadi kesalahan saat menyimpan data.');
  }
};