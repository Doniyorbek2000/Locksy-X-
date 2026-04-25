"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanService = void 0;
const common_1 = require("@nestjs/common");
const threats_service_1 = require("../threats/threats.service");
let ScanService = class ScanService {
    threatsService;
    constructor(threatsService) {
        this.threatsService = threatsService;
    }
    async scanApk(data) {
        const existingThreat = await this.threatsService.checkApp(data.packageName);
        if (existingThreat) {
            return {
                status: existingThreat.riskLevel,
                risk: existingThreat.riskScore,
                package: existingThreat.packageName,
                message: 'This app is known in our database.',
            };
        }
        let risk = 10;
        let status = 'SAFE';
        let severity = 'LOW';
        if (data.permissions) {
            const dangerousPerms = ['READ_SMS', 'SYSTEM_ALERT_WINDOW', 'RECEIVE_BOOT_COMPLETED', 'READ_CONTACTS', 'PROCESS_OUTGOING_CALLS'];
            const matched = data.permissions.filter(p => dangerousPerms.includes(p));
            if (matched.length >= 3) {
                risk = 95;
                status = 'DANGEROUS';
                severity = 'CRITICAL';
            }
            else if (matched.length > 0) {
                risk = 75;
                status = 'HIGH RISK';
                severity = 'MEDIUM';
            }
        }
        const blacklistedPackages = ['com.scam.spy', 'com.malware.keylogger', 'com.unknown.spyware'];
        if (blacklistedPackages.includes(data.packageName)) {
            risk = 100;
            status = 'DANGEROUS';
            severity = 'CRITICAL';
        }
        await this.threatsService.addThreatApp({ packageName: data.packageName, riskScore: risk, riskLevel: status, severity, permissions: data.permissions || [] });
        return {
            status,
            risk,
            severity,
            package: data.packageName,
            message: severity === 'CRITICAL' ? 'CRITICAL THREAT! Immediate action required.' : 'Scanned using heuristic patterns.',
        };
    }
    async scanUrl(url) {
        let domain = url;
        try {
            if (url.includes('://')) {
                const parsed = new URL(url);
                domain = parsed.hostname;
            }
        }
        catch (e) {
        }
        const existingThreat = await this.threatsService.checkUrl(domain);
        if (existingThreat) {
            return {
                status: existingThreat.type === 'SAFE' ? 'SAFE' : 'DANGEROUS',
                risk: existingThreat.riskScore,
                severity: existingThreat.severity || 'LOW',
                message: 'This URL is known in our database.',
            };
        }
        let risk = 5;
        let status = 'SAFE';
        let severity = 'LOW';
        const suspiciousKeywords = ['scam', 'phish', 'login-verify', 'secure-update', 'bank-online'];
        if (suspiciousKeywords.some(kw => domain.toLowerCase().includes(kw))) {
            risk = 85;
            status = 'DANGEROUS';
            severity = 'HIGH';
        }
        if (domain.length > 30 && (domain.match(/\d/g) || []).length > 5) {
            risk = 70;
            status = 'SUSPICIOUS';
            severity = 'MEDIUM';
        }
        await this.threatsService.addThreatUrl({ domain, riskScore: risk, type: status, severity });
        return { status, risk, severity, message: status === 'DANGEROUS' ? 'Highly suspicious domain pattern detected.' : 'URL seems safe.' };
    }
};
exports.ScanService = ScanService;
exports.ScanService = ScanService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [threats_service_1.ThreatsService])
], ScanService);
//# sourceMappingURL=scan.service.js.map