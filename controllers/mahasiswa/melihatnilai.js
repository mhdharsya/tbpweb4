const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.showNilai = async (req, res) => {
  try {
  const nim = req.userId; // jika login sebagai mahasiswa
  const data = await prisma.pendaftaran.findFirst({
    where: {
      id_user: nim, // mencocokkan id_user dengan userId yang login
    },
    orderBy: {
      id_pendaftaran: 'desc', // urutkan berdasarkan id_pendaftaran terbaru
    },
  });

  // Jika ada data, tampilkan judul
  if (data) {
    console.log(data.judul); // menampilkan judul dari pendaftaran
  } else {
    console.log("Data tidak ditemukan.");
  }
} catch (error) {
  console.error("Terjadi error: ", error);
}
};
