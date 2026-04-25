import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ad } from './entities/ad.entity';

@Controller('ads')
export class AdsController {
  constructor(
    @InjectRepository(Ad)
    private adRepository: Repository<Ad>,
  ) {}

  @Get('active')
  getActiveAds() {
    return this.adRepository.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllAds() {
    return this.adRepository.find({ order: { createdAt: 'DESC' } });
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAd(@Body() body: Partial<Ad>) {
    const ad = this.adRepository.create({ ...body, isActive: true });
    return this.adRepository.save(ad);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateAd(@Param('id') id: string, @Body() body: Partial<Ad>) {
    await this.adRepository.update(id, body);
    return this.adRepository.findOne({ where: { id } });
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/toggle')
  async toggleAd(@Param('id') id: string) {
    const ad = await this.adRepository.findOne({ where: { id } });
    if (ad) {
      ad.isActive = !ad.isActive;
      return this.adRepository.save(ad);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteAd(@Param('id') id: string) {
    await this.adRepository.delete(id);
    return { success: true };
  }
}
