/**
 * Generate test data to see all insights in action
 * Run this in your app to populate with realistic test logs
 */

import { Category, Emotion, LogType } from '../store/useStore';

export function generateTestLogs(count: number = 30) {
  const categories: Category[] = ['Sugar', 'Junk Food', 'Instagram', 'TikTok', 'YouTube', 'Other'];
  const emotions: Emotion[] = ['Curious', 'Restless', 'Stressed', 'Bored', 'Excited'];
  const types: LogType[] = ['observed', 'resisted'];

  const reflectionTemplates = [
    'feeling stressed from work',
    'so tired after long day',
    'sitting alone at home',
    'bored and waiting',
    'anxious about deadlines',
    'need something sweet',
    'just finished work',
    'late at night before bed',
    'procrastinating on work',
    'feeling restless',
  ];

  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;

  return Array.from({ length: count }, (_, i) => {
    // Create varied patterns
    const daysAgo = Math.floor(i / 3); // Spread over ~10 days
    const timestamp = new Date(now - (daysAgo * oneDayMs) - Math.random() * oneDayMs);

    // Time patterns: more cravings at night
    const hour = timestamp.getHours();
    let category: Category;
    let emotion: Emotion;

    // Pattern 1: Stressed -> Sugar
    if (i % 5 === 0) {
      emotion = 'Stressed';
      category = 'Sugar';
    }
    // Pattern 2: Bored -> Instagram/TikTok
    else if (i % 5 === 1 || i % 5 === 2) {
      emotion = 'Bored';
      category = Math.random() > 0.5 ? 'Instagram' : 'TikTok';
    }
    // Random
    else {
      emotion = emotions[Math.floor(Math.random() * emotions.length)];
      category = categories[Math.floor(Math.random() * categories.length)];
    }

    // Resistance rate: better in morning, worse at night
    let type: LogType;
    if (hour >= 6 && hour < 12) {
      type = Math.random() > 0.3 ? 'resisted' : 'observed'; // 70% resist in morning
    } else if (hour >= 21 || hour < 6) {
      type = Math.random() > 0.8 ? 'resisted' : 'observed'; // 20% resist at night
    } else {
      type = Math.random() > 0.5 ? 'resisted' : 'observed'; // 50% otherwise
    }

    // Add reflections to some logs
    const reflection = i % 3 === 0
      ? reflectionTemplates[Math.floor(Math.random() * reflectionTemplates.length)]
      : undefined;

    return {
      category,
      type,
      emotion,
      reflection,
      timestamp,
    };
  });
}

// Console log function to manually add via dev tools
export function printTestDataCommands() {
  const logs = generateTestLogs(30);

  console.log('=== COPY AND RUN THESE COMMANDS IN YOUR APP ===\n');
  console.log('// 1. Get the store:');
  console.log('import { useStore } from "./store/useStore";\n');
  console.log('// 2. Run this in your component or console:');

  logs.forEach((log, i) => {
    console.log(
      `useStore.getState().addLog('${log.category}', '${log.type}', '${log.emotion}', '${log.reflection || ''}');`
    );
  });
}
