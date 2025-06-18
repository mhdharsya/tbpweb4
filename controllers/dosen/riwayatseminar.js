const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Menampilkan halaman utama Riwayat Seminar
exports.index = (req, res) => {
  res.render('dosen/riwayatseminar', {
    title: 'Riwayat Seminar', // <--- PASTIKAN BARIS INI ADA
    user: req.user
  });
};

// Menyediakan data untuk API DataTables
exports.getApiData = async (req, res) => {
    try {
        const dosenId = req.user.id;
        const { draw, start, length, search } = req.query;
        const searchValue = search.value || '';

        let whereClause = { dosenPembimbingId: dosenId };
        if (searchValue) {
            whereClause.OR = [
                { mahasiswa: { nim: { contains: searchValue, mode: 'insensitive' } } },
                { mahasiswa: { nama: { contains: searchValue, mode: 'insensitive' } } },
                { judulPenelitian: { contains: searchValue, mode: 'insensitive' } },
                { status: { contains: searchValue, mode: 'insensitive' } },
            ];
        }

        const totalRecords = await prisma.seminar.count({ where: { dosenPembimbingId: dosenId } });
        const filteredRecords = await prisma.seminar.count({ where: whereClause });

        const seminars = await prisma.seminar.findMany({
            where: whereClause,
            include: { mahasiswa: { select: { nim: true, nama: true } } },
            orderBy: { tanggalSeminar: 'desc' },
            skip: parseInt(start) || 0,
            take: parseInt(length) || 10
        });

        const data = seminars.map((seminar, index) => ({
            no: parseInt(start) + index + 1,
            nim: seminar.mahasiswa.nim,
            nama: seminar.mahasiswa.nama,
            judul: seminar.judulPenelitian,
            // Berikan class pada status untuk styling di CSS
            status: `<span class="status-badge status-${seminar.status?.toLowerCase()}">${seminar.status || 'Baru'}</span>`,
            tanggalSeminar: seminar.tanggalSeminar?.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' }) || '-',
            actions: `
                <div class="action-buttons">
                    <button onclick="viewDetail(${seminar.id})" class="btn-detail">Detail</button>
                    <button onclick="updateStatus(${seminar.id})" class="btn-update">Update</button>
                </div>`
        }));

        res.json({
            draw: parseInt(draw),
            recordsTotal: totalRecords,
            recordsFiltered: filteredRecords,
            data: data
        });
    } catch (error) {
        console.error('Error di getApiData:', error);
        res.status(500).json({ error: 'Gagal mengambil data' });
    }
};

// Mengupdate status seminar dari modal
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, catatan } = req.body;
        
        await prisma.seminar.update({
            where: { id: parseInt(id) },
            data: { status, catatan }
        });

        res.json({ success: true, message: 'Status berhasil diperbarui!' });
    } catch (error) {
        console.error("Gagal memperbarui status:", error);
        res.status(500).json({ success: false, message: 'Gagal memperbarui status.' });
    }
};

// Fungsi lain (jika Anda ingin mengembangkannya nanti)
exports.detail = (req, res) => { res.send(`Halaman detail untuk seminar ID: ${req.params.id}`); };
exports.exportData = (req, res) => { res.send('Fitur export sedang dikembangkan.'); };