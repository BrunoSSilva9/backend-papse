import { Router } from "express";
import { ColaboradorController } from "../controllers/colaborador.controller.js";

const router = Router();
const colaboradorController = new ColaboradorController();

router.post("/colaboradores", colaboradorController.create);
router.get("/colaboradores", colaboradorController.findAll);
router.get("/colaboradores/:id", colaboradorController.findOne);
router.put("/colaboradores/:id", colaboradorController.update);
router.delete("/colaboradores/:id", colaboradorController.delete);

export default router;
