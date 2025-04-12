import React from 'react';

const SlideEditor = ({ slides, setSlides }) => {
  const handleTitleChange = (index, value) => {
    const updated = [...slides];
    updated[index].title = value;
    setSlides(updated);
  };

  const handleBulletChange = (index, value) => {
    const updated = [...slides];
    updated[index].bullets = value.split('\n');
    setSlides(updated);
  };

  return (
    <div>
      <h3>Edit Your Slides</h3>
      {slides.map((slide, idx) => (
        <div key={idx} style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <label><strong>Slide {idx + 1} Title:</strong></label>
          <input
            type="text"
            value={slide.title}
            onChange={(e) => handleTitleChange(idx, e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
          />

          <label><strong>Bullet Points (one per line):</strong></label>
          <textarea
            value={slide.bullets.join('\n')}
            onChange={(e) => handleBulletChange(idx, e.target.value)}
            rows={5}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
      ))}
    </div>
  );
};

export default SlideEditor;
