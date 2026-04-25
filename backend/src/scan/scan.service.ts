import { Injectable } from '@nestjs/common';
import { ThreatsService } from '../threats/threats.service';

@Injectable()
export class ScanService {
  constructor(private readonly threatsService: ThreatsService) {}

  async scanApk(data: { packageName: string; hash?: string; permissions?: string[] }) {
    const existingThreat = await this.threatsService.checkApp(data.packageName);
    if (existingThreat) {
      return {
        status: existingThreat.riskLevel,
        risk: existingThreat.riskScore,
        package: existingThreat.packageName,
        message: 'This app is known in our database.',
      };
    }

    // Mock AI analysis based on permissions and heuristics
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
      } else if (matched.length > 0) {
        risk = 75;
        status = 'HIGH RISK';
        severity = 'MEDIUM';
      }
    }

    // Specific dangerous packages (example)
    const blacklistedPackages = ['com.scam.spy', 'com.malware.keylogger', 'com.unknown.spyware'];
    if (blacklistedPackages.includes(data.packageName)) {
      risk = 100;
      status = 'DANGEROUS';
      severity = 'CRITICAL';
    }

    // Save to database
    await this.threatsService.addThreatApp({ packageName: data.packageName, riskScore: risk, riskLevel: status, severity, permissions: data.permissions || [] });

    return {
      status,
      risk,
      severity,
      package: data.packageName,
      message: severity === 'CRITICAL' ? 'CRITICAL THREAT! Immediate action required.' : 'Scanned using heuristic patterns.',
    };
  }

  async scanUrl(url: string) {
    let domain = url;
    try {
      if (url.includes('://')) {
        const parsed = new URL(url);
        domain = parsed.hostname;
      }
    } catch (e) {
      // ignore
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

    // Heuristics for suspicious domains
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
}
