import express from 'express';

import Opsitel from './Opsitel.routes.js';
import Auth from './Auth.routes.js';

import authenticateJWT from '../middlewares/AuthChecker.js';

const router = express.Router();


const rutaApi = process.env.API_PREFIX;



router.use(`${rutaApi}/opsitel`,authenticateJWT,Opsitel);
router.use(`${rutaApi}/auth`, Auth);


router.get('*', (req, res) => {
    res.status(404)
    res.send({ error: 'Not found' })
})



export default router;