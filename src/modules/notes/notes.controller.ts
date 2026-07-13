import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { NotesService } from "./notes.service";
import { CreateNoteDto } from "./dto/create-note.dto";

@ApiTags('Notes')
@ApiBearerAuth()
@Controller('notes')
export class NotesController {
  constructor(private notesService: NotesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new note' })
  async create(@Request() req: any, @Body() dto: CreateNoteDto) {
    return this.notesService.create(req.user.teamId, req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all notes' })
  async findAll(
    @Request() req: any,
    @Query('contactId') contactId?: string,
    @Query('leadId') leadId?: string,
    @Query('dealId') dealId?: string,
  ) {
    return this.notesService.findAll(req.user.teamId, contactId, leadId, dealId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get note by id' })
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.notesService.findOne(req.user.teamId, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a note' })
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.notesService.remove(req.user.teamId, id);
  }
}