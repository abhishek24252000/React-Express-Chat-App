import express from 'express';
import authRoutes from './routes/auth.route.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json()); //this allowes to extract json data out of request body in controller.ex:const {password,..}=req.body

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log('server runnig on 5001');
    connectDB();
});
