import {
  Injectable,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '@/database/prisma.service';

import { ReportFilterDto } from './dto/report-filter.dto';

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  private async verifyTeamMembership(
    teamId: string,
    userId: string,
  ): Promise<void> {
    const membership =
      await this.prisma.teamMember.findUnique({
        where: {
          teamId_userId: {
            teamId,
            userId,
          },
        },
        select: {
          id: true,
        },
      });

    if (!membership) {
      throw new ForbiddenException(
        'You are not a member of this team',
      );
    }
  }

  private getDateRange(dto: ReportFilterDto) {
    const to = dto.to
      ? new Date(dto.to)
      : new Date();

    const from = dto.from
      ? new Date(dto.from)
      : new Date(
          to.getTime() -
            30 * 24 * 60 * 60 * 1000,
        );

    return {
      from,
      to,
    };
  }

  async getOverview(
    teamId: string,
    userId: string,
    dto: ReportFilterDto,
  ) {
    await this.verifyTeamMembership(
      teamId,
      userId,
    );

    const { from, to } =
      this.getDateRange(dto);

    const analytics =
      await this.prisma.analyticsDaily.findMany({
        where: {
          teamId,

          date: {
            gte: from,
            lte: to,
          },
        },

        select: {
          date: true,
          wonDeals: true,
          wonRevenue: true,
          convertedLeads: true,
        },

        orderBy: {
          date: 'asc',
        },
      });

    const metrics = analytics.reduce(
      (acc, row) => {
        acc.wonDeals += row.wonDeals;
        acc.wonRevenue += row.wonRevenue;
        acc.convertedLeads += row.convertedLeads;

        return acc;
      },
      {
        wonDeals: 0,
        wonRevenue: 0,
        convertedLeads: 0,
      },
    );

    return {
      period: {
        from,
        to,
      },

      metrics,
    };
  }

  async getRevenue(
    teamId: string,
    userId: string,
    dto: ReportFilterDto,
  ) {
    await this.verifyTeamMembership(
      teamId,
      userId,
    );

    const { from, to } =
      this.getDateRange(dto);

    const analytics =
      await this.prisma.analyticsDaily.findMany({
        where: {
          teamId,

          date: {
            gte: from,
            lte: to,
          },
        },

        select: {
          date: true,
          wonDeals: true,
          wonRevenue: true,
        },

        orderBy: {
          date: 'asc',
        },
      });

    return {
      period: {
        from,
        to,
      },

      data: analytics.map((row) => ({
        date: row.date,
        wonDeals: row.wonDeals,
        revenue: row.wonRevenue,
      })),
    };
  }

  async getConversions(
    teamId: string,
    userId: string,
    dto: ReportFilterDto,
  ) {
    await this.verifyTeamMembership(
      teamId,
      userId,
    );

    const { from, to } =
      this.getDateRange(dto);

    const analytics =
      await this.prisma.analyticsDaily.findMany({
        where: {
          teamId,

          date: {
            gte: from,
            lte: to,
          },
        },

        select: {
          date: true,
          convertedLeads: true,
        },

        orderBy: {
          date: 'asc',
        },
      });

    return {
      period: {
        from,
        to,
      },

      data: analytics.map((row) => ({
        date: row.date,
        convertedLeads:
          row.convertedLeads,
      })),
    };
  }
}