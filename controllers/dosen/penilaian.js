const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// REVISI: Mengambil kriteria dari DB dan mengirimkannya ke EJS
const renderPenilaianPage = async (req, res) => {
    try {
        // 1. Ambil semua kriteria penilaian dari database
        const kriteriaPenilaian = await prisma.kriteriaPenilaian.findMany({
            orderBy: {
                id: 'asc' // Urutkan berdasarkan ID agar konsisten
            }
        });

        // 2. Render halaman dan kirim data kriteria
        res.render('dosen/penilaian', {
            title: 'Penilaian Seminar',
            user: req.user,
            kriteriaPenilaian: kriteriaPenilaian // <-- DATA DIKIRIM KE EJS
        });

    } catch (error) {
        console.error("Gagal memuat halaman penilaian:", error);
        // Mungkin render halaman error atau kirim pesan error
        res.status(500).send("Tidak dapat memuat halaman penilaian.");
    }
};

// FUNGSI INI TETAP SAMA (SUDAH BAIK)
const getMahasiswaBimbingan = async (req, res) => {
    try {
        const dosenId = req.user.id; 

        // Query ini sudah bagus. Mungkin bisa ditambahkan filter status seminar.
        const mahasiswa = await prisma.mahasiswa.findMany({
            where: {
                dosenPembimbingId: dosenId,
                // CONTOH FILTER TAMBAHAN:
                // statusSeminar: 'DIJADWALKAN'
            },
            select: {
                id: true,
                nim: true,
                nama: true
            }
        });
        res.json(mahasiswa);
    } catch (error) {
        console.error("Gagal mengambil data mahasiswa:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

// REVISI: Menggunakan 'upsert' untuk membuat atau memperbarui penilaian
const submitPenilaian = async (req, res) => {
    try {
        const dosenId = req.user.id;
        const { mahasiswaId, nilai, nilaiAkhir } = req.body;

        if (!mahasiswaId || !nilai || nilaiAkhir === undefined) {
            return res.status(400).json({ message: "Data tidak lengkap." });
        }
        
        const mahasiswaIdInt = parseInt(mahasiswaId);

        // Menggunakan 'upsert'
        // - 'where': Kondisi untuk mencari data yang ada.
        // - 'create': Data untuk dibuat jika tidak ada.
        // - 'update': Data untuk diperbarui jika sudah ada.
        const penilaian = await prisma.penilaian.upsert({
            where: {
                // Asumsi ada unique constraint di schema.prisma: @@unique([dosenId, mahasiswaId])
                dosenId_mahasiswaId: {
                    dosenId: dosenId,
                    mahasiswaId: mahasiswaIdInt
                }
            },
            update: {
                nilaiAkhir: parseFloat(nilaiAkhir),
                detailNilai: nilai // Prisma akan handle JSON
            },
            create: {
                mahasiswaId: mahasiswaIdInt,
                dosenId: dosenId,
                nilaiAkhir: parseFloat(nilaiAkhir),
                detailNilai: nilai
            }
        });
        
        // Opsional: Update status mahasiswa setelah dinilai
        // await prisma.mahasiswa.update({ where: { id: mahasiswaIdInt }, data: { status: 'SELESAI_NILAI' } });

        res.status(201).json({ 
            message: "Penilaian berhasil disimpan/diperbarui!", 
            data: penilaian 
        });

    } catch (error) {
        console.error("Gagal menyimpan penilaian:", error);
        res.status(500).json({ message: "Terjadi kesalahan saat menyimpan data." });
    }
};

// BARU: Fungsi untuk mengambil data nilai yang sudah ada
const getExistingNilai = async (req, res) => {
    try {
        const dosenId = req.user.id;
        const { mahasiswaId } = req.params;

        const penilaian = await prisma.penilaian.findUnique({
            where: {
                dosenId_mahasiswaId: {
                    dosenId: dosenId,
                    mahasiswaId: parseInt(mahasiswaId)
                }
            }
        });

        if (!penilaian) {
            // Ini bukan error, tapi artinya data belum ada. Kirim 404.
            return res.status(404).json({ message: "Penilaian untuk mahasiswa ini belum ada." });
        }
        
        // Jika data ditemukan, kirim kembali sebagai JSON
        // Di frontend, kita akan membaca `detailNilai` dari sini
        res.json({
            nilaiAkhir: penilaian.nilaiAkhir,
            nilai: penilaian.detailNilai // Mengirim kembali array detail nilai
        });

    } catch (error) {
        console.error("Gagal mengambil nilai yang ada:", error);
        res.status(500).json({ message: "Terjadi kesalahan pada server." });
    }
};

module.exports = {
    renderPenilaianPage,
    getMahasiswaBimbingan,
    submitPenilaian,
    getExistingNilai // <-- EXPORT FUNGSI BARU
};