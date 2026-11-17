import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateSlotDto {
  @IsNotEmpty()
  @IsDateString()
  start_time: string;

  @IsNotEmpty()
  @IsDateString()
  end_time: string;
}
