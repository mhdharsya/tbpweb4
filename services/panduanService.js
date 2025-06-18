// services/panduanService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk mengunggah PDF baru
const uploadPanduan = async (nama_file, file_buffer) => {
    try {
        const newPanduan = await prisma.panduan.create({
            data: {
                nama_file: nama_file,
                file: file_buffer, // Data binary PDF
                tanggal_unggah: new Date(), // Tanggal saat ini
               
            }
        });

        console.log(`DEBUG UPLOAD: Menerima file: ${nama_file}, ukuran: ${file_buffer.length} bytes`);
        return newPanduan;
    } catch (error) {
        console.error("Error uploading panduan:", error);
        throw new Error('Gagal mengunggah panduan.');
    }
    
};

// Fungsi untuk mendapatkan semua panduan (untuk tabel riwayat)
const getAllPanduan = async () => {
    try {
        const panduanList = await prisma.panduan.findMany({
            select: {
                id_panduan: true,
                nama_file: true,
                tanggal_unggah: true,
                // file_data tidak perlu diselect jika hanya untuk tampilan tabel
            },
            orderBy: {
                tanggal_unggah: 'desc' // Urutkan dari yang terbaru
            }
        });
        return panduanList.map(p => ({
            id: p.id_panduan,
            namaFile: p.nama_file,
            tanggalUnggah: p.tanggal_unggah.toISOString().slice(0, 10), // Format tanggal YYYY-MM-DD
        }));
    } catch (error) {
        console.error("Error fetching all panduan:", error);
        throw new Error('Gagal mengambil daftar panduan.');
    }
};

// Fungsi untuk mendapatkan panduan terbaru (untuk tampilan "Buku Panduan")
const getLatestPanduan = async () => {
    try {
        const latestPanduan = await prisma.panduan.findFirst({
            orderBy: {
                id_panduan: 'desc'
            },
            select: {
                id_panduan: true,
                nama_file: true,
                // file_data tidak perlu diselect di sini jika hanya untuk menampilkan link/thumbnail
            }
        });
        return latestPanduan;
    } catch (error) {
        console.error("Error fetching latest panduan:", error);
        // Jika tidak ada panduan, kembalikan null atau objek kosong
        return null;
    }
};

// Fungsi untuk mendapatkan data file PDF berdasarkan ID (untuk download/tampilkan)
const getPanduanFile = async (id_panduan) => {
    try {
        const panduan = await prisma.panduan.findUnique({
            where: { id_panduan: id_panduan },
            select: {
                nama_file: true,
                file_data: true // Ambil data binary file
            }
        });
        console.log(`DEBUG FILE: File ditemukan. Nama: ${panduan.nama_file}, ukuran data: ${panduan.file_data.length} bytes`);
        return panduan;
    } catch (error) {
        console.error("Error fetching panduan file data:", error);
        return null;
    }
};


module.exports = {
    uploadPanduan,
    getAllPanduan,
    getLatestPanduan,
    getPanduanFile,
};