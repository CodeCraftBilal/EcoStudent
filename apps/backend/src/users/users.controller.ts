import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, UseInterceptors, BadRequestException, UploadedFile } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { Public } from 'src/auth/decorators/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';
import { UploadService } from 'src/upload/upload.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly uploadService: UploadService,
  ) {}

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.usersService.create(createUserDto);
  }

  @Roles('ADMIN')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Post('updatelocation')
  updateUserLocation(@Body() body: UpdateUserDto, @Req() req) {
    console.log('udpateing user location')
    return this.usersService.updateUserLocation(body, req.user.id);
  }

  @Post('updateprofile')
  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: multer.memoryStorage(),
      limits: {fileSize: 4 * 1024 * 1024},
      fileFilter(req, file, callback) {
        if(!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return callback(
            new BadRequestException('Only Images Allowed'),
            false,
          )
        }
        callback(null, true);
      },
    })
  )
  async updateProfile(
    @Req() req,
    @Body() body: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File
) {
    const profileUrl = await this.uploadService.uploadToLocal(file, 'profile')
    return this.usersService.updateProfilePicture(req.user.id, {
      ...body,
      profilePicture: profileUrl,
    });
  }

  @Patch('profile/update/:userId')
  handleProfileUpdate( @Param('userId') userId ,@Req() req, @Body() body) {
    return this.usersService.updateProfile(+userId, body, req.user.id);
  }

  @Get('profile')
  getUserProfile(@Req() req) {
    return this.usersService.getUserProfile(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    console.log(req.user.id)
      return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    console.log('updating controller ', updateUserDto)
    const uId = parseInt(id);
    if(uId != req.user.id) throw new UnauthorizedException('Invalid update Request');
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
