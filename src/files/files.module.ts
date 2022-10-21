/* eslint-disable @typescript-eslint/no-unused-vars */
import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { File } from './entities/file.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronService } from './cron/cron.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([File])],
  controllers: [FilesController],
  providers: [FilesService, CronService],
})
export class FilesModule {}
