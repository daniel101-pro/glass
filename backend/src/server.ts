import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { healthRouter } from './routes/health.js';
import { authRouter } from './routes/auth.js';
import { getEnv } from './config/env.js';

const app = express();

const { CORS_ORIGIN } = getEnv();
app.use(cors({ 
  origin: CORS_ORIGIN || true,
  credentials: true 
}));
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ ok: true, name: 'glass-backend', version: '0.1.0' });
});

app.use('/api/v1/health', healthRouter);
app.use('/api/v1/auth', authRouter);

export default app;
