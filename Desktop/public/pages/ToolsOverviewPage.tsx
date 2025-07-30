
import React from 'react';
import { Link } from 'react-router-dom';
import { toolCategoriesData } from '../constants'; // Ensure this path is correct

const ToolsOverviewPage: React.FC = () => {
  return (
    <div className="animate-fadeIn space-y-12">
      <div className="text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4 tracking-tight">
          Explore Our Tool Categories
        </h1>
        <p className="text-lg text-slate-600">
          Discover a wide range of tools designed to help you with fitness, SEO, image manipulation, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {Object.values(toolCategoriesData).map(category => (
          <Link
            key={category.path}
            to={`/${category.path}`} // Link to the specific category page e.g. /fitness, /seo
            className="group block bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transform transition-all duration-300 text-center border-2 border-transparent hover:border-teal-500 hover:scale-105"
            aria-label={`View tools in ${category.title}`}
          >
            <h3 className="text-2xl font-semibold text-teal-600 mb-3 group-hover:text-teal-700 transition-colors duration-300">
              {category.title}
            </h3>
            <p className="text-slate-500 text-sm mb-4">
              Discover {category.tools.length} specialized tools in this category.
            </p>
            <span className="inline-block text-teal-500 group-hover:text-teal-700 font-semibold transition-colors duration-300">
              View Category &rarr;
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ToolsOverviewPage;
