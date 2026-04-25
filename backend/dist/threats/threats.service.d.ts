import { Repository } from 'typeorm';
import { ThreatApp } from './entities/threat-app.entity';
import { ThreatUrl } from './entities/threat-url.entity';
export declare class ThreatsService {
    private threatAppRepository;
    private threatUrlRepository;
    constructor(threatAppRepository: Repository<ThreatApp>, threatUrlRepository: Repository<ThreatUrl>);
    checkApp(packageName: string): Promise<ThreatApp | null>;
    checkUrl(domain: string): Promise<ThreatUrl | null>;
    addThreatApp(data: Partial<ThreatApp>): Promise<ThreatApp>;
    addThreatUrl(data: Partial<ThreatUrl>): Promise<ThreatUrl>;
    getAllThreatApps(): Promise<ThreatApp[]>;
    getAllThreatUrls(): Promise<ThreatUrl[]>;
    updateThreatUrl(id: string, data: Partial<ThreatUrl>): Promise<ThreatUrl | null>;
    deleteThreatUrl(id: string): Promise<void>;
    updateThreatApp(id: string, data: Partial<ThreatApp>): Promise<ThreatApp | null>;
    deleteThreatApp(id: string): Promise<void>;
}
