import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSearchhistoryDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}
