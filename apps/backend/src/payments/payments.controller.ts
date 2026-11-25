import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitializePaymentDto } from './dto/initialize-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('api/v1/payments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initialize')
  @Roles('PATIENT', 'ADMIN')
  @HttpCode(HttpStatus.OK)
  async initializePayment(@Body() dto: InitializePaymentDto) {
    return this.paymentsService.initializePayment(dto);
  }

  @Get('verify/:reference')
  @Roles('PATIENT', 'ADMIN')
  async verifyPaymentByParam(@Param('reference') reference: string) {
    return this.paymentsService.verifyPayment({ reference });
  }

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(dto);
  }

  @Public()
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Body() body: any,
    @Headers('x-paystack-signature') paystackSig?: string,
    @Headers('verif-hash') flutterwaveSig?: string,
  ) {
    const signature = paystackSig || flutterwaveSig;
    return this.paymentsService.handleWebhook(body, signature);
  }

  @Get('doctor/ledger')
  @Roles('DOCTOR', 'LOCUM', 'THERAPIST', 'ADMIN')
  async getDoctorLedger(@CurrentUser('id') doctorId: string) {
    return this.paymentsService.getDoctorLedger(doctorId);
  }

  @Get('breakdown/:bookingId')
  @Roles('PATIENT', 'DOCTOR', 'LOCUM', 'THERAPIST', 'ADMIN')
  async getFeeBreakdown(@Param('bookingId') bookingId: string) {
    return this.paymentsService.calculateFeeAndSplit(bookingId);
  }
}
