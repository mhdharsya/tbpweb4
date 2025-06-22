// Lokasi: controllers/dosen/penilaian.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Definisi Kriteria Penilaian dan Bobotnya (HARDCODED)
const daftarKriteriaPenilaian = [
    { id: 'pemahaman', nama: 'Pemahaman Materi', bobot: 0.20 },
    { id: 'dokumenasi', nama: 'Dokumenasi & Laporan', bobot: 0.20 }, // TETAP PAKAI EJAAN 'dokumenasi'
    { id: 'presentasi', nama: 'Presentasi', bobot: 0.20 },
    { id: 'ketepatan_waktu', nama: 'Ketepatan Waktu', bobot: 0.20 },
    { id: 'sikap', nama: 'Sikap', bobot: 0.20 }
];

// Helper untuk validasi input numerik (tetap sama)
const isValidScore = (score) => {
    const num = parseFloat(score);
    return !isNaN(num) && num >= 0 && num <= 100;
};

// 1. Render halaman penilaian (tetap sama)
const renderPenilaianPage = async (req, res) => {
    try {
        if (!req.user || !req.user.userId || !req.user.nama_lengkap || req.user.role !== 'DOSEN') {
            console.error('Error: User data missing, userId not found, or not a DOSEN. req.user:', req.user);
            return res.status(403).send('Akses Ditolak: Data pengguna tidak valid atau bukan Dosen.');
        }

        const dosenNamaLengkap = req.user.nama_lengkap;
        const dosenId = req.user.userId;

        console.log('DEBUG: Nama Dosen dari JWT:', dosenNamaLengkap);
        console.log('DEBUG: Dosen Login ID:', dosenId);

        const pendaftaranRecords = await prisma.pendaftaran.findMany({
            where: {
                jadwal_pendaftaran: {
                    some: {
                        dosen_penguji: dosenNamaLengkap
                    }
                }
            },
            include: {
                user: { select: { id_user: true, nama_lengkap: true } },
                jadwal_pendaftaran: { select: { id_jadwal: true, dosen_penguji: true } }
            },
            orderBy: { user: { nama_lengkap: 'asc' } }
        });

        console.log('DEBUG: Pendaftaran Records untuk Dosen (dari Prisma query):', JSON.stringify(pendaftaranRecords, null, 2));

        const finalDaftarMahasiswa = [];
        const processedPendaftaranIds = new Set();

        for (const pendaftaran of pendaftaranRecords) {
            const student = pendaftaran.user;
            const isDosenPengujiValid = pendaftaran.jadwal_pendaftaran.some(jp => jp.dosen_penguji === dosenNamaLengkap);

            if (student && isDosenPengujiValid && !processedPendaftaranIds.has(pendaftaran.id_pendaftaran)) {
                const existingNilai = await prisma.nilai_semhas.findFirst({
                    where: {
                        id_pendaftaran: pendaftaran.id_pendaftaran,
                        id_user: dosenId
                    }
                });

                finalDaftarMahasiswa.push({
                    id_user: student.id_user,
                    nama_lengkap: student.nama_lengkap,
                    id_pendaftaran: pendaftaran.id_pendaftaran,
                    judul: pendaftaran.judul,
                    isDinilai: !!existingNilai
                });
                processedPendaftaranIds.add(pendaftaran.id_pendaftaran);
            }
        }
        console.log('DEBUG: Final Daftar Mahasiswa (yang akan dikirim ke EJS):', JSON.stringify(finalDaftarMahasiswa, null, 2));

        res.render('dosen/penilaian', {
            title: 'Penilaian Seminar',
            user: req.user,
            penilaian: daftarKriteriaPenilaian,
            mahasiswas: finalDaftarMahasiswa
        });

    } catch (error) {
        console.error("Gagal memuat halaman penilaian:", error);
        res.status(500).send("Tidak dapat memuat halaman penilaian.");
    }
};

// 2. Simpan penilaian
const submitPenilaian = async (req, res) => {
    try {
        const { mahasiswaId, scores, status_semhas, komentar } = req.body;

        if (!req.user || !req.user.userId || req.user.role !== 'DOSEN') {
            console.error('Error: User data missing, or not a DOSEN. req.user:', req.user);
            return res.status(403).json({ message: 'Akses Ditolak: Data pengguna tidak valid atau bukan Dosen.' });
        }
        const dosenId = req.user.userId;

        if (!mahasiswaId || !scores || !status_semhas) {
            return res.status(400).json({ message: "Data penilaian tidak lengkap (mahasiswaId, skor, atau status seminar kosong)." });
        }

        for (const kriteria of daftarKriteriaPenilaian) {
            const score = scores[kriteria.id];
            if (!isValidScore(score)) {
                return res.status(400).json({ message: `Nilai untuk ${kriteria.nama} tidak valid (harus angka 0-100).` });
            }
        }
        
        if (komentar && komentar.length > 1000) {
            return res.status(400).json({ message: "Komentar terlalu panjang (maks. 1000 karakter)." });
        }

        const pendaftaranMahasiswa = await prisma.pendaftaran.findFirst({
            where: { id_user: mahasiswaId },
            select: { id_pendaftaran: true }
        });

        if (!pendaftaranMahasiswa) {
            return res.status(404).json({ message: "Pendaftaran mahasiswa tidak ditemukan." });
        }

        const id_pendaftaran = pendaftaranMahasiswa.id_pendaftaran;

        // --- Proses Rubik ---
        const rubikData = {
            pemahaman: String(scores.pemahaman), // Kembali ke String
            dokumenasi: String(scores.dokumenasi), // Kembali ke String
            presentasi: String(scores.presentasi), // Kembali ke String
            ketepatan_waktu: String(scores.ketepatan_waktu), // Kembali ke String
            sikap: String(scores.sikap), // Kembali ke String
            id_pendaftaran: id_pendaftaran
        };

        let rubikRecord;
        let existingRubik = await prisma.rubik.findFirst({
            where: { id_pendaftaran: id_pendaftaran }
        });

        if (existingRubik) {
            rubikRecord = await prisma.rubik.update({
                where: { id_rubik: existingRubik.id_rubik }, // Ini benar karena id_rubik adalah PK rubik
                data: rubikData
            });
        } else {
            // *** PERBAIKAN PENTING DI SINI ***
            // Karena id_rubik di schema.prisma adalah String @id TANPA @default(uuid()) atau @default(autoincrement())
            // Anda HARUS membuat ID-nya secara manual saat membuat record baru.
            const newRubikId = `rubik-${Date.now()}-${id_pendaftaran}`; // Buat ID unik
            rubikRecord = await prisma.rubik.create({
                data: {
                    id_rubik: newRubikId, // Sertakan ID yang dibuat manual
                    ...rubikData
                }
            });
        }
        const rubikIdForComment = rubikRecord.id_rubik; // Pastikan ini mengambil ID yang benar dari record yang dibuat/diupdate

        // --- Proses Nilai Semhas ---
        let existingNilaiSemhas = await prisma.nilai_semhas.findFirst({
            where: {
                id_pendaftaran: id_pendaftaran,
                id_user: dosenId
            }
        });

        if (existingNilaiSemhas) {
            await prisma.nilai_semhas.update({
                where: { id_rubik: existingNilaiSemhas.id_rubik }, // Ini HARUS id_rubik karena itu PK di nilai_semhas
                data: {
                    status_semhas: status_semhas,
                    komentar: komentar,
                    // id_rubik tidak perlu diupdate di data jika sudah sama dengan where.
                }
            });
        } else {
            // *** PERBAIKAN PENTING DI SINI ***
            // id_rubik adalah PK untuk nilai_semhas, jadi harus selalu ada
            // Karena tidak ada @default di schema, kita harus memberikannya.
            // Gunakan rubikIdForComment yang kita dapatkan dari rubikRecord.
            await prisma.nilai_semhas.create({
                data: {
                    id_rubik: rubikIdForComment, // Pastikan ini adalah ID yang valid
                    id_pendaftaran: id_pendaftaran,
                    id_user: dosenId,
                    status_semhas: status_semhas,
                    komentar: komentar,
                }
            });
        }

        res.status(200).json({ message: 'Penilaian berhasil disimpan!' });

    } catch (error) {
        console.error('Gagal menyimpan penilaian:', error);
        if (error.code === 'P2002') {
            // Jika ada unique constraint di nilai_semhas ([id_pendaftaran, id_user, id_rubik] misalnya)
            return res.status(409).json({ message: 'Penilaian untuk mahasiswa ini sudah ada dari dosen ini.' });
        }
        res.status(500).json({ message: 'Terjadi kesalahan internal server saat menyimpan penilaian.' });
    }
};

// 3. Ambil nilai yang sudah pernah dinilai oleh dosen (tetap sama)
const getExistingNilai = async (req, res) => {
    try {
        const { mahasiswaId } = req.params;

        if (!req.user || !req.user.userId || req.user.role !== 'DOSEN') {
            console.error('Error: User data missing, or not a DOSEN. req.user:', req.user);
            return res.status(403).json({ error: "Akses Ditolak: Data pengguna tidak valid atau bukan Dosen." });
        }
        const dosenId = req.user.userId;

        if (!mahasiswaId) {
            return res.status(400).json({ error: "Parameter mahasiswaId diperlukan." });
        }

        const pendaftaranMahasiswa = await prisma.pendaftaran.findFirst({
            where: { id_user: mahasiswaId },
            select: { id_pendaftaran: true }
        });

        if (!pendaftaranMahasiswa) {
            return res.json({ scores: null, commentData: null });
        }

        const id_pendaftaran = pendaftaranMahasiswa.id_pendaftaran;

        const scores = await prisma.rubik.findFirst({
            where: { id_pendaftaran: id_pendaftaran },
            select: {
                pemahaman: true,
                dokumenasi: true, // KEMBALI KE EJAAN 'dokumenasi'
                presentasi: true,
                ketepatan_waktu: true,
                sikap: true,
                id_rubik: true
            }
        });

        const commentData = await prisma.nilai_semhas.findFirst({
            where: {
                id_pendaftaran: id_pendaftaran,
                id_user: dosenId
            },
            select: {
                status_semhas: true,
                komentar: true
            }
        });

        res.json({
            scores: scores ? {
                pemahaman: parseFloat(scores.pemahaman || 0),
                dokumenasi: parseFloat(scores.dokumenasi || 0), // KEMBALI KE EJAAN 'dokumenasi'
                presentasi: parseFloat(scores.presentasi || 0),
                ketepatan_waktu: parseFloat(scores.ketepatan_waktu || 0),
                sikap: parseFloat(scores.sikap || 0)
            } : null,
            commentData: commentData || null
        });

    } catch (error) {
        console.error('DEBUG_GET_EXISTING_NILAI: Gagal mengambil nilai:', error);
        res.status(500).json({ error: 'Terjadi kesalahan internal server saat mengambil nilai.' });
    }
};

module.exports = {
    renderPenilaianPage,
    submitPenilaian,
    getExistingNilai
};