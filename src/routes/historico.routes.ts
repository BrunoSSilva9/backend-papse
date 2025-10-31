import { Router } from "express";
import { HistoricoController } from "../controllers/historico.controller.js";

const router = Router();
const historicoController = new HistoricoController();

router.post("/historico", historicoController.create);
router.get("/historico", historicoController.findAll);
router.get("/historico/:id", historicoController.findOne);
router.delete("/historico/:id", historicoController.delete);

export default router;
