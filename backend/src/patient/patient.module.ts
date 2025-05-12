import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './patient.entity';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { User } from '../user/user.entity';
import { PatientsGateway } from 'src/gateway/patient.gateway';
import { Address } from 'src/address/address.entity';
import { Identity } from 'src/identity/identity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Patient, User, Address, Identity])],
  controllers: [PatientController],
  providers: [PatientService, PatientsGateway],
})
export class PatientModule {}
