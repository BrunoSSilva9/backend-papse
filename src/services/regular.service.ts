import { prisma } from "../lib/prisma.js";
import { Prisma } from "@prisma/client";

export interface CreateRegularDto {
  data_inicio_atendimento: Date;
  qtde_sessoes: number;
  idPaciente: number;
  idBolsista: number;
}

export class RegularService {
  async create(data: CreateRegularDto) {
    try {
      return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const pacienteEmEspera = await tx.listaEspera.findFirst({
          where: { idPaciente: data.idPaciente },
        });

        const pacienteRegular = await tx.listaRegular.findFirst({
          where: { idPaciente: data.idPaciente },
        });

        if (!pacienteEmEspera && !pacienteRegular) {
          throw new Error("Paciente não encontrado em nenhuma lista.");
        }

        await tx.colaborador.findUniqueOrThrow({
          where: { idBolsista: data.idBolsista },
        });

        if (pacienteEmEspera) {
          await tx.listaEspera.deleteMany({
            where: { idPaciente: data.idPaciente },
          });
        }

        if (pacienteRegular) {
          await tx.listaRegular.deleteMany({
            where: { idPaciente: data.idPaciente },
          });
        }


        const novoRegistro = await tx.regular.create({
          data: {
            data_inicio_atendimento: new Date(data.data_inicio_atendimento),
            qtde_sessoes: data.qtde_sessoes,
            idPaciente: data.idPaciente,
            idBolsista: data.idBolsista,
          },
          include: {
            paciente: true,
            colaborador: true,
          },
        });

        return novoRegistro;
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        console.error(
          "Erro ao criar registro regular: Colaborador não encontrado.",
          error
        );
        throw new Error("Colaborador informado não existe.");
      }

      if (
        error instanceof Error &&
        (error.message === "Paciente não encontrado em nenhuma lista." ||
          error.message === "Paciente não encontrado.")
      ) {
        console.error("Erro ao criar registro regular:", error.message);
        throw error;
      }

      console.error("Erro ao adicionar paciente na lista regular:", error);
      throw new Error("Erro interno ao criar registro regular.");
    }
  }

  async findAll() {
    try {
      return await prisma.regular.findMany({
        include: {
          paciente: true,
          colaborador: true,
        },
      });
    } catch (error) {
      console.error("Erro ao buscar registros regulares:", error);
      throw new Error("Erro interno ao buscar registros regulares.");
    }
  }

  async findOne(id: number) {
  try {
    const registro = await prisma.regular.findUniqueOrThrow({
      where: { idRegular: id },
      include: {
        paciente: true,
        colaborador: true,
      },
    });
    return registro;
  } catch (error: any) {
    if (error.code === "P2025") {
      console.error(`Registro regular com ID ${id} não encontrado.`);
      throw new Error("Registro regular não encontrado.");
    }
    console.error(`Erro ao buscar registro regular com ID ${id}:`, error);
    throw new Error("Erro ao buscar o registro regular.");
    }
    }

    async delete(id: number) {
    try {
      await prisma.regular.delete({
        where: { idRegular: id },
      });
    } catch (error: any) {
      if (error.code === "P2025") {
        console.error(`Registro regular com ID ${id} não encontrado.`);
        throw new Error("Registro regular não encontrado.");
      }
      console.error(`Erro ao deletar registro regular com ID ${id}:`, error);
      throw new Error("Erro ao deletar o registro regular.");
    }
  }
}