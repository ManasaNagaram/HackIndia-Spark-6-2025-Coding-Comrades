// src/services/lexica.service.ts
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LexicaService {
  async getImageForPrompt(prompt: string): Promise<string | null> {
    try {
      const url = `https://lexica.art/api/v1/search?q=${encodeURIComponent(prompt)}`;
      const response = await axios.get(url);

      const imageUrl = response.data.images?.[0]?.src;
      if (!imageUrl) return null;

      const imageBuffer = (
        await axios.get(imageUrl, { responseType: 'arraybuffer' })
      ).data;

      const imageDir = path.join(__dirname, '../../temp/images');
      if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

      const imagePath = path.join(imageDir, `${uuidv4()}.jpg`);
      fs.writeFileSync(imagePath, imageBuffer);

      return imagePath;
    } catch (err) {
      console.error(`Lexica image fetch failed for "${prompt}":`, err.message);
      return null;
    }
  }
}
