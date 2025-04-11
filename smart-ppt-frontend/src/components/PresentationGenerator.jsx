import { useState, useEffect } from 'react';
import AOS from 'aos';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import 'aos/dist/aos.css';

export default function PresentationGenerator() {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [font, setFont] = useState('Calibri');
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);
  const [pptUrl, setPptUrl] = useState(null);
  const [listening, setListening] = useState(false);

  const { token, isLoggedIn } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    setListening(true);
    recognition.start();

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTopic(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      alert("Could not capture voice. Try again.");
    };

    recognition.onend = () => {
      setListening(false);
    };
  };

  const handleGenerate = async () => {
    if (!isLoggedIn) return alert('Please login to generate a presentation.');
    setLoading(true);
    setPptUrl(null);

    try {
      const response = await axios.post(
        'http://localhost:3000/ppt/generate',
        {
          topic,
          slideCount,
          font,
          theme,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { downloadUrl, previewUrl } = response.data;
      setPptUrl({ downloadUrl, previewUrl });
    } catch (error) {
      console.error(error);
      alert('Failed to generate presentation.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (pptUrl?.downloadUrl) {
      const a = document.createElement('a');
      a.href = pptUrl.downloadUrl;
      a.download = 'presentation.pptx';
      a.click();
    }
  };

  const handlePreview = () => {
    if (pptUrl?.previewUrl) {
      window.open(pptUrl.previewUrl, '_blank');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center text-gray-700 text-xl">
        Please log in to access the Smart Presentation Generator.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-md p-8 md:flex md:gap-8" data-aos="fade-up">
        <div className="flex-grow space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Smart Presentation Generator</h1>
            <p className="text-gray-500 text-sm">Turn your topic into a professional slide deck in seconds.</p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. AI in Healthcare"
                className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
              />
              <img
                src={listening ? '/micon.png' : '/mic.png'}
                alt="Speak"
                onClick={handleVoiceInput}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer opacity-70 hover:opacity-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Number of Slides</label>
              <input
                type="number"
                min={1}
                max={20}
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Font</label>
                <select
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                >
                  <option value="Calibri">Calibri</option>
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Comic Sans MS">Comic Sans MS</option>
                  <option value="Georgia">Georgia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-3 rounded-md font-semibold transition ${
                loading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Generating...' : 'Generate Presentation'}
            </button>
          </div>

          {pptUrl && (
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={handleDownload}
                  className="w-1/2 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition"
                >
                  Download PPT
                </button>
                <button
                  onClick={handlePreview}
                  className="w-1/2 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Open Preview
                </button>
              </div>

              <div>
                <h2 className="text-md font-medium text-gray-700 mb-2">Preview</h2>
                <iframe
                  src={pptUrl.previewUrl}
                  title="Presentation Preview"
                  className="w-full h-[500px] border rounded-md shadow-sm"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
