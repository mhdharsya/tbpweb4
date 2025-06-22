exports.getFormMelihat = async (req, res) => {
  try {
    const user = req.user;
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();


    if (!user ||!user.nama_lengkap) {
      return res.status(400).send('User tidak ditemukan');
    }

    const bacajudul = await prisma.pendaftaran.findFirst({
      where: {
        id_user: user.userId
      },
      select: {
        id_pendaftaran: true,
        judul: true,
        nama_dosen: true
      }
    });

    const rubik = await prisma.rubik.findUnique({
  where: {
    id_rubik: 'RBK001'
  },
  select: {
    pemahaman: true,
    dokumenasi: true,
    presentasi: true,
    ketepatan_waktu: true,
    sikap: true
  }
});

    const komen = await prisma.nilai_semhas.findFirst({
      where: {
        id_pendaftaran: 2
      },
      select: {
        komentar: true,
        status_semhas: true
      }
    });

    const dosen = await prisma.user.findFirst({
      where: {
        nama_lengkap: bacajudul.nama_dosen
      },
      select: {
        id_user: true
      }
    });

      // Siapkan array penilaian jika rubik ditemukan
      if (rubik) {
        kriteriaPenilaian = [
          { label: 'Pemahaman terhadap Materi Tugas Akhir', nilai: rubik.pemahaman },
          { label: 'Kelengkapan dan Kualitas Dokumentasi Laporan', nilai: rubik.dokumenasi },
          { label: 'Kemampuan dalam Menyampaikan Presentasi', nilai: rubik.presentasi },
          { label: 'Ketepatan Waktu dalam Pelaksanaan Presentasi', nilai: rubik.ketepatan_waktu },
          { label: 'Sikap Profesional saat Presentasi dan Tanya Jawab', nilai: rubik.sikap },
        ];
      }

      if (komen) {
        komentar = komen.komentar;
        status_semhas = komen.status_semhas;
      } else {
        komentar = '-';
        status_semhas = '-';
      }
    
        console.log('judul:', bacajudul.judul)

    return res.render('mahasiswa/melihatdandownloadnilai', {
      nama_lengkap: user.nama_lengkap,
      judul: bacajudul.judul,
      user: req.user,
      kriteriaPenilaian,
      nama_dosen: bacajudul.nama_dosen,
      nip_dosen: dosen.id_user,
    });

  } catch (error) {
    console.error('ERROR GET MELIHAT NILAI:', error);
    return res.status(500).send('Terjadi kesalahan dalam melihat nilai ');
  }
};
