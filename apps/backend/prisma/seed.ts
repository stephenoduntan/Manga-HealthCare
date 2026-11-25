import { PrismaClient, Role, VerificationStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding MANGA HEALTHCARE database...');

  // 1. Admin / Ops Staff
  await prisma.user.upsert({
    where: { public_id: 'ADM-0001' },
    update: {},
    create: {
      public_id: 'ADM-0001',
      role: Role.ADMIN,
      name: 'Manga Operations Lead',
      phone: '+2348000000001',
      email: 'ops@mangahealthcare.com',
      auth_id: 'seed_admin_001',
      telemedicine_consent: true,
      ndpr_consent: true,
      consent_accepted_at: new Date(),
    },
  });

  // 2. Verified General Practitioner
  await prisma.user.upsert({
    where: { public_id: 'DOC-1001' },
    update: {},
    create: {
      public_id: 'DOC-1001',
      role: Role.DOCTOR,
      name: 'Dr. Chioma Adebayo',
      phone: '+2348000000002',
      email: 'chioma.adebayo@mangahealthcare.com',
      auth_id: 'seed_doc_001',
      telemedicine_consent: true,
      ndpr_consent: true,
      doctor_profile: {
        create: {
          specialty: 'Family Medicine',
          is_locum: false,
          mdcn_license_number: 'MDCN-78901',
          medical_degree_details: 'MBBS (University of Lagos), FWACP',
          verification_status: VerificationStatus.VERIFIED,
          is_online: true,
          languages: ['English', 'Yoruba', 'Igbo'],
          consultation_fee: 10000,
          followup_fee: 5000,
        },
      },
    },
  });

  // 3. Verified On-Demand Locum Doctor
  await prisma.user.upsert({
    where: { public_id: 'LOC-9941' },
    update: {},
    create: {
      public_id: 'LOC-9941',
      role: Role.LOCUM,
      name: 'Dr. Chidi Okafor',
      phone: '+2348000000003',
      email: 'chidi.okafor@mangahealthcare.com',
      auth_id: 'seed_locum_001',
      telemedicine_consent: true,
      ndpr_consent: true,
      doctor_profile: {
        create: {
          specialty: 'General Practice & Emergency Medicine',
          is_locum: true,
          mdcn_license_number: 'MDCN-78320',
          medical_degree_details: 'MBBS (University of Ibadan), FWACS',
          verification_status: VerificationStatus.VERIFIED,
          is_online: true,
          languages: ['English', 'Igbo'],
          consultation_fee: 10000,
          followup_fee: 5000,
        },
      },
    },
  });

  // 4. Verified Mental Health Therapist
  await prisma.user.upsert({
    where: { public_id: 'DOC-2001' },
    update: {},
    create: {
      public_id: 'DOC-2001',
      role: Role.THERAPIST,
      name: 'Dr. Tolu Adeyemi',
      phone: '+2348000000004',
      email: 'tolu.adeyemi@mangahealthcare.com',
      auth_id: 'seed_therapist_001',
      telemedicine_consent: true,
      ndpr_consent: true,
      doctor_profile: {
        create: {
          specialty: 'Mental Health & Therapy',
          is_locum: false,
          mdcn_license_number: 'MDCN-55102',
          medical_degree_details: 'MBBS, MSc Clinical Psychiatry',
          verification_status: VerificationStatus.VERIFIED,
          is_online: false,
          languages: ['English', 'Yoruba'],
          consultation_fee: 15000,
          followup_fee: 7500,
        },
      },
    },
  });

  // 5. Verified Partner Pharmacy
  await prisma.user.upsert({
    where: { public_id: 'PRT-0101' },
    update: {},
    create: {
      public_id: 'PRT-0101',
      role: Role.PARTNER,
      name: 'MedPlus Pharmacy Victoria Island',
      phone: '+2348000000005',
      email: 'vi-dispensary@medplus.ng',
      auth_id: 'seed_partner_001',
      telemedicine_consent: true,
      ndpr_consent: true,
    },
  });

  // 6. Sample Consented Patient
  await prisma.user.upsert({
    where: { public_id: 'PAT-48291' },
    update: {},
    create: {
      public_id: 'PAT-48291',
      role: Role.PATIENT,
      name: 'Amaka Adeleke',
      phone: '+2348012345678',
      email: 'amaka.adeleke@example.com',
      auth_id: 'seed_patient_001',
      telemedicine_consent: true,
      ndpr_consent: true,
      consent_accepted_at: new Date(),
      patient_profile: {
        create: {
          preferred_languages: ['English', 'Pidgin'],
          allergies: ['Penicillin'],
          existing_conditions: ['Mild seasonal asthma'],
          current_medications: ['Salbutamol inhaler PRN'],
        },
      },
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
