import { Test } from '@nestjs/testing';
import { AppModule } from './app.module';
import { HealthController } from './health.controller';
import { PatientsController } from './patients/patients.module';
import { DoctorsController } from './doctors/doctors.module';
import { ClinicalDocsController } from './clinical-docs/clinical-docs.module';
import { WebhooksController } from './webhooks/webhooks.module';
import { ConsultationChatGateway } from './consultations/chat.gateway';

describe('AppModule DI & Bootstrap Verification', () => {
  it('should compile full AppModule with all controllers, guards, interceptors, filters, and WS gateway', async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    expect(moduleRef.get(HealthController)).toBeDefined();
    expect(moduleRef.get(PatientsController)).toBeDefined();
    expect(moduleRef.get(DoctorsController)).toBeDefined();
    expect(moduleRef.get(ClinicalDocsController)).toBeDefined();
    expect(moduleRef.get(WebhooksController)).toBeDefined();
    expect(moduleRef.get(ConsultationChatGateway)).toBeDefined();

    const root = moduleRef.get(HealthController).getRootInfo();
    expect(root.status).toBe('ok');
    expect(root.docs).toBe('/api/docs');

    const health = moduleRef.get(HealthController).getApiHealth();
    expect(health.status).toBe('ok');
    expect(health.service).toBe('manga-healthcare-backend');

    await moduleRef.close();
  });
});
