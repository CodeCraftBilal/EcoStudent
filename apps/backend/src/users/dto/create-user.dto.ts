import { IsDecimal, IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  userName: string;

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
  phoneNumber: string;

  @IsOptional()
  @IsString()
  profilePicture: string;

  @IsOptional()
  @IsString() 
  @MinLength(5)
  @MaxLength(255)
  userLocation: string;

  @IsDecimal()
  @IsOptional()
  latitude: number;

  @IsDecimal()
  @IsOptional()
  longitude: number;

}
