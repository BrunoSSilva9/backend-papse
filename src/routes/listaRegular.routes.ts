import { Router } from "express";
import { ListaRegularController } from "../controllers/listaRegular.controller.js";

const router = Router();
const listaRegularController = new ListaRegularController();

router.post("/listaregular", listaRegularController.create);
router.get("/listaregular", listaRegularController.findAll);
router.get("/listaregular/:id", listaRegularController.findOne);
router.delete("/listaregular/:id", listaRegularController.delete);

export default router;