import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(password: string) {
    // Professional darajada bu parol hash qilingan holda bazada saqlanishi kerak.
    // Hozircha loyihani tezroq ishga tushirish uchun .env dan yoki konstantadan foydalanamiz.
    if (password === 'adm12') {
      const payload = { username: 'admin', role: 'SUPERUSER' };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException('Parol noto\'g\'ri!');
  }
}
