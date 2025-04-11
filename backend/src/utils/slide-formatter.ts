export interface SlideData {
  title: string;
  content: string[];
}

export function parseStructuredSlides(input: string): SlideData[] {
  const lines = input.split('\n').map(line => line.trim()).filter(Boolean);
  const slides: SlideData[] = [];

  let currentSlide: SlideData | null = null;

  for (const line of lines) {
    // Start of a new slide
    if (/^Slide \d+:/.test(line)) {
      if (currentSlide) {
        slides.push(currentSlide);
      }

      // Extract title after "Slide X:"
      const title = line.replace(/^Slide \d+:\s*/, '');
      currentSlide = { title, content: [] };
    } else if (currentSlide) {
      // Regular content line, treat as a bullet
      currentSlide.content.push(line.replace(/^\* ?/, ''));
    }
  }

  if (currentSlide) {
    slides.push(currentSlide);
  }

  return slides;
}
