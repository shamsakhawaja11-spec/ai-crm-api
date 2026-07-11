import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LeadsService } from "./leads.service";
import { CreateLeadDto } from "./dto/create-lead.dto";
import { LeadFilterDto } from "./dto/lead-filter.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { ConvertLeadDto } from "./dto/convert-lead.dto";

@ApiTags('Leads')
@ApiBearerAuth()
@Controller('leads')
export class LeadsController {
  constructor(private leadsService: LeadsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lead' })
  async create(@Request() req: any, @Body() dto: CreateLeadDto) {
    return this.leadsService.create(req.user.teamId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all leads' })
  async findAll(@Request() req: any, @Query() filter: LeadFilterDto) {
    return this.leadsService.findAll(req.user.teamId, filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lead by id' })
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.leadsService.findOne(req.user.teamId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a lead' })
  async update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateLeadDto) {
    return this.leadsService.update(req.user.teamId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a lead' })
  async delete(@Request() req: any, @Param('id') id: string) {
    await this.leadsService.remove(req.user.teamId, id);
  }

  @Post(':id/convert')
  @ApiOperation({ summary: 'Convert lead to contact and deal' })
  async convertLead(@Request() req: any, @Param('id') id: string, @Body() dto: ConvertLeadDto) {
    return this.leadsService.convertLead(req.user.teamId, id, dto);
  }
}