import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export interface LoginDto {
  matricula: string;
  senha_bolsista: string;
}

export class AuthService {
  async login(data: LoginDto) {
    const colaborador = await prisma.colaborador.findUnique({
      where: { matricula: data.matricula },
    });

    if (!colaborador) {
      throw new Error("Matrícula ou senha inválidos.");
    }

    const senhaValida = await bcrypt.compare(
      data.senha_bolsista,
      colaborador.senha
    );

    if (!senhaValida) {
      throw new Error("Matrícula ou senha inválidos.");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("Segredo JWT não configurado no servidor.");
    }

    const token = jwt.sign(
      {
        id: colaborador.idBolsista,
        role: colaborador.role,
      },
      secret,
      {
        expiresIn: "8h",
      }
    );

    const { senha, ...colaboradorSemSenha } = colaborador;
    return {
      usuario: colaboradorSemSenha,
      token: token,
    };
  }
}
