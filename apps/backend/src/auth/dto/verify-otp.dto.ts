import { IsNotEmpty, IsOptional, IsString, IsBoolean, IsNumber } from 'class-validator';
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
