const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  index: async (req, res) => {
    res.render('/dosen/schedule');
  },

  getCalendar: async (req, res) => {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || new Date().getMonth() + 1;

    // Ambil data dari database (ubah sesuai struktur tabelmu)
    const schedules = await prisma.schedule.findMany({
      where: {
        year,
        month,
      }
    });

    // Konversi ke format yang bisa dipakai di frontend
    const grouped = {};
    schedules.forEach(schedule => {
      const key = `${schedule.year}-${String(schedule.month).padStart(2, '0')}-${String(schedule.date).padStart(2, '0')}`;
      grouped[key] = JSON.parse(schedule.shifts);
    });

    res.render('schedule/calendar', { year, month, schedules: grouped });
  },

  editSchedule: async (req, res) => {
    const { date, year, month } = req.query;

    const existing = await prisma.schedule.findFirst({
      where: {
        date: parseInt(date),
        year: parseInt(year),
        month: parseInt(month),
      }
    });

    res.json({
      date,
      year,
      month,
      schedules: existing ? JSON.parse(existing.shifts) : {
        shift1: '',
        shift2: '',
        shift3: '',
        shift4: ''
      }
    });
  },

  saveSchedule: async (req, res) => {
    const { date, year, month, shifts } = req.body;

    if (!date || !year || !month || !shifts) {
      return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
    }

    const saved = await prisma.schedule.upsert({
      where: {
        unique_key: {
          date: parseInt(date),
          year: parseInt(year),
          month: parseInt(month)
        }
      },
      update: {
        shifts: JSON.stringify(shifts)
      },
      create: {
        date: parseInt(date),
        year: parseInt(year),
        month: parseInt(month),
        shifts: JSON.stringify(shifts)
      }
    });

    res.json({
      success: true,
      message: 'Jadwal berhasil disimpan',
      data: {
        date,
        shifts
      }
    });
  }
};
