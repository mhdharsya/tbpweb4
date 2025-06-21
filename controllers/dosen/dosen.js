// C:\pwebcap\tbpweb4\controllers\dosen\dosen.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getDashboardD = async (req, res) => {
    try {
        const user = req.user; // Data from your JWT (e.g., { userId: '1234567890', email: 'cab@gmail.com', role: 'DOSEN', nama_lengkap: 'cap' })

        // Basic validation: Ensure user object and essential data exist
        if (!user || !user.id_user || user.role !== 'DOSEN') {
            console.error('Error: User data missing or not a DOSEN. req.user:', user);
            return res.status(403).send('Access Denied: Invalid user or role.');
        }

        const dosenNIP = user.id_user; // Assuming userId from JWT is the Dosen's NIP

        // 1. Fetch Dosen's detailed profile from the database
        //    Assuming your 'User' model in Prisma contains Dosen information
        //    like nama_lengkap, email, and potentially a relation to a 'Dosen' model
        //    that holds 'bidang_keahlian'.
        const dosenProfile = await prisma.user.findUnique({
            where: { id_user: dosenNIP }, // Assuming 'id_user' is the NIP field in your User model
            // Include related models if 'bidangKeahlian' is in a separate 'Dosen' model
            // e.g., include: { dosenDetail: true }
        });

        if (!dosenProfile) {
            console.warn(`Dosen profile not found for NIP: ${dosenNIP}`);
            return res.status(404).render('error', { message: 'Dosen profile not found.' });
        }

        // 2. Fetch today's schedule for this Dosen
        //    This query depends heavily on your Prisma schema's relationships.
        //    Assuming: Pendaftaran has 'nip_dosen', JadwalPendaftaran relates to Pendaftaran,
        //    and Mahasiswa relates to Pendaftaran.
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow

        const rawJadwalHariIni = await prisma.jadwalPendaftaran.findMany({
            where: {
                // Filter by date
                tanggal: {
                    gte: today,
                    lt: tomorrow,
                },
                // Filter by the Dosen's NIP via the 'Pendaftaran' model
                pendaftaran: {
                    nip_dosen: dosenNIP,
                },
            },
            include: {
                pendaftaran: {
                    include: {
                        mahasiswa: true, // Include Mahasiswa data for seminar details
                    },
                },
            },
            orderBy: {
                jam_mulai: 'asc',
            },
        });

        // 3. Format data for the EJS template
        const formattedDosen = {
            nama: dosenProfile.nama_lengkap, // Assuming 'nama_lengkap' is the Dosen's name in 'User' model
            nip: dosenProfile.id_user,       // Assuming 'id_user' is the NIP in 'User' model
            bidangKeahlian: dosenProfile.bidang_keahlian || 'Belum Ditentukan', // Adjust if this is in a separate Dosen model or different field name
            email: dosenProfile.email,
        };

        const formattedJadwalHariIni = rawJadwalHariIni.map(item => {
            return {
                waktu: `${new Date(item.jam_mulai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${new Date(item.jam_selesai).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}`,
                judul: item.pendaftaran.judul,
                detail: `Mahasiswa: ${item.pendaftaran.mahasiswa?.nama_lengkap || 'N/A'}` // Use optional chaining for safety
            };
        });

        // 4. Render the EJS template with the formatted data
        res.redirect('/dashboard', {
            dosen: formattedDosen,
            jadwalHariIni: formattedJadwalHariIni,
            title: 'Dashboard Dosen'
        });

    } catch (error) {
        console.error('ERROR GET DASHBOARD Dosen:', error);
        res.status(500).send(`Terjadi kesalahan dalam memuat dashboard: ${error.message}`);
    }
};

// // Ensure getDashboardD is correctly exported
// module.exports = {
//     getDashboardD
// };