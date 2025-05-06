import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { IdentityService } from './identity.service';
import { CreateIdentityDto } from './dto/create-identity.dto';
import { UpdateIdentityDto } from './dto/update-identity.dto';

@Controller('identities')
export class IdentityController {
  constructor(private readonly identityService: IdentityService) {}

  @Post()
  async create(@Body() createDto: CreateIdentityDto) {
    return this.identityService.create(createDto);
  }

  @Get()
  async findAll() {
    return this.identityService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.identityService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateIdentityDto,
  ) {
    return this.identityService.update(id, updateDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.identityService.remove(id);
  }
}
