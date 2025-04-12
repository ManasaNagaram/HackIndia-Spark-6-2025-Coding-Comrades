import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';

import { MistralService } from 'src/mistral/mistral.service';
import { PptGeneratorService } from './ppt-generator.service';

@Controller('ppt')
export class PptGeneratorController {
  constructor(
    private readonly mistralService: MistralService,
    private readonly pptGeneratorService: PptGeneratorService,
  ) {}

  @Post('generate')
  async generatePpt(
    @Body()
    body: {
      topic: string;
      slideCount: number;
      theme?: 'light' | 'dark';
      font?: string;
    },
    @Res() res: Response,
  ) {
    try {
      const { topic, slideCount, theme = 'dark', font = 'Comic Sans MS' } = body;

      if (!topic || !slideCount || slideCount <= 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid input. Please provide a valid topic and slide count.',
        });
      }

      const slideContent = await this.mistralService.generateSlideContent(
        topic,
        slideCount,
      );

      const slidesText = slideContent
        .map((slide) => slide.trim())
        .filter((slide) => slide.length > 0)
        .join('\n\n'); // Join to form a single string for parsing

      if (!slidesText) {
        return res.status(HttpStatus.NO_CONTENT).json({
          message: 'AI generated no valid content.',
        });
      }

      const { filename, pdfFilename } = await this.pptGeneratorService.generatePpt(
        slidesText,
        theme,
        font,
      );

      const base = process.env.BASE_URL || 'http://localhost:3000';
      const downloadUrl = `${base}/ppt/download/${filename}`;
      const previewUrl = `${base}/ppt/preview/${pdfFilename}`;

      return res.status(HttpStatus.OK).json({
        message: 'Presentation generated successfully.',
        downloadUrl,
        previewUrl,
      });
    } catch (error) {
      console.error('Error generating PowerPoint:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to generate PowerPoint file.',
        error: error.message,
      });
    }
  }

  @Post('script')
  async generateScript(
    @Body() body: { topic: string; slideCount: number },
    @Res() res: Response,
  ) {
    try {
      const { topic, slideCount } = body;

      if (!topic || !slideCount || slideCount <= 0) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'Invalid input. Please provide a valid topic and slide count.',
        });
      }

      const slideContent = await this.mistralService.generateSlideContent(topic, slideCount);
      const scriptLines = await this.mistralService.generatePresentationScript(slideContent);

      return res.status(HttpStatus.OK).json({ scriptLines });
    } catch (error) {
      console.error('Error generating script:', error);
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Failed to generate speaker script.',
        error: error.message,
      });
    }
  }


  @Get('download/:filename')
  async downloadFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(__dirname, '../../temp', filename);
    if (!fs.existsSync(filePath)) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'File not found.' });
    }
    return res.download(filePath);
  }

  @Get('preview/:filename')
  async previewFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = path.join(__dirname, '../../temp', filename);
    if (!fs.existsSync(filePath)) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'File not found.' });
    }
    res.setHeader('Content-Type', 'application/pdf');
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  }
}
