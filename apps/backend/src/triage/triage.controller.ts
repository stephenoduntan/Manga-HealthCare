import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { TriageService } from './triage.service';
import { EvaluateTriageDto } from './dto/evaluate-triage.dto';
import { Public } from '../common/decorators/public.decorator';
import { RED_FLAG_SYMPTOMS } from '@manga/api-contract';

@Controller('api/v1/triage')
export class TriageController {
  constructor(private readonly triageService: TriageService) {}

  @Public()
  @Get('checklist')
  getChecklist() {
    return {
      symptoms: RED_FLAG_SYMPTOMS,
      emergency_disclaimer:
        'Telehealth consultations are NOT for life-threatening emergencies. If you experience any of these 8 red-flag symptoms, call 112 or Lagos Ambulance (767) immediately.',
    };
  }

  @Public()
  @Get('symptoms')
  getRedFlagSymptoms() {
    return {
      symptoms: RED_FLAG_SYMPTOMS,
    };
  }

  @Public()
  @Post('evaluate')
  @HttpCode(HttpStatus.OK)
  async evaluate(@Body() dto: EvaluateTriageDto, @Req() req: any) {
    const currentUserId = req?.user?.id || req?.user?.sub;
    return this.triageService.evaluate(dto, currentUserId);
  }

  @Public()
  @Post('clarify')
  @HttpCode(HttpStatus.OK)
  async clarify(@Body() dto: EvaluateTriageDto, @Req() req: any) {
    const currentUserId = req?.user?.id || req?.user?.sub;
    return this.triageService.evaluate(dto, currentUserId);
  }
}
