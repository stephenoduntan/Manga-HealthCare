import { IsBoolean, IsOptional } from 'class-validator';

export class ConsentDto {
  @IsBoolean()
  telemedicine_consent: boolean;

  @IsBoolean()
  ndpr_consent: boolean;

  @IsOptional()
  @IsBoolean()
  terms_accepted?: boolean;
}
