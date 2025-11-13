import { IsDecimal, IsEmail, IsNumber, IsOptional, IsString, Matches, MaxLength, min, MinLength, minLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  username: string;

  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        'Password too weak. It must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character.',
    },
  )
  password: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @MinLength(11)
  phone_number: string;

  @IsOptional()
  @IsString()
  profile_picture: string;

  @IsString() 
  @MinLength(5)
  @MaxLength(255)
  user_location: string;

  @IsDecimal()
  @IsOptional()
  latitude: number;

  @IsDecimal()
  @IsOptional()
  longitude: number;

}
