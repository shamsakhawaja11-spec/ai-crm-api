import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Request } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { CompaniesService } from "./companies.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { CompanyFilterDto } from "./dto/company-filter.dto";

@ApiTags('Companies')
@ApiBearerAuth()
@Controller('companies')
export class CompaniesController {
  constructor(private companiesService: CompaniesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new company' })
  async create(@Request() req: any, @Body() dto: CreateCompanyDto) {
    return this.companiesService.create(req.user.teamId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  async findAll(@Request() req: any, @Query() filter: CompanyFilterDto) {
    return this.companiesService.findAll(req.user.teamId, filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by id' })
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.companiesService.findOne(req.user.teamId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a company' })
  async update(@Request() req: any, @Param('id') id: string, @Body() dto: CreateCompanyDto) {
    return this.companiesService.update(req.user.teamId, id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a company' })
  async delete(@Request() req: any, @Param('id') id: string) {
    await this.companiesService.delete(req.user.teamId, id);
  }
}