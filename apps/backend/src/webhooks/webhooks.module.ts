import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Logger,
  Module,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { PaymentsModule } from '../payments/payments.module';
import { PaymentsService } from '../payments/payments.service';
import { PaystackAdapter } from '../integrations/paystack.adapter';
import { FlutterwaveAdapter } from '../integrations/flutterwave.adapter';
import { Public } from '../common/decorators/public.decorator';
import { PrismaService } from '../common/prisma/prisma.service';

/**
 * Inbound third-party webhook controller (Paystack, Flutterwave, Daily.co).
 */
@Controller('api/v1/webhooks')
export class WebhooksController {
  private readonly logger = new Logger(WebhooksController.name);

  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly paystack: PaystackAdapter,
    private readonly flutterwave: FlutterwaveAdapter,
    private readonly prisma: PrismaService,
  ) {}

  @Public()
  @Post('paystack')
  @HttpCode(HttpStatus.OK)
  async handlePaystackWebhook(
    @Body() body: any,
    @Headers('x-paystack-signature') signature?: string,
  ) {
    if (!this.paystack.verifyWebhookSignature(body, signature)) {
      throw new UnauthorizedException('Invalid Paystack webhook signature');
    }
    return this.paymentsService.handleWebhook(body, signature);
  }

  @Public()
  @Post('flutterwave')
  @HttpCode(HttpStatus.OK)
  async handleFlutterwaveWebhook(
    @Body() body: any,
    @Headers('verif-hash') verifHash?: string,
  ) {
    if (!this.flutterwave.verifyWebhookSignature(verifHash)) {
      throw new UnauthorizedException('Invalid Flutterwave webhook signature');
    }
    return this.paymentsService.handleWebhook(body, verifHash);
  }

  @Public()
  @Post('daily')
  @HttpCode(HttpStatus.OK)
  async handleDailyWebhook(@Body() body: any) {
    const eventType = body?.type || body?.event || 'unknown';
    const roomName = body?.payload?.room_name || body?.room_name;
    this.logger.log(`[DAILY WEBHOOK] Event: ${eventType} | Room: ${roomName || 'N/A'}`);

    if (this.prisma.isConnected && roomName?.startsWith('manga-room-')) {
      const bookingPrefix = roomName.replace('manga-room-', '');
      const recentConsultations = await this.prisma.consultation.findMany({
        where: { end_time: null },
        take: 100,
        orderBy: { created_at: 'desc' },
      });
      const consultation = recentConsultations.find((c) => c.booking_id.startsWith(bookingPrefix));
      if (consultation) {
        if (eventType === 'meeting.started' && !consultation.start_time) {
          await this.prisma.consultation.update({
            where: { id: consultation.id },
            data: { start_time: new Date() },
          });
        } else if (eventType === 'meeting.ended' && !consultation.end_time) {
          await this.prisma.consultation.update({
            where: { id: consultation.id },
            data: { end_time: new Date() },
          });
        }
      }
    }

    return { received: true, event: eventType, room_name: roomName || null };
  }
}

@Module({
  imports: [PaymentsModule],
  controllers: [WebhooksController],
})
export class WebhooksModule {}
