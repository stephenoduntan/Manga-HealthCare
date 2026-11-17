import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ConsultationMode } from '@prisma/client';

export class StartConsultationDto {
  @IsNotEmpty()
  @IsString()
  booking_id: string;

  @IsOptional()
  @IsEnum(ConsultationMode)
  mode?: ConsultationMode;
}
