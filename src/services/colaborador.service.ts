import { prisma } from "../lib/prisma.js";

export interface CreateColaboradorDto {
  nome: string;
  matricula: string;
  data_admissao: Date;
  data_saida?: Date | null;
}

export type UpdateColaboradorDto = Partial<CreateColaboradorDto>;

export class ColaboradorService {
  async create(data: CreateColaboradorDto) {
    try {
      const colaborador = await prisma.colaborador.create({
        data: {
          ...data,
          data_admissao: new Date(data.data_admissao),
          data_saida: data.data_saida ? new Date(data.data_saida) : null,
        },
      });
      return colaborador;
    } catch (error) {
      console.error("Erro ao criar colaborador:", error);
      throw new Error("Não foi possível criar o colaborador.");
    }
  }

  async findAll() {
    try {
      const colaboradores = await prisma.colaborador.findMany();
      return colaboradores;
    } catch (error) {
      console.error("Erro ao buscar colaboradores:", error);
      throw new Error("Não foi possível buscar os colaboradores.");
    }
  }

  async findOne(id: number) {
    try {
      const colaborador = await prisma.colaborador.findUniqueOrThrow({
        where: { idBolsista: id },
      });
      return colaborador;
    } catch (error) {
      console.error(`Erro ao buscar colaborador com ID ${id}:`, error);
      throw new Error("Colaborador não encontrado.");
    }
  }

  async update(id: number, data: UpdateColaboradorDto) {
    try {
      const colaborador = await prisma.colaborador.update({
        where: { idBolsista: id },
        data: {
          ...data,
          ...(data.data_admissao && {
            data_admissao: new Date(data.data_admissao),
          }),
          ...(data.data_saida && { data_saida: new Date(data.data_saida) }),
        },
      });
      return colaborador;
    } catch (error) {
      console.error(`Erro ao atualizar colaborador com ID ${id}:`, error);
      throw new Error("Colaborador não encontrado ou dados inválidos.");
    }
  }

  async delete(id: number) {
    try {
      await prisma.colaborador.delete({
        where: { idBolsista: id },
      });
    } catch (error) {
      console.error(`Erro ao deletar colaborador com ID ${id}:`, error);
      throw new Error("Colaborador não encontrado.");
    }
  }
}
