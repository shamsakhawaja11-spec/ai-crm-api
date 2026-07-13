import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { TasksService } from "./tasks.service";
import { CreateTaskDto } from "./dto/create-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  async create(@Request() req: any, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(req.user.teamId, req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  async findAll(
    @Request() req: any,
    @Query('contactId') contactId?: string,
    @Query('leadId') leadId?: string,
    @Query('dealId') dealId?: string,
  ) {
    return this.tasksService.findAll(req.user.teamId, contactId, leadId, dealId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by id' })
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.tasksService.findOne(req.user.teamId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task' })
  async update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.tasksService.update(req.user.teamId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a task' })
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.tasksService.remove(req.user.teamId, id);
  }
}