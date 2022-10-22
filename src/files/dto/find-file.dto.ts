/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class FindFilesDTO {
  @ApiProperty()
  @IsNumber()
  readonly page: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly limit: number;
}
