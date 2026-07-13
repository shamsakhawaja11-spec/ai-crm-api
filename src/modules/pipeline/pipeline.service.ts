import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { CreatePipelineDto } from './dto/create-pipeline.dto';
import { CreateStageDto } from "./dto/create-stage.dto";

@Injectable()
export class PipelineService {
  constructor(private prisma: PrismaService) {}

  async createPipeline(teamId: string, dto: CreatePipelineDto) {
    return this.prisma.pipeline.create({
      data: { ...dto, teamId },
    });
  }

  async createStage(teamId: string, dto: CreateStageDto) {
    const pipeline = await this.prisma.pipeline.findFirst({
      where: { id: dto.pipelineId, teamId },
    });
    if (!pipeline) throw new NotFoundException('Pipeline not found');

    return this.prisma.stage.create({
      data: {
        name: dto.name,
        order: dto.order,
        color: dto.color,
        pipelineId: dto.pipelineId,
      },
    });
  }

  async findAllPipelines(teamId: string) {
    return this.prisma.pipeline.findMany({
      where: { teamId },
      include: {
        stages: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOnePipeline(teamId: string, id: string) {
    const pipeline = await this.prisma.pipeline.findFirst({
      where: { id, teamId },
      include: {
        stages: {
          orderBy: { order: 'asc' },
        },
      },
    });
    if (!pipeline) throw new NotFoundException('Pipeline not found');
    return pipeline;
  }

  async deletePipeline(teamId: string, id: string) {
    await this.findOnePipeline(teamId, id);
    await this.prisma.pipeline.deleteMany({ where: { id, teamId } });
  }

  async deleteStage(teamId: string, id: string) {
    const stage = await this.prisma.stage.findFirst({
      where: { id, pipeline: { teamId } },
    });
    if (!stage) throw new NotFoundException('Stage not found');
    await this.prisma.stage.delete({ where: { id } });
  }
}