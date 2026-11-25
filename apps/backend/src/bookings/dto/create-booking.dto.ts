import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { BookingType } from '@prisma/client';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  triage_clearance_token: string;

  @IsNotEmpty()
  @IsEnum(BookingType)
  booking_type: BookingType;

  @IsOptional()
  @IsString()
  doctor_id?: string;

  @IsOptional()
  @IsString()
  slot_id?: string;

  @IsOptional()
  @IsString()
  slot_label?: string;

  @IsOptional()
  @IsString()
  consultation_mode?: string;

  @IsOptional()
  @IsBoolean()
  is_followup?: boolean;

  @IsOptional()
  @IsString()
  specialty?: string;
}
