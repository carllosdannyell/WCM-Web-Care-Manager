import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { EvolutionService } from './evolution.service';
import { CreateEvolutionDto } from './dto/create-evolution.dto';
import { UpdateEvolutionDto } from './dto/update-evolution.dto';

@Controller('evolutions')
export class EvolutionController {
  constructor(private readonly evolutionService: EvolutionService) {}

  @Post()
  create(@Body() dto: CreateEvolutionDto) {
    return this.evolutionService.create(dto);
  }

  @Get()
  findAll() {
    return this.evolutionService.findAll();
  }

  @Get('/patient/:patientId')
  findByPatient(@Param('patientId', ParseIntPipe) id: number) {
    return this.evolutionService.findByPatient(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEvolutionDto,
  ) {
    return this.evolutionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.evolutionService.remove(id);
  }
}
