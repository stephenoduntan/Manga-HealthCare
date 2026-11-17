import { IsArray, IsDateString, IsOptional } from 'class-validator';

export class UpdateIntakeDto {
  @IsOptional()
  @IsDateString()
  date_of_birth?: string;

  @IsOptional()
  @IsArray()
  preferred_languages?: string[];

  @IsOptional()
  allergies?: any;

  @IsOptional()
  existing_conditions?: any;

  @IsOptional()
  current_medications?: any;
}
