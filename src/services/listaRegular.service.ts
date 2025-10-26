import { prisma } from "../lib/prisma.js";

export interface CreateListaRegularDto {
  idPaciente: number;
  idBolsista: number;
}

export class ListaRegularService {
  async create(data: CreateListaRegularDto) {
    try {
      return prisma.$transaction(async (tx) => {
        const pacienteEmEspera = await tx.listaEspera.findFirst({
          where: { idPaciente: data.idPaciente },
        });

        if (!pacienteEmEspera) {
          throw new Error("❌ O paciente não está na lista de espera.");
        }

        const colaborador = await tx.colaborador.findUnique({
          where: { idBolsista: data.idBolsista },
        });

        if (!colaborador) {
          throw new Error("❌ O colaborador informado não existe.");
        }

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
        console.error("🚨 Erro ao mover paciente da lista de espera:", error);

      if (error instanceof Error) {
        throw new Error(error.message);
      }

      throw new Error("Erro interno ao adicionar paciente na lista regular.");
    }
  }

 async findAll() {
    try {
      const lista = await prisma.listaRegular.findMany({
        include: {
          paciente: true,   
          colaborador: true 
        },
        orderBy: {
          idListaRegular: "asc",
        },
      });

      return lista;
    } catch (error: any) {
      console.error("🚨 Erro ao buscar lista regular:", error);

      throw new Error("Erro ao buscar os registros da lista regular.");
    }
  }

  async findOne(id: number) {
    try {
      const entradaListaRegular = await prisma.listaRegular.findUniqueOrThrow({
        where: { idListaRegular: id },
        include: {
          paciente: true,
          colaborador: true
        },
      });
      return entradaListaRegular;
    } catch (error) {
      console.error(
        `Erro ao buscar entrada da lista regular com ID ${id}:`,
        error
      );
      throw new Error("Entrada da lista regular não encontrada.");
    }
  }

  async delete(id: number) {
    try {
      await prisma.listaRegular.delete({
        where: { idListaRegular: id },
      });
    } catch (error) {
      console.error(`Erro ao deletar entrada da lista regular com ID ${id}:`, error);
      throw new Error("Erro ao deletar entrada da lista regular.");
    }
  }
}