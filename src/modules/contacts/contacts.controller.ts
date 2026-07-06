import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ContactsService } from "./contacts.service";
import { CreateContactDto } from "./dto/create-contact.dto";
import { UpdateContactDto } from "./dto/update-contact.dto";
import { ContactFilterDto } from "./dto/contact-filter.dto";

@ApiTags('Contacts')
@ApiBearerAuth()
@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new contact' })
  async create(@Request() req: any, @Body() dto: CreateContactDto) {
    return this.contactsService.create(req.user.teamId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all contacts' })
  async findAll(@Request() req: any, @Query() filter: ContactFilterDto) {
    return this.contactsService.findAll(req.user.teamId, filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact by id' })
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.contactsService.findOne(req.user.teamId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a contact' })
  async update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateContactDto) {
    return this.contactsService.update(req.user.teamId,dto, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a contact' })
  async remove(@Request() req: any, @Param('id') id: string) {
    await this.contactsService.delete(req.user.teamId, id);
  }
}