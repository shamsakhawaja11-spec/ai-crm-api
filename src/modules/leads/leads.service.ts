import { PrismaService } from "@/database/prisma.service";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { LeadFilterDto } from "./dto/lead-filter.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { ConvertLeadDto } from "./dto/convert-lead.dto";
import { LeadStatus, Prisma } from "@prisma/client";

@Injectable()
export class LeadsService {
  constructor(private prisma: PrismaService) {}

  async create(teamId: string, dto: CreateLeadDto) {
    return this.prisma.lead.create({
      data: { ...dto, teamId }
    });
  }

  async findAll(teamId: string, filter: LeadFilterDto) {
    const { search, status, source, assigneeId, minScore, maxScore, page = 1, limit = 20 } = filter;

    const where: Prisma.LeadWhereInput = {
      teamId,
      ...(status && { status }),
      ...(source && { source }),
      ...(assigneeId && { assigneeId }),
      ...(minScore !== undefined && { score: { gte: minScore } }),
      ...(maxScore !== undefined && { score: { lte: maxScore } }),
      ...(search && {
        OR: [
          { firstName: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { lastName: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
    };

    const [leads, total] = await Promise.all([
      this.prisma.lead.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.lead.count({ where }),
    ]);

    return { data: leads, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(teamId: string, id: string) {
    const lead = await this.prisma.lead.findFirst({ where: { teamId, id } });
    if (!lead) throw new NotFoundException('Lead not found');
    return lead;
  }

  async update(teamId: string, id: string, dto: UpdateLeadDto) {
    await this.findOne(teamId, id);
    return this.prisma.lead.updateMany({ where: { teamId, id }, data: { ...dto } });
  }

  async remove(teamId: string, id: string) {
    await this.findOne(teamId, id);
    await this.prisma.lead.deleteMany({ where: { teamId, id } });
  }

  async convertLead(teamId: string, id: string, dto: ConvertLeadDto) {
    const lead = await this.findOne(teamId, id);

    if (lead.status === LeadStatus.CONVERTED) {
      throw new BadRequestException('Lead already converted');
    }

    return this.prisma.$transaction(async (tx) => {
      const contact = await tx.contact.create({
        data: {
          teamId,
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email ?? undefined,
          phone: lead.phone ?? undefined,
          jobTitle: lead.jobTitle ?? undefined,
          companyId: lead.companyId ?? undefined,
        },
      });

      const deal = await tx.deal.create({
        data: {
          teamId,
          pipelineId: dto.pipelineId,
          stageId: dto.stageId,
          title: dto.dealTitle,
          value: dto.dealValue ?? 0,
          contactId: contact.id,
        },
      });

      await tx.lead.update({
        where: { id },
        data: {
          status: LeadStatus.CONVERTED,
          convertedAt: new Date(),
          convertedToId: contact.id,
        },
      });

      return { contact, deal };
    });
  }
}