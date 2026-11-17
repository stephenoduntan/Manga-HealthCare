import {
  IsArray,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class StructuredClinicalNoteDto {
  @IsNotEmpty()
  @IsString()
  chief_complaint: string;

  @IsNotEmpty()
  @IsString()
  history_of_present_illness: string;

  @IsNotEmpty()
  @IsString()
  assessment: string;

  @IsNotEmpty()
  @IsString()
  plan: string;
}

export class LabRequestItemDto {
  @IsNotEmpty()
  @IsString()
  test_name: string;

  @IsOptional()
  @IsString()
  clinical_indication?: string;

  @IsOptional()
  @IsString()
  urgency?: 'ROUTINE' | 'URGENT';
}

export class SaveNotesDto {
  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => StructuredClinicalNoteDto)
  notes: StructuredClinicalNoteDto;

  @IsOptional()
  @IsString()
  referral_note?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LabRequestItemDto)
  lab_requests?: LabRequestItemDto[];
}
