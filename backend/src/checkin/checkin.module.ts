import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checkin } from './checkin.entity';
import { CheckinService } from './checkin.service';
import { CheckinController } from './checkin.controller';
import { Patient } from '../patient/patient.entity';
import { User } from '../user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Checkin, Patient, User])],
  providers: [CheckinService],
  controllers: [CheckinController],
})
export class CheckinModule {}
