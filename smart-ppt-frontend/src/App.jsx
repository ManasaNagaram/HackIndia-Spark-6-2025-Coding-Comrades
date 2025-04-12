import './index.css';
import PresentationGenerator from './components/PresentationGenerator';
import LoginForm from './components/LoginForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import SignupForm from './components/SignupForm';
import PresentationPreview from './components/PresentationPreview';

import Home from './pages/Home';
import About from './pages/About';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/PresentationGenerator" element={<PresentationGenerator/>}/>
        <Route path="/preview" element={<PresentationPreview />} />
      </Routes>
    </Router>
      
    </div>
  );
}

export default App;
