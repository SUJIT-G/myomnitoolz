
import React from 'react';
import { Tool } from '../types';
import ToolCard from '@/components/ToolCard';

interface ToolCategoryPageProps {
  title: string;
  tools: Tool[];
  categoryPath: string; // e.g., "fitness", "seo"
}

const ToolCategoryPage: React.FC<ToolCategoryPageProps> = ({ title, tools, categoryPath }) => {
  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-700">{title}</h1>
      </div>
      {tools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {tools.map(tool => (
            <ToolCard key={tool.id} tool={tool} categoryPath={categoryPath} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-slate-500">No tools available in this category yet. Check back soon!</p>
          <img src="https://picsum.photos/400/300?grayscale" alt="Coming soon" className="mt-8 mx-auto rounded-lg shadow-md" />
        </div>
      )}
    </div>
  );
};

export default ToolCategoryPage;
