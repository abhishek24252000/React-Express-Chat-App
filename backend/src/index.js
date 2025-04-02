import express from 'express';
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db.js';
import cors from 'cors';
import { app ,server} from './lib/socket.js';

import path from "path";

dotenv.config();
// const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve(); // Get the current directory name

app.use(express.json({ limit: '5mb' })); //this allowes to extract json data out of request body in controller.ex:const {password,..}=req.body
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

server.listen(PORT, () => {
  console.log('server runnig on 5001');
  connectDB();
});
