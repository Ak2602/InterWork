import express from 'express';
import {getRegister, regQuery}from '../controls/regController.js';

const regRouter = express.Router();

regRouter.get('/register', getRegister);
regRouter.post('/save', regQuery);

export default regRouter;