import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from './address.entity';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { Patient } from '../patient/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Address, Patient])],
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
