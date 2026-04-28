import { IsDateString, IsEnum, IsNumber, IsString, Length, Max, Min } from "class-validator";
import { exchange_type } from "generated/prisma";

export class CreateOrderDto {

    @IsNumber()
    buyerId: number;

    @IsNumber()
    productId: number;

    @Max(5000)
    agreedPrice: number

    @IsString()
    @Length(5, 90)
    meetupLocation: string;

    @IsNumber()
    @Max(1000)
    meetupLatitude: number;

    @IsNumber()
    meetupLongitude: number;

    @IsDateString()
    meetupTime: string;
}
