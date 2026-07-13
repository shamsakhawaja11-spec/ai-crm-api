import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ActivitiesService } from "./activities.service";
import { CreateActivityDto } from "./dto/create-activity.dto";
import { UpdateActivityDto } from "./dto/update-activity.dto";
import { LogCallDto } from "./dto/log-call.dto";

@ApiTags('Activities')
@ApiBearerAuth()
@Controller('activities')
export class ActivitiesController {
  constructor(private activitiesService: ActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new activity' })
  async create(@Request() req: any, @Body() dto: CreateActivityDto) {
    return this.activitiesService.create(req.user.teamId, req.user.id, dto);
  }

  @Post('log-call')
  @ApiOperation({ summary: 'Log a call quickly' })
  async logCall(@Request() req: any, @Body() dto: LogCallDto) {
    return this.activitiesService.logCall(req.user.teamId, req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all activities' })
  async findAll(
    @Request() req: any,
    @Query('contactId') contactId?: string,
    @Query('leadId') leadId?: string,
    @Query('dealId') dealId?: string,
  ) {
    return this.activitiesService.findAll(req.user.teamId, contactId, leadId, dealId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity by id' })
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.activitiesService.findOne(req.user.teamId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an activity' })
  async update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateActivityDto) {
    return this.activitiesService.update(req.user.teamId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an activity' })
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.activitiesService.remove(req.user.teamId, id);
  }
}