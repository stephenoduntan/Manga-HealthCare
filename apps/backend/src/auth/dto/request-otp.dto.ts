import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Role } from '@prisma/client';

export class RequestOtpDto {
  @IsNotEmpty()
  @IsString()
  identifier: string; // Phone number (+234...), Email (user@domain.com), or Public ID (PAT-XXXX, DOC-XXXX, LOC-XXXX)

  @IsOptional()
  @IsString()
  role?: Role;
}
