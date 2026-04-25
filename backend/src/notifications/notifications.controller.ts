import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(
    @InjectRepository(Notification)
    private notifRepository: Repository<Notification>,
  ) {}

  @Get()
  getAll() {
    return this.notifRepository.find({ order: { createdAt: 'DESC' } });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: { title: string; message: string }) {
    const notif = this.notifRepository.create(body);
    return this.notifRepository.save(notif);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body: { title?: string; message?: string }) {
    await this.notifRepository.update(id, body);
    return this.notifRepository.findOne({ where: { id } });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.notifRepository.delete(id);
    return { success: true };
  }
}
