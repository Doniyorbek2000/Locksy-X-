import { ScanService } from './scan.service';
export declare class ScanController {
    private readonly scanService;
    constructor(scanService: ScanService);
    scanApk(body: {
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
