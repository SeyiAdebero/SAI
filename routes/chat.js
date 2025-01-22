import express from 'express';
import { db } from '../utils/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const chats = await db.read('chats');
    res.json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching chats' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    const chat = { message, timestamp: new Date().toISOString() };
    await db.create('chats', chat);
    res.json({ message: 'Chat created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating chat' });
  }
});

export default router;