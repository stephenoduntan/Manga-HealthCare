import { IsBoolean } from 'class-validator';

export class ConsentDto {
  @IsBoolean()
  telemedicine_consent: boolean;

  @IsBoolean()
  ndpr_consent: boolean;
}
