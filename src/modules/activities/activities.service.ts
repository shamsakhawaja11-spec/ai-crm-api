import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";
import { LogCallDto } from "./dto/log-call.dto";
import { ActivityType, Prisma } from "@prisma/client";

@Injectable()
export class ActivitiesService {
  constructor(private prisma: PrismaService) {}

  async create(teamId: string, userId: string, dto: CreateActivityDto) {
    return this.prisma.activity.create({
      data: { ...dto, teamId, userId },
    });
  }

  async logCall(teamId: string, userId: string, dto: LogCallDto) {
    return this.prisma.activity.create({
      data: {
        ...dto,
        teamId,
        userId,
        type: ActivityType.CALL,
        title: dto.title,
        completedAt: new Date(),
      },
    });
  }

  async findAll(teamId: string, contactId?: string, leadId?: string, dealId?: string) {
    const where: Prisma.ActivityWhereInput = {
      teamId,
      ...(contactId && { contactId }),
      ...(leadId && { leadId }),
      ...(dealId && { dealId }),
    };

    return this.prisma.activity.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { user: true },
    });
  }

  async findOne(teamId: string, id: string) {
    const activity = await this.prisma.activity.findFirst({
      where: { id, teamId },
      include: { user: true },
    });
    if (!activity) throw new NotFoundException('Activity not found');
    return activity;
  }

  async update(teamId: string, id: string, dto: UpdateActivityDto) {
    await this.findOne(teamId, id);
    return this.prisma.activity.updateMany({
      where: { id, teamId },
      data: { ...dto },
    });
  }

  async remove(teamId: string, id: string) {
    await this.findOne(teamId, id);
    await this.prisma.activity.deleteMany({ where: { id, teamId } });
  }
}