
import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-20rem)] text-center px-4 animate-fadeIn">
      <img src="https://picsum.photos/seed/404page/300/200" alt="Lost astronaut" className="w-64 h-auto mb-8 rounded-lg shadow-xl"/>
      <h1 className="text-6xl font-bold text-teal-500 mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-slate-700 mb-6">Oops! Page Not Found.</h2>
      <p className="text-lg text-slate-500 mb-8 max-w-md">
        It seems like you've ventured into uncharted territory. The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/home"
        className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
