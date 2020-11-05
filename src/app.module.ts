import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChannelsModule } from './channels/channels.module';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'toor',
    database: 'postgres',
    autoLoadEntities: true,
    synchronize: true
  }),
  ChannelsModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
