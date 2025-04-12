import React from 'react';
import { useLocation } from 'react-router-dom';

const PresentationPreview = () => {
  const { state } = useLocation();
  const { previewUrl, scriptLines } = state || {};

  // Derive download URL from preview URL
  const downloadUrl = previewUrl
    ? previewUrl.replace('/preview/', '/download/').replace('.pdf', '.pptx')
    : null;

  const handleDownload = () => {
    if (downloadUrl) {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'presentation.pptx';
      document.body.appendChild(a); // For Firefox
      a.click();
      document.body.removeChild(a);
    }
  };

  if (!previewUrl) {
    return (
      <div className="text-center text-gray-500 mt-10">
        No preview available.
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row p-6 min-h-screen bg-gray-100 gap-6">
      {/* Preview Section */}
      <div className="flex-1">
        <h2 className="text-md font-medium text-zinc-700 mb-2">📽️ Slide Preview</h2>
        <iframe
          src={previewUrl}
          title="Presentation Preview"
          className="w-full h-[500px] border border-zinc-700 rounded-md"
        ></iframe>

        {/* Download Button */}
        {downloadUrl && (
          <div className="mt-4">
            <button
              onClick={handleDownload}
              className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-500 transition"
            >
              ⬇️ Download PPTX
            </button>
          </div>
        )}
      </div>

      {/* Script Section */}
      <div className="flex-1 overflow-y-auto max-h-[500px] pr-2">
        <h2 className="text-xl font-bold mb-3 text-gray-800">🗣️ Speaker Scripts</h2>
        <ol className="list-decimal list-inside space-y-4">
          {scriptLines?.map((line, idx) => (
            <li key={idx} className="bg-white p-3 rounded shadow text-gray-700">
              <strong>Slide {idx + 1}:</strong> {line}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default PresentationPreview;
