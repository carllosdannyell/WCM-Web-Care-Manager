import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { CheckinService } from './checkin.service';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { CheckoutDto } from './dto/checkout.dto';

@Controller('checkins')
export class CheckinController {
  constructor(private readonly checkinService: CheckinService) {}

  @Post()
  create(@Body() dto: CreateCheckinDto) {
    return this.checkinService.create(dto);
  }

  @Post('/checkout')
  checkout(@Body() dto: CheckoutDto) {
    return this.checkinService.checkout(dto);
  }

  @Get()
  findAll() {
    return this.checkinService.findAll();
  }

  @Get('/user/:userId')
  findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.checkinService.findByUser(userId);
  }

  @Get('/patient/:patientId')
  findByPatient(@Param('patientId', ParseIntPipe) patientId: number) {
    return this.checkinService.findByPatient(patientId);
  }
}
