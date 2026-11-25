import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class VerifyOtpDto {
  @IsNotEmpty()
  @IsString()
  identifier: string;

  @IsNotEmpty()
  @IsString()
  otp: string;

  @IsOptional()
  @IsString()
  login_mode?: string;

  @IsOptional()
  @IsBoolean()
  is_new_user?: boolean;

  @IsOptional()
  @IsString()
  intent?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  role?: Role;

  @IsOptional()
  @IsString()
  rbac_role?: string;

  @IsOptional()
  @IsString()
  totp_code?: string;

  @IsOptional()
  @IsString()
  facility_name?: string;

  @IsOptional()
  @IsString()
  partner_type?: string;

  @IsOptional()
  @IsString()
  fcm_token?: string;

  @IsOptional()
  @IsBoolean()
  is_locum?: boolean;

  @IsOptional()
  @IsString()
  mdcn_license_number?: string;

  @IsOptional()
  @IsString()
  specialty?: string;

  @IsOptional()
  @IsString()
  medical_degree_details?: string;

  @IsOptional()
  @IsNumber()
  consultation_fee?: number;

  @IsOptional()
  @IsNumber()
  followup_fee?: number;
}
