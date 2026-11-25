import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { UpdateIntakeDto } from './dto/update-intake.dto';

@Injectable()
export class RecordsService {
  private readonly logger = new Logger(RecordsService.name);

  // In-memory fallback
  private memoryPatientProfiles = new Map<string, any>();

  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves complete patient medical record and consultations
   */
  async getPatientRecord(patientId: string) {
    if (this.prisma.isConnected) {
      try {
        const user = await this.prisma.user.findUnique({
          where: { id: patientId },
          include: {
            patient_profile: true,
            patient_bookings: {
              include: {
                consultation: {
                  include: { prescriptions: true },
                },
                doctor: {
                  include: { doctor_profile: true },
                },
              },
              orderBy: { created_at: 'desc' },
            },
          },
        });
        if (user) return user;
      } catch (err: any) {
        this.logger.warn(`Failed to fetch patient record from DB: ${err?.message}`);
      }
    }

    const mem = this.memoryPatientProfiles.get(patientId);
    if (mem) return mem;

    throw new NotFoundException(`Patient record for ${patientId} not found`);
  }

  /**
   * Updates clinical intake details
   */
  async updatePatientIntake(patientId: string, dto: UpdateIntakeDto) {
    const mergedAllergies = [
      ...(Array.isArray(dto.allergies) ? dto.allergies : dto.allergies ? [dto.allergies] : []),
      ...(dto.other_allergy?.trim() ? [dto.other_allergy.trim()] : []),
    ];
    const baseConditions = dto.existing_conditions ?? dto.chronic_conditions;
    const mergedConditions = [
      ...(Array.isArray(baseConditions) ? baseConditions : baseConditions ? [baseConditions] : []),
      ...(dto.other_condition?.trim() ? [dto.other_condition.trim()] : []),
    ];

    if (this.prisma.isConnected) {
      try {
        if (dto.full_name?.trim()) {
          await this.prisma.user.update({
            where: { id: patientId },
            data: { name: dto.full_name.trim() },
          });
        }
        const profile = await this.prisma.patientProfile.upsert({
          where: { user_id: patientId },
          create: {
            user_id: patientId,
            date_of_birth: dto.date_of_birth ? new Date(dto.date_of_birth) : undefined,
            preferred_languages: dto.preferred_languages || ['English'],
            allergies: mergedAllergies,
            existing_conditions: mergedConditions,
            current_medications: dto.current_medications,
          },
          update: {
            date_of_birth: dto.date_of_birth ? new Date(dto.date_of_birth) : undefined,
            preferred_languages: dto.preferred_languages,
            allergies: mergedAllergies,
            existing_conditions: mergedConditions,
            current_medications: dto.current_medications,
          },
        });

        return {
          success: true,
          profile,
          message: 'Clinical intake form updated successfully.',
        };
      } catch (err: any) {
        this.logger.warn(`Failed to update patient intake in DB: ${err?.message}`);
      }
    }

    // Memory fallback
    const mem = {
      user_id: patientId,
      full_name: dto.full_name,
      date_of_birth: dto.date_of_birth,
      preferred_languages: dto.preferred_languages || ['English'],
      allergies: mergedAllergies,
      existing_conditions: mergedConditions,
      current_medications: dto.current_medications,
    };
    this.memoryPatientProfiles.set(patientId, mem);

    return {
      success: true,
      profile: mem,
      message: 'Clinical intake form updated successfully.',
    };
  }

  /**
   * Retrieves NDPR Audit Log entries for Admin
   */
  async getAuditLogs(limit = 100) {
    if (this.prisma.isConnected) {
      try {
        return await this.prisma.auditLog.findMany({
          take: limit,
          orderBy: { timestamp: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                public_id: true,
                name: true,
                role: true,
              },
            },
          },
        });
      } catch (err: any) {
        this.logger.warn(`Failed to fetch audit logs: ${err?.message}`);
      }
    }
    return [];
  }
}
