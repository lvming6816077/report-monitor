import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: { username: string; userId: string }) {

    const payload = { username: user.username, sub: user.userId };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
