import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async create(teamId: string, creatorId: string, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: { ...dto, teamId, creatorId },
    });
  }

  async findAll(teamId: string, contactId?: string, leadId?: string, dealId?: string) {
    const where: Prisma.TaskWhereInput = {
      teamId,
      ...(contactId && { contactId }),
      ...(leadId && { leadId }),
      ...(dealId && { dealId }),
    };

    return this.prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        assignee: true,
        creator: true,
      },
    });
  }

  async findOne(teamId: string, id: string) {
    const task = await this.prisma.task.findFirst({
      where: { id, teamId },
      include: {
        assignee: true,
        creator: true,
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(teamId: string, id: string, dto: UpdateTaskDto) {
    await this.findOne(teamId, id);
    return this.prisma.task.updateMany({
      where: { id, teamId },
      data: { ...dto },
    });
  }

  async remove(teamId: string, id: string) {
    await this.findOne(teamId, id);
    await this.prisma.task.deleteMany({ where: { id, teamId } });
  }
}