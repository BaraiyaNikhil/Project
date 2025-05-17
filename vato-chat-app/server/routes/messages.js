// server/routes/messages.js
import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import Message from '../models/Message.js';

const router = express.Router();

router.get('/:room', requireAuth, async (req, res) => {
  try {
    const { room } = req.params;
    const messages = await Message
      .find({ room })
      .sort({ timestamp: 1 })
      .limit(100)
      .populate('sender', 'name');
    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Could not fetch messages' });
  }
});

export default router;
