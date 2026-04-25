import { Controller, Get, Post, Put, Body, Param, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockedNumber } from './entities/blocked-number.entity';

@Controller('blocked-numbers')
export class BlockedNumbersController {
  constructor(
    @InjectRepository(BlockedNumber)
    private blockedNumberRepository: Repository<BlockedNumber>,
  ) {}

  @Get()
  getAllGlobal() {
    return this.blockedNumberRepository.find({ where: { userId: 'admin' }, order: { createdAt: 'DESC' } });
  }

  @Get('user/:locksyId')
  getUserBlocked(@Param('locksyId') locksyId: string) {
    return this.blockedNumberRepository.find({ where: [ { userId: 'admin' }, { userId: locksyId } ], order: { createdAt: 'DESC' } });
  }

  @Post()
  async create(@Body() body: { number: string; userId?: string }) {
    const existing = await this.blockedNumberRepository.findOne({ where: { number: body.number, userId: body.userId || 'admin' } });
    if (existing) return existing;

    const bn = this.blockedNumberRepository.create({ number: body.number, userId: body.userId || 'admin' });
    return this.blockedNumberRepository.save(bn);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<BlockedNumber>) {
    await this.blockedNumberRepository.update(id, body);
    return this.blockedNumberRepository.findOne({ where: { id } });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.blockedNumberRepository.delete(id);
    return { success: true };
  }
}
