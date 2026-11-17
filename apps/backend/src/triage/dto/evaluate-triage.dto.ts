import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { RedFlagCode } from '@manga/api-contract';

export class EvaluateTriageDto {
  @IsOptional()
  @IsString()
  patient_id?: string;

  @IsArray()
  selected_red_flags: RedFlagCode[];

  @IsNotEmpty()
  @IsString()
  chief_complaint: string;

  @IsOptional()
  @IsString()
  clarification_response?: string;
}
