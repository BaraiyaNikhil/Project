// server/models/Message.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  room:      { type: String, required: true },
  sender:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content:   { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);