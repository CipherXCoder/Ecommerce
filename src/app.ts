import express, { Application, NextFunction, Request, Response } from 'express';
import { ALLOWED_ORIGIN, COOKIE_SECRET, NODE_ENV, TRUST_PROXY } from './config/secrets.js';
import rootRouter from './routes/index.js';
import { errorHandler, notFound } from './middlewares/error.js';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import cookieParser from 'cookie-parser';

const app: Application = express();

const trustProxy = TRUST_PROXY;
if (typeof trustProxy !== 'undefined') {
  // convert common values ("1","true") to useful types for Express
  if (trustProxy === '1') {
    app.set('trust proxy', 1);
  } else if (trustProxy === 'true') {
    app.set('trust proxy', true);
  } else {
    app.set('trust proxy', trustProxy); // allow IPs/list
  }
} else if (NODE_ENV === 'production') {
  // sensible default on common PaaS
  app.set('trust proxy', 1);
}

app.use(helmet());
app.use(hpp());
app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
    exposedHeaders: ['Content-Disposition'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000,
  }),
);

app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

app.use("/api", rootRouter);

// 404 Handler
app.use(notFound);

// Global Error Handler
app.use(
  errorHandler as (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ) => void,
);

export default app;