import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    console.log('Request User:', req.user);
    return this.usersService.findById(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async updateProfile(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    const userId = req.user.id; // Extract user ID from the token
    return this.usersService.updateProfile(userId, updateUserDto);
  }
}
