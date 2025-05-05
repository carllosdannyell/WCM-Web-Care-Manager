import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Identity } from './identity.entity';
import { IdentityService } from './identity.service';
import { IdentityController } from './identity.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Identity])],
  providers: [IdentityService],
  controllers: [IdentityController],
})
export class IdentityModule {}
