import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { CreateDealDto } from "./dto/create-deal.dto";
import { UpdateDealDto } from "./dto/update-deal.dto";
import { DealFilterDto } from "./dto/deal-filter.dto";
import { MoveStageDto } from "./dto/move-stage.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class DealsService {
  constructor(private prisma: PrismaService) {}

  async create(teamId: string, dto: CreateDealDto) {
    return this.prisma.deal.create({
      data: { ...dto, teamId }
    });
  }

  async findAll(teamId: string, filter: DealFilterDto) {
    const { search, stageId, pipelineId, assigneeId, minValue, maxValue, page = 1, limit = 20 } = filter;

    const where: Prisma.DealWhereInput = {
      teamId,
      ...(stageId && { stageId }),
      ...(pipelineId && { pipelineId }),
      ...(assigneeId && { assigneeId }),
      ...(minValue !== undefined && { value: { gte: minValue } }),
      ...(maxValue !== undefined && { value: { lte: maxValue } }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
    };

    const [deals, total] = await Promise.all([
      this.prisma.deal.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          stage: true,
          pipeline: true,
          contact: true,
        },
      }),
      this.prisma.deal.count({ where }),
    ]);

    return { data: deals, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(teamId: string, id: string) {
    const deal = await this.prisma.deal.findFirst({
      where: { id, teamId },
      include: {
        stage: true,
        pipeline: true,
        contact: true,
        assignee: true,
      },
    });
    if (!deal) throw new NotFoundException('Deal not found');
    return deal;
  }

  async update(teamId: string, id: string, dto: UpdateDealDto) {
    await this.findOne(teamId, id);
    return this.prisma.deal.updateMany({
      where: { id, teamId },
      data: { ...dto }
    });
  }

  async remove(teamId: string, id: string) {
    await this.findOne(teamId, id);
    await this.prisma.deal.deleteMany({ where: { id, teamId } });
  }

  async moveStage(teamId: string, id: string, dto: MoveStageDto) {
    const deal = await this.prisma.deal.findFirst({ where: { id, teamId } });
    if (!deal) throw new NotFoundException('Deal not found');

    const stage = await this.prisma.stage.findFirst({ where: { id: dto.stageId } });
    if (!stage) throw new NotFoundException('Stage not found');

    const isWon = stage.name.toLowerCase().includes('won');
    const isLost = stage.name.toLowerCase().includes('lost');

    return this.prisma.deal.update({
      where: { id },
      data: {
        stageId: dto.stageId,
        ...(isWon && { closedAt: new Date(), probability: 100 }),
        ...(isLost && {
          closedAt: new Date(),
          probability: 0,
          lostReason: dto.lostReason,
        }),
      },
    });
  }
}