import express from 'express';
import { getAdmin, updateUser } from '../controls/admController.js';

const admRouter = express.Router();

admRouter.get('/admin', getAdmin);
admRouter.post('/update', updateUser);

export default admRouter;