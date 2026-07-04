import { Body, Controller, Delete, Get, Param, Post, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TeamsService } from "./teams.service";
import { CreateTeamDto } from "./dto/create-team.dto";
import { InviteMembersDto } from "./dto/invite-member.dto";

@ApiTags('Teams')
@ApiBearerAuth()
@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  async create(@Request() req: any, @Body() dto: CreateTeamDto) {
    return this.teamsService.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get my teams' })
  async findMyTeams(@Request() req: any) {
    return this.teamsService.findMyTeams(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get team by id' })
  async findOne(@Param('id') id: string) {
    return this.teamsService.findOne(id);
  }

  @Post(':id/members')
  @ApiOperation({ summary: 'Invite a member to team' })
  async inviteMembers(@Param('id') id: string, @Body() dto: InviteMembersDto) {
    return this.teamsService.inviteMember(id, dto);
  }

  @Delete(':id/members/:userId')
  @ApiOperation({ summary: 'Remove a member from team' })
  async removeMembers(@Param('id') id: string, @Param('userId') userId: string) {
    await this.teamsService.removeMember(id, userId);
  }
}