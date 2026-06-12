import express from 'express';
import cors from 'cors';
import errorMiddleware from './middleware/errorMiddleware.js';

const app = express();

app.use(express.json());

app.use(cors({origin: 'http://localhost:5000', credentials: true}));


app.use(errorMiddleware); // error middleware should be in the last because 
// if we put it before the routes then it will catch all the errors and 
// we won't be able to handle them in the routes and also it will catch the 
// errors from the routes and we won't be able to handle them in the error 
// middleware

export default app;