const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getDashboard = async (req, res, next) => {
    try {
        const dosenId = req.user.id;
        // Ganti 'Dosen' dengan nama model Anda yang benar
        const dataDosen = await prisma.Dosen.findUnique({ where: { id: dosenId } });

        if (!dataDosen) {
            const error = new Error("Profil dosen tidak ditemukan.");
            error.statusCode = 404;
            return next(error);
        }

        // Ganti 'Jadwal' dengan nama model jadwal Anda
        const dataJadwal = await prisma.Jadwal.findMany({ where: { dosenId: dosenId } });

        res.render('dosen/dashboardD', {
            dosen: dataDosen,
            jadwalHariIni: dataJadwal
        });
    } catch (error) {
        next(error);
    }
};