import { IsNumber } from "class-validator";

export class FindMessagesDto {
    @IsNumber()
    receiverId: number;
}