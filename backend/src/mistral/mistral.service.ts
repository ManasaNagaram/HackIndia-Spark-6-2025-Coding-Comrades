import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MistralService {
  private readonly apiUrl = process.env.MISTRAL_BASE_URL;
  private readonly apiKey = process.env.MISTRAL_API_KEY;
  async generateSlideContent(topic: string, slideCount: number): Promise<string[]> {
    const prompt = `
  Generate exactly ${slideCount} slides for a presentation on "${topic}".
  Each slide must be in this format:
  
  Slide X: <Slide Title>
  - Bullet point 1
  - Bullet point 2
  - Bullet point 3
  
  Return all slides separated by double newlines.
  `;
  
    try {
      const response = await axios.post(
        `${this.apiUrl}/v1/chat/completions`,
        {
          model: 'mistral-small',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1500,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );
  
      const content = response.data.choices[0].message.content;
      return content.split(/\n\n+/).filter(s => s.trim().length > 0);  // Ensure slide-per-block
    } catch (error) {
      console.error('Error generating slide content:', error);
      throw new Error('Failed to generate slide content.');
    }
  }
  

  
async generatePresentationScript(slides: string[]): Promise<string[]> {
  const slideCount = slides.length;

  const prompt = `
You are a professional presentation coach.

For each of the following ${slideCount} slides, generate one corresponding speaker script.
- Each script should be 4–6 sentences long.
- Make the tone confident, professional, and easy to present.
- Use examples or analogies where appropriate to support the explanation.
- Respond strictly as a JSON array like:
[
  "Script for Slide 1",
  "Script for Slide 2",
  ...
]
Here are the slides:
${slides.map((s, i) => `Slide ${i + 1}: ${s}`).join('\n')}
`;

  try {
    const response = await axios.post(
      `${this.apiUrl}/v1/chat/completions`,
      {
        model: 'mistral-small',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
      },
      {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content.trim();

    // Try parsing JSON strictly
    const parsed = JSON.parse(content);

    if (Array.isArray(parsed)) {
      // ✅ Ensure script count matches slide count
      if (parsed.length === slideCount) {
        return parsed;
      } else {
        // ⚠️ Trim extra or fill missing ones with fallback
        const trimmed = parsed.slice(0, slideCount);
        while (trimmed.length < slideCount) trimmed.push("No script generated.");
        return trimmed;
      }
    }

    throw new Error('Unexpected response format');
  } catch (error) {
    console.error('Script generation failed:', error.message);

    // Fallback: basic cleanup
    return slides.map((_, i) => `Script for Slide ${i + 1} could not be generated properly.`);
  }
}


}