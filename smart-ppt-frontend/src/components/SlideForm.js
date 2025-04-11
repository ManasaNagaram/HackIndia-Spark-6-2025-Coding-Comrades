import React, { useState } from 'react';
import axios from 'axios';

const SlideForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/generate', {
        title,
        content
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'presentation.pptx');
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      alert('Error generating presentation.');
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="form-container">
      <h2>Smart Presentation Generator</h2>
      <form onSubmit={handleGenerate}>
        <input
          type="text"
          placeholder="Presentation Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Enter content (paragraph or points)..."
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Generate Presentation'}
        </button>
      </form>
    </div>
  );
};

export default SlideForm;
