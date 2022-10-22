/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from './entities/file.entity';
import { FindFilesDTO } from './dto/find-file.dto';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private readonly fileRepo: Repository<File>,
  ) {}
  async create(createFileDto: CreateFileDto) {
    try {
      const file = new File();
      file.file_content = createFileDto.file_content;
      file.url = createFileDto.url;
      const fileExist = await this.fileRepo
        .createQueryBuilder('file')
        .where(`file.url = :url`, { url: createFileDto.url })
        .orderBy('created_at', 'DESC')
        .getOne();
      if (fileExist) {
        console.warn(`File Already Exists`);
        file.file_name = `${createFileDto.file_name}_${fileExist.verson + 1}`;
        file.verson = fileExist.verson + 1;
      }
      const saveFile = await this.fileRepo.save(file);
      return {
        status: true,
        message: `File stored successfully`,
        file: saveFile,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(query: FindFilesDTO) {
    try {
      const page = typeof query.page !== 'undefined' ? query.page : 1;
      const limit =
        typeof query.limit !== 'undefined' && query.limit <= 100
          ? query.limit
          : 10;
      const offset = limit * (page - 1);
      const files = await this.fileRepo
        .createQueryBuilder('file')
        .limit(limit)
        .offset(offset)
        .orderBy('file.created_at', 'DESC')
        .getMany();
      return {
        status: true,
        message: `File list found successfully`,
        files,
        statusCode: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number) {
    try {
      const file = await this.fileRepo
        .createQueryBuilder('file')
        .where(`file.id = :id`, { id })
        .getOne();
      return {
        status: true,
        message: `File found successfully`,
        file,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updateFileDto: UpdateFileDto) {
    try {
      const file = await this.fileRepo
        .createQueryBuilder('file')
        .where(`file.id = :id`, { id })
        .getOne();
      if (!file) {
        throw new NotFoundException(`File not found`);
      }
      const updateFile = await this.fileRepo.update(
        { id: file.id },
        updateFileDto,
      );
      return {
        status: true,
        message: `File updated successfully`,
        file: updateFile,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    try {
      const file = await this.fileRepo.delete({ id });
      return {
        status: true,
        message: `File deleted successfully`,
        file,
        statusCode: HttpStatus.OK,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
