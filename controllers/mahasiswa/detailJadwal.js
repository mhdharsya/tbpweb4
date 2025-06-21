// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// async function getDetailJadwal(req, res) {
//   try {
//     const { id_pendaftaran } = req.params;  // Mengambil id_pendaftaran dari URL

//     // Periksa apakah id_pendaftaran valid dan bukan undefined atau kosong
//     if (!id_pendaftaran) {
//       return res.status(400).send('ID Pendaftaran tidak valid');
//     }

//     // Ambil data pendaftaran berdasarkan ID pendaftaran
//     const pendaftaran = await prisma.pendaftaran.findUnique({
//       where: { id_pendaftaran: id_pendaftaran },  // ID pendaftaran yang dipilih
//       include: {
//         jadwal_pendaftaran: {
//           select: {
//             jam_mulai: true,
//             jam_selesai: true,
//             dosen_penguji: true
//           }
//         },
//         // Pilih field yang diperlukan dari pendaftaran
//         select: {
//           judul: true,           // Ambil judul seminar
//           id_user: true,         // Ambil id_user
//           nama_dosen: true,      // Ambil nama dosen
//           status: true           // Ambil status seminar
//         }
//       }
//     });

//     if (!pendaftaran) {
//       return res.status(404).send('Seminar tidak ditemukan');
//     }

//     // Mengambil jadwal_pendaftaran (misalnya mengambil jadwal pertama jika ada beberapa jadwal)
//     const jadwal = pendaftaran.jadwal_pendaftaran[0];  // Ambil jadwal pertama

//     // Format tanggal dan waktu
//     const hari = jadwal.jam_mulai.toLocaleString('id-ID', { weekday: 'long' }).toUpperCase();  // Hari
//     const tanggal = jadwal.jam_mulai.toLocaleDateString('id-ID');  // Tanggal
//     const waktu = `${jadwal.jam_mulai.toLocaleTimeString('id-ID')} - ${jadwal.jam_selesai.toLocaleTimeString('id-ID')}`;  // Waktu

//     // Kirim data ke view (EJS)
//     res.render('mahasiswa/detailJadwal', {
//       judul: pendaftaran.judul,
//       nama_dosen: pendaftaran.nama_dosen,
//       dosen_penguji: jadwal.dosen_penguji,  // Dosen Penguji
//       hari,
//       tanggal,
//       waktu,
//     });
//   } catch (error) {
//     console.error("Error fetching seminar detail:", error);
//     res.status(500).send('Terjadi kesalahan dalam mengambil data');
//   }
// }

// module.exports = { getDetailJadwal };

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getJadwal(req, res) {
  try {
    const { id } = req.params;  // Ambil ID dari URL

    // Ambil data pendaftaran berdasarkan ID pendaftaran dan pastikan nama_laporan tidak null
    const pendaftaran = await prisma.pendaftaran.findUnique({
      where: {
        id_pendaftaran: parseInt(id),  // Cari berdasarkan id_pendaftaran
      },
      select: {
        id_pendaftaran: true,  // ID seminar
        judul: true,  // Judul seminar
        id_user: true,  // ID user
      },
    });

    // Cek jika data pendaftaran tidak ditemukan
    if (!pendaftaran) {
      return res.status(404).send('Seminar tidak ditemukan');
    }

    // Render data pendaftaran ke halaman detailJadwal
    res.render('mahasiswa/detailJadwal', {  
      judul: pendaftaran.judul,
      id_pendaftaran: pendaftaran.id_pendaftaran, 
    });
  } catch (error) {
    console.error("Error fetching jadwal seminar:", error);
    res.status(500).send('Terjadi kesalahan dalam mengambil data');
  }
}

module.exports = { getJadwal };
