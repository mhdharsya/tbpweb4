const express = require('express');
const router = express.Router();
const { getDashboardD } = require('../../controllers/dosen/dosen'); // Make sure this path is correct
const userGuard = require('../../middleware/decodeJWT'); // Make sure this path is correct

// This router will be mounted at '/dashboardD' in app.js
// So, the route inside here should be just '/'
router.get('/', getDashboardD, async (req, res) => {
  console.log("Isi req.body saat register:", req.body);
  res.render('dosen/dashboardD', {
    title: 'Dashboard Dosen',
    user: req.user, // Pass the user data to the view
    

  });
});

module.exports = router;