import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Flutterwave v3 payment failover adapter + verif-hash webhook verification.
 */
@Injectable()
export class FlutterwaveAdapter {
  private readonly logger = new Logger(FlutterwaveAdapter.name);
  private readonly baseUrl = 'https://api.flutterwave.com/v3';

  constructor(private readonly configService: ConfigService) {}

  async initializePayment(params: {
    email: string;
    phone: string;
    name: string;
    amountNaira: number;
    txRef: string;
    paymentOptions?: string;
  }): Promise<{ link: string; tx_ref: string; live: boolean }> {
    const secretKey = this.configService.get<string>('FLUTTERWAVE_SECRET_KEY');
    if (!secretKey || secretKey.includes('...')) {
      return {
        link: `https://checkout.flutterwave.com/v3/hosted/pay/${params.txRef}`,
        tx_ref: params.txRef,
        live: false,
      };
    }

    try {
      const response = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_ref: params.txRef,
          amount: params.amountNaira,
          currency: 'NGN',
          payment_options: params.paymentOptions || 'card,banktransfer,ussd',
          customer: {
            email: params.email,
            phonenumber: params.phone,
            name: params.name,
          },
        }),
      });
      const json: any = await response.json();
      if (json?.status === 'success' && json?.data?.link) {
        return { link: json.data.link, tx_ref: params.txRef, live: true };
      }
      this.logger.warn(`Flutterwave initialize fallback: ${json?.message}`);
    } catch (err: any) {
      this.logger.warn(`Flutterwave initialize error: ${err?.message}`);
    }

    return {
      link: `https://checkout.flutterwave.com/v3/hosted/pay/${params.txRef}`,
      tx_ref: params.txRef,
      live: false,
    };
  }

  verifyWebhookSignature(verifHash?: string): boolean {
    const expectedHash = this.configService.get<string>('FLUTTERWAVE_SECRET_HASH');
    if (!expectedHash) {
      return true;
    }
    return Boolean(verifHash && verifHash === expectedHash);
  }
}
