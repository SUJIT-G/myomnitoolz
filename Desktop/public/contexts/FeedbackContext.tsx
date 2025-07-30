import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { Feedback } from '../types';
import { db } from '@/firebaseConfig';

interface FeedbackContextType {
  feedbacks: Feedback[];
  loading: boolean;
  addFeedback: (feedbackData: Omit<Feedback, 'id' | 'date' | 'isTestimonial'>) => Promise<void>;
  getTestimonials: () => Feedback[];
  getAllFeedbacks: () => Feedback[];
  toggleTestimonialStatus: (feedbackId: string) => Promise<void>;
  hasUserSubmittedFeedbackForTool: (toolId: string) => boolean;
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

// Sample initial feedbacks to simulate existing testimonials
const initialSampleFeedbacks: Feedback[] = [
  {
    id: 'seo1_1672531200000', // Example timestamp, will be used as doc ID for seeding
    toolId: 'seo1',
    toolName: 'AI SEO Content Optimizer',
    rating: 5,
    comment: 'This optimizer is fantastic! It helped me rank my article higher in just a few days. The LSI keyword suggestions are pure gold.',
    date: new Date('2023-01-01T10:00:00Z').toISOString(),
    userName: 'Pro User Alice',
    isTestimonial: true,
  },
  {
    id: 'fh1_1672617600000',
    toolId: 'fh1',
    toolName: 'Daily Habit Tracker',
    rating: 4,
    comment: 'Love the streak rewards! Keeps me motivated to log my habits daily. Wish there were more badge options.',
    date: new Date('2023-01-02T12:00:00Z').toISOString(),
    userName: 'FitnessFan22',
    isTestimonial: true,
  },
  {
    id: 'img1_1672704000000',
    toolId: 'img1',
    toolName: 'AI Background Remover',
    rating: 5,
    comment: 'The background removal is so precise! Saved me hours of manual work in Photoshop. The canvas preview is super helpful.',
    date: new Date('2023-01-03T14:00:00Z').toISOString(),
    userName: 'DesignerDave',
    isTestimonial: true,
  },
  {
    id: 'seo4_1672790400000',
    toolId: 'seo4',
    toolName: 'SEO Audit & Site Health Checker',
    rating: 4,
    comment: 'The AI audit gave me a lot of actionable insights. Some of the simulated scores were a bit generic, but the recommendations were solid.',
    date: new Date('2023-01-04T16:00:00Z').toISOString(),
    userName: 'WebmasterWill',
    isTestimonial: false, // This one is not a testimonial initially
  },
];


export const FeedbackProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    const feedbacksColRef = db.collection('feedbacks');
    try {
      const q = feedbacksColRef.orderBy('date', 'desc');
      const querySnapshot = await q.get();

      if (querySnapshot.empty) {
        // Collection is empty, seed it with initial data for demo purposes
        const batch = db.batch();
        initialSampleFeedbacks.forEach(fb => {
          const docRef = feedbacksColRef.doc(fb.id); // Use specific ID for seeding
          batch.set(docRef, fb);
        });
        await batch.commit();
        setFeedbacks(initialSampleFeedbacks.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } else {
        const feedbacksData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Feedback));
        setFeedbacks(feedbacksData);
      }
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const addFeedback = useCallback(async (feedbackData: Omit<Feedback, 'id' | 'date' | 'isTestimonial'>) => {
    const newFeedback: Omit<Feedback, 'id'> = {
      ...feedbackData,
      date: new Date().toISOString(),
      isTestimonial: false, // New feedback is not a testimonial by default
    };
    try {
      const feedbacksColRef = db.collection('feedbacks');
      const docRef = await feedbacksColRef.add(newFeedback);
      setFeedbacks(prevFeedbacks => [{...newFeedback, id: docRef.id}, ...prevFeedbacks]);
    } catch (error) {
      console.error("Error adding feedback:", error);
    }
  }, []);

  const toggleTestimonialStatus = useCallback(async (feedbackId: string) => {
    const feedbackToUpdate = feedbacks.find(fb => fb.id === feedbackId);
    if (!feedbackToUpdate) return;
    
    const newStatus = !feedbackToUpdate.isTestimonial;
    const feedbackDocRef = db.collection('feedbacks').doc(feedbackId);

    try {
      await feedbackDocRef.update({ isTestimonial: newStatus });
      setFeedbacks(prevFeedbacks =>
        prevFeedbacks.map(fb =>
          fb.id === feedbackId ? { ...fb, isTestimonial: newStatus } : fb
        )
      );
    } catch (error) {
      console.error("Error toggling testimonial status:", error);
    }
  }, [feedbacks]);

  const getTestimonials = useCallback((): Feedback[] => {
    return feedbacks.filter(fb => fb.isTestimonial).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [feedbacks]);

  const getAllFeedbacks = useCallback((): Feedback[] => {
    return [...feedbacks].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [feedbacks]);

  const hasUserSubmittedFeedbackForTool = useCallback((toolId: string): boolean => {
    // This logic remains client-side for simplicity, as it's about UI behavior within a session.
    const submittedThisSession = sessionStorage.getItem(`feedback_submitted_${toolId}`);
    return submittedThisSession === 'true';
  }, []);


  return (
    <FeedbackContext.Provider value={{ feedbacks, loading, addFeedback, getTestimonials, getAllFeedbacks, toggleTestimonialStatus, hasUserSubmittedFeedbackForTool }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = (): FeedbackContextType => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
