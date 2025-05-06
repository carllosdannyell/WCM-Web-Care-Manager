import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evolution } from './evolution.entity';
import { EvolutionService } from './evolution.service';
import { EvolutionController } from './evolution.controller';
import { User } from '../user/user.entity';
import { Patient } from '../patient/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Evolution, User, Patient])],
  providers: [EvolutionService],
  controllers: [EvolutionController],
})
export class EvolutionModule {}
