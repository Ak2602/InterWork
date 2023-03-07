import express from 'express';
import {getHomepage,
    getRegister,
    regQuery,
    getLogin,
    logQuery,
    getAdmin,
    updateUser}from '../controls/controller.js';

const router = express.Router();
router.get('/', getHomepage);

router.get('/register', getRegister);
router.post('/save', regQuery);

router.get('/login', getLogin);
router.post('/auth', logQuery);

router.get('/admin', getAdmin);
router.post('/update', updateUser);

export default router;