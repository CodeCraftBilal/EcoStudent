import { IsEnum, IsNumber, IsString } from 'class-validator';
import { NOTIFICATION_TYPE } from 'generated/prisma';

export class CreateNotificationDto {
  @IsNumber()
  userId: number;

  @IsEnum(NOTIFICATION_TYPE)
  type: NOTIFICATION_TYPE;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsString()
  relatedEntityType: string;

  @IsNumber()
  relatedEntityId: number;
}
