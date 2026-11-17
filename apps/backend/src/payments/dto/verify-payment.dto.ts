import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaymentProvider } from '@prisma/client';

export class VerifyPaymentDto {
  @IsNotEmpty()
  @IsString()
  reference: string;

  @IsOptional()
  @IsEnum(PaymentProvider)
  provider?: PaymentProvider;
}
