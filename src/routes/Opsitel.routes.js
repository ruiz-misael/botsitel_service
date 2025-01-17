import express from 'express';
//import authenticateJWT from '../middlewares/authenticateJWT.js';
import uploadFile from "../middlewares/Upload.js";
const router = express.Router();

import Opsitel    from '../controllers/Opsitel.js';




router.get("/procesar",Opsitel.procesar);
router.post("/plantilla",Opsitel.plantilla);
router.post("/reporte",Opsitel.reporte);
router.post("/carga",uploadFile.single("file"),Opsitel.carga);
router.post("/listaRegistros",Opsitel.listaRegistos);
router.post("/estatusServicio",Opsitel.estatusServicio);
router.post("/actEstatusServicio",Opsitel.actEstatusServicio);



router.get('*', (req, res) => {
    res.status(404)
    res.send({ error: 'Not found' })
})


export default router;