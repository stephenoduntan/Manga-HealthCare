import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class RequestOtpDto {
  @IsNotEmpty()
  @IsString()
  identifier: string; // Phone number (+234...), Email, or Public ID (PAT-XXXX, DOC-XXXX, LOC-XXXX, PRT-XXXX, ADM-XXXX)

  @IsOptional()
  @IsString()
  role?: Role;

  @IsOptional()
  @IsString()
  login_mode?: string;

  @IsOptional()
  @IsString()
  rbac_role?: string;
}
