import { Log, Category, Emotion } from '../store/useStore';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'beginner' | 'intermediate' | 'advanced';
  unlocked: boolean;
  progress?: number;
  total?: number;
}

export interface Insight {
  id: string;
  title: string;
  message: string;
  type: 'time' | 'category' | 'emotion' | 'streak' | 'growth';
  unlocked: boolean;
}

// Badge unlock conditions
export const checkBadgeUnlocks = (logs: Log[]): Badge[] => {
  const totalLogs = logs.length;
  const resistedLogs = logs.filter(log => log.type === 'resisted');
  const reflections = logs.filter(log => log.reflection && log.reflection.length > 0);
  const categories = new Set(logs.map(log => log.category));

  const resistRate = totalLogs > 0 ? (resistedLogs.length / totalLogs) * 100 : 0;

  return [
    // Beginner Badges
    {
      id: 'first_step',
      title: 'First Step',
      description: 'Log your first moment of awareness',
      icon: '🌱',
      category: 'beginner',
      unlocked: totalLogs >= 1,
      progress: Math.min(totalLogs, 1),
      total: 1,
    },
    {
      id: 'self_aware',
      title: 'Self Aware',
      description: 'Build awareness with 5 moments',
      icon: '👁️',
      category: 'beginner',
      unlocked: totalLogs >= 5,
      progress: Math.min(totalLogs, 5),
      total: 5,
    },
    {
      id: 'reflective',
      title: 'Reflective',
      description: 'Write 3 thoughtful reflections',
      icon: '📝',
      category: 'beginner',
      unlocked: reflections.length >= 3,
      progress: Math.min(reflections.length, 3),
      total: 3,
    },
    {
      id: 'first_resistance',
      title: 'First Resistance',
      description: 'Choose differently for the first time',
      icon: '🛡️',
      category: 'beginner',
      unlocked: resistedLogs.length >= 1,
      progress: Math.min(resistedLogs.length, 1),
      total: 1,
    },

    // Intermediate Badges
    {
      id: 'committed',
      title: 'Committed',
      description: 'Track 25 moments of awareness',
      icon: '💪',
      category: 'intermediate',
      unlocked: totalLogs >= 25,
      progress: Math.min(totalLogs, 25),
      total: 25,
    },
    {
      id: 'resistance_rising',
      title: 'Resistance Rising',
      description: 'Achieve 50% resistance rate (min 10 logs)',
      icon: '⚡',
      category: 'intermediate',
      unlocked: totalLogs >= 10 && resistRate >= 50,
      progress: totalLogs >= 10 ? Math.min(Math.round(resistRate), 50) : 0,
      total: 50,
    },
    {
      id: 'deep_thinker',
      title: 'Deep Thinker',
      description: 'Write 10 reflections',
      icon: '🧠',
      category: 'intermediate',
      unlocked: reflections.length >= 10,
      progress: Math.min(reflections.length, 10),
      total: 10,
    },
    {
      id: 'explorer',
      title: 'Explorer',
      description: 'Log moments across 4 different categories',
      icon: '🗺️',
      category: 'intermediate',
      unlocked: categories.size >= 4,
      progress: Math.min(categories.size, 4),
      total: 4,
    },

    // Advanced Badges
    {
      id: 'pattern_master',
      title: 'Pattern Master',
      description: 'Reach 50 total moments logged',
      icon: '🎯',
      category: 'advanced',
      unlocked: totalLogs >= 50,
      progress: Math.min(totalLogs, 50),
      total: 50,
    },
    {
      id: 'balanced_growth',
      title: 'Balanced Growth',
      description: 'Log all 6 categories',
      icon: '🌈',
      category: 'advanced',
      unlocked: categories.size >= 6,
      progress: Math.min(categories.size, 6),
      total: 6,
    },
    {
      id: 'wisdom_keeper',
      title: 'Wisdom Keeper',
      description: 'Write 25 reflections',
      icon: '📚',
      category: 'advanced',
      unlocked: reflections.length >= 25,
      progress: Math.min(reflections.length, 25),
      total: 25,
    },
    {
      id: 'centurion',
      title: 'Centurion',
      description: 'Log 100 moments of awareness',
      icon: '💯',
      category: 'advanced',
      unlocked: totalLogs >= 100,
      progress: Math.min(totalLogs, 100),
      total: 100,
    },
  ];
};

// Generate insights from patterns
export const generateInsights = (logs: Log[]): Insight[] => {
  const insights: Insight[] = [];

  if (logs.length < 5) {
    return insights; // Need minimum data for patterns
  }

  // Time-based patterns
  const timeInsight = detectTimePattern(logs);
  if (timeInsight) insights.push(timeInsight);

  // Category patterns
  const categoryInsight = detectCategoryPattern(logs);
  if (categoryInsight) insights.push(categoryInsight);

  // Emotion patterns
  const emotionInsight = detectEmotionPattern(logs);
  if (emotionInsight) insights.push(emotionInsight);

  // Growth patterns
  const growthInsight = detectGrowthPattern(logs);
  if (growthInsight) insights.push(growthInsight);

  return insights;
};

// Detect time-based patterns (peak hours)
const detectTimePattern = (logs: Log[]): Insight | null => {
  if (logs.length < 10) return null;

  const hourCounts = new Map<number, number>();

  logs.forEach(log => {
    const hour = new Date(log.timestamp).getHours();
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
  });

  const sortedHours = Array.from(hourCounts.entries())
    .sort((a, b) => b[1] - a[1]);

  const peakHour = sortedHours[0][0];
  const peakCount = sortedHours[0][1];
  const percentage = Math.round((peakCount / logs.length) * 100);

  let timeLabel = '';
  if (peakHour >= 21 || peakHour < 6) {
    timeLabel = 'late night';
  } else if (peakHour >= 18) {
    timeLabel = 'evening';
  } else if (peakHour >= 12) {
    timeLabel = 'afternoon';
  } else {
    timeLabel = 'morning';
  }

  return {
    id: 'time_pattern',
    title: peakHour >= 21 || peakHour < 6 ? 'Night Owl' : 'Time Pattern',
    message: `${percentage}% of your cravings happen in the ${timeLabel}`,
    type: 'time',
    unlocked: true,
  };
};

// Detect most common category
const detectCategoryPattern = (logs: Log[]): Insight | null => {
  if (logs.length < 10) return null;

  const categoryCounts = new Map<Category, number>();

  logs.forEach(log => {
    categoryCounts.set(log.category, (categoryCounts.get(log.category) || 0) + 1);
  });

  const sortedCategories = Array.from(categoryCounts.entries())
    .sort((a, b) => b[1] - a[1]);

  const topCategory = sortedCategories[0][0];
  const topCount = sortedCategories[0][1];
  const percentage = Math.round((topCount / logs.length) * 100);

  return {
    id: 'category_pattern',
    title: 'Primary Trigger',
    message: `${topCategory} accounts for ${percentage}% of your cravings`,
    type: 'category',
    unlocked: true,
  };
};

// Detect most common emotion
const detectEmotionPattern = (logs: Log[]): Insight | null => {
  const logsWithEmotion = logs.filter(log => log.emotion);

  if (logsWithEmotion.length < 5) return null;

  const emotionCounts = new Map<Emotion, number>();

  logsWithEmotion.forEach(log => {
    if (log.emotion) {
      emotionCounts.set(log.emotion, (emotionCounts.get(log.emotion) || 0) + 1);
    }
  });

  const sortedEmotions = Array.from(emotionCounts.entries())
    .sort((a, b) => b[1] - a[1]);

  const topEmotion = sortedEmotions[0][0];
  const topCount = sortedEmotions[0][1];

  return {
    id: 'emotion_pattern',
    title: 'Emotional Trigger',
    message: `You most often feel "${topEmotion}" when cravings arise`,
    type: 'emotion',
    unlocked: true,
  };
};

// Detect growth over time
const detectGrowthPattern = (logs: Log[]): Insight | null => {
  if (logs.length < 20) return null;

  // Split logs into first half and second half
  const midpoint = Math.floor(logs.length / 2);
  const olderLogs = logs.slice(midpoint);
  const recentLogs = logs.slice(0, midpoint);

  const olderResistRate = olderLogs.filter(log => log.type === 'resisted').length / olderLogs.length;
  const recentResistRate = recentLogs.filter(log => log.type === 'resisted').length / recentLogs.length;

  const improvement = ((recentResistRate - olderResistRate) / olderResistRate) * 100;

  if (improvement > 20) {
    return {
      id: 'growth_pattern',
      title: 'Growing Stronger',
      message: `Your resistance rate improved by ${Math.round(improvement)}%`,
      type: 'growth',
      unlocked: true,
    };
  }

  return null;
};
