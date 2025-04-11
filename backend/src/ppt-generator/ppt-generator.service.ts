import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';
import { lastValueFrom } from 'rxjs';
import { parseStructuredSlides, SlideData } from '../utils/slide-formatter';

const PptxGenJS = require('pptxgenjs');

@Injectable()
export class PptGeneratorService {
  constructor(private readonly httpService: HttpService) {}

  async generatePpt(
    rawSlides: string,
    theme: 'light' | 'dark' = 'light',
    font: string = 'Calibri',
  ): Promise<{ filename: string; pdfFilename: string }> {
    const pptx = new PptxGenJS();
    const slideDataArray: SlideData[] = parseStructuredSlides(rawSlides);

    const colors = {
      background: theme === 'dark' ? '1c1c1c' : 'FFFFFF',
      title: theme === 'dark' ? 'ffffff' : '003366',
      content: theme === 'dark' ? 'e0e0e0' : '000000',
    };

    // Random image layout setup
    const slideIndexesWithImages = new Set<number>();
    while (slideIndexesWithImages.size < Math.floor(slideDataArray.length / 2)) {
      slideIndexesWithImages.add(Math.floor(Math.random() * slideDataArray.length));
    }

    const slideImageOrientation: Record<number, 'left' | 'right'> = {};
    slideIndexesWithImages.forEach((index) => {
      slideImageOrientation[index] = Math.random() > 0.5 ? 'left' : 'right';
    });

    for (const [index, slideData] of slideDataArray.entries()) {
      const slide = pptx.addSlide();
      slide.background = { color: colors.background };

      // Title
      slide.addText(slideData.title, {
        x: 0.5,
        y: 0.3,
        w: 9,
        h: 1,
        fontSize: 26,
        bold: true,
        align: 'center',
        color: colors.title,
        fontFace: font,
      });

      let xText = 0.5;
      let textWidth = 9;
      let localImagePath: string | null = null;

      if (slideIndexesWithImages.has(index)) {
        const keywords = slideData.content
          ?.flatMap((line) => line.split(' '))
          .filter((word) => word.length > 3)
          .slice(0, 5)
          .join(' ');
        const query = `${slideData.title}`;
        localImagePath = await this.getImageForSlide(query);

        if (localImagePath) {
          const orientation = slideImageOrientation[index];
          const imgX = orientation === 'left' ? 0.5 : 5.0;
          xText = orientation === 'left' ? 5.0 : 0.5;
          textWidth = 4.5;

          slide.addImage({
            path: localImagePath,
            x: imgX,
            y: 1.2,
            w: 4.5,
            h: 3.5,
          });
        }
      }

      // Bullet points
      if (slideData.content && Array.isArray(slideData.content)) {
        const formattedContent = slideData.content.map(point => `${point}`).join('\n');

        slide.addText(formattedContent, {
          x: xText,
          y: 1.2,
          w: textWidth,
          h: 4.5,
          fontSize: 16,
          color: colors.content,
          fontFace: font,
          align: 'left',
          bullet: true,
        });
      }
    }

    // Save .pptx
    const outputDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const filename = `presentation-${uuidv4()}.pptx`;
    const pptPath = path.join(outputDir, filename);
    await pptx.writeFile({ fileName: pptPath });

    // Convert to PDF using LibreOffice
    const pdfFilename = filename.replace('.pptx', '.pdf');
    const command = `soffice --headless --convert-to pdf --outdir "${outputDir}" "${pptPath}"`;

    await new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error('PDF conversion failed:', stderr);
          return reject(err);
        }
        resolve(true);
      });
    });

    return { filename, pdfFilename };
  }

  private async getImageForSlide(query: string): Promise<string | null> {
    const key = process.env.PEXELS_API_KEY;
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=10`;

    try {
      const res = await lastValueFrom(
        this.httpService.get(url, {
          headers: { Authorization: key },
        }),
      );

      const results = res.data.photos;
      if (!results?.length) return null;

      const randomImage = results[Math.floor(Math.random() * results.length)];
      const imageUrl = randomImage.src.medium;

      const imageBuffer = (
        await lastValueFrom(this.httpService.get(imageUrl, { responseType: 'arraybuffer' }))
      ).data;

      const imageDir = path.join(__dirname, '../../temp/images');
      if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

      const imagePath = path.join(imageDir, `${uuidv4()}.jpg`);
      fs.writeFileSync(imagePath, imageBuffer);
      return imagePath;
    } catch (e) {
      console.error('Pexels image fetch error:', e.message);
      return null;
    }
  }
}
