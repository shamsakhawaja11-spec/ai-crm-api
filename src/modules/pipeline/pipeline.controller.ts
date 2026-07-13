import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { PipelineService } from "./pipeline.service";
import { CreatePipelineDto } from "./dto/create-pipeline.dto";
import { CreateStageDto } from "./dto/create-stage.dto";

@ApiTags('Pipelines')
@ApiBearerAuth()
@Controller('pipelines')
export class PipelineController {
  constructor(private pipelineService: PipelineService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pipeline' })
  async createPipeline(@Request() req: any, @Body() dto: CreatePipelineDto) {
    return this.pipelineService.createPipeline(req.user.teamId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pipelines' })
  async findAllPipelines(@Request() req: any) {
    return this.pipelineService.findAllPipelines(req.user.teamId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get pipeline by id' })
  async findOnePipeline(@Request() req: any, @Param('id') id: string) {
    return this.pipelineService.findOnePipeline(req.user.teamId, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a pipeline' })
  async deletePipeline(@Request() req: any, @Param('id') id: string) {
    await this.pipelineService.deletePipeline(req.user.teamId, id);
  }

  @Post('stages')
  @ApiOperation({ summary: 'Create a new stage' })
  async createStage(@Request() req: any, @Body() dto: CreateStageDto) {
    return this.pipelineService.createStage(req.user.teamId, dto);
  }

  @Delete('stages/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a stage' })
  async deleteStage(@Request() req: any, @Param('id') id: string) {
    await this.pipelineService.deleteStage(req.user.teamId, id);
  }
}