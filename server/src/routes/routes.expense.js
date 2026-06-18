import express from 'express';
import { submitExpense,getExpense,updateExpenseStatus } from '../controller/controller.expense';
import { authenticate,authorise } from '../middlewares/middleware.auth';


const expenseRouter = express.Router();

expenseRouter.post('/',authenticate,authorise);
expenseRouter.get('/',authenticate,getExpense);
expressRouter.patch('/:id/status',authenticate,authorise("ADMIN"),updateExpenseStatus);

export default expenseRouter;