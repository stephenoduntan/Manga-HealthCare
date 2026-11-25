import { Global, Module } from '@nestjs/common';
import { PaystackAdapter } from './paystack.adapter';
import { FlutterwaveAdapter } from './flutterwave.adapter';
import { DailyAdapter } from './daily.adapter';
import { TermiiAdapter } from './termii.adapter';
import { ResendAdapter } from './resend.adapter';
import { FcmAdapter } from './fcm.adapter';
import { S3Adapter } from './s3.adapter';
import { ObservabilityAdapter } from './observability.adapter';

@Global()
@Module({
  providers: [
    PaystackAdapter,
    FlutterwaveAdapter,
    DailyAdapter,
    TermiiAdapter,
    ResendAdapter,
    FcmAdapter,
    S3Adapter,
    ObservabilityAdapter,
  ],
  exports: [
    PaystackAdapter,
    FlutterwaveAdapter,
    DailyAdapter,
    TermiiAdapter,
    ResendAdapter,
    FcmAdapter,
    S3Adapter,
    ObservabilityAdapter,
  ],
})
export class IntegrationsModule {}
