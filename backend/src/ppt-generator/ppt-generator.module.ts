import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MistralModule } from 'src/mistral/mistral.module';
import { PptGeneratorController } from './ppt-generator.controller';
import { PptGeneratorService } from './ppt-generator.service';
import { LexicaService } from './lexica.service';

@Module({
  providers: [PptGeneratorService,LexicaService],
  controllers: [PptGeneratorController],
  imports: [MistralModule,HttpModule],
})
export class PptGeneratorModule {}
