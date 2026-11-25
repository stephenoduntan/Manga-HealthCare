import { IsArray, IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateIntakeDto {
  @IsOptional()
  @IsString()
  full_name?: string;

  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @IsOptional()
  @IsArray()
  preferred_languages?: string[];

  @IsOptional()
  allergies?: any;

  @IsOptional()
  @IsString()
  other_allergy?: string;

  @IsOptional()
  existing_conditions?: any;

  @IsOptional()
  chronic_conditions?: any;

  @IsOptional()
  @IsString()
  other_condition?: string;

  @IsOptional()
  current_medications?: any;
}
