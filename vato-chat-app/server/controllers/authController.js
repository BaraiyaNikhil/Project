import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

function getJwtSecret() {
  if (!process.env.JWT_SECRET) {
    throw new Error('✋ Missing JWT_SECRET in your environment variables');
  }
  return process.env.JWT_SECRET;
}

const TOKEN_EXPIRY = '7d';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await User.create({ name, email, password: hashed });

    const token = jwt.sign(
      { id: user._id },
      getJwtSecret(),
      { expiresIn: TOKEN_EXPIRY }
    );

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id },
      getJwtSecret(),
      { expiresIn: TOKEN_EXPIRY }
    );

    res.json({
      user: { id: user._id, name: user.name, email: user.email },
      token
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Server error' });
  }
};
