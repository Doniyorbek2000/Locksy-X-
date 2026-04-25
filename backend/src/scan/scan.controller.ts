import { Controller, Post, Body } from '@nestjs/common';
import { ScanService } from './scan.service';

@Controller('scan')
export class ScanController {
  constructor(private readonly scanService: ScanService) {}

  @Post('apk')
  scanApk(@Body() body: { packageName: string; hash?: string; permissions?: string[] }) {
    return this.scanService.scanApk(body);
  }

  @Post('url')
  scanUrl(@Body('url') url: string) {
    return this.scanService.scanUrl(url);
  }
}
