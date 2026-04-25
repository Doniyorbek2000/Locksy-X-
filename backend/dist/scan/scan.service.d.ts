import { ThreatsService } from '../threats/threats.service';
export declare class ScanService {
    private readonly threatsService;
    constructor(threatsService: ThreatsService);
    scanApk(data: {
        packageName: string;
        hash?: string;
        permissions?: string[];
    }): Promise<{
        status: string;
        risk: number;
        package: string;
        message: string;
        severity?: undefined;
    } | {
        status: string;
        risk: number;
        severity: string;
        package: string;
        message: string;
    }>;
    scanUrl(url: string): Promise<{
        status: string;
        risk: number;
        severity: string;
        message: string;
    }>;
}
