
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import AboutPage from '@/pages/AboutPage';
import TermsPage from '@/pages/TermsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import ToolCategoryPage from '@/pages/ToolCategoryPage';
import ToolsOverviewPage from '@/pages/ToolsOverviewPage';
import ToolPage from '@/pages/ToolPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AdminFeedbacksPage from '@/pages/AdminFeedbacksPage';
import { toolCategoriesData } from '@/constants';
import { AuthProvider } from '@/contexts/AuthContext';
import { FeedbackProvider } from '@/contexts/FeedbackContext';
import { Tool, ToolCategory } from '@/types';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Define the type for categoryData based on the structure in constants.ts
interface CategoryDataType {
  title: ToolCategory | string; // Using string as ToolCategory is an enum of strings
  tools: Tool[];
  path: string;
}

const App: React.FC = () => {
  return (
    <AuthProvider>
      <FeedbackProvider> {/* Wrap with FeedbackProvider */}
        <HashRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-slate-100 text-slate-800 selection:bg-teal-500 selection:text-white">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/tools" element={<ToolsOverviewPage />} /> {/* Add route for ToolsOverviewPage */}
                <Route path="/admin/feedbacks" element={<AdminFeedbacksPage />} /> {/* Add route for AdminFeedbacksPage */}
                
                {Object.values(toolCategoriesData).map((categoryData: CategoryDataType) => (
                  <Route 
                    key={categoryData.path} // Use path as key, it's unique and used in URL
                    path={`/${categoryData.path}`} // Prepend '/' to the slug path
                    element={
                      <ToolCategoryPage 
                        title={categoryData.title as string} // Cast to string if ToolCategory is used 
                        tools={categoryData.tools} 
                        categoryPath={categoryData.path} // Pass the slug (e.g., "fitness")
                      />} 
                  />
                ))}

                {/* Route for individual tool pages */}
                <Route path="/:categoryPath/:toolId" element={<ToolPage />} />
                
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </HashRouter>
      </FeedbackProvider>
    </AuthProvider>
  );
};

export default App;
