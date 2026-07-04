import { PrismaService } from "@/database/prisma.service";
import { CreateTeamDto } from "./dto/create-team.dto";
import { UserRole } from "@prisma/client";
import { InviteMembersDto } from "./dto/invite-member.dto";
import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";

@Injectable()
export class TeamsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateTeamDto) {
    const team = await this.prisma.team.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        logoUrl: dto.logoUrl,
        members: {
          create: { userId, role: UserRole.OWNER }
        }
      }
    });
    return team;
  }

  async findMyTeams(userId: string) {
    return this.prisma.teamMember.findMany({
      where: { userId },
      include: { team: true }
    });
  }

  async findOne(teamId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: { members: { include: { user: true } } }
    });
    if (!team) throw new NotFoundException('Team not found');
    return team;
  }

  async inviteMember(teamId: string, dto: InviteMembersDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('User not found');

    const existing = await this.prisma.teamMember.findFirst({
      where: { teamId, userId: user.id }
    });
    if (existing) throw new ConflictException('User already a member');

    return this.prisma.teamMember.create({
      data: { teamId, userId: user.id, role: dto.role }
    });
  }

  async removeMember(teamId: string, userId: string) {
    await this.prisma.teamMember.deleteMany({ where: { teamId, userId } });
  }
}