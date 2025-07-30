import React from 'react';
import { Link } from 'react-router-dom';
import { useFeedback } from '../contexts/FeedbackContext'; // Import useFeedback

const HomePage: React.FC = () => {
  const { getTestimonials } = useFeedback();
  const testimonials = getTestimonials().slice(0, 3); // Get up to 3 testimonials

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'fill-current' : 'stroke-current text-yellow-200'}`}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 .587l3.668 7.568L24 9.748l-6 5.845L19.336 24 12 19.897 4.664 24 6 15.593 0 9.748l8.332-1.593L12 .587z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="animate-fadeIn space-y-12 md:space-y-16">
      {/* Hero Section */}
      <div className="text-center py-12 md:py-16 bg-gradient-to-r from-teal-600 to-cyan-500 rounded-xl shadow-2xl">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          Unlock Your Potential with OmniToolz
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-teal-100 px-4">
          Your Free, All-In-One Suite of Intelligent Online Utilities
        </p>
      </div>
      
      {/* Introduction Section */}
      <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl">
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-6 text-center">
          Streamline Your Tasks, Amplify Your Results
        </h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-4">
          OmniToolz provides a comprehensive collection of powerful and intuitive online tools, completely free to use. 
          Whether you're boosting your fitness, optimizing SEO, or enhancing images, our AI-powered solutions are designed to help you achieve your goals with ease and precision.
        </p>
        <p className="text-lg text-slate-600 leading-relaxed text-center">
          Explore our diverse range of tools and discover how OmniToolz can make a difference for you today!
        </p>
      </div>

      {/* Why Choose OmniToolz Section */}
      <div className="bg-slate-50 p-6 md:p-10 rounded-xl shadow-xl">
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-8 text-center">Why Choose OmniToolz?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🎉</div>
            <h3 className="text-xl font-semibold text-teal-600 mb-2">Completely Free</h3>
            <p className="text-slate-500 text-sm">Access all our tools without any cost or hidden fees. Empowerment for everyone.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">💡</div>
            <h3 className="text-xl font-semibold text-teal-600 mb-2">AI-Powered Innovation</h3>
            <p className="text-slate-500 text-sm">Leverage cutting-edge AI to get smarter insights and better results from our advanced tools.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-3">🖌️</div>
            <h3 className="text-xl font-semibold text-teal-600 mb-2">User-Focused Design</h3>
            <p className="text-slate-500 text-sm">Enjoy a seamless and intuitive experience with tools designed for ease of use and efficiency.</p>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <div className="bg-white p-6 md:p-10 rounded-xl shadow-xl">
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-8 text-center">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="bg-slate-50 p-6 rounded-lg shadow-md flex flex-col">
                <div className="mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-slate-600 italic text-sm mb-4 flex-grow">"{testimonial.comment}"</p>
                <div className="mt-auto">
                  <p className="font-semibold text-teal-600 text-sm">{testimonial.userName || 'Anonymous'}</p>
                  <p className="text-slate-400 text-xs">Used: {testimonial.toolName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tool Categories Section - Updated to link to /tools */}
      <div>
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 mb-8 text-center">Explore Our Tool Categories</h2>
        <div className="text-center">
          <Link
            to="/tools"
            className="inline-block bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 px-10 rounded-lg text-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            aria-label="Explore all tool categories"
          >
            Browse All Tools &rarr;
          </Link>
        </div>
      </div>

    </div>
  );
};

export default HomePage;