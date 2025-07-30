import React, { useState, useEffect, ChangeEvent, useRef, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { toolCategoriesData } from '../constants';
import { Tool, ToolCategoryKey } from '../types';
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { useAuth } from '../contexts/AuthContext'; 
import { useFeedback } from '../contexts/FeedbackContext';
import { db } from '../firebaseConfig';


// --- Interfaces for various tools ---

interface HabitEntry {
  workout: string;
  waterIntake: number;
  sleepHours: number;
  meals: string;
  steps: number;
}

interface StoredHabitData {
  entries: Record<string, HabitEntry>;
  streak: number;
  badges: string[];
}

const postureTips = {
  good: [
    "Great posture! Keep it up to maintain spinal health.",
    "Excellent alignment! Remember to take short breaks often.",
    "Your posture looks good. Ensure your monitor is at eye level."
  ],
  bad: [
    "Try to sit more upright, with your shoulders back and relaxed.",
    "Consider adjusting your chair for better lumbar support.",
    "Gently tuck your chin in to align your head over your shoulders.",
    "Are your feet flat on the floor? This helps stabilize your posture."
  ],
  stretch: [
    "Neck Tilt: Gently tilt your head to one side, hold for 15s, repeat on other side.",
    "Shoulder Rolls: Roll your shoulders backward and down 5 times, then forward 5 times.",
    "Torso Twist: While seated, gently twist your upper body to one side, hold, then switch.",
    "Wrist Stretches: Extend one arm, palm up, gently bend wrist down with other hand. Repeat with palm down and other arm.",
    "Upper Back Stretch: Clasp hands in front, round your upper back, and reach forward."
  ],
  eyeStrain: [
    "Practice the 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds.",
    "Blink frequently to keep your eyes moist.",
    "Adjust your screen brightness to match your room's lighting.",
    "Increase font size if you find yourself squinting."
  ],
  general: [
    "Remember to take short breaks every 30-60 minutes.",
    "Stay hydrated! Drinking water benefits your whole body, including your muscles and joints.",
    "A short walk can do wonders for your energy and focus."
  ]
};

interface MoodEnergyEntry {
  mood: string;
  stressLevel: number;
  energyLevel: number;
  notes?: string;
  relatedActivity?: string;
}
interface StoredMoodEnergyData {
  entries: Record<string, MoodEnergyEntry>;
}
const moodOptions = ["Happy 😊", "Okay 😐", "Sad 😢", "Stressed 😫", "Tired 😴", "Energetic ✨", "Calm 😌", "Anxious 😟"];
const levelOptions = [
  { value: 1, label: "1 (Very Low)" }, { value: 2, label: "2 (Low)" }, { value: 3, label: "3 (Medium)" },
  { value: 4, label: "4 (High)" }, { value: 5, label: "5 (Very High)" },
];

interface Fh4BaseEntry { id: string; timestamp: string; from: string; }
interface Fh4WorkoutEntry extends Fh4BaseEntry { type: 'workout'; activity: string; duration: number; notes?: string; }
interface Fh4CheerEntry extends Fh4BaseEntry { type: 'cheer'; message: string; to: string; }
type Fh4LogEntry = Fh4WorkoutEntry | Fh4CheerEntry;
interface Fh4StoredData { userName?: string; buddyName?: string; myLogs: Fh4LogEntry[]; partnerLogs: Fh4LogEntry[]; badges: string[]; firstSyncAchieved?: boolean; }

interface Fh5Item { text: string; skipped: boolean; suggestionIndex?: number; }
interface Fh5MealPlan { breakfast: Fh5Item; lunch: Fh5Item; dinner: Fh5Item; snacks: Fh5Item; }
interface Fh5ExercisePlan { morningActivity: Fh5Item; afternoonActivity: Fh5Item; eveningActivity: Fh5Item; }
interface Fh5PlannerEntry { goal: string; mealPlan: Fh5MealPlan; exercisePlan: Fh5ExercisePlan; }
interface Fh5StoredPlannerData { entries: Record<string, Fh5PlannerEntry>; }
const healthGoalOptions = ["General Fitness", "Weight Loss", "Muscle Gain", "Improve Endurance"];
const fh5Suggestions: Record<string, { meals: Record<keyof Fh5MealPlan, string[]>, exercises: Record<keyof Fh5ExercisePlan, string[]> }> = {
    "General Fitness": { meals: { breakfast: ["Oatmeal with fruits", "Toast with avocado"], lunch: ["Chicken salad", "Quinoa bowl"], dinner: ["Baked salmon", "Tofu stir-fry"], snacks: ["Apple", "Yogurt"] }, exercises: { morningActivity: ["30 min walk", "20 min yoga"], afternoonActivity: ["Cycling", "Swimming"], eveningActivity: ["Stretching", "Rest"] } },
    "Weight Loss": { meals: { breakfast: ["Egg whites", "Greek yogurt"], lunch: ["Large salad", "Vegetable soup"], dinner: ["Baked cod", "Chicken breast"], snacks: ["Cucumber", "Celery"] }, exercises: { morningActivity: ["45 min cardio", "30 min HIIT"], afternoonActivity: ["Strength training", "Circuit training"], eveningActivity: ["Active recovery", "Evening walk"] } },
    "Muscle Gain": { meals: { breakfast: ["Protein pancakes", "Omelette"], lunch: ["Lean beef", "Quinoa salad"], dinner: ["Salmon fillet", "Ground turkey"], snacks: ["Protein shake", "Cottage cheese"] }, exercises: { morningActivity: ["Strength training", "Hypertrophy workout"], afternoonActivity: ["Accessory exercises", "Bodybuilding workout"], eveningActivity: ["Mobility work", "Light cardio"] } },
    "Improve Endurance": { meals: { breakfast: ["Oatmeal with banana", "Bagel with peanut butter"], lunch: ["Pasta with protein", "Brown rice bowl"], dinner: ["Chicken with quinoa", "Lentil stew"], snacks: ["Energy bars", "Banana"] }, exercises: { morningActivity: ["Long run", "Extended cycling"], afternoonActivity: ["Tempo run", "Hill repeats"], eveningActivity: ["Cross-training", "Recovery jog"] } }
};

interface Fh6Biometrics { age: string; gender: 'male' | 'female'; height: string; weight: string; activityLevel: string; }
interface Fh6DailyLog { intake: number; tdee: number; }
interface Fh6StoredData { biometrics: Fh6Biometrics; dailyLogs: Record<string, Fh6DailyLog>; }
const genderOptionsFh6 = [{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }];
const activityLevelOptionsFh6: Record<string, { label: string; multiplier: number }> = {
    sedentary: { label: 'Sedentary', multiplier: 1.2 }, light: { label: 'Lightly Active', multiplier: 1.375 },
    moderate: { label: 'Moderately Active', multiplier: 1.55 }, very: { label: 'Very Active', multiplier: 1.725 },
    super: { label: 'Super Active', multiplier: 1.9 },
};

interface Fh7SleepEntry { totalSleep: number; deepSleep: number; lightSleep: number; remSleep: number; quality: string; }
interface Fh7WorkoutEntry { intensity: string; }
interface Fh7StoredLogs { sleepLogs: Record<string, Fh7SleepEntry>; workoutLogs: Record<string, Fh7WorkoutEntry>; }
const sleepQualityOptionsFh7 = ["Excellent", "Good", "Fair", "Poor"];
const workoutIntensityOptionsFh7 = ["High Intensity", "Moderate Intensity", "Light Activity / Recovery", "Rest Day"];

interface Fh8Settings { avgCycleLength: number; avgPeriodLength: number; }
interface Fh8PeriodLog { startDate: string; duration: number; }
interface Fh8DailyEntry { phase: string; symptoms: string[]; workoutNotes: string; nutritionNotes: string; }
interface Fh8StoredData { settings: Fh8Settings; periodHistory: Fh8PeriodLog[]; dailyEntries: Record<string, Fh8DailyEntry>; }
const commonSymptomsFh8 = ["Cramps", "Fatigue", "Bloating", "Mood Swings", "Headache", "Energy Spike", "Cravings", "Tender Breasts", "Acne Breakout"];
type CyclePhase = "Menstrual" | "Follicular" | "Ovulation" | "Luteal" | "Unknown";
const phaseSuggestionsFh8: Record<CyclePhase, { workout: string; nutrition: string; description: string }> = {
    Menstrual: { description: "Energy levels are typically lower. Focus on rest and gentle movement.", workout: "Light yoga, walking, stretching.", nutrition: "Iron-rich foods (leafy greens, red meat), anti-inflammatory foods (ginger, turmeric)." },
    Follicular: { description: "Energy levels begin to rise. A great time for challenging workouts.", workout: "Cardio, HIIT, strength training.", nutrition: "Lean proteins, complex carbs for energy." },
    Ovulation: { description: "Peak energy and strength. This is the best time to push for personal bests.", workout: "High-intensity training, powerlifting.", nutrition: "Fiber-rich foods, antioxidants from fruits and vegetables." },
    Luteal: { description: "Energy may decline. Listen to your body and adjust intensity.", workout: "Moderate cardio, pilates, bodyweight strength.", nutrition: "Magnesium-rich foods (nuts, seeds), calcium, and B-vitamins." },
    Unknown: { description: "Cycle data not available. Focus on consistent, balanced habits.", workout: "A mix of moderate cardio, strength, and flexibility work.", nutrition: "A balanced diet rich in whole foods." }
};

interface Seo1Data { content: string; keywords: string; results?: any; }
interface Seo2Data { mainKeyword: string; competitors: string[]; results?: any; }
interface Seo3Data { contacts: { name: string; email: string; status: string; }[]; outreachTemplates: { name:string; subject:string; body: string}[]; backlinks: { url: string; anchorText: string; status: string; qualityScore: number }[]; }
interface Seo4Data { url: string; auditResults?: any; }
interface Seo5Data { topic: string; keywords: string; tone: string; results?: { title: string; description: string }[]; }
interface Seo6Data { keyword: string; location:string; results?: any; }
interface Img1Data { originalImage: string | null; modifiedImage: string | null; bgColor: string; }
interface Img2Data { originalImage: string | null; upscaledImage: string | null; }
interface Img3Data { originalImage: string | null; extractedText: string | null; }

const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

const ToolPage: React.FC = () => {
  const { categoryPath, toolId } = useParams<{ categoryPath: ToolCategoryKey, toolId: string }>();
  const { user, login } = useAuth();
  const isLoggedIn = !!user;

  const [data, setData] = useState<any>(null); // Use null for clearer loading state
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(true); // Track database connection status
  const debounceTimeout = useRef<number | null>(null);

  // State specifically for the MediaStream, to keep it out of the 'data' object that gets persisted.
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);

  const getInitialToolData = useCallback((id: string): any => {
    switch (id) {
      case 'fh1': return { entries: {}, streak: 0, badges: [] };
      case 'fh2': return { posture: 'unknown', tip: 'Enable your camera and click "Start Monitoring" to get feedback.', monitoring: false };
      case 'fh3': return { entries: {} };
      case 'fh4': return { userName: '', buddyName: 'Fitness Pal', myLogs: [], partnerLogs: [], badges: [], firstSyncAchieved: false };
      case 'fh5': return { entries: {} };
      case 'fh6': return { biometrics: { age: '', gender: 'male', height: '', weight: '', activityLevel: 'sedentary' }, dailyLogs: {} };
      case 'fh7': return { sleepLogs: {}, workoutLogs: {} };
      case 'fh8': return { settings: { avgCycleLength: 28, avgPeriodLength: 5 }, periodHistory: [], dailyEntries: {} };
      case 'seo1': return { content: '', keywords: '', results: null };
      case 'seo2': return { mainKeyword: '', competitors: ['', '', ''], results: null };
      case 'seo3': return { contacts: [], outreachTemplates: [{name: 'Initial Outreach', subject: 'Collaboration Inquiry', body: 'Hi [Name], ...'}], backlinks: [] };
      case 'seo4': return { url: '', auditResults: null };
      case 'seo5': return { topic: '', keywords: '', tone: 'Neutral', results: null };
      case 'seo6': return { keyword: '', location: 'United States', results: null };
      case 'img1': return { originalImage: null, modifiedImage: null, bgColor: '#ffffff' };
      case 'img2': return { originalImage: null, upscaledImage: null };
      case 'img3': return { originalImage: null, extractedText: null };
      default: return {};
    }
  }, []);

  useEffect(() => {
    if (!toolId) return;
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      setData(null);
      setIsOnline(true);
      if (user && user.uid && toolId) {
        const docRef = db.collection('userToolData').doc(user.uid).collection('tools').doc(toolId);
        try {
          const docSnap = await docRef.get();
          const docData = docSnap.data();
          if (docSnap.exists && docData?.content) {
            setData(docData.content);
          } else {
            setData(getInitialToolData(toolId));
          }
        } catch (err: any) {
          console.error("Error fetching tool data from Firestore:", err);
          if (err.code === 'unavailable' || err.code === 'unauthenticated' || (err.message && err.message.includes('client is offline'))) {
              setIsOnline(false);
              setError("Could not connect to the database. Your progress will not be saved. Please check your internet connection and the app's configuration.");
          } else {
              setError(`Could not load saved data. Using fresh data. (Error: ${err.code})`);
          }
          setData(getInitialToolData(toolId));
        }
      } else {
        setData(getInitialToolData(toolId));
      }
      setIsLoading(false);
    };
    loadData();
  }, [toolId, user?.uid, getInitialToolData]);

  useEffect(() => {
    if (isLoading || !user || data === null || !isOnline) return;
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = window.setTimeout(async () => {
      if (toolId && user && user.uid) {
        const docRef = db.collection('userToolData').doc(user.uid).collection('tools').doc(toolId);
        try {
          await docRef.set({ content: data });
        } catch (err) {
          console.error("Error saving tool data to Firestore:", err);
          setError("Your progress could not be saved. Please check your connection.");
        }
      }
    }, 1500);
    return () => { if (debounceTimeout.current) clearTimeout(debounceTimeout.current); };
  }, [data, toolId, user?.uid, isLoading, isOnline]);

  const tool = categoryPath && toolId ? toolCategoriesData[categoryPath]?.tools.find(t => t.id === toolId) : undefined;
  
  const { addFeedback, hasUserSubmittedFeedbackForTool } = useFeedback();
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating > 0 && comment.trim() && tool) {
        await addFeedback({
            toolId: tool.id, toolName: tool.name, rating, comment,
            userName: user?.isAnonymous ? "Pro User" : (user?.displayName || "Anonymous")
        });
        setFeedbackSubmitted(true);
        sessionStorage.setItem(`feedback_submitted_${tool.id}`, 'true');
    }
  };
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    // Effect for cleaning up resources on component unmount or when dependencies change.
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);
  
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, field: string, otherFields: object = {}) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setData(prev => ({ ...prev, [field]: event.target?.result as string, ...otherFields }));
      };
      reader.readAsDataURL(file);
    }
  };

  const callGemini = useCallback(async (prompt: string, jsonResponse: boolean = false) => {
    setIsProcessing(true);
    setError(null);
    try {
      if (!process.env.API_KEY) throw new Error("API_KEY environment variable not set.");
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            safetySettings,
            ...(jsonResponse && { responseMimeType: "application/json" })
        }
      });
      
      let text = response.text;
      if (jsonResponse) {
        let jsonStr = text.trim().replace(/^```(json)?|```$/g, '').trim();
        return JSON.parse(jsonStr);
      }
      return text;
    } catch (err: any) {
      console.error("Error calling Gemini API:", err);
      setError(`Failed to get response from AI. ${err.message}`);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const callGeminiWithImage = async (prompt: string, base64Image: string, mimeType: string) => {
      setIsProcessing(true);
      setError(null);
      try {
          if (!process.env.API_KEY) throw new Error("API_KEY environment variable not set.");
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const imagePart = { inlineData: { data: base64Image.split(',')[1], mimeType } };
          const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: { parts: [imagePart, { text: prompt }] },
              config: {
                safetySettings
              }
          });
          return response.text;
      } catch (err: any) {
          console.error("Error calling Gemini Vision API:", err);
          setError(`Failed to analyze image. ${err.message}`);
          return null;
      } finally {
          setIsProcessing(false);
      }
  };

  if (!tool) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-slate-700">Tool not found!</h2>
        <Link to="/tools" className="mt-4 inline-block bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600">Back to Tools</Link>
      </div>
    );
  }

  const ProFeatureLock = () => (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 my-6 rounded-md shadow-md text-center">
        <h3 className="font-bold text-xl mb-2">This is a Pro Feature!</h3>
        <p className="mb-4">Please log in to use this tool and save your progress.</p>
        <button onClick={login} className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200">Login to Pro</button>
    </div>
  );

  const renderToolContent = () => {
    if (isLoading || data === null) {
      return (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-slate-500">Loading Tool...</p>
        </div>
      );
    }

    if (tool.isPro && !isLoggedIn) return <ProFeatureLock />;
    
    switch (tool.id) {
        case 'fh1': {
            const today = new Date().toISOString().split('T')[0];
            const currentEntry = data.entries?.[today] || { workout: '', waterIntake: 0, sleepHours: 0, meals: '', steps: 0 };
            
            const handleHabitChange = (field: keyof HabitEntry, value: string | number) => {
                setData(prev => {
                    const newEntries = { ...(prev.entries || {}) };
                    newEntries[today] = { ...(newEntries[today] || {}), [field]: value };
                    return { ...prev, entries: newEntries };
                });
            };
            const handleLogHabit = () => {
                setData((prev: StoredHabitData) => {
                    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
                    const newStreak = prev.entries?.[yesterday] ? (prev.streak || 0) + 1 : 1;
                    const newBadges = [...(prev.badges || [])];
                    if (newStreak >= 7 && !newBadges.includes("7-Day Streak")) newBadges.push("7-Day Streak");
                    if (newStreak >= 30 && !newBadges.includes("30-Day Legend")) newBadges.push("30-Day Legend");
                    return { ...prev, streak: newStreak, badges: newBadges };
                });
            };
            return (
                <div>
                    <h3 className="text-xl font-semibold mb-4">Log Today's Habits ({today})</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input type="text" placeholder="Workout (e.g., 30min run)" value={currentEntry.workout} onChange={e => handleHabitChange('workout', e.target.value)} className="p-2 border rounded"/>
                        <input type="number" placeholder="Water Intake (glasses)" value={currentEntry.waterIntake} onChange={e => handleHabitChange('waterIntake', parseInt(e.target.value))} className="p-2 border rounded"/>
                        <input type="number" placeholder="Sleep (hours)" value={currentEntry.sleepHours} onChange={e => handleHabitChange('sleepHours', parseFloat(e.target.value))} className="p-2 border rounded"/>
                        <input type="text" placeholder="Meals (e.g., Salad, Chicken)" value={currentEntry.meals} onChange={e => handleHabitChange('meals', e.target.value)} className="p-2 border rounded"/>
                        <input type="number" placeholder="Steps" value={currentEntry.steps} onChange={e => handleHabitChange('steps', parseInt(e.target.value))} className="p-2 border rounded"/>
                    </div>
                    <button onClick={handleLogHabit} className="mt-4 bg-teal-500 text-white px-4 py-2 rounded w-full hover:bg-teal-600">Update Streak & Badges</button>
                    <div className="mt-4 flex justify-around p-4 bg-slate-50 rounded-lg">
                        <p>🔥 Streak: {data.streak || 0} days</p>
                        <p>🏆 Badges: {data.badges?.join(', ') || 'None yet!'}</p>
                    </div>
                </div>
            );
        }
        case 'fh2': {
            const { posture, tip, monitoring } = data;

            const startMonitoring = async () => {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    try {
                        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                        setMediaStream(stream); // Store stream in its own state
                        if (videoRef.current) videoRef.current.srcObject = stream;
                        setData(prev => ({ ...prev, monitoring: true, tip: "Monitoring started. Sit naturally." }));
                        
                        intervalRef.current = window.setInterval(() => {
                            const random = Math.random();
                            let newPosture = 'good';
                            let newTipKey: keyof typeof postureTips = 'general';
                            if (random < 0.3) { newPosture = 'bad'; newTipKey = 'bad';} 
                            else if (random < 0.6) { newPosture = 'good'; newTipKey = 'good';}
                            else if (random < 0.8) {newTipKey = 'stretch';}
                            else {newTipKey = 'eyeStrain';}
                            
                            const tipsArray = postureTips[newTipKey];
                            const randomTip = tipsArray[Math.floor(Math.random() * tipsArray.length)];
                            setData(prev => ({ ...prev, posture: newPosture, tip: randomTip }));
                        }, 15000); // Check every 15 seconds
                    } catch (err) {
                        setError("Could not access camera. Please grant permission.");
                        setData(prev => ({ ...prev, monitoring: false }));
                    }
                }
            };
            const stopMonitoring = () => {
                if (intervalRef.current) clearInterval(intervalRef.current);
                if (mediaStream) {
                    mediaStream.getTracks().forEach(track => track.stop());
                    setMediaStream(null);
                }
                if (videoRef.current) {
                    videoRef.current.srcObject = null;
                }
                setData(prev => ({ ...prev, monitoring: false, tip: 'Monitoring stopped. Click "Start" to resume.' }));
            };
             return (
                 <div>
                    <video ref={videoRef} autoPlay playsInline muted className={`w-full rounded-lg bg-slate-200 mb-4 ${!monitoring && 'hidden'}`}></video>
                    <div className="flex space-x-4 mb-4">
                        <button onClick={startMonitoring} disabled={monitoring} className="w-full bg-green-500 text-white px-4 py-2 rounded disabled:bg-slate-400">Start Monitoring</button>
                        <button onClick={stopMonitoring} disabled={!monitoring} className="w-full bg-red-500 text-white px-4 py-2 rounded disabled:bg-slate-400">Stop Monitoring</button>
                    </div>
                    <div className={`p-4 rounded-lg text-center border-2 ${posture === 'good' ? 'border-green-500 bg-green-50' : posture === 'bad' ? 'border-red-500 bg-red-50' : 'border-slate-300 bg-slate-50'}`}>
                        <p className="font-semibold text-lg">AI Feedback:</p>
                        <p className="text-slate-700">{tip}</p>
                    </div>
                 </div>
             );
        }
        case 'fh3': {
            const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
            const [aiInsight, setAiInsight] = useState('');

            const currentEntry: MoodEnergyEntry = data.entries?.[selectedDate] || {
                mood: moodOptions[0],
                stressLevel: 3,
                energyLevel: 3,
                notes: '',
                relatedActivity: ''
            };

            const handleMoodChange = (field: keyof MoodEnergyEntry, value: string | number) => {
                setData((prev: StoredMoodEnergyData) => {
                    const newEntries = { ...(prev.entries || {}) };
                    newEntries[selectedDate] = { 
                        ...(newEntries[selectedDate] || { mood: moodOptions[0], stressLevel: 3, energyLevel: 3 }),
                        [field]: value
                    };
                    return { ...prev, entries: newEntries };
                });
            };
            
            const handleGetInsight = async () => {
                const recentEntries = Object.entries(data.entries || {})
                    .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                    .slice(0, 5)
                    .map(([date, entry]: [string, MoodEnergyEntry]) => `On ${date}: mood was ${entry.mood}, stress was ${entry.stressLevel}/5, energy was ${entry.energyLevel}/5. Notes: ${entry.notes || 'none'}.`)
                    .join('\n');
                    
                if (!recentEntries) {
                    setAiInsight("Not enough data to provide an insight. Please log your mood for a few days.");
                    return;
                }
                
                const prompt = `Based on my recent logs, suggest a simple wellness activity for me today. Be encouraging and brief. My logs:\n${recentEntries}`;
                const result = await callGemini(prompt);
                if (result) {
                    setAiInsight(result);
                }
            };
            
            const recentLogs = Object.entries(data.entries || {})
                .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
                .slice(0, 7);

            return (
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Left Side: Logging */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold mb-2">Log Your Mood & Energy</h3>
                            <div>
                                <label htmlFor="mood-date" className="block text-sm font-medium text-slate-700">Date</label>
                                <input type="date" id="mood-date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500"/>
                            </div>
                            <div>
                                <label htmlFor="mood-select" className="block text-sm font-medium text-slate-700">How are you feeling?</label>
                                <select id="mood-select" value={currentEntry.mood} onChange={e => handleMoodChange('mood', e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm bg-white focus:ring-teal-500 focus:border-teal-500">
                                    {moodOptions.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="stress-level" className="block text-sm font-medium text-slate-700">Stress Level: {currentEntry.stressLevel}</label>
                                <input id="stress-level" type="range" min="1" max="5" value={currentEntry.stressLevel} onChange={e => handleMoodChange('stressLevel', parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"/>
                            </div>
                            <div>
                                <label htmlFor="energy-level" className="block text-sm font-medium text-slate-700">Energy Level: {currentEntry.energyLevel}</label>
                                <input id="energy-level" type="range" min="1" max="5" value={currentEntry.energyLevel} onChange={e => handleMoodChange('energyLevel', parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"/>
                            </div>
                            <div>
                                <label htmlFor="mood-notes" className="block text-sm font-medium text-slate-700">Notes (optional)</label>
                                <textarea id="mood-notes" rows={3} value={currentEntry.notes || ''} onChange={e => handleMoodChange('notes', e.target.value)} className="mt-1 block w-full p-2 border border-slate-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500" placeholder="Any thoughts or events to note?"></textarea>
                            </div>
                        </div>
                        
                        {/* Right Side: Insights and History */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold mb-2">Insights & History</h3>
                             <button onClick={handleGetInsight} disabled={isProcessing} className="w-full bg-teal-500 text-white px-4 py-2 rounded disabled:bg-slate-400">
                                {isProcessing ? 'Thinking...' : 'Get AI Suggestion'}
                            </button>
                            {aiInsight && (
                                <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
                                     <h4 className="font-semibold text-blue-800">💡 AI Wellness Tip</h4>
                                     <p className="text-blue-700 mt-1 whitespace-pre-wrap">{aiInsight}</p>
                                </div>
                            )}
                            <div className="h-64 overflow-y-auto pr-2 space-y-3">
                                {recentLogs.length > 0 ? recentLogs.map(([date, entry]: [string, any]) => (
                                    <div key={date} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                                        <p className="font-semibold text-slate-800">{new Date(date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <p className="text-sm text-slate-600">Mood: {entry.mood} | Stress: {entry.stressLevel}/5 | Energy: {entry.energyLevel}/5</p>
                                        {entry.notes && <p className="text-xs text-slate-500 mt-1 italic">"{entry.notes}"</p>}
                                    </div>
                                )) : (
                                    <div className="text-center py-10">
                                        <p className="text-slate-500">No logs yet. Start tracking your mood to see your history here!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        case 'img1': {
            const { originalImage, modifiedImage, bgColor } = data;
            const handleBgRemove = async () => {
                if(!originalImage) { setError("Please upload an image first."); return; }
                const result = await callGeminiWithImage("Analyze the image and provide a very short, one to three word description of the main subject.", originalImage, 'image/jpeg');
                if (result) {
                    setData(prev => ({ ...prev, modifiedImage: `Simulated cutout of: ${result}` }));
                }
            };
            return (
                 <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div>
                            <label className="block mb-2 font-semibold">1. Upload Image</label>
                            <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'originalImage', { modifiedImage: null })} className="w-full" />
                            {originalImage && <img src={originalImage} alt="Original" className="mt-4 rounded shadow-md max-h-60" />}
                        </div>
                        <div>
                            <label className="block mb-2 font-semibold">2. Choose Background Color</label>
                            <input type="color" value={bgColor} onChange={e => setData(prev => ({...prev, bgColor: e.target.value}))} className="w-full h-10 p-1 border rounded" />
                        </div>
                    </div>
                    <button onClick={handleBgRemove} disabled={isProcessing || !originalImage} className="mt-4 w-full bg-teal-500 text-white px-4 py-2 rounded disabled:bg-slate-400">
                        {isProcessing ? "Analyzing..." : "Remove Background (AI Simulated)"}
                    </button>
                     <div className="mt-4 p-4 border rounded-lg text-center">
                        <h4 className="font-semibold text-lg">Result</h4>
                         {modifiedImage ? (
                            <div className="inline-block mt-2">
                                <div style={{ backgroundColor: bgColor }} className="p-4 rounded inline-block">
                                    <img src={originalImage!} alt="Foreground" className="max-h-60" style={{ mixBlendMode: 'screen' }} />
                                </div>
                                <p className="text-center font-mono mt-2 text-xs bg-white p-1 rounded shadow-sm">{modifiedImage}</p>
                            </div>
                         ) : <p className="text-slate-500 mt-2">Result will appear here.</p>}
                     </div>
                </div>
            );
        }
        case 'img2': {
            const { originalImage, upscaledImage } = data;
             const handleUpscale = async () => {
                if(!originalImage) { setError("Please upload an image first."); return; }
                const result = await callGeminiWithImage("This is a low-resolution image. I need you to act as an AI image upscaler. Describe in one sentence what a higher resolution, enhanced version of this image would look like.", originalImage, 'image/jpeg');
                if (result) {
                    setData(prev => ({ ...prev, upscaledImage: `Simulation: ${result}` }));
                }
            };
            return (
                <div>
                    <label className="block mb-2 font-semibold">1. Upload Image to Upscale</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'originalImage', { upscaledImage: null })} className="w-full mb-4" />
                    <button onClick={handleUpscale} disabled={isProcessing || !originalImage} className="w-full bg-teal-500 text-white px-4 py-2 rounded disabled:bg-slate-400">
                        {isProcessing ? "Enhancing..." : "Upscale & Enhance Image (AI Simulated)"}
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-center">
                        <div>
                            <h4 className="font-semibold">Original</h4>
                            {originalImage ? <img src={originalImage} alt="Original" className="mt-2 rounded shadow-md mx-auto max-h-60" /> : <p className="text-slate-400">No image</p>}
                        </div>
                        <div>
                            <h4 className="font-semibold">Upscaled Result</h4>
                            {upscaledImage ? (
                                <div>
                                    <img src={originalImage!} alt="Upscaled" className="mt-2 rounded shadow-md mx-auto max-h-60 opacity-90" style={{ transform: 'scale(1.05)' }}/>
                                    <p className="text-xs bg-white p-2 rounded shadow-sm mt-2">{upscaledImage}</p>
                                </div>
                            ) : <p className="text-slate-400">Result will appear here</p>}
                        </div>
                    </div>
                </div>
            );
        }
        case 'img3': {
            const { originalImage, extractedText } = data;
            const handleExtractText = async () => {
                if (!originalImage) { setError("Please upload an image first."); return; }
                const result = await callGeminiWithImage("Extract all text from this image. Present the text with its original formatting if possible.", originalImage, 'image/jpeg');
                if (result) {
                    setData(prev => ({ ...prev, extractedText: result }));
                }
            };
            return (
                <div>
                    <label className="block mb-2 font-semibold">1. Upload Image for Text Extraction</label>
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'originalImage', { extractedText: null })} className="w-full mb-4" />
                    
                    <button onClick={handleExtractText} disabled={isProcessing || !originalImage} className="w-full bg-teal-500 text-white px-4 py-2 rounded disabled:bg-slate-400">
                        {isProcessing ? "Extracting..." : "Extract Text (AI-Powered OCR)"}
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="text-center">
                            <h4 className="font-semibold mb-2">Original Image</h4>
                            {originalImage ? <img src={originalImage} alt="Uploaded for OCR" className="mt-2 rounded shadow-md mx-auto max-h-80" /> : <p className="text-slate-400">Upload an image to begin.</p>}
                        </div>
                        <div className="text-center">
                            <h4 className="font-semibold mb-2">Extracted Text</h4>
                            {extractedText ? (
                                <textarea
                                    readOnly
                                    value={extractedText}
                                    className="w-full h-80 p-3 bg-slate-50 border border-slate-200 rounded-md font-mono text-sm shadow-inner"
                                    placeholder="Extracted text will appear here."
                                ></textarea>
                            ) : (
                                <div className="flex items-center justify-center w-full h-80 p-3 bg-slate-50 border border-slate-200 rounded-md">
                                    <p className="text-slate-400">Text will appear here after extraction.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
        case 'seo1':
        case 'seo2':
        case 'seo4':
        case 'seo5':
        case 'seo6': {
             const handleSeoGenerate = async () => {
                let prompt = '';
                switch(tool.id) {
                    case 'seo1': prompt = `Act as an SEO expert. Analyze the following content and suggest improvements based on the keywords "${data.keywords}". Provide feedback on readability, keyword density, and E-E-A-T. Content: "${data.content}"`; break;
                    case 'seo2': prompt = `Act as an SEO expert. Find keyword gaps. My main keyword is "${data.mainKeyword}". My competitors are ${data.competitors.join(', ')}. Suggest 5 related keywords I could target that they might be missing.`; break;
                    case 'seo4': prompt = `Act as an SEO expert. Perform a simulated SEO audit for the URL "${data.url}". Provide a summary of on-page issues, mobile-friendliness, and Core Web Vitals, with 3 actionable tips.`; break;
                    case 'seo5': prompt = `Generate 3 SEO-friendly meta titles and descriptions for a webpage about "${data.topic}". The target keywords are "${data.keywords}". The desired tone of voice is "${data.tone}". Return the result as a JSON array of objects, where each object has a "title" and a "description" key.`; break;
                    case 'seo6': prompt = `Act as an SEO expert. Provide a simulated local rank tracking report for the keyword "${data.keyword}" in "${data.location}". Include a mock rank for Google Search and Google Maps, and list 2 mock local competitors.`; break;
                }
                const isJson = tool.id === 'seo5';
                const result = await callGemini(prompt, isJson);
                if (result) setData(prev => ({ ...prev, results: result }));
            };
            const handleFieldChange = (field: string, value: any) => {
                setData(prev => ({ ...prev, [field]: value }));
            };
            return (
                <div className="space-y-4">
                    {tool.id === 'seo1' && <>
                        <textarea value={data.content} onChange={e => handleFieldChange('content', e.target.value)} placeholder="Paste your content here..." className="w-full p-2 border rounded h-32"></textarea>
                        <input type="text" value={data.keywords} onChange={e => handleFieldChange('keywords', e.target.value)} placeholder="Target keywords..." className="w-full p-2 border rounded" />
                    </>}
                    {tool.id === 'seo2' && <>
                        <input type="text" value={data.mainKeyword} onChange={e => handleFieldChange('mainKeyword', e.target.value)} placeholder="Your main keyword" className="w-full p-2 border rounded" />
                        <div className="grid grid-cols-3 gap-2">
                           {data.competitors.map((c: string, i: number) => <input key={i} type="text" value={c} onChange={e => { const newComps = [...data.competitors]; newComps[i] = e.target.value; handleFieldChange('competitors', newComps); }} placeholder={`Competitor ${i+1} URL`} className="p-2 border rounded"/>)}
                        </div>
                    </>}
                    {(tool.id === 'seo4' || tool.id === 'seo6') && <input type="text" value={tool.id === 'seo4' ? data.url : data.keyword} onChange={e => handleFieldChange(tool.id === 'seo4' ? 'url' : 'keyword', e.target.value)} placeholder={tool.id === 'seo4' ? "URL to audit (e.g. https://example.com)" : "Keyword to track"} className="w-full p-2 border rounded" />}
                    {tool.id === 'seo6' && <input type="text" value={data.location} onChange={e => handleFieldChange('location', e.target.value)} placeholder="Location (e.g. New York, NY)" className="w-full p-2 border rounded" />}
                    {tool.id === 'seo5' && <>
                        <input type="text" placeholder="Page Topic (e.g., Best running shoes)" value={data.topic} onChange={e => handleFieldChange('topic', e.target.value)} className="w-full p-2 border rounded"/>
                        <input type="text" placeholder="Keywords (e.g., running, sneakers)" value={data.keywords} onChange={e => handleFieldChange('keywords', e.target.value)} className="w-full p-2 border rounded"/>
                        <select value={data.tone} onChange={e => handleFieldChange('tone', e.target.value)} className="w-full p-2 border rounded bg-white">
                            <option>Neutral</option><option>Professional</option><option>Friendly</option><option>Witty</option>
                        </select>
                    </>}
                    <button onClick={handleSeoGenerate} disabled={isProcessing} className="w-full bg-teal-500 text-white px-4 py-2 rounded disabled:bg-slate-400">
                        {isProcessing ? 'Analyzing...' : 'Generate Results'}
                    </button>
                    {data.results && (
                        <div className="mt-4 p-4 border rounded-lg bg-slate-50">
                             <h4 className="font-bold text-lg mb-2">AI Results:</h4>
                            {typeof data.results === 'string' ? <p className="whitespace-pre-wrap">{data.results}</p> :
                                (Array.isArray(data.results)) ? data.results.map((r: any, i: number) => (
                                    <div key={i} className="p-2 border-b last:border-b-0">
                                        <h5 className="font-bold text-blue-600">{r.title}</h5>
                                        <p className="text-slate-600 mt-1">{r.description}</p>
                                    </div>
                                )) : <p>Could not display result.</p>
                            }
                        </div>
                    )}
                </div>
            );
        }
        default:
            return <div className="bg-yellow-100 p-6 rounded-lg shadow-md"><p>Tool <span className="font-bold">{tool.name}</span> UI is under construction. Check back soon!</p></div>;
    }
  };
  
  return (
    <div className="animate-fadeIn">
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">{tool.name}</h1>
        <div className="mt-3 text-slate-500 text-lg" dangerouslySetInnerHTML={{ __html: tool.line1 }}></div>
      </div>
      
      {!isLoggedIn && !tool.isPro && isOnline && (
         <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-6 rounded-md shadow-sm text-center">
            <p><button onClick={login} className="font-bold underline hover:text-blue-800">Log in as a Pro user</button> to save your progress automatically.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md shadow-sm text-center">
            <p>{error}</p>
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl min-h-[300px]">
        {renderToolContent()}
      </div>

      {tool.line2 && (
        <div className="mt-10 bg-slate-50 p-6 rounded-xl shadow-lg">
            <h3 className="text-2xl font-semibold text-teal-600 mb-3">Unique Touch</h3>
            <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: tool.line2 }}></div>
        </div>
      )}

      <div className="mt-12">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-3xl font-semibold text-slate-700">Share Your Feedback</h3>
          <p className="text-slate-500 mt-2">Help us improve this tool by sharing your experience.</p>
        </div>
        {feedbackSubmitted || hasUserSubmittedFeedbackForTool(tool.id) ? (
          <div className="mt-6 bg-green-100 text-green-800 p-4 rounded-md text-center shadow">Thank you for your feedback!</div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="mt-6 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
             <div className="mb-4">
              <label className="block text-slate-600 font-semibold mb-2">Your Rating</label>
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button type="button" key={star} onClick={() => setRating(star)} className="focus:outline-none">
                    <svg className={`w-8 h-8 transition-colors duration-200 ${rating >= star ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/></svg>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
                <label htmlFor="comment" className="block text-slate-600 font-semibold mb-2">Your Comments</label>
                <textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition" rows={4} placeholder={`What did you like or dislike about the ${tool.name}?`} required></textarea>
            </div>
            <button type="submit" className="w-full bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 font-semibold" disabled={!isLoggedIn}>
              {isLoggedIn ? 'Submit Feedback' : 'Log in to Submit Feedback'}
            </button>
            {!isLoggedIn && <p className="text-xs text-slate-500 text-center mt-2">Feedback can only be submitted by Pro users.</p>}
          </form>
        )}
      </div>
    </div>
  );
};
export default ToolPage;