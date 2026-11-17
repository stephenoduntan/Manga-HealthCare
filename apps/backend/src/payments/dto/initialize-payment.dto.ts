import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
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
  callback_url?: string;
}
