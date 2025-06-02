const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  // Hapus semua data User yang ada sebelumnya
  await prisma.user.deleteMany();

  // Data pengguna baru
  const users = [
    {
      username: 'admin',
      password: 'admin123',
    },
  ];

  for (const userData of users) {
    // Hash password sebelum disimpan ke database
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Menambahkan pengguna baru ke dalam database
    await prisma.user.create({
      data: {
        username: userData.username,
        password: hashedPassword,
      },
    });
  }

  console.log('Data pengguna berhasil ditambahkan.');
}

// Menjalankan fungsi main
main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });