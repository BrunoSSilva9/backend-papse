import { Router } from "express";
import { PacienteController } from "../controllers/paciente.controller.js";

console.log("✅ paciente.routes.ts foi carregado");

const router = Router();
const pacienteController = new PacienteController();

router.post("/pacientes", pacienteController.create);
router.get("/pacientes", pacienteController.findAll);
router.get("/pacientes/:id", pacienteController.findOne);
router.put("/pacientes/:id", pacienteController.update);
router.delete("/pacientes/:id", pacienteController.delete);

export default router;
