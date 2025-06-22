const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /bidang-keahlian
exports.listBidangKeahlian = async (req, res) => {
  const perPage = 6;
  const page    = parseInt(req.query.page, 10) || 1;
  const skip    = (page - 1) * perPage;

  // Bangun filter: cari berdasarkan nama lengkap user dan filter bidang
  const where = {};
  if (req.query.search) {
    where.user = {
      nama_lengkap: { contains: req.query.search, mode: 'insensitive' }
    };
  }
  if (req.query.filter && req.query.filter !== 'all') {
    where.bidang_keahlian = { equals: req.query.filter };
  }

  try {
    // Ambil data jadwal beserta relation user
    const [entries, total] = await Promise.all([
      prisma.jadwal_dosendosen.findMany({
        where,
        include: { user: true },
        orderBy: { tanggal_data: 'desc' },
        skip,
        take: perPage,
      }),
      prisma.jadwal_dosendosen.count({ where }),
    ]);
    const totalPages = Math.ceil(total / perPage);

    const bidangOptions = [
      'Tata Kelola',
      'Rekayasa Digital dan Business Intelligence',
      'Enterprise System',
      'System Development'
    ];

    // Konversi ke format yang view harapkan
    const dosens = entries.map(e => ({
      id_jadwal:       e.id_jadwal_dosen,
      nama_dosen:      e.user.nama_lengkap,
      bidang_keahlian: e.bidang_keahlian,
      tanggal:         e.tanggal_data.toISOString().slice(0,10),
    }));

    res.render('kadep/bidangkeahlian', {
      dosens,
      bidangOptions,
      search: req.query.search || '',
      filter: req.query.filter || 'all',
      currentPage: page,
      totalPages
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// POST /bidang-keahlian → tambah jadwal baru
exports.createJadwal = async (req, res) => {
  const { id_user, tanggal_data, bidang_keahlian } = req.body;
  try {
    await prisma.jadwal_dosendosen.create({
      data: {
        id_user,
        tanggal_data: new Date(tanggal_data),
        bidang_keahlian
      }
    });
    res.redirect('/bidang-keahlian');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menambah jadwal');
  }
};

// PUT /bidang-keahlian/:id → ubah bidang keahlian pada jadwal tertentu
exports.updateJadwal = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { bidang_keahlian } = req.body;
  try {
    await prisma.jadwal_dosendosen.update({
      where: { id_jadwal_dosen: id },
      data: { bidang_keahlian }
    });
    res.redirect('/bidang-keahlian');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal mengubah jadwal');
  }
};

// DELETE /bidang-keahlian/:id → hapus bidang pada jadwal (kosongkan field)
exports.deleteJadwal = async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await prisma.jadwal_dosendosen.update({
      where: { id_jadwal_dosen: id },
      data: { bidang_keahlian: null }
    });
    res.redirect('/bidang-keahlian');
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal menghapus jadwal');
  }
};