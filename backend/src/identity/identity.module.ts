import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Identity } from './identity.entity';
import { Patient } from '../patient/patient.entity';
import { IdentityService } from './identity.service';
import { IdentityController } from './identity.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Identity, Patient])],
  controllers: [IdentityController],
  providers: [IdentityService],
})
export class IdentityModule {}
