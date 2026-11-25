import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateSlotDto {
  @IsOptional()
  @IsDateString()
  start_time?: string;

  @IsOptional()
  @IsDateString()
  end_time?: string;

  @IsOptional()
  @IsString()
  day?: string;

  @IsOptional()
  @IsString()
  time_range?: string;

  @IsOptional()
  @IsString()
  slot_type?: 'GENERAL' | 'THERAPY_MANDATORY';
}
