import { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function PresentationGenerator() {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [pptUrl, setPptUrl] = useState('');

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setPptUrl('');
    try {
      const response = await fetch('/ppt/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, slideCount }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      setPptUrl(url);
    } catch (error) {
      console.error(error);
      alert('Failed to generate presentation.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    if (pptUrl) {
      window.open(pptUrl, '_blank');
    }
  };

  const handleDownload = () => {
    if (pptUrl) {
      const a = document.createElement('a');
      a.href = pptUrl;
      a.download = 'presentation.pptx';
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-6 text-white font-sans">
      <div
        className="bg-white text-gray-800 shadow-2xl rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10 max-w-5xl w-full transition-all"
        data-aos="zoom-in"
      >
        <img
          src="https://undraw.co/api/illustrations/undraw_presentation_re_sxof.svg"
          alt="Presentation Illustration"
          className="w-64 md:w-80 h-auto drop-shadow-md"
        />

        <div className="flex-1 w-full">
          <h1 className="text-3xl font-bold mb-3 text-center md:text-left text-indigo-700 animate-pulse">
            Smart Presentation Generator
          </h1>
          <p className="mb-6 text-center md:text-left text-sm text-gray-600">
            🚀 Turn your ideas into a professional slide deck in seconds
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. AI in Healthcare"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slide Count</label>
              <input
                type="number"
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
                min="1"
                max="20"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 flex justify-center items-center ${
                loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Generating...
                </div>
              ) : (
                'Generate Presentation'
              )}
            </button>

            {pptUrl && (
              <div className="flex justify-between mt-4 gap-4">
                <button
                  onClick={handlePreview}
                  className="w-1/2 py-2 border border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition"
                >
                  Preview
                </button>
                <button
                  onClick={handleDownload}
                  className="w-1/2 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition"
                >
                  Download
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
