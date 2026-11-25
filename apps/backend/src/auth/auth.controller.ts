import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RequestOtpDto } from './dto/request-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { ConsentDto } from './dto/consent.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('otp/request')
  @HttpCode(HttpStatus.OK)
  async requestOtp(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto);
  }

  @Public()
  @Post('request-otp')
  @HttpCode(HttpStatus.OK)
  async requestOtpLegacy(@Body() dto: RequestOtpDto) {
    return this.authService.requestOtp(dto);
  }

  @Public()
  @Post('otp/verify')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() dto: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.verifyOtp(dto);
    this.setRefreshCookie(res, result.refresh_token);
    return result;
  }

  @Public()
  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtpLegacy(@Body() dto: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.verifyOtp(dto);
    this.setRefreshCookie(res, result.refresh_token);
    return result;
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body() body: { refresh_token?: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const cookieToken = this.extractCookie(req, 'manga_refresh_token');
    const refreshToken = body?.refresh_token || cookieToken;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }
    const result = await this.authService.refreshAccessToken(refreshToken);
    this.setRefreshCookie(res, result.refresh_token);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Body() body: { refresh_token?: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = body?.refresh_token || this.extractCookie(req, 'manga_refresh_token');
    if (refreshToken) {
      await this.authService.logout(refreshToken);
    }
    res.clearCookie('manga_refresh_token', { path: '/' });
    return { success: true, message: 'Logged out and refresh session invalidated.' };
  }

  @UseGuards(JwtAuthGuard)
  @Post('consent')
  @HttpCode(HttpStatus.OK)
  async updateConsent(@CurrentUser('id') userId: string, @Body() dto: ConsentDto) {
    return this.authService.updateConsent(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getProfile(@CurrentUser('id') userId: string) {
    return this.authService.getProfile(userId);
  }

  private setRefreshCookie(res: Response, refreshToken: string) {
    res.cookie('manga_refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    });
  }

  private extractCookie(req: Request, name: string): string | undefined {
    const header = req.headers?.cookie;
    if (!header) return undefined;
    for (const part of header.split(';')) {
      const [k, ...rest] = part.trim().split('=');
      if (k === name) return decodeURIComponent(rest.join('='));
    }
    return undefined;
  }
}
