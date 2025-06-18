const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.get('/', (req, res) => {
    res.render('schedule/index');
});

router.get('/calendar', async (req, res) => {
    const { year, month } = req.query;
    const y = parseInt(year) || new Date().getFullYear();
    const m = parseInt(month) || new Date().getMonth() + 1;

    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0);

    const schedules = await prisma.schedule.findMany({
        where: {
            date: {
                gte: startDate,
                lte: endDate
            }
        }
    });

    const mapped = {};
    for (const s of schedules) {
        const key = s.date.toISOString().split('T')[0];
        mapped[key] = s;
    }

    res.render('schedule/calendar', { year: y, month: m, schedules: mapped });
});

router.post('/save', async (req, res) => {
    const { date, shifts } = req.body;

    const existing = await prisma.schedule.findFirst({ where: { date: new Date(date) } });

    if (existing) {
        await prisma.schedule.update({
            where: { id: existing.id },
            data: shifts
        });
    } else {
        await prisma.schedule.create({
            data: {
                date: new Date(date),
                ...shifts
            }
        });
    }

    res.json({ success: true, message: 'Saved successfully.' });
});

module.exports = router;
