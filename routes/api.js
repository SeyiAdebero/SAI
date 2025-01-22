import express from 'express';
import { db } from '../utils/db.js';

const router = express.Router();

router.get('/users', async (req, res) => {
  try {
    const users = await db.read('users');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await db.read('users', id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user' });
  }
});

router.patch('/user/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const user = await db.read('users', id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    } else {
      const { name, email } = req.body;
      user.name = name;
      user.email = email;
      await db.update('users', id, user);
      res.json({ message: 'User updated successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user' });
  }
});

router.delete('/user/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.delete('users', id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting user' });
  }
});

export default router;