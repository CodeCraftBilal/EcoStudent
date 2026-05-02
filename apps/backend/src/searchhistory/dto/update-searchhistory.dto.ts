import { PartialType } from '@nestjs/mapped-types';
import { CreateSearchhistoryDto } from './create-searchhistory.dto';

export class UpdateSearchhistoryDto extends PartialType(CreateSearchhistoryDto) {}
