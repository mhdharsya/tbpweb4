var express = require('express');
var router = express.Router();
const { login, register } = require('../controllers/authController');
const { auth } = require('../middleware/authMiddleware');

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/dashboard', auth, (req, res) =>{
  res.render('dashboard', { title: 'Express' });
});

router.post('/login', login);
router.post('/register', register);

module.exports = router;
