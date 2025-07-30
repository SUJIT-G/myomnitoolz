
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFeedback } from '../contexts/FeedbackContext';
import { Feedback } from '../types';
import { Link } from 'react-router-dom';

const AdminFeedbacksPage: React.FC = () => {
  const { user } = useAuth();
  const { getAllFeedbacks, toggleTestimonialStatus, loading } = useFeedback();

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'fill-current' : 'stroke-current text-yellow-200'}`}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 .587l3.668 7.568L24 9.748l-6 5.845L19.336 24 12 19.897 4.664 24 6 15.593 0 9.748l8.332-1.593L12 .587z" />
          </svg>
        ))}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="text-center py-10 bg-white rounded-lg shadow-xl p-8 animate-fadeIn">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-slate-600 mb-6">You must be logged in as a Pro user to access this page.</p>
        <Link
          to="/home"
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="text-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
        <p className="mt-4 text-slate-500">Loading Feedbacks...</p>
      </div>
    );
  }

  const allFeedbacks = getAllFeedbacks(); // Fetches sorted feedbacks from state

  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-slate-700">Feedback Management</h1>
        <p className="text-slate-500">View all user feedback and manage testimonials.</p>
      </div>

      {allFeedbacks.length === 0 ? (
        <p className="text-center text-slate-500">No feedback submitted yet.</p>
      ) : (
        <div className="bg-white shadow-xl rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tool Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider max-w-sm">Comment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Is Testimonial?</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {allFeedbacks.map((fb: Feedback) => (
                <tr key={fb.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{fb.toolName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{fb.userName || 'Anonymous'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{renderStars(fb.rating)}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 max-w-sm overflow-hidden text-ellipsis whitespace-nowrap" title={fb.comment}>
                    {fb.comment.length > 70 ? `${fb.comment.substring(0, 70)}...` : fb.comment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(fb.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      fb.isTestimonial ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {fb.isTestimonial ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleTestimonialStatus(fb.id)}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors
                        ${fb.isTestimonial 
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                          : 'bg-teal-500 hover:bg-teal-600 text-white'}`}
                    >
                      {fb.isTestimonial ? 'Remove Testimonial' : 'Make Testimonial'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminFeedbacksPage;
