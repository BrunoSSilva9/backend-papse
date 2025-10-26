import { Router } from "express";
import { ListaEsperaController } from "../controllers/listaEspera.controller.js";

const router = Router();
const listaEsperaController = new ListaEsperaController();

router.post("/listaespera", listaEsperaController.create);
router.get("/listaespera", listaEsperaController.findAll);
router.get("/listaespera/:id", listaEsperaController.findOne);
router.delete("/listaespera/:id", listaEsperaController.delete);

export default router;
