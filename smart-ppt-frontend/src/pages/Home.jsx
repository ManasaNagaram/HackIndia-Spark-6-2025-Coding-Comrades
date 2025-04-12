// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import Navbar from '../components/Navbar';

// const Home = () => {
//   const navigate = useNavigate();

//   const handleGenerateClick = () => {
//     navigate('/PresentationGenerator');
//   };

//   return (
//     <>
//       <Navbar />
//       <div style={{ textAlign: 'center', marginTop: '2rem' }}>
//         <h1>Welcome to the Home Page</h1>
//         <button onClick={handleGenerateClick} style={styles.button}>
//           Generate PPT
//         </button>
//       </div>
//     </>
//   );
// };

// const styles = {
//   button: {
//     padding: '12px 24px',
//     fontSize: '16px',
//     backgroundColor: '#444',
//     color: 'white',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     marginTop: '1.5rem',
//     backgroundColor:'grey'
//   }
// };

// export default Home;
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Home = () => {
  const navigate = useNavigate();

  const handleGenerateClick = () => {
    navigate('/PresentationGenerator');
  };

  return (
    <>
      <Navbar />
      <div className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-r from-pink-100 via-purple-100 to-fuchsia-200 animate-gradient-x">
        {/* Soft Glow Bubbles */}
        <div className="absolute top-0 left-10 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-16 w-60 h-60 bg-white opacity-20 rounded-full blur-2xl animate-bounce-slower"></div>
        <div className="absolute top-1/4 right-1/3 w-32 h-32 bg-white opacity-15 rounded-full blur-2xl animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-white opacity-10 rounded-full blur-xl animate-bounce"></div>

        {/* Main Content */}
        <div className="z-10 text-center px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 animate-fade-in">
            Create Presentations Instantly
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl mx-auto animate-fade-in delay-200">
            Let AI design beautiful, professional slides from your ideas. As easy as typing a prompt.
          </p>
          <button
            onClick={handleGenerateClick}
            className="mt-8 px-6 py-3 bg-fuchsia-600 text-white font-semibold rounded-xl shadow-lg hover:bg-fuchsia-700 hover:shadow-xl transition-all duration-300 animate-fade-in delay-300"
          >
            Generate Your PPT
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
