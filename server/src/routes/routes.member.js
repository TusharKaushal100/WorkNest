import express from 'express'
import { authorise,authenticate } from '../middlewares/middleware.auth.js';
import { sendInvite,acceptInvite,getMembers} from '../controller/controller.member.js';

const memberRouter = express.Router();

memberRouter.post('/invite',authenticate,authorise('ADMIN'),sendInvite);
memberRouter.post('/accept-invite',acceptInvite);
memberRouter.get('/',authenticate,authorise('ADMIN'),getMembers);

export default memberRouter;