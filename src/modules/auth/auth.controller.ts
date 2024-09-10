import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/currentUser.decorator';
import { UserDTO } from '../users/dto/user.dto';
import { AuthService } from './auth.service';
import { AuthDTO, TokenValidType } from './dto/auth.dto';
import { AuthInput } from './dto/auth.input.dto';

@ApiBearerAuth()
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('authenticated')
  @ApiOperation({ summary: 'Authenticated System' })
  @ApiResponse({
    status: 201,
    description: 'Successfully Logged In',
    type: AuthDTO,
  })
  public async authenticated(@Body() data: AuthInput): Promise<AuthDTO> {
    return await this.authService.validateUser(data);
  }

  @Get('isTokenValid/:token')
  @ApiOperation({ summary: 'Valid Token' })
  @ApiResponse({
    status: 200,
    description: 'Token Valid',
    type: TokenValidType,
  })
  public async isTokenValid(
    @Param('token') token: string,
  ): Promise<TokenValidType> {
    return await this.authService.validateToken(token);
  }

  @Get('me')
  @ApiExcludeEndpoint()
  public async me(@CurrentUser() user: UserDTO): Promise<UserDTO> {
    return user;
  }
}
