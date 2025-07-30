import { Tool, ToolCategory, PageKey, ToolCategoryKey } from './types';

export const fitnessTools: Tool[] = [
  { id: 'fh1', name: 'Daily Habit Tracker', line1: '<strong>Features:</strong> Log daily workouts, water intake, sleep, meals, and step count.', line2: '<strong>Unique Touch:</strong> Gamified streak rewards and wellness badges.' },
  { id: 'fh2', name: 'AI Posture Monitor', line1: '<strong>Features:</strong> Webcam-based posture detection, desk stretch reminders, screen time tracking.', line2: '<strong>Unique Touch:</strong> AI tips to reduce back pain or eye strain.' },
  { id: 'fh3', name: 'Mood & Energy Tracker', line1: '<strong>Features:</strong> Log moods, stress, and energy; integrated with fitness routines.', line2: '<strong>Unique Touch:</strong> Offers suggestions like yoga or power naps based on trends.' },
  { id: 'fh4', name: 'Virtual Fitness Buddy', line1: '<strong>Features:</strong> Sync with a partner, share workout logs, challenge each other.', line2: '<strong>Unique Touch:</strong> Real-time cheering, badges, and leaderboard.' },
  { id: 'fh5', name: 'Interactive Meal & Exercise Planner', line1: '<strong>Features:</strong> Custom daily meal and workout suggestions based on health goals.', line2: '<strong>Unique Touch:</strong> Adjusts suggestions dynamically based on user feedback.' },
  { id: 'fh6', name: 'BMR & Calorie Burn Analyzer', line1: '<strong>Features:</strong> Calculates Basal Metabolic Rate and daily calorie burn from activity logs.', line2: '<strong>Unique Touch:</strong> Visual charts showing weekly calorie deficit or surplus.' },
  { id: 'fh7', name: 'Sleep Fitness Sync App', line1: '<strong>Features:</strong> Integrates with wearables to track deep/light sleep vs. workout intensity.', line2: '<strong>Unique Touch:</strong> Suggests ideal workout intensity based on sleep quality.' },
  { id: 'fh8', name: 'Menstrual Cycle & Fitness Tracker', line1: '<strong>Features:</strong> Syncs period tracking with workout and nutrition adjustments.', line2: '<strong>Unique Touch:</strong> AI-driven insights on cycle phases and optimal training times.' }, // Completed line2 for fh8
];

export const seoTools: Tool[] = [
  { id: 'seo1', name: 'AI SEO Content Optimizer', line1: '<strong>Features:</strong> AI-driven content analysis, keyword density, readability scores.', line2: '<strong>Unique Touch:</strong> Suggests LSI keywords and E-E-A-T improvements.', isPro: true },
  { id: 'seo2', name: 'Keyword Research & Gap Finder', line1: '<strong>Features:</strong> Discover new keywords, analyze SERP difficulty, find content gaps.', line2: '<strong>Unique Touch:</strong> AI-powered suggestions based on competitor analysis.', isPro: true },
  { id: 'seo3', name: 'Backlink Monitor & Outreach Tracker', line1: '<strong>Features:</strong> Track (mock) backlinks, manage outreach contacts, use email templates.', line2: '<strong>Unique Touch:</strong> Simulated quality scores and outreach status tracking.' },
  { id: 'seo4', name: 'SEO Audit & Site Health Checker', line1: '<strong>Features:</strong> AI-generated crawl reports, on-page suggestions, mobile & page speed audits.', line2: '<strong>Unique Touch:</strong> Simulated Core Web Vitals and actionable insights.', isPro: true },
  { id: 'seo5', name: 'AI Meta Title & Description Generator', line1: '<strong>Features:</strong> Generate SEO-friendly meta titles and descriptions using AI.', line2: '<strong>Unique Touch:</strong> Options for tone of voice and keyword focus.' },
  { id: 'seo6', name: 'Local SEO Rank Tracker', line1: '<strong>Features:</strong> AI-simulated local keyword rank tracking (Search & Maps), GMB insights.', line2: '<strong>Unique Touch:</strong> Mock competitor visibility snapshots for local areas.', isPro: true },
];

export const imageTools: Tool[] = [
  { id: 'img1', name: 'AI Background Remover', line1: '<strong>Features:</strong> Automatically remove image backgrounds using AI. Set solid color or custom image.', line2: '<strong>Unique Touch:</strong> AI subject detection for precise cutouts; Canvas preview.' },
  { id: 'img2', name: 'Online Image Upscaler & Enhancer', line1: '<strong>Features:</strong> Upscale images and enhance details using AI models.', line2: '<strong>Unique Touch:</strong> Regenerates image based on AI understanding for clarity.' },
  { id: 'img3', name: 'Image to Text Extractor', line1: '<strong>Features:</strong> Extract text from any uploaded image using advanced OCR (Optical Character Recognition) technology.', line2: '<strong>Unique Touch:</strong> AI-powered text recognition provides formatted output that you can copy with one click.' },
  // { id: 'img4', name: 'AI Image Style Transfer', line1: '<strong>Features:</strong> Apply artistic styles of famous paintings to your photos.', line2: '<strong>Unique Touch:</strong> Real-time preview and adjustable style intensity.' },
  // { id: 'img5', name: 'Image Compressor & Optimizer', line1: '<strong>Features:</strong> Reduce image file sizes without significant quality loss.', line2: '<strong>Unique Touch:</strong> Options for lossy/lossless compression, format conversion.' },
  // { id: 'img6', name: 'Photo to Sketch/Cartoon Converter', line1: '<strong>Features:</strong> Transform photos into sketches, cartoons, or drawings.', line2: '<strong>Unique Touch:</strong> Various artistic effects and fine-tuning controls.' },
];

export const toolCategoriesData: Record<ToolCategoryKey, { title: ToolCategory; tools: Tool[]; path: string }> = {
  [PageKey.FITNESS]: {
    title: ToolCategory.FITNESS,
    tools: fitnessTools,
    path: 'fitness',
  },
  [PageKey.SEO]: {
    title: ToolCategory.SEO,
    tools: seoTools,
    path: 'seo',
  },
  [PageKey.IMAGE]: {
    title: ToolCategory.IMAGE_TOOLS,
    tools: imageTools,
    path: 'image',
  },
};