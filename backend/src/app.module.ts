import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { IdentityModule } from './identity/identity.module';
import { AddressModule } from './address/address.module';
import { PatientModule } from './patient/patient.module';
import { ConversationModule } from './conversation/conversation.module';
import { ConversationUserModule } from './conversation-user/conversation-user.module';
import { MessageModule } from './message/message.module';
import { CheckinModule } from './checkin/checkin.module';
import { EvolutionModule } from './evolution/evolution.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get('DATABASE_HOST'),
        port: parseInt(configService.get('DATABASE_PORT', '3306')),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    UserModule,
    PatientModule,
    IdentityModule,
    AddressModule,
    ConversationModule,
    ConversationUserModule,
    MessageModule,
    CheckinModule,
    EvolutionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
