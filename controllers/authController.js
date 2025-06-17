const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const login = async (req, res) => {
  const { email, id_user, password, role } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id_user, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const decodedToken = jwt.decode(token);

    console.log("id cookie : ", decodedToken.userId);
    console.log("email cookie : ", decodedToken.email);
    console.log("role cookie : ", decodedToken.role);

    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // 1 hour expiration
    return res.redirect('/dashboard');
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const register = async (req, res) => {
  const { email, id_user, password, role } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'email already exists' });
    }

    const existingId = await prisma.user.findUnique({
      where: { id_user },
    });

    if (existingId) {
      return res.status(400).json({ message: 'ID user already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, id_user, password: hashedPassword, role },
    });

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { login, register };
