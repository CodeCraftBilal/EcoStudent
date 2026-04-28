import { IsNumber } from "class-validator";

export class CreateChatDto {

    @IsNumber()
    receiverId: number;

    @IsNumber()
    productId: number;
}
