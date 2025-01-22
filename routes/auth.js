import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Users } from '../models/User.js';
import { db } from '../utils/db.js';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { name, email, password: hashedPassword };
    db.create(user);
    res.send('User registered successfully!');
  } catch (ex) {
    res.status(400).send('Error registering user.');
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.findOne({ email });
    if (!user) return res.status(400).send('Invalid email or password.');
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).send('Invalid email or password.');
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
    res.send(token);
  } catch (ex) {
    res.status(400).send('Error logging in.');
  }
});

router.post('/forget-password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await db.findOne({ email });
    if (!user) return res.status(400).send('User not found.');
    // Generate a password reset token and send it to the user's email
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    // Send the reset link to the user's email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-password'
      }
    });
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: user.email,
      subject: 'Password Reset Request',
      text: `Click on the following link to reset your password: ${resetLink}`
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) return res.status(500).send('Error sending email.');
      res.send('Password reset link sent to your email.');
    });
  } catch (ex) {
    res.status(400).send('Error sending password reset link.');
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await db.findOne({ _id: decoded._id });
    if (!user) return res.status(400).send('User not found.');
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await db.update(user);
    res.send('Password reset successfully.');
  } catch (ex) {
    res.status(400).send('Error resetting password.');
  }
});

router.patch('/update-profile', async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).send('Unauthorized');
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await db.findOne({ _id: decoded._id });
    if (!user) return res.status(404).send('User not found');
    const { name, email } = req.body;
    user.name = name;
    user.email = email;
    await user.save();
    res.send('Profile updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating profile');
  }
});

export default router;