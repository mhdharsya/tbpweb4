const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Definisi Kriteria Penilaian dan Bobotnya (HARDCODED)
// Sesuaikan nama kriteria dan bobotnya sesuai kebutuhan Anda
const daftarKriteriaPenilaian = [
    { id: 'pemahaman', nama: 'Pemahaman Materi', bobot: 20 },
    { id: 'dokumenasi', nama: 'Dokumentasi & Laporan', bobot: 20 }, // Perhatikan ejaan 'dokumenasi' sesuai nama kolom
    { id: 'presentasi', nama: 'Presentasi', bobot: 20 },
    { id: 'ketepatan_waktu', nama: 'Ketepatan Waktu', bobot: 20 },
    { id: 'sikap', nama: 'Sikap', bobot: 20 }
]; // Total bobot harus 100

// 1. Render halaman penilaian
const renderPenilaianPage = async (req, res) => {
    try {
        // Validasi data user dari JWT
        if (!req.user || !req.user.userId || !req.user.nama_lengkap || req.user.role !== 'DOSEN') {
            console.error('Error: User data missing, userId not found, or not a DOSEN. req.user:', req.user);
            return res.status(403).send('Akses Ditolak: Data pengguna tidak valid atau bukan Dosen.');
        }

        const dosenNamaLengkap = req.user.nama_lengkap;

        // Mengambil daftar mahasiswa yang perlu dinilai oleh dosen yang login (sebagai penguji)
        const daftarMahasiswa = await prisma.user.findMany({
            where: {
                role: "MAHASISWA",
                pendaftaran: {
                    some: {
                        jadwal_pendaftaran: {
                            some: {
                                // Filter berdasarkan nama dosen penguji (STRING MATCHING - tetap tidak 100% andal)
                                dosen_penguji: dosenNamaLengkap
                            }
                        },
                        periode_semhas: {
                            tanggal_buka: {
                                lte: new Date() // Tanggal seminar sudah lewat
                            }
                        },
                        // Kompromi: Hanya tampilkan mahasiswa yang BELUM memiliki entri skor di tabel 'rubik' ini
                        // Karena kita tidak bisa membedakan dosen penilai di tabel 'rubik'
                        NOT: {
                            rubik: {
                                some: {} // Cukup cek apakah ada entri skor rubik untuk pendaftaran ini
                            }
                        }
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

        res.render('dosen/penilaian', {
            title: 'Penilaian Seminar',
            user: req.user,
            penilaian: daftarKriteriaPenilaian, // Menggunakan daftar kriteria hardcode
            mahasiswas: daftarMahasiswa
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
        // scores akan menjadi objek: { pemahaman: '90', dokumenasi: '85', ... }
        // status_semhas dan komentar dari form

        if (!req.user || !req.user.userId || req.user.role !== 'DOSEN') {
            console.error('Error: User data missing, or not a DOSEN. req.user:', req.user);
            return res.status(403).send('Akses Ditolak: Data pengguna tidak valid atau bukan Dosen.');
        }
        const dosenId = req.user.userId; // ID dosen yang login

        if (!mahasiswaId || !scores) {
            return res.status(400).send("Data penilaian tidak lengkap.");
        }

        const pendaftaranMahasiswa = await prisma.pendaftaran.findFirst({
            where: { id_user: mahasiswaId },
            select: { id_pendaftaran: true }
        });

        if (!pendaftaranMahasiswa) {
            return res.status(404).send("Pendaftaran mahasiswa tidak ditemukan.");
        }

        const id_pendaftaran = pendaftaranMahasiswa.id_pendaftaran;

        // Persiapkan data skor untuk tabel rubik
        const rubikData = {
            pemahaman: String(scores.pemahaman || ''), // Konversi ke String karena tipe kolom di DB adalah String
            dokumenasi: String(scores.dokumenasi || ''),
            presentasi: String(scores.presentasi || ''),
            ketepatan_waktu: String(scores.ketepatan_waktu || ''),
            sikap: String(scores.sikap || ''),
            id_pendaftaran: id_pendaftaran
        };

        // Cek apakah sudah ada entri rubik untuk pendaftaran ini
        let existingRubik = await prisma.rubik.findUnique({
            where: { id_pendaftaran: id_pendaftaran } // Asumsi id_pendaftaran itu unique di rubik
                                                      // Jika id_rubrik adalah PK dan Anda ingin update by id_rubrik
                                                      // maka Anda perlu mendapatkan id_rubrik dari form atau query dulu
        });

        // KARENA ID_RUBRIK ADALAH PRIMARY KEY DI MODEL RUBIK, KITA TIDAK BISA LANGSUNG UPDATE BERDASARKAN ID_PENDAFTARAN
        // Asumsi: Setiap pendaftaran HANYA memiliki SATU entri rubik.
        // Jika id_rubrik akan di-generate/diberikan secara unik saat pertama kali dibuat
        // DAN id_pendaftaran menjadi Unique untuk rubik, maka bisa begini:
        existingRubik = await prisma.rubik.findFirst({
            where: { id_pendaftaran: id_pendaftaran }
        });

        if (existingRubik) {
            // Jika sudah ada, update entri rubik tersebut
            await prisma.rubik.update({
                where: { id_rubrik: existingRubik.id_rubrik }, // Update berdasarkan id_rubrik yang sudah ada
                data: rubikData
            });
        } else {
            // Jika belum ada, buat entri rubik baru
            // Anda perlu membuat id_rubrik yang unik
            const newRubikId = `rubik-${Date.now()}-${id_pendaftaran}`;
            await prisma.rubik.create({
                data: {
                    id_rubrik: newRubikId,
                    ...rubikData
                }
            });
        }

        // Simpan atau update komentar di nilai_semhas
        let existingNilaiSemhas = await prisma.nilai_semhas.findFirst({
            where: {
                id_pendaftaran: id_pendaftaran,
                // Karena id_rubik adalah PK di nilai_semhas, ini menjadi kompleks.
                // Asumsi: hanya ada satu entri komentar/status per pendaftaran
                // dan kita akan menggunakannya untuk update
                // Jika tidak, Anda harus membuat id_nilai_semhas sendiri sebagai PK
                // Seperti yang kita diskusikan sebelumnya (id Int @id @default)
                // Berdasarkan schema yang ada, id_rubik adalah PK. Jadi hanya 1 nilai_semhas per rubik.
                // Kita perlu ambil id_rubik dari rubik yang baru dibuat/diupdate
                id_rubik: existingRubik ? existingRubik.id_rubrik : newRubikId,
            }
        });


        // Ini akan mencoba mencari berdasarkan id_rubik (yang adalah PK)
        // Jika tidak ada entry rubik yang ditemukan, maka nilai_semhas tidak bisa dihubungkan.
        // Solusi yang lebih tepat adalah:
        // Cek apakah sudah ada nilai_semhas untuk pendaftaran dan dosen ini.
        // Karena id_rubik adalah PK, ini sangat membatasi.
        // Asumsi: Ada 1-to-1 relationship antara rubik dan nilai_semhas melalui id_rubik sebagai PK.
        // Maka kita cari berdasarkan id_rubik yang sama.

        const rubikIdForComment = existingRubik ? existingRubik.id_rubrik : newRubikId;

        existingNilaiSemhas = await prisma.nilai_semhas.findFirst({
            where: {
                id_rubik: rubikIdForComment, // id_rubik di nilai_semhas adalah PK, jadi ini adalah cara mencarinya
                id_pendaftaran: id_pendaftaran, // Juga filter by pendaftaran
                id_user: dosenId // Filter by dosen (yang mengupdate komentar/status)
            }
        });


        if (existingNilaiSemhas) {
            await prisma.nilai_semhas.update({
                where: { id_rubik: existingNilaiSemhas.id_rubik }, // Update berdasarkan PK (id_rubik)
                data: {
                    status_semhas: status_semhas,
                    komentar: komentar,
                    waktu_input: new Date(),
                    id_user: dosenId // Update dosen yang terakhir mengubah komentar
                }
            });
        } else {
            await prisma.nilai_semhas.create({
                data: {
                    id_rubik: rubikIdForComment, // Harus pakai id_rubik yang sama dengan entri skor
                    id_pendaftaran: id_pendaftaran,
                    status_semhas: status_semhas,
                    komentar: komentar,
                    waktu_input: new Date(),
                    id_user: dosenId // Dosen yang membuat komentar pertama
                }
            });
        }

        res.redirect('/dosen/penilaian');
    } catch (error) {
        console.error('Gagal menyimpan penilaian:', error);
        res.status(500).send('Terjadi kesalahan saat menyimpan penilaian.');
    }
};

// 3. Ambil nilai yang sudah pernah dinilai oleh dosen
const getExistingNilai = async (req, res) => {
    try {
        const { mahasiswaId } = req.query;

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

        // Ambil skor dari tabel rubik
        const scores = await prisma.rubik.findFirst({
            where: { id_pendaftaran: id_pendaftaran },
            select: {
                pemahaman: true,
                dokumenasi: true,
                presentasi: true,
                ketepatan_waktu: true,
                sikap: true
            }
        });

        // Ambil komentar dari tabel nilai_semhas
        const commentData = await prisma.nilai_semhas.findFirst({
            where: {
                id_pendaftaran: id_pendaftaran,
                id_user: dosenId // Ambil komentar yang diberikan oleh dosen ini
            },
            select: {
                status_semhas: true,
                komentar: true
            }
        });

        // Gabungkan data skor dan komentar
        res.json({
            scores: scores ? {
                pemahaman: parseFloat(scores.pemahaman || 0), // Konversi ke Float
                dokumenasi: parseFloat(scores.dokumenasi || 0),
                presentasi: parseFloat(scores.presentasi || 0),
                ketepatan_waktu: parseFloat(scores.ketepatan_waktu || 0),
                sikap: parseFloat(scores.sikap || 0)
            } : null,
            commentData: commentData || null // Jika tidak ada, kirim null
        });

    } catch (error) {
        console.error('Gagal mengambil nilai:', error);
        res.status(500).json({ error: 'Terjadi kesalahan saat mengambil nilai.' });
    }
};

module.exports = {
    renderPenilaianPage,
    submitPenilaian,
    getExistingNilai
};