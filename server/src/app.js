import express from 'express';
import cors from 'cors';
import errorMiddleware from './middlewares/middleware.error.js';
import {rateLimiter} from './middlewares/middleware.ratelimit.js';
import categoryRoute from './routes/routes.category.js';
import memberRouter from './routes/routes.member.js';
import authRouter from './routes/routes.auth.js';
import dashboardRouter from './routes/routes.dashboard.js'
import dotenv from'dotenv'

dotenv.config();

const app = express();

app.use(express.json());

app.use(cors({origin:process.env.CLIENT_URL, credentials: true}));

app.use('/api',rateLimiter);//rateLimiter reads req.orgId, and that's only set after authenticate runs, 
// unauthenticated routes (register/login) will just fall back to req.ip — correct behavior.

app.use('/api/categories',categoryRoute);
app.use('/api/member',memberRouter);
app.use('/api/auth',authRouter);
app.use('/api/dashboard', dashboardRouter);


app.use(errorMiddleware); // error middleware should be in the last because 
// if we put it before the routes then it will catch all the errors and 
// we won't be able to handle them in the routes and also it will catch the 
// errors from the routes and we won't be able to handle them in the error 
// middleware

export default app;