import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import fareRoutes from './routes/fareRoutes';
import helmet from 'helmet';
import dotenv from 'dotenv';

dotenv.config();

export function runServer(): void {
  const app: Application = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(helmet());
  app.use(cors());
  app.use(bodyParser.json());

  app.get('/', (req: Request, res: Response) => {
    res.send('Singa Metro Fare Calculation API is running.');
  });

  // Use Fare Routes
  app.use('/', fareRoutes);

  // Global Error Handler
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).json({ error: 'An unexpected error occurred.' });
  });

  // Start Server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
