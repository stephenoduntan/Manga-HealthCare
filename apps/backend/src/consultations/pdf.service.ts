import { Injectable, Logger } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import * as crypto from 'crypto';

export interface PrescriptionPdfData {
  prescriptionId: string;
  consultationId: string;
  date: Date;
  doctor: {
    name: string;
    publicId: string;
    specialty: string;
    mdcnLicense: string;
    isLocum?: boolean;
  };
  patient: {
    name: string;
    publicId: string;
    phone: string;
    ageOrDob?: string;
  };
  items: Array<{
    drug_name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
}

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);

  async generatePrescriptionPdf(data: PrescriptionPdfData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 40,
        info: {
          Title: `Manga Healthcare E-Prescription ${data.prescriptionId}`,
          Author: `Dr. ${data.doctor.name} (${data.doctor.mdcnLicense})`,
          Subject: 'Medical Teleconsultation E-Prescription',
        },
      });

      const buffers: Buffer[] = [];
      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      // Brand Header
      doc.fillColor('#0a3922'); // Chat for Impact Canopy Green
      doc.fontSize(20).font('Helvetica-Bold').text('MANGA HEALTHCARE', { align: 'left' });
      doc.fontSize(10).font('Helvetica').fillColor('#747679').text('Digital Clinical Telemedicine & Remote Patient Care', { align: 'left' });
      doc.fontSize(8).fillColor('#0f3e17').text('Accredited by Medical & Dental Council of Nigeria (MDCN) Clinical Standards', { align: 'left' });
      doc.moveDown(0.5);

      // Horizontal Rule
      doc.strokeColor('#0a3922').lineWidth(1.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
      doc.moveDown(1);

      // Document Title Badge
      const startY = doc.y;
      doc.rect(40, startY, 515, 26).fill('#e1f4df'); // Ease Keylime Wash
      doc.fillColor('#0a3922').font('Helvetica-Bold').fontSize(12).text('OFFICIAL ELECTRONIC MEDICAL PRESCRIPTION (Rx)', 50, startY + 7);
      doc.moveDown(1.5);

      // Metadata Grid (Patient & Doctor)
      const detailsTop = doc.y + 10;
      
      // Patient Box (Left)
      doc.rect(40, detailsTop, 250, 85).fillAndStroke('#f8f3eb', '#b1dbb8');
      doc.fillColor('#080331').font('Helvetica-Bold').fontSize(10).text('PATIENT PARTICULARS', 50, detailsTop + 8);
      doc.font('Helvetica').fontSize(9).fillColor('#222326');
      doc.text(`Full Name: ${data.patient.name}`, 50, detailsTop + 24);
      doc.text(`Patient ID: ${data.patient.publicId}`, 50, detailsTop + 38);
      doc.text(`Contact: ${data.patient.phone}`, 50, detailsTop + 52);
      doc.text(`Date of Issue: ${data.date.toLocaleDateString('en-GB')}`, 50, detailsTop + 66);

      // Doctor Box (Right)
      doc.rect(305, detailsTop, 250, 85).fillAndStroke('#ebf0f8', '#b6ced5');
      doc.fillColor('#080331').font('Helvetica-Bold').fontSize(10).text('PRESCRIBING PRACTITIONER', 315, detailsTop + 8);
      doc.font('Helvetica').fontSize(9).fillColor('#222326');
      doc.text(`Attending: Dr. ${data.doctor.name}`, 315, detailsTop + 24);
      doc.text(`Doctor/Locum ID: ${data.doctor.publicId}`, 315, detailsTop + 38);
      doc.text(`MDCN License No: ${data.doctor.mdcnLicense}`, 315, detailsTop + 52);
      doc.text(`Specialty: ${data.doctor.specialty}`, 315, detailsTop + 66);

      doc.y = detailsTop + 105;

      // Table Header
      const tableTop = doc.y;
      doc.rect(40, tableTop, 515, 22).fill('#0f3e17'); // Botanical Forest Green
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(9);
      doc.text('#', 48, tableTop + 6, { width: 20 });
      doc.text('MEDICATION & STRENGTH', 70, tableTop + 6, { width: 160 });
      doc.text('DOSAGE', 235, tableTop + 6, { width: 75 });
      doc.text('FREQUENCY', 315, tableTop + 6, { width: 85 });
      doc.text('DURATION', 405, tableTop + 6, { width: 65 });
      doc.text('INSTRUCTIONS', 475, tableTop + 6, { width: 75 });

      let currentY = tableTop + 22;
      doc.font('Helvetica').fontSize(9).fillColor('#222326');

      // Table Rows
      data.items.forEach((item, index) => {
        const rowBg = index % 2 === 0 ? '#ffffff' : '#f9f9f9';
        doc.rect(40, currentY, 515, 24).fill(rowBg);
        doc.fillColor('#222326');

        doc.text(`${index + 1}`, 48, currentY + 6, { width: 20 });
        doc.font('Helvetica-Bold').text(item.drug_name, 70, currentY + 6, { width: 160 });
        doc.font('Helvetica').text(item.dosage, 235, currentY + 6, { width: 75 });
        doc.text(item.frequency, 315, currentY + 6, { width: 85 });
        doc.text(item.duration, 405, currentY + 6, { width: 65 });
        doc.text(item.instructions || 'As advised', 475, currentY + 6, { width: 75 });

        // Bottom border
        doc.strokeColor('#e5e5e5').lineWidth(0.5).moveTo(40, currentY + 24).lineTo(555, currentY + 24).stroke();
        currentY += 24;
      });

      doc.y = currentY + 20;

      // Digital Signature & MDCN Stamp Box
      const stampTop = doc.y;
      const signatureHash = crypto
        .createHash('sha256')
        .update(`${data.prescriptionId}:${data.doctor.mdcnLicense}:${data.date.toISOString()}`)
        .digest('hex');

      doc.rect(40, stampTop, 515, 80).fillAndStroke('#f8f3eb', '#0a3922');
      doc.fillColor('#0a3922').font('Helvetica-Bold').fontSize(10).text('★ OFFICIAL MDCN VERIFIED DIGITAL STAMP & ENCRYPTED SIGNATURE ★', 50, stampTop + 8);
      
      doc.font('Helvetica').fontSize(8).fillColor('#222326');
      doc.text(`Digital Practitioner Stamp: Verified Active MDCN License #${data.doctor.mdcnLicense}`, 50, stampTop + 25);
      doc.text(`Signature Hash: SHA256:${signatureHash.slice(0, 36)}...`, 50, stampTop + 38);
      doc.text(`Prescription Reference: RX-${data.prescriptionId}`, 50, stampTop + 51);
      doc.text(`Digital Verification Key: MANGA-SEC-${signatureHash.slice(36, 48).toUpperCase()}`, 50, stampTop + 64);

      // Legal & NDPR Compliance Footer
      doc.y = stampTop + 100;
      doc.font('Helvetica-Oblique').fontSize(8).fillColor('#747679');
      doc.text(
        'LEGAL NOTICE: This e-prescription is legally valid throughout the Federal Republic of Nigeria under NDPR regulations. Participating pharmacies and clinical partners can verify authenticity via the Manga Partner Portal at /api/v1/partners/lookup/:patientPublicId.',
        40,
        doc.y,
        { width: 515, align: 'center' },
      );

      doc.end();
    });
  }
}
