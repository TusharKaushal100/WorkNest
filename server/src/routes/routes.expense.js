import express from 'express';
import { submitExpense, getExpense, updateExpenseStatus } from '../controller/controller.expense.js';
import { authenticate, authorise } from '../middlewares/middleware.auth.js';

const expenseRouter = express.Router();

expenseRouter.post('/', authenticate, submitExpense);
expenseRouter.get('/', authenticate, getExpense);
expenseRouter.patch('/:id/status', authenticate, authorise("ADMIN"), updateExpenseStatus);

export default expenseRouter;