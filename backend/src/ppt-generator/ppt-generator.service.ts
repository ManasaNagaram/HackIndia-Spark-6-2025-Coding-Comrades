import { Injectable } from '@nestjs/common';
const PptxGenJS = require('pptxgenjs');
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { exec } from 'child_process';

@Injectable()
export class PptGeneratorService {
  async generatePpt(slideData: string[]): Promise<{ filename: string; pdfFilename: string }> {
    const pptx = new PptxGenJS();

    if (slideData.length === 0) slideData = ['No content generated'];

    const groupedSlides: string[][] = [];
    let currentSlide: string[] = [];

    slideData.forEach((line) => {
      if (line.startsWith('Slide')) {
        if (currentSlide.length > 0) groupedSlides.push(currentSlide);
        currentSlide = [line];
      } else currentSlide.push(line);
    });

    if (currentSlide.length > 0) groupedSlides.push(currentSlide);

    groupedSlides.forEach((slideContent) => {
      const slide = pptx.addSlide();
      slide.background = { color: 'FFFFFF' };

      slide.addText(slideContent[0], {
        x: '5%', y: '5%', w: '90%',
        fontSize: 28, color: '0000FF', bold: true, align: 'center'
      });

      const bulletPoints = slideContent.slice(1).join('\n');
      const fontSize = bulletPoints.length > 500 ? 20 : 24;
      const maxLength = 800;

      if (bulletPoints.length > maxLength) {
        const parts = bulletPoints.match(/(.|[\r\n]){1,800}/g) || [];
        parts.forEach((part, i) => {
          const subSlide = pptx.addSlide();
          subSlide.addText(`${slideContent[0]} (Part ${i + 1})`, {
            x: '5%', y: '5%', w: '90%',
            fontSize: 26, color: '0000FF', bold: true, align: 'center'
          });

          subSlide.addText(part, {
            x: '5%', y: '20%', w: '90%', h: '65%',
            fontSize: fontSize - 2, color: '000000', align: 'left', valign: 'top'
          });
        });
      } else {
        slide.addText(bulletPoints, {
          x: '5%', y: '20%', w: '90%', h: '65%',
          fontSize, color: '000000', align: 'left', valign: 'top'
        });
      }
    });

    const filename = `presentation-${uuidv4()}.pptx`;
    const outputDir = path.join(__dirname, '../../temp');
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    const pptPath = path.join(outputDir, filename);

    await pptx.writeFile({ fileName: pptPath });

    // 🔄 Use 'soffice' instead of 'libreoffice' for Windows compatibility
    const pdfFilename = filename.replace('.pptx', '.pdf');
    const command = `soffice --headless --convert-to pdf --outdir "${outputDir}" "${pptPath}"`;

    await new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error('Conversion error:', stderr);
          return reject(err);
        }
        resolve(true);
      });
    });

    return { filename, pdfFilename };
  }
}
