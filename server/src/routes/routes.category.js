import express from 'express'
import { createCategory,getCategory } from '../controller/controller.category';
import { authenticate,authorise } from '../middlewares/middleware.auth';

const categoryRoute = express.Router();

categoryRoute.post('/',authenticate,authorise('ADMIN'),createCategory);
categoryRoute.get('/',authenticate,getCategory);

export default categoryRoute;