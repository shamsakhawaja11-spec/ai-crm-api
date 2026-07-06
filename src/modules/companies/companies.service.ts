import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { CompanyFilterDto } from "./dto/company-filter.dto";
import { Prisma } from "@prisma/client";

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(teamId: string, dto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: { teamId, ...dto }
    });
  }

  async findAll(teamId: string, filter: CompanyFilterDto) {
    const { search, industry, city, country, tags, page = 1, limit = 20 } = filter;

    const where: Prisma.CompanyWhereInput = {
      teamId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { domain: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
      ...(industry && { industry }),
      ...(city && { city }),
      ...(country && { country }),
      ...(tags && tags.length > 0 && { tags: { hasSome: tags } }),
    };

    const [companies, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.company.count({ where }),
    ]);

    return { data: companies, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findOne(teamId: string, id: string) {
    const company = await this.prisma.company.findFirst({ where: { id, teamId } });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(teamId: string, id: string, dto: Partial<CreateCompanyDto>) {
    await this.findOne(teamId, id);
    return this.prisma.company.updateMany({ where: { id, teamId }, data: dto });
  }

  async delete(teamId: string, id: string) {
    await this.findOne(teamId, id);
    await this.prisma.company.deleteMany({ where: { id, teamId } });
  }
}