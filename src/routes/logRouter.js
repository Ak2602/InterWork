import express from 'express';
import { getLogin, logQuery } from '../controls/logController.js';

const logRouter = express.Router();

logRouter.get('/login', getLogin);
logRouter.post('/auth', logQuery);

export default logRouter;