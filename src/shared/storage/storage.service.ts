import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class StorageService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get<string>('cloudinary.cloudName'),
      api_key: this.config.get<string>('cloudinary.apiKey'),
      api_secret: this.config.get<string>('cloudinary.apiSecret'),
    });
  }

  async upload(buffer: Buffer, folder: string): Promise<{ url: string; publicId: string }> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }
          if (!result) {
            reject(new Error('Upload failed'));
            return;
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      ).end(buffer);
    });
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}