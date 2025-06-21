exports.getFormDashboard = async (req, res) => {
  try {
    const user = req.user;

    if (!user || !user.nama_lengkap) {
      return res.status(400).send('User tidak ditemukan');
    }

    return res.render('mahasiswa/dashboardMhs', {
      nama_lengkap: user.nama_lengkap,
    });

  } catch (error) {
    console.error('ERROR GET DASHBOARD:', error);
    return res.status(500).send('Terjadi kesalahan dalam dashboard');
  }
};
