import { Controller, Get } from '@nestjs/common';

@Controller('updates')
export class UpdatesController {
  @Get('check')
  checkUpdate() {
    return {
      version: '1.0.2',
      url: 'https://locksy-x.onrender.com/updates/download/locksy-x.apk',
      changelog: 'Xavfsizlik tizimi kuchaytirildi va avtomatik yangilanish funksiyasi qo\'shildi.',
      forceUpdate: true
    };
  }
}
