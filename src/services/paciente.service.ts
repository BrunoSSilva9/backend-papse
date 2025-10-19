import { prisma } from "../lib/prisma.js"; 


export interface CreatePacienteDto {
  nome: string;
  matricula: string;
  data_nascimento: Date;
  data_inscricao: Date;
  telefone?: string;
  relato?: string;
  curso?: string;
}

export type UpdatePacienteDto = Partial<CreatePacienteDto>;

export class PacienteService {

  async create(data: CreatePacienteDto) {
    try {
      const paciente = await prisma.paciente.create({
        data: {
          ...data,
          data_nascimento: new Date(data.data_nascimento),
          data_inscricao: new Date(data.data_inscricao),
        },
      });
      return paciente;
    } catch (error) {
      console.error("Erro ao criar paciente:", error);
      throw new Error("Não foi possível criar o paciente.");
    }
  }

  async findAll() {
    try {
      const pacientes = await prisma.paciente.findMany();
      return pacientes;
    } catch (error) {
      console.error("Erro ao buscar pacientes:", error);
      throw new Error("Não foi possível buscar os pacientes.");
    }
  }

  async findOne(id: number) {
    try {
      const paciente = await prisma.paciente.findUniqueOrThrow({
        where: { idPaciente: id },
      });
      return paciente;
    } catch (error) {
      console.error(`Erro ao buscar paciente com ID ${id}:`, error);

      throw new Error("Paciente não encontrado.");
    }
  }

  async update(id: number, data: UpdatePacienteDto) {
    try {
      const paciente = await prisma.paciente.update({
        where: { idPaciente: id },
        data: {
          ...data,
          ...(data.data_nascimento && {

            data_nascimento: new Date(data.data_nascimento),
          }),
          ...(data.data_inscricao && {
            data_inscricao: new Date(data.data_inscricao),
          }),
        },
      });
      return paciente;
    } catch (error) {
      console.error(`Erro ao atualizar paciente com ID ${id}:`, error);
      throw new Error("Paciente não encontrado ou dados inválidos.");
    }
  }

  async delete(id: number) {
    try {
      await prisma.paciente.delete({
        where: { idPaciente: id },
      });
    } catch (error) {
      console.error(`Erro ao deletar paciente com ID ${id}:`, error);
      throw new Error("Paciente não encontrado.");
    }
  }
}
