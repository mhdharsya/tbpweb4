const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
 
const getListMahasiswa = async (req, res) => {
  try {
    
    const dosen = req.user; // Ini adalah data user yang login dari JWT, BUKAN objek dari tabel dosen/user secara penuh.

    // Tambahkan log lebih detail untuk debugging jika diperlukan
    console.log("LOG: Data dosen (dari req.user token):", dosen);

    if (!dosen || !dosen.userId || dosen.role !== 'DOSEN') {
        console.error('Error: User data missing, userId not found, or not a DOSEN. req.user:', dosen);
        return res.status(403).send('Access Denied: Invalid user or role.');
    }

    // Ambil NIP dosen dari token (userId di JWT Anda adalah NIP)
    const nipDosen = dosen.userId;
    const namaDosen = dosen.nama_lengkap; // Ambil nama lengkap dosen dari token

    const pendaftaranList = await prisma.pendaftaran.findMany({
      where: {
        nip_dosen: nipDosen // Gunakan NIP dosen yang login
      }, include: {
        user :true,
//       include: {
//         judul: true,          // Mengambil data dari tabel mahasiswa
//         nama_krs: true, // Mengambil data dari tabel jadwal_pendaftaran
//         bidang_penelitian: true,      // Mengambil data dari tabel periode_semhas
//         }
    }}
);

    console.log("LOG: Hasil pendaftaranList dari Prisma:", pendaftaranList);

    // 2. Format data gabungan agar sesuai dengan yang dibutuhkan di file EJS.
    const formattedData = pendaftaranList.map(p => {
      // Ambil data jadwal, cek jika ada untuk menghindari error
      const jadwal = p.jadwal_pendaftaran && p.jadwal_pendaftaran.length > 0 ? p.jadwal_pendaftaran[0] : {};
      const namaMahasiswa = p.user ? p.user.nama_lengkap : 'Nama Tidak Ditemukan'; // Pastikan ada data mahasiswa
      
      return {
        nim: p.id_user, // <--- PERBAIKAN DI SINI! Akses dari p.mahasiswa.nim
        nama: namaMahasiswa,
        judul_seminar: p.judul,
        tanggal_seminar: p.periode_semhas?.tanggal_buka,
        waktu_mulai: jadwal.jam_mulai ? new Date(jadwal.jam_mulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }) : null,
        waktu_selesai: jadwal.jam_selesai ? new Date(jadwal.jam_selesai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }) : null
      };
    });
   
    console.log("LOG: Data yang diformat untuk EJS (mahasiswaList):", formattedData);

    // 3. Render halaman dengan data yang sudah diformat dengan benar.
    res.render('dosen/mahasiswaseminar', { 
      mahasiswaList: formattedData,
      title: 'List Mahasiswa Seminar'
    });

  } catch (error) {
    console.error('Database Error in getListMahasiswa:', error); // Detailkan pesan error
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