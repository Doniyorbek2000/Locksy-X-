import { Controller, Get, Post, Body } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  @Post('register')
  async register(@Body() body: { locksyId: string; region?: string }) {
    let user = await this.userRepository.findOne({ where: { locksyId: body.locksyId } });
    if (!user) {
      user = this.userRepository.create(body);
    } else {
      user.lastLoginAt = new Date();
    }
    await this.userRepository.save(user);
    return user;
  }

  @Get('all')
  getAllUsers() {
    return this.userRepository.find({ order: { registeredAt: 'DESC' } });
  }
}
