import { Injectable, BadRequestException } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { promises as fs } from 'fs';
import { join } from 'path';
import { extname } from 'path';

@Injectable()
export class UploadService {
  private storage: Storage;
  private bucketName = process.env.GCS_BUCKET!;

  constructor() {
    this.storage = new Storage({
      keyFilename: process.env.GCS_KEY_FILE,  // service account JSON
    });
  }

  //-- UPLOAD TO LOCAL ---------------------------------------------------------
  async uploadToLocal(file: Express.Multer.File, subfolder = 'products') {
    if (!file) throw new BadRequestException('File not found');

    const uploadPath = join(__dirname, '..', '..', 'uploads', subfolder);

    const filename = Date.now() +
    '_' +
    Math.round(Math.random() * 1e9) +
    extname(file.originalname);
    // Ensure folder exists
    await fs.mkdir(uploadPath, { recursive: true });

    const filepath = join(uploadPath, filename);

    await fs.writeFile(filepath, file.buffer);

    return `http://localhost:8000/uploads/${subfolder}/${filename}`;
  }

  //-- UPLOAD TO GOOGLE CLOUD STORAGE ------------------------------------------
  async uploadToGCS(file: Express.Multer.File, folder = 'products') {
    if (!file) throw new BadRequestException('File not found');

    const bucket = this.storage.bucket(this.bucketName);

    const filename = `${folder}/${Date.now()}-${file.originalname}`;
    const blob = bucket.file(filename);

    const stream = blob.createWriteStream({
      resumable: false,
      contentType: file.mimetype,
      public: true,
    });

    return new Promise<string>((resolve, reject) => {
      stream.on('finish', async () => {
        const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${filename}`;
        resolve(publicUrl);
      });
      stream.on('error', () => reject('GCS upload error'));
      stream.end(file.buffer);
    });
  }
}
