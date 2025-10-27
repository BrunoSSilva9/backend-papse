import { prisma } from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

export interface CreateListaRegularDto {
  idPaciente: number;
  idBolsista: number;
}

export class ListaRegularService {
  async create(data: CreateListaRegularDto) {
    try {
      return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const pacienteEmEspera = await tx.listaEspera.findFirst({
          where: { idPaciente: data.idPaciente },
        });

        if (!pacienteEmEspera) {
          throw new Error("Paciente não encontrado na lista de espera.");
        }

        await tx.colaborador.findUniqueOrThrow({
          where: { idBolsista: data.idBolsista },
        });

        const novoRegistro = await tx.listaRegular.create({
          data: {
            idPaciente: data.idPaciente,
            idBolsista: data.idBolsista,
          },
        });

        await tx.listaEspera.deleteMany({
          where: { idPaciente: data.idPaciente },
        });

        return novoRegistro;
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        console.error(
          "Erro ao criar na lista regular: Colaborador não encontrado.",
          error
        );
        throw new Error("Colaborador informado não existe.");
      }
      if (
        error instanceof Error &&
        error.message === "Paciente não encontrado na lista de espera."
      ) {
        console.error("Erro ao criar na lista regular:", error.message);
        throw error;
      }

      console.error(
        "Erro ao mover paciente da lista de espera para a regular:",
        error
      );
      throw new Error("Erro interno ao adicionar paciente na lista regular.");
    }
  }

  async findAll() {
    try {
      const lista = await prisma.listaRegular.findMany({
        include: {
          paciente: true,
          colaborador: true,
        },
        orderBy: {
          idListaRegular: "asc",
        },
      });
      return lista;
    } catch (error: any) {
      console.error("Erro ao buscar lista regular:", error);
      throw new Error("Não foi possível buscar os registros da lista regular.");
    }
  }

  async findOne(id: number) {
    try {
      const entradaListaRegular = await prisma.listaRegular.findUniqueOrThrow({
        where: { idListaRegular: id },
        include: {
          paciente: true,
          colaborador: true,
        },
      });
      return entradaListaRegular;
    } catch (error: any) {
      if (error.code === "P2025") {
        console.error(`Entrada da lista regular com ID ${id} não encontrada.`);
        throw new Error("Entrada da lista regular não encontrada.");
      }
      console.error(
        `Erro ao buscar entrada da lista regular com ID ${id}:`,
        error
      );
      throw new Error("Erro ao buscar a entrada da lista regular.");
    }
  }

  async delete(id: number) {
    try {
      await prisma.listaRegular.findUniqueOrThrow({
        where: { idListaRegular: id },
      });

      await prisma.listaRegular.delete({
        where: { idListaRegular: id },
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        console.error(
          `Entrada da lista regular com ID ${id} não encontrada para deletar.`
        );
        throw new Error("Entrada da lista regular não encontrada.");
      }
      console.error(
        `Erro ao deletar entrada da lista regular com ID ${id}:`,
        error
      );
      throw new Error("Erro ao deletar a entrada da lista regular.");
    }
  }
}
