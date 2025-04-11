import './index.css';
import PresentationGenerator from './components/PresentationGenerator';
import LoginForm from './components/LoginForm';
import { BrowserRouter as Router, Routes, Route } from 'react-router';
import SignupForm from './components/SignupForm';



function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Router>
      <Routes>
      <Route path="/" element={<PresentationGenerator />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
      </Routes>
    </Router>
      
    </div>
  );
}

export default App;
