import { Router } from "express";
import { ProtocoloController } from "../controllers/protocolo.controller.js";

console.log("✅ protocolo.routes.ts foi carregado");

const router = Router();
const protocoloController = new ProtocoloController();

router.post("/protocolos", protocoloController.create);
router.get("/protocolos", protocoloController.findAll);
router.get("/protocolos/:id", protocoloController.findOne);
router.put("/protocolos/:id", protocoloController.update);
router.delete("/protocolos/:id", protocoloController.delete);

export default router;