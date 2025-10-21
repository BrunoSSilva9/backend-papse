import { prisma } from "../lib/prisma.js"; 
import type { CreatePacienteDto } from "./paciente.service.js";


export interface ProtocoloInterface {
    data_inicio_atendimento: Date;
    qtde_sessoes: number;
    idPaciente: number;
    idBolsista: number;
}

export class ProtocoloService {
  public async create(data: ProtocoloInterface) {
    try {
      const protocolo = await prisma.protocolo.create({
        data: {
          ...data,
          data_inicio_atendimento: new Date(data.data_inicio_atendimento),
        },
      });
      return protocolo;
    } catch (error) {
      console.error("Erro ao criar protocolo:", error);
      throw new Error("Não foi possível criar o protocolo.");
    }
  }

    public async findAll() {
    try {
      const protocolos = await prisma.protocolo.findMany();
      return protocolos;
    } catch (error) {
      console.error("Erro ao buscar protocolos:", error);
      throw new Error("Não foi possível buscar os protocolos.");
    }
  }

    public async findOne(id: number) {
    try {
      const protocolo = await prisma.protocolo.findUniqueOrThrow({
        where: { idProtocolo: id },
      });
      return protocolo;
    } catch (error) {
      console.error("Erro ao buscar protocolo:", error);
      throw new Error("Não foi possível buscar o protocolo.");
    }
  }

  public async update(id: number, data: ProtocoloInterface) {
    try {
      const protocolo = await prisma.protocolo.update({
        where: { idProtocolo: id },
        data: {
          ...data,
          data_inicio_atendimento: new Date(data.data_inicio_atendimento),
        },
      });
      return protocolo;
    } catch (error) {
      console.error("Erro ao atualizar protocolo:", error);
      throw new Error("Não foi possível atualizar o protocolo.");
    }
  };

  public async delete(id: number) {
    try {
      await prisma.protocolo.delete({
        where: { idProtocolo: id },
      });
    } catch (error) {
      console.error("Erro ao deletar protocolo:", error);
      throw new Error("Não foi possível deletar o protocolo.");
    }
  }
}
