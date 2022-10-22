/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { File } from '../entities/file.entity';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';

@Injectable()
export class CronService {
  apiUrl = process.env.API_URL;
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(File) private readonly fileRepo: Repository<File>,
  ) {}

  /**
   * Get files data from api
   */
  findAll(): Promise<AxiosResponse<any>> {
    return this.httpService.axiosRef.get(this.apiUrl);
  }

  /**
   * Get Content of file from url
   * @param url string
   */
  fetchContent(url): Promise<AxiosResponse<any>> {
    return this.httpService.axiosRef.get(url, { responseType: 'arraybuffer' });
  }

  /**
   * Cron job setup
   * Run Every 5 mins to fetch data and insert into db
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron() {
    try {
      // Get All available files
      const response = await this.findAll();

      // Structured data into array of url strings
      const data = JSON.stringify(response.data).match(
        /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/+#-]*[\w@?^=%&\/+#-])/g,
      );

      // Loop throw data to get content and store into db
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key];
          // split url to fetch file name
          const splVal = element.split('/');

          // Fetch file content
          const fileContent = await this.fetchContent(element);

          // new file object
          const file = new File();

          // Get use file name from url
          file.file_name = splVal[splVal.length - 1];
          file.url = element;
          file.file_content = fileContent.data;

          // check if file already exists from url
          const fileExist = await this.fileRepo
            .createQueryBuilder('file')
            .where(`url = :url`, { url: element })
            .orderBy('created_at', 'DESC')
            .getOne();
          if (fileExist) {
            // warning that file already exist before store again
            console.warn(`File Already Exists`);
            file.file_name = `${splVal[splVal.length - 1]}_${
              fileExist.version + 1
            }`;
            // update last version
            file.version = fileExist.version + 1;
          }
          // save file again
          await this.fileRepo.save(file);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
}
