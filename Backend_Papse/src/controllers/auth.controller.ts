import { type Request, type Response } from "express";
import { AuthService } from "../services/auth.service.js";

export class AuthController {
  private authService = new AuthService();

  public login = async (req: Request, res: Response) => {
    try {
      const { matricula, senha_ } = req.body;
      const resultado = await this.authService.login({
        matricula: matricula,
        senha_bolsista: senha_,
      });
      res.status(200).json(resultado);
    } catch (error: any) {
      if (error.message.includes("inválidos")) {
        return res.status(401).json({ message: error.message });
      }
      res.status(500).json({ message: error.message });
    }
  };
}
