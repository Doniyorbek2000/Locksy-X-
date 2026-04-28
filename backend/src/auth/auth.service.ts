import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(password: string) {
    try {
      // .env dagi JWT_SECRET borligini tekshirish
      const secret = process.env.JWT_SECRET || 'fallback_secret_for_dev';

      console.log('Login attempt with password');

      if (password === 'adm12') {
        const payload = { username: 'admin', role: 'SUPERUSER' };
        return {
          access_token: this.jwtService.sign(payload, { secret: secret }),
        };
      }
      throw new UnauthorizedException('Parol noto\'g\'ri!');
    } catch (error) {
      console.error('Login xatosi:', error.message);
      throw error;
    }
  }
}
