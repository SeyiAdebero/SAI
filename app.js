import express from 'express';
import authRoutes from './routes/auth.js';
import apiRoutes from './routes/api.js';
import chatRoutes from './routes/chat.js';

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);
app.use('/api/chat', chatRoutes);

app.get('/', (req, res) => {
  res.send('SAI Chatbot');
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});