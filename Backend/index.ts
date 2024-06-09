import express, { Request, Response } from 'express';
import cors from 'cors';
import connection from './config/db';
import userRouter from './routes/user.route';
import boardRouter from './routes/board.route';
import taskRouter from './routes/task.route';
import subtaskRouter from './routes/subtask.route';
import swaggerRouter from './routes/swagger.route'; 
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json(), cors());
app.use('/user', userRouter);
app.use('/board', boardRouter);
app.use('/task', taskRouter);
app.use('/subtask', subtaskRouter);

// Use the Swagger router for documentation
app.use('/api-docs', swaggerRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('server is running');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    await connection;
    console.log(`Connected to DB`);
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.log(error);
  }
});

export default app;
