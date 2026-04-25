import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ThreatApp } from './entities/threat-app.entity';
import { ThreatUrl } from './entities/threat-url.entity';

@Injectable()
export class ThreatsService {
  constructor(
    @InjectRepository(ThreatApp)
    private threatAppRepository: Repository<ThreatApp>,
    @InjectRepository(ThreatUrl)
    private threatUrlRepository: Repository<ThreatUrl>,
  ) {}

  async checkApp(packageName: string): Promise<ThreatApp | null> {
    return this.threatAppRepository.findOne({ where: { packageName } });
  }

  async checkUrl(domain: string): Promise<ThreatUrl | null> {
    return this.threatUrlRepository.findOne({ where: { domain } });
  }

  async addThreatApp(data: Partial<ThreatApp>): Promise<ThreatApp> {
    const app = this.threatAppRepository.create(data);
    return this.threatAppRepository.save(app);
  }

  async addThreatUrl(data: Partial<ThreatUrl>): Promise<ThreatUrl> {
    const url = this.threatUrlRepository.create(data);
    return this.threatUrlRepository.save(url);
  }

  async getAllThreatApps(): Promise<ThreatApp[]> {
    return this.threatAppRepository.find({ order: { createdAt: 'DESC' }, take: 50 });
  }

  async getAllThreatUrls(): Promise<ThreatUrl[]> {
    return this.threatUrlRepository.find({ order: { createdAt: 'DESC' }, take: 100 });
  }

  async updateThreatUrl(id: string, data: Partial<ThreatUrl>): Promise<ThreatUrl | null> {
    await this.threatUrlRepository.update(id, data);
    return this.threatUrlRepository.findOne({ where: { id } });
  }

  async deleteThreatUrl(id: string): Promise<void> {
    await this.threatUrlRepository.delete(id);
  }

  async updateThreatApp(id: string, data: Partial<ThreatApp>): Promise<ThreatApp | null> {
    await this.threatAppRepository.update(id, data);
    return this.threatAppRepository.findOne({ where: { id } });
  }

  async deleteThreatApp(id: string): Promise<void> {
    await this.threatAppRepository.delete(id);
  }
}
