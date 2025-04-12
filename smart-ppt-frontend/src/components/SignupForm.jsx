// import { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import PresentationGenerator from './PresentationGenerator';

// export default function SignupForm() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [name,setName] = useState('');
//   const navigate = useNavigate();

//   const handleSignup = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:3000/auth/register', {
//         name,
//         email,
//         password,
//       });
//       alert('Signup successful! Please login.');
//       navigate('/PresentationGenerator');
//     } catch (err) {
//       alert('Signup failed. Try a different email.');
//     }
//   };

//   return (
//     <form onSubmit={handleSignup} className="max-w-sm mx-auto p-4 bg-white rounded-lg shadow">
//       <h2 className="text-xl font-bold mb-4 text-center">Sign Up</h2>
//       <input
//   type="text"
//   placeholder="Full Name"
//   className="w-full p-2 mb-3 border rounded"
//   value={name}
//   onChange={(e) => setName(e.target.value)}
// />

//       <input
//         type="email"
//         placeholder="Email"
//         className="w-full p-2 mb-3 border rounded"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         className="w-full p-2 mb-4 border rounded"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
//         Sign Up
//       </button>
//     </form>
//   );
// }

import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/register', {
        name,
        email,
        password,
      });
      alert('Signup successful! Please login.');
      navigate('/PresentationGenerator');
    } catch (err) {
      alert('Signup failed. Try a different email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-8"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create an Account
        </h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-all duration-300"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
