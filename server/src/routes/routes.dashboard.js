import express from 'express'
import { authenticate, authorise } from '../middlewares/middleware.auth.js'
import { getDashboard } from '../controller/controller.dashboard.js'

const dashboardRouter = express.Router();

// both ADMIN and MEMBER can see dashboard — no authorise needed
dashboardRouter.get('/', authenticate, getDashboard);

export default dashboardRouter;