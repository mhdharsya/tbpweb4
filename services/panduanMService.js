// services/panduanService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Fungsi untuk mendapatkan panduan terbaru
const getLatestPanduan = async () => {
    try {
        const latest = await prisma.panduan.findFirst({
            orderBy: { tanggal_unggah: 'desc' },
        });
        return latest; // Mengembalikan objek panduan atau null
    } catch (error) {
        // Log error di sini untuk debugging internal service
        console.error("Error in panduanService.getLatestPanduan:", error);
        throw new Error('Gagal mengambil panduan terbaru dari database.'); // Lempar error untuk ditangani di router/controller
    }
};

// Fungsi untuk mendapatkan data file PDF berdasarkan ID
const getPanduanFile = async (id_panduan) => {
    try {
        const panduan = await prisma.panduan.findUnique({
            where: { id_panduan: id_panduan },
            select: {
                nama_file: true,
                file_pdf: true, // Asumsikan kolom di DB adalah 'file_pdf'
            },
        });
        return panduan; // Mengembalikan objek panduan dengan nama_file dan file_pdf, atau null
    } catch (error) {
        // Log error di sini untuk debugging internal service
        console.error("Error in panduanService.getPanduanFile:", error);
        throw new Error('Gagal mengambil data file panduan dari database.'); // Lempar error
    }
};

module.exports = {
    getLatestPanduan,
    getPanduanFile,
};