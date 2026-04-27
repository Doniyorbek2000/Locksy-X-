import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(password: string) {
    try {
      // .env dagi JWT_SECRET borligini tekshirish
      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET o\'rnatilmagan!');
        throw new Error('Server sozlamalarida xatolik bor (JWT)');
      }

      if (password === 'adm12') {
        const payload = { username: 'admin', role: 'SUPERUSER' };
        return {
          access_token: this.jwtService.sign(payload),
        };
      }
      throw new UnauthorizedException('Parol noto\'g\'ri!');
    } catch (error) {
      console.error('Login xatosi:', error.message);
      throw error;
    }
  }
}
