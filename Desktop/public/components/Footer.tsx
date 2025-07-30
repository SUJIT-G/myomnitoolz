
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Footer: React.FC = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-slate-800 text-slate-300 py-8 text-center mt-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-center items-center space-x-6 mb-4">
            <Link to="/about" className="text-slate-400 hover:text-white transition-colors duration-200">About</Link>
            <Link to="/terms" className="text-slate-400 hover:text-white transition-colors duration-200">Terms of Use</Link>
            <Link to="/privacy" className="text-slate-400 hover:text-white transition-colors duration-200">Privacy Policy</Link>
        </div>
        <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} OmniToolz. All Rights Reserved.</p>
        <p className="text-sm mt-1 text-slate-400">Empowering you with free online tools.</p>
        {user && (
          <div className="mt-4">
            <Link to="/admin/feedbacks" className="text-teal-400 hover:text-teal-300 text-sm transition-colors">
              Feedback Management (Pro)
            </Link>
          </div>
        )}
      </div>
    </footer>
  );
};

export default Footer;
