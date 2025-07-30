import React from 'react';
import { Link } from 'react-router-dom';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  categoryPath: string; // e.g., "fitness", "seo"
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, categoryPath }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col h-full relative">
      {tool.isPro && (
        <span className="absolute top-2 right-2 bg-yellow-400 text-yellow-800 text-xs font-bold px-2.5 py-0.5 rounded-full shadow">
          PRO
        </span>
      )}
      <div className="p-6 flex-grow">
        <h3 className="text-2xl font-semibold text-slate-700 mb-3 pr-10">{tool.name}</h3> {/* Added pr-10 for space for PRO badge */}
        <p className="text-slate-600 text-sm mb-2" dangerouslySetInnerHTML={{ __html: tool.line1 }}></p>
        {tool.line2 && <p className="text-slate-600 text-sm" dangerouslySetInnerHTML={{ __html: tool.line2 }}></p>}
      </div>
      <div className="p-6 bg-slate-50">
        <Link
          to={`/${categoryPath}/${tool.id}`}
          className="block w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-4 rounded-md text-center transition-colors duration-200"
        >
          Use Tool
        </Link>
      </div>
    </div>
  );
};

export default ToolCard;