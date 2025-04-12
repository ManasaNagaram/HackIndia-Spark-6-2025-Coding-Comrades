import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PresentationGenerator() {
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(5);
  const [font, setFont] = useState('Comic Sans MS');
  const [theme] = useState('dark');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const navigate = useNavigate();

  const { token, isLoggedIn } = useAuth();

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Speech recognition not supported.");

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;

    setListening(true);
    recognition.start();

    recognition.onresult = (e) => {
      setTopic(e.results[0][0].transcript);
    };

    recognition.onerror = () => {
      alert("Voice input failed.");
    };

    recognition.onend = () => setListening(false);
  };

  const handleGenerate = async () => {
    if (!isLoggedIn) return alert('Please login to generate.');
    if (!topic || slideCount <= 0) return alert('Enter valid inputs');

    setLoading(true);
    try {
      const pptRes = await axios.post(
        'http://localhost:3000/ppt/generate',
        { topic, slideCount, font, theme },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const scriptRes = await axios.post(
        'http://localhost:3000/ppt/script',
        { topic, slideCount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { pptUrl, previewUrl } = pptRes.data;

      navigate('/preview', {
        state: {
          pptUrl, 
    previewUrl,

          scriptLines: scriptRes.data.scriptLines || [],
        },
      });
    } catch (err) {
      console.error(err);
      alert('PPT generation failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-xl">
        Please log in to access the Smart Presentation Generator.
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black text-white flex items-center justify-center p-8">
      <div className="w-full max-w-5xl bg-black rounded-xl shadow-lg p-8 md:flex md:gap-8 border border-zinc-800" data-aos="fade-up">
        <div className="flex-grow space-y-6">
          <h1 className="text-3xl font-semibold text-white mb-2">Smart Presentation Generator</h1>
          <p className="text-zinc-400 text-sm">Turn your topic into a professional slide deck in seconds.</p>

          <div className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. AI in Healthcare"
                className="w-full p-3 pr-12 border border-beige-400 bg-black text-beige-400 rounded-lg focus:ring-2 focus:ring-beige-500"
              />
              <img
                src={listening ? '/micon.png' : '/mic.png'}
                alt="Mic"
                onClick={handleVoiceInput}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 cursor-pointer opacity-70 hover:opacity-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400">Number of Slides</label>
              <input
                type="number"
                min={1}
                max={20}
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
                className="w-full border border-beige-400 bg-black text-beige-400 rounded-md px-4 py-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400">Font</label>
                <select
                  value={font}
                  onChange={(e) => setFont(e.target.value)}
                  className="w-full border border-beige-400 bg-black text-beige-400 rounded-md px-4 py-2"
                >
                  <option value="Comic Sans MS">Comic Sans MS</option>
                  <option value="Calibri">Calibri</option>
                  <option value="Arial">Arial</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Georgia">Georgia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400">Theme</label>
                <select
                  value={theme}
                  disabled
                  className="w-full border border-beige-400 bg-black text-beige-400 rounded-md px-4 py-2"
                >
                  
                  <option value="dark">Dark</option>
<option value="light">Light</option>

                </select>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`w-full py-3 rounded-md font-medium border transition
                ${loading
                  ? 'border-zinc-600 text-zinc-500 cursor-not-allowed'
                  : 'border-beige-400 text-beige-400 hover:border-beige-300 hover:text-beige-300'}`}
            >
              {loading ? 'Generating...' : 'Generate Presentation'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
