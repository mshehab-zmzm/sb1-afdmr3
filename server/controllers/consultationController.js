import db from '../db/database.js';
import { mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const UPLOADS_DIR = join(__dirname, '..', 'uploads');

// Ensure uploads directory exists
try {
  await mkdir(UPLOADS_DIR, { recursive: true });
} catch (err) {
  console.error('Error creating uploads directory:', err);
}

export const getAllConsultations = async (req, res) => {
  try {
    const consultations = await db.all(
      'SELECT * FROM consultations ORDER BY createdAt DESC'
    );

    // Get supporting documents for each consultation
    const consultationsWithDocs = await Promise.all(
      consultations.map(async (consultation) => {
        const docs = await db.all(
          'SELECT * FROM supporting_documents WHERE consultationId = ?',
          [consultation.id]
        );
        return { ...consultation, supportingDocs: docs };
      })
    );

    res.json(consultationsWithDocs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createConsultation = async (req, res) => {
  try {
    const {
      name, birthDate, gender, mobile, nationalId,
      description, symptomsDuration, clinic, doctor, appointment
    } = req.body;

    // Insert consultation
    const result = await db.run(
      `INSERT INTO consultations (
        name, birthDate, gender, mobile, nationalId,
        description, symptomsDuration, clinic, doctor, appointment
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, birthDate, gender, mobile, nationalId,
       description, symptomsDuration, clinic, doctor, appointment]
    );

    const consultationId = result.id;

    // Handle supporting documents
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const title = req.body[`supportingDocs[${file.fieldname}][title]`];
        await db.run(
          'INSERT INTO supporting_documents (consultationId, title, filename) VALUES (?, ?, ?)',
          [consultationId, title, file.filename]
        );
      }
    }

    res.status(201).json({ 
      message: 'تم إنشاء طلب الاستشارة بنجاح',
      consultationId 
    });
  } catch (error) {
    console.error('Error creating consultation:', error);
    res.status(400).json({ message: error.message });
  }
};