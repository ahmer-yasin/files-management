/* eslint-disable @typescript-eslint/no-unused-vars */
import { IsNotEmpty, IsString } from 'class-validator';
export class CreateFileDto {
  @IsNotEmpty()
  @IsString()
  readonly url: string;

  @IsNotEmpty()
  @IsString()
  readonly file_name: string;

  @IsNotEmpty()
  readonly file_content: Buffer;
}
