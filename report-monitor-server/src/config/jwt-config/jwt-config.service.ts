import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/schemas/user.schema';


@Injectable()
export class JwtConfigService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: User) {

    const payload = { username: user.username, sub: user.userid };

    return {
      user:{
          username:user.username,
          userid:user.userid,
          level:user.level
      },
      access_token: this.jwtService.sign(payload),
    };
  }
}
