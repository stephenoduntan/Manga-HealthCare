import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentProvider } from '@prisma/client';

export class InitializePaymentDto {
  @IsNotEmpty()
  @IsString()
  booking_id: string;

  @IsNotEmpty()
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @IsOptional()
  @IsString()
  channel?: 'CARD' | 'BANK_TRANSFER' | 'TRANSFER' | 'USSD';

  @IsOptional()
  @IsBoolean()
  is_followup?: boolean;

  @IsOptional()
  @IsString()
  callback_url?: string;
}
