import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ThreatsService } from './threats.service';

@Controller('threats')
export class ThreatsController {
  constructor(private readonly threatsService: ThreatsService) {}

  @Get('app/:packageName')
  checkApp(@Param('packageName') packageName: string) {
    return this.threatsService.checkApp(packageName);
  }

  @Get('url/:domain')
  checkUrl(@Param('domain') domain: string) {
    return this.threatsService.checkUrl(domain);
  }

  @Post('app')
  addApp(@Body() body: any) {
    return this.threatsService.addThreatApp(body);
  }

  @Put('app/:id')
  updateApp(@Param('id') id: string, @Body() body: any) {
    return this.threatsService.updateThreatApp(id, body);
  }

  @Delete('app/:id')
  deleteApp(@Param('id') id: string) {
    return this.threatsService.deleteThreatApp(id);
  }

  @Post('url')
  addUrl(@Body() body: any) {
    return this.threatsService.addThreatUrl(body);
  }

  @Put('url/:id')
  updateUrl(@Param('id') id: string, @Body() body: any) {
    return this.threatsService.updateThreatUrl(id, body);
  }

  @Delete('url/:id')
  deleteUrl(@Param('id') id: string) {
    return this.threatsService.deleteThreatUrl(id);
  }

  @Get('apps/all')
  getAllApps() {
    return this.threatsService.getAllThreatApps();
  }

  @Get('urls/all')
  getAllUrls() {
    return this.threatsService.getAllThreatUrls();
  }
}
