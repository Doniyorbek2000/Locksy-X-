import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guide } from './entities/guide.entity';

@Controller('guides')
export class GuidesController {
  constructor(
    @InjectRepository(Guide)
    private guideRepository: Repository<Guide>,
  ) {}

  @Get()
  getAllGuides() {
    return this.guideRepository.find({ order: { lang: 'ASC' } });
  }

  @Get(':lang')
  async getGuide(@Param('lang') lang: string) {
    const guide = await this.guideRepository.findOne({ where: { lang } });
    if (!guide) return { content: 'No guide available.' };
    return guide;
  }

  @Post()
  async updateGuide(@Body() body: { lang: string; content: string }) {
    let guide = await this.guideRepository.findOne({ where: { lang: body.lang } });
    if (!guide) {
      guide = this.guideRepository.create(body);
    } else {
      guide.content = body.content;
    }
    return this.guideRepository.save(guide);
  }
}
