import express from 'express';
//import authenticateJWT from '../middlewares/authenticateJWT.js';
import uploadFile from "../middlewares/Upload.js";
import authenticateJWT from '../middlewares/AuthChecker.js';
const router = express.Router();

import Auth    from '../controllers/Auth.js';

router.post("/registroUsuario",authenticateJWT,Auth.registroUsuario);
router.post("/listaUsuarios",authenticateJWT,Auth.listaUsuarios);
router.post("/login",Auth.login);
router.post("/token",authenticateJWT,Auth.token);

router.get('*', (req, res) => {
    res.status(404)
    res.send({ error: 'Not found' })
})


export default router;