const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
 
const getListMahasiswa = async (req, res) => {
  try {
    // 1. Query data dari tabel 'pendaftaran' dan sertakan (include) tabel lain yang terkait.
    const pendaftaranList = await prisma.pendaftaran.findMany({
      where: {
        // PENTING: Filter berdasarkan NIP dosen yang sedang login.
        // NIP ini harus Anda dapatkan dari session atau token (misal: req.user.nip).
        // NIP di bawah ini HANYA CONTOH, harus diganti dengan data dinamis.
        nip_dosen: 5011001
      },
      include: {
        mahasiswa: true,          // Mengambil data dari tabel mahasiswa
        jadwal_pendaftaran: true, // Mengambil data dari tabel jadwal_pendaftaran
        periode_semhas: true      // Mengambil data dari tabel periode_semhas
      }
    });

    // 2. Format data gabungan agar sesuai dengan yang dibutuhkan di file EJS.
    const formattedData = pendaftaranList.map(p => {
      // Ambil data jadwal, cek jika ada untuk menghindari error
      const jadwal = p.jadwal_pendaftaran && p.jadwal_pendaftaran[0] ? p.jadwal_pendaftaran[0] : {};
      
      return {
        nim: p.mahasiswa?.nim,
        nama: p.mahasiswa?.nama_lengkap,
        judul_seminar: p.judul,
        tanggal_seminar: p.periode_semhas?.tanggal_buka,
        waktu_mulai: jadwal.jam_mulai ? new Date(jadwal.jam_mulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }) : null,
        waktu_selesai: jadwal.jam_selesai ? new Date(jadwal.jam_selesai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }) : null
      };
    });
   
    // 3. Render halaman dengan data yang sudah diformat dengan benar.
    res.render('dosen/mahasiswaseminar', { 
      mahasiswaList: formattedData,
      title: 'List Mahasiswa Seminar'
    });

  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).render('dosen/mahasiswaseminar', {
      mahasiswaList: [],
      errorMessage: `Gagal memuat data dari database: ${error.message}`,
      title: 'List Mahasiswa Seminar'
    });
  }
}

module.exports = {
  getListMahasiswa
}