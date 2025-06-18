// controllers/userController.js

// Hapus baris ini:
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

const userService = require('../services/userService'); // Pastikan path ini benar


const getAllUsersWithDetailsOptimized = async (req, res) => {
    try {
        // HAPUS BARIS INI: const filterRole = req.query.role;
        // Panggil service tanpa parameter filter
        const usersWithDetails = await userService.getUsersWithDetails(); // <--- Panggil tanpa parameter

        res.status(200).json(usersWithDetails);

    } catch (error) {
        console.error("Error in userController.getAllUsersWithDetailsOptimized:", error.message);
        res.status(500).json({ message: 'Error fetching users with details', error: error.message });
    }
};

// ... (lanjutkan dengan fungsi updateUsersRoles jika ada) ...
const updateUsersRoles = async (req, res) => {
    const updates = req.body;

    if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ message: 'Invalid update data provided.' });
    }

    try {
        const results = await userService.updateUsersRoles(updates);
        res.status(200).json({ message: 'Role update process completed.', results: results });
    } catch (error) {
        console.error("Error in userController.updateUsersRoles:", error.message);
        res.status(500).json({ message: 'Server error during role update.', details: error.message });
    }
};


module.exports = {
    getAllUsersWithDetailsOptimized,
    updateUsersRoles // Pastikan ini diekspor
    // ... (fungsi controller lainnya jika ada) ...
};