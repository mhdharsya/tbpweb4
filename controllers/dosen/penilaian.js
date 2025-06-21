// Lokasi: controllers/dosen/penilaian.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Definisi Kriteria Penilaian dan Bobotnya (HARDCODED)
const daftarKriteriaPenilaian = [
    { id: 'pemahaman', nama: 'Pemahaman Materi', bobot: 0.20 },
    { id: 'dokumenasi', nama: 'Dokumentasi & Laporan', bobot: 0.20 }, // Sudah dikoreksi ejaannya
    { id: 'presentasi', nama: 'Presentasi', bobot: 0.20 },
    { id: 'ketepatan_waktu', nama: 'Ketepatan Waktu', bobot: 0.20 },
    { id: 'sikap', nama: 'Sikap', bobot: 0.20 }
];

// 1. Render halaman penilaian
// Lokasi: controllers/dosen/penilaian.js
// ... (bagian atas controller) ...

// 1. Render halaman penilaian
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

        const daftarMahasiswa = await prisma.user.findMany({
            where: {
                role: "MAHASISWA",
                pendaftaran: {
                    some: {
                        jadwal_pendaftaran: {
                            some: {
                                dosen_penguji: dosenNamaLengkap
                            }
                        },
                        // periode_semhas: { // Ini tetap dikomentari sesuai diskusi sebelumnya
                        //     tanggal_buka: {
                        //         lte: new Date()
                        //     }
                        // },
                    }
                }
            },
            select: {
                id_user: true,
                nama_lengkap: true,
                pendaftaran: {
                    select: {
                        id_pendaftaran: true,
                        judul: true,
                        jadwal_pendaftaran: {
                            select: {
                                dosen_penguji: true,
                                jam_mulai: true,
                                jam_selesai: true,
                            }
                        },
                        periode_semhas: {
                            select: {
                                tanggal_buka: true,
                                tanggal_tutup: true
                            }
                        }
                    }
                }
            },
            orderBy: { nama_lengkap: 'asc' }
        });

        console.log('DEBUG: Daftar Mahasiswa (dari Prisma query):', JSON.stringify(daftarMahasiswa, null, 2));

        const finalDaftarMahasiswa = [];
        for (const mhs of daftarMahasiswa) {
            const pendaftaran = mhs.pendaftaran[0];
            if (pendaftaran) {
                const existingNilai = await prisma.nilai_semhas.findFirst({
                    where: {
                        id_pendaftaran: pendaftaran.id_pendaftaran,
                        id_user: dosenId
                    }
                });
                console.log(`DEBUG: Mahasiswa ${mhs.nama_lengkap} (ID: ${mhs.id_user}) - Pendaftaran ID: ${pendaftaran.id_pendaftaran}. Existing Nilai: ${!!existingNilai}`);

                // --- PERUBAHAN UTAMA UNTUK FITUR REVISI ---
                finalDaftarMahasiswa.push({
                    id_user: mhs.id_user,
                    nama_lengkap: mhs.nama_lengkap,
                    id_pendaftaran: pendaftaran.id_pendaftaran,
                    judul: pendaftaran.judul,
                    isDinilai: !!existingNilai // Flag untuk frontend
                });
                // --- AKHIR PERUBAHAN ---
            }
        }

        console.log('DEBUG: Final Daftar Mahasiswa (setelah filter existingNilai):', JSON.stringify(finalDaftarMahasiswa, null, 2));

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

// ... (fungsi submitPenilaian dan getExistingNilai di bawahnya tetap sama) ...

// 2. Simpan penilaian
const submitPenilaian = async (req, res) => {
    try {
        const { mahasiswaId, scores, status_semhas, komentar } = req.body;

        if (!req.user || !req.user.userId || req.user.role !== 'DOSEN') {
            console.error('Error: User data missing, or not a DOSEN. req.user:', req.user);
            return res.status(403).json({ message: 'Akses Ditolak: Data pengguna tidak valid atau bukan Dosen.' });
        }
        const dosenId = req.user.userId;

        if (!mahasiswaId || !scores) {
            return res.status(400).json({ message: "Data penilaian tidak lengkap." });
        }

        const pendaftaranMahasiswa = await prisma.pendaftaran.findFirst({
            where: { id_user: mahasiswaId },
            select: { id_pendaftaran: true }
        });

        if (!pendaftaranMahasiswa) {
            return res.status(404).json({ message: "Pendaftaran mahasiswa tidak ditemukan." });
        }

        const id_pendaftaran = pendaftaranMahasiswa.id_pendaftaran;

        const rubikData = {
            pemahaman: String(scores.pemahaman || ''),
            dokumenasi: String(scores.dokumenasi || ''), // Sudah dikoreksi ejaannya
            presentasi: String(scores.presentasi || ''),
            ketepatan_waktu: String(scores.ketepatan_waktu || ''),
            sikap: String(scores.sikap || ''),
            id_pendaftaran: id_pendaftaran
        };

        let existingRubik = await prisma.rubik.findFirst({
            where: { id_pendaftaran: id_pendaftaran }
        });

        let rubikIdForComment;
        if (existingRubik) {
            await prisma.rubik.update({
                where: { id_rubik: existingRubik.id_rubik },
                data: rubikData
            });
            rubikIdForComment = existingRubik.id_rubik;
        } else {
            const newRubikId = `rubik-${Date.now()}-${id_pendaftaran}`;
            const createdRubik = await prisma.rubik.create({
                data: {
                    id_rubik: newRubikId,
                    ...rubikData
                }
            });
            rubikIdForComment = createdRubik.id_rubik;
        }

        let existingNilaiSemhas = await prisma.nilai_semhas.findFirst({
            where: {
                id_rubik: rubikIdForComment,
                id_pendaftaran: id_pendaftaran,
                id_user: dosenId
            }
        });

        if (existingNilaiSemhas) {
            await prisma.nilai_semhas.update({
                where: { id_rubik: existingNilaiSemhas.id_rubik },
                data: {
                    status_semhas: status_semhas,
                    komentar: komentar,
                    // HAPUS BARIS INI: waktu_input: new Date(),
                    id_user: dosenId
                }
            });
        } else {
            await prisma.nilai_semhas.create({
                data: {
                    id_rubik: rubikIdForComment,
                    id_pendaftaran: id_pendaftaran,
                    status_semhas: status_semhas,
                    komentar: komentar,
                    // HAPUS BARIS INI: waktu_input: new Date(),
                    id_user: dosenId
                }
            });
        }

        res.status(200).json({ message: 'Penilaian berhasil disimpan.' });

    } catch (error) {
        console.error('Gagal menyimpan penilaian:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat menyimpan penilaian.' });
    }
};

// 3. Ambil nilai yang sudah pernah dinilai oleh dosen
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
            return res.status(404).json({ error: "Pendaftaran mahasiswa tidak ditemukan." });
        }

        const id_pendaftaran = pendaftaranMahasiswa.id_pendaftaran;

        const scores = await prisma.rubik.findFirst({
            where: { id_pendaftaran: id_pendaftaran },
            select: {
                pemahaman: true,
                dokumenasi: true, // Sudah dikoreksi ejaannya
                presentasi: true,
                ketepatan_waktu: true,
                sikap: true,
                id_rubik: true // Sudah dikoreksi
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
                dokumenasi: parseFloat(scores.dokumenasi || 0), // Sudah dikoreksi ejaannya
                presentasi: parseFloat(scores.presentasi || 0),
                ketepatan_waktu: parseFloat(scores.ketepatan_waktu || 0),
                sikap: parseFloat(scores.sikap || 0)
            } : null,
            commentData: commentData || null
        });

    } catch (error) {
        console.error('DEBUG_GET_EXISTING_NILAI: Gagal mengambil nilai:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengambil nilai.' });
    }
};

module.exports = {
    renderPenilaianPage,
    submitPenilaian,
    getExistingNilai
};