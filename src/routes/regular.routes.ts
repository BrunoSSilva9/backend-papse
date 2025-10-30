import { Router } from "express";
import { RegularController } from "../controllers/regular.controller.js";

const router = Router();
const regularController = new RegularController();

router.post("/regular", (req, res) => regularController.create(req, res));
router.get("/regular", (req, res) => regularController.findAll(req, res));
router.get("/regular/:id", (req, res) => regularController.findOne(req, res));
router.delete("/regular/:id", (req, res) => regularController.delete(req, res));

export default router;