import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { DealsService } from "./deals.service";
import { CreateDealDto } from "./dto/create-deal.dto";
import { UpdateDealDto } from "./dto/update-deal.dto";
import { DealFilterDto } from "./dto/deal-filter.dto";
import { MoveStageDto } from "./dto/move-stage.dto";

@ApiTags('Deals')
@ApiBearerAuth()
@Controller('deals')
export class DealsController {
  constructor(private dealsService: DealsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new deal' })
  async create(@Request() req: any, @Body() dto: CreateDealDto) {
    return this.dealsService.create(req.user.teamId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all deals' })
  async findAll(@Request() req: any, @Query() filter: DealFilterDto) {
    return this.dealsService.findAll(req.user.teamId, filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get deal by id' })
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.dealsService.findOne(req.user.teamId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a deal' })
  async update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateDealDto) {
    return this.dealsService.update(req.user.teamId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a deal' })
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.dealsService.remove(req.user.teamId, id);
  }

  @Patch(':id/stage')
  @ApiOperation({ summary: 'Move deal to a new stage' })
  async moveStage(@Request() req: any, @Param('id') id: string, @Body() dto: MoveStageDto) {
    return this.dealsService.moveStage(req.user.teamId, id, dto);
  }
}