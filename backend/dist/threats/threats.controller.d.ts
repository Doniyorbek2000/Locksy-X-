import { ThreatsService } from './threats.service';
export declare class ThreatsController {
    private readonly threatsService;
    constructor(threatsService: ThreatsService);
    checkApp(packageName: string): Promise<import("./entities/threat-app.entity").ThreatApp | null>;
    checkUrl(domain: string): Promise<import("./entities/threat-url.entity").ThreatUrl | null>;
    addApp(body: any): Promise<import("./entities/threat-app.entity").ThreatApp>;
    updateApp(id: string, body: any): Promise<import("./entities/threat-app.entity").ThreatApp | null>;
    deleteApp(id: string): Promise<void>;
    addUrl(body: any): Promise<import("./entities/threat-url.entity").ThreatUrl>;
    updateUrl(id: string, body: any): Promise<import("./entities/threat-url.entity").ThreatUrl | null>;
    deleteUrl(id: string): Promise<void>;
    getAllApps(): Promise<import("./entities/threat-app.entity").ThreatApp[]>;
    getAllUrls(): Promise<import("./entities/threat-url.entity").ThreatUrl[]>;
}
