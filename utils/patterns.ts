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
  type: 'correlation' | 'context' | 'substitution' | 'keywords' | 'growth';
  typeLabel: string; // Human-readable type label (e.g., "Emotional Pattern", "Time-Based")
  unlocked: boolean;
  actionable?: string; // Optional actionable tip
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

  // Advanced insights (all shown to users)
  const emotionCorrelation = detectEmotionCategoryCorrelation(logs);
  if (emotionCorrelation) insights.push(emotionCorrelation);

  const contextSuccess = detectSuccessRateByContext(logs);
  if (contextSuccess) insights.push(contextSuccess);

  const substitution = detectSubstitutionPattern(logs);
  if (substitution) insights.push(substitution);

  const keywords = detectReflectionKeywords(logs);
  if (keywords) insights.push(keywords);

  // Growth pattern (motivational)
  const growthInsight = detectGrowthPattern(logs);
  if (growthInsight) insights.push(growthInsight);

  return insights;
};

// 1. Detect emotion-category correlations
const detectEmotionCategoryCorrelation = (logs: Log[]): Insight | null => {
  const logsWithEmotion = logs.filter(log => log.emotion);

  if (logsWithEmotion.length < 15) return null;

  // Build emotion -> category map
  const emotionCategories = new Map<Emotion, Map<Category, number>>();

  logsWithEmotion.forEach(log => {
    if (!log.emotion) return;

    if (!emotionCategories.has(log.emotion)) {
      emotionCategories.set(log.emotion, new Map());
    }

    const categoryMap = emotionCategories.get(log.emotion)!;
    categoryMap.set(log.category, (categoryMap.get(log.category) || 0) + 1);
  });

  // Find strongest correlation
  let bestCorrelation: { emotion: Emotion; category: Category; percentage: number } | undefined = undefined;

  emotionCategories.forEach((categoryMap, emotion) => {
    const totalForEmotion = Array.from(categoryMap.values()).reduce((sum, count) => sum + count, 0);

    categoryMap.forEach((count, category) => {
      const percentage = Math.round((count / totalForEmotion) * 100);

      if (!bestCorrelation || percentage > bestCorrelation.percentage) {
        bestCorrelation = { emotion, category, percentage };
      }
    });
  });

  if (!bestCorrelation) return null;
  // @ts-ignore - TypeScript control flow issue
  const emotionValue: Emotion = bestCorrelation.emotion;
  // @ts-ignore - TypeScript control flow issue
  const categoryValue: Category = bestCorrelation.category;
  // @ts-ignore - TypeScript control flow issue
  const percentageValue: number = bestCorrelation.percentage;

  if (percentageValue < 40) return null;

  return {
    id: 'emotion_category_correlation',
    title: `Emotional Trigger • ${categoryValue}`,
    message: `${percentageValue}% of your **${categoryValue}** cravings happen when you're **${emotionValue}**.\n\n**${emotionValue}** is directly driving this craving.`,
    type: 'correlation',
    typeLabel: 'Emotional Pattern',
    unlocked: true,
    actionable: `**When you notice feeling ${emotionValue}:**\n\n• Deep breathing for 2 minutes\n• Take a 5-minute walk\n• Text a friend\n\nThe craving will pass in 10-15 minutes.`,
  };
};

// 2. Detect success rate by context (time of day + category)
const detectSuccessRateByContext = (logs: Log[]): Insight | null => {
  if (logs.length < 20) return null;

  const resistedLogs = logs.filter(log => log.type === 'resisted');
  if (resistedLogs.length < 5) return null;

  // Calculate success rate by time of day
  const timeSlots = {
    morning: { total: 0, resisted: 0 },    // 6am-12pm
    afternoon: { total: 0, resisted: 0 },  // 12pm-6pm
    evening: { total: 0, resisted: 0 },    // 6pm-9pm
    night: { total: 0, resisted: 0 },      // 9pm-6am
  };

  logs.forEach(log => {
    const hour = new Date(log.timestamp).getHours();
    let slot: keyof typeof timeSlots;

    if (hour >= 6 && hour < 12) slot = 'morning';
    else if (hour >= 12 && hour < 18) slot = 'afternoon';
    else if (hour >= 18 && hour < 21) slot = 'evening';
    else slot = 'night';

    timeSlots[slot].total++;
    if (log.type === 'resisted') timeSlots[slot].resisted++;
  });

  // Find biggest contrast
  let strongest: { time: string; rate: number } | undefined = undefined;
  let weakest: { time: string; rate: number } | undefined = undefined;

  Object.entries(timeSlots).forEach(([time, data]) => {
    if (data.total < 3) return; // Need minimum data

    const rate = Math.round((data.resisted / data.total) * 100);

    if (!strongest || rate > strongest.rate) {
      strongest = { time, rate };
    }
    if (!weakest || rate < weakest.rate) {
      weakest = { time, rate };
    }
  });

  if (!strongest || !weakest) return null;
  // @ts-ignore - TypeScript control flow issue
  const strongRate: number = strongest.rate;
  // @ts-ignore - TypeScript control flow issue
  const strongTime: string = strongest.time;
  // @ts-ignore - TypeScript control flow issue
  const weakRate: number = weakest.rate;
  // @ts-ignore - TypeScript control flow issue
  const weakTime: string = weakest.time;

  if (Math.abs(strongRate - weakRate) < 20) return null;

  // Create more specific messaging
  const delta = strongRate - weakRate;
  let explanation = '';

  if (weakTime === 'night') {
    explanation = `Your willpower depletes throughout the day.\n\n**By ${weakTime}, you're running on empty.**\n\nThis is biology, not weakness.`;
  } else if (weakTime === 'evening') {
    explanation = `Decision fatigue hits hard in the **${weakTime}**.\n\nAfter a full day of choices, your resistance drops naturally.`;
  } else {
    explanation = `**${delta}% difference** in resistance.\n\n${strongTime}: ${strongRate}% success\n${weakTime}: ${weakRate}% success`;
  }

  return {
    id: 'context_success_rate',
    title: `Time Pattern • Willpower`,
    message: `You resist **${strongRate}%** in **${strongTime}** but only **${weakRate}%** at **${weakTime}**.\n\n${explanation}`,
    type: 'context',
    typeLabel: 'Time-Based',
    unlocked: true,
    actionable: `**Schedule smart:**\n\n• Important decisions in ${strongTime}\n• Tough tasks in ${strongTime}\n• Remove temptations before ${weakTime}\n\nDon't rely on willpower when it's depleted.`,
  };
};

// 3. Detect substitution patterns
const detectSubstitutionPattern = (logs: Log[]): Insight | null => {
  if (logs.length < 25) return null;

  const resistedLogs = logs.filter(log => log.type === 'resisted');
  if (resistedLogs.length < 10) return null;

  // Track what happens after resisting
  const substitutions = new Map<string, number>();

  resistedLogs.forEach(resistedLog => {
    const resistedTime = new Date(resistedLog.timestamp).getTime();

    // Look for cravings within 2 hours after resisting
    const subsequentCravings = logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      const timeDiff = (logTime - resistedTime) / (1000 * 60); // minutes
      return timeDiff > 0 && timeDiff <= 120 && log.category !== resistedLog.category;
    });

    subsequentCravings.forEach(sub => {
      const key = `${resistedLog.category}→${sub.category}`;
      substitutions.set(key, (substitutions.get(key) || 0) + 1);
    });
  });

  if (substitutions.size === 0) return null;

  // Find most common substitution
  const sorted = Array.from(substitutions.entries()).sort((a, b) => b[1] - a[1]);
  const [pattern, count] = sorted[0];
  const [from, to] = pattern.split('→');

  const percentage = Math.round((count / resistedLogs.length) * 100);

  if (percentage < 20) return null;

  return {
    id: 'substitution_pattern',
    title: `Substitution • ${from} → ${to}`,
    message: `${percentage}% of the time you resist **${from}**, you reach for **${to}** within 2 hours.\n\n**You're not beating cravings—you're switching them.**\n\nSame impulse, different target.`,
    type: 'substitution',
    typeLabel: 'Habit Chain',
    unlocked: true,
    actionable: `**Address the REAL need:**\n\n• Connection: Call someone\n• Stimulation: Go outside\n• Rest: Take a real break\n\nAnything that isn't another craving.`,
  };
};

// 4. Detect reflection keyword patterns
const detectReflectionKeywords = (logs: Log[]): Insight | null => {
  const logsWithReflections = logs.filter(log => log.reflection && log.reflection.length > 10);

  if (logsWithReflections.length < 10) return null;

  // Keywords to search for
  const keywords = [
    { word: 'work', category: 'Work Stress' },
    { word: 'tired', category: 'Fatigue' },
    { word: 'alone', category: 'Loneliness' },
    { word: 'bored', category: 'Boredom' },
    { word: 'anxious', category: 'Anxiety' },
    { word: 'stress', category: 'Stress' },
    { word: 'bed', category: 'Evening Routine' },
    { word: 'waiting', category: 'Idle Time' },
  ];

  // Count keyword occurrences
  const keywordMatches = new Map<string, { count: number; category: string; relatedCategories: Category[] }>();

  logsWithReflections.forEach(log => {
    const reflection = log.reflection!.toLowerCase();

    keywords.forEach(({ word, category }) => {
      if (reflection.includes(word)) {
        if (!keywordMatches.has(word)) {
          keywordMatches.set(word, { count: 0, category, relatedCategories: [] });
        }
        const match = keywordMatches.get(word)!;
        match.count++;
        match.relatedCategories.push(log.category);
      }
    });
  });

  if (keywordMatches.size === 0) return null;

  // Find most common keyword
  const sorted = Array.from(keywordMatches.entries()).sort((a, b) => b[1].count - a[1].count);
  const [keyword, data] = sorted[0];

  const percentage = Math.round((data.count / logsWithReflections.length) * 100);

  if (percentage < 20) return null;

  // Find most common category associated with this keyword
  const categoryCount = new Map<Category, number>();
  data.relatedCategories.forEach(cat => {
    categoryCount.set(cat, (categoryCount.get(cat) || 0) + 1);
  });
  const topCategory = Array.from(categoryCount.entries()).sort((a, b) => b[1] - a[1])[0][0];

  // Create context-specific advice
  let rootCauseAdvice = '';
  if (keyword === 'work' || keyword === 'stress') {
    rootCauseAdvice = `**The real problem:** Unmanaged work stress\n\n• Can you add more breaks?\n• Can you set boundaries?\n• Can you change your environment?\n\n${topCategory} is just the symptom.`;
  } else if (keyword === 'tired') {
    rootCauseAdvice = `**Your body needs rest, not ${topCategory}.**\n\n• Sleep more\n• Schedule real downtime\n• Take actual naps\n\nStop reaching for quick fixes.`;
  } else if (keyword === 'alone' || keyword === 'bored') {
    rootCauseAdvice = `**${topCategory} temporarily numbs loneliness.**\n\n• Text 3 friends right now\n• Join a local group\n• Schedule social time\n\nConnection is the real solution.`;
  } else if (keyword === 'anxious') {
    rootCauseAdvice = `**Anxiety is the driver.**\n\n• Try therapy\n• Use meditation apps\n• Journal the specific worry\n\n${topCategory} makes it worse long-term.`;
  } else {
    rootCauseAdvice = `**${data.category} is your real trigger.**\n\n${topCategory} is just the symptom.`;
  }

  return {
    id: 'reflection_keywords',
    title: `Hidden Trigger • ${topCategory}`,
    message: `You wrote **"${keyword}"** in ${percentage}% of reflections, always followed by **${topCategory}** cravings.\n\nThis word is your emotional alarm bell.`,
    type: 'keywords',
    typeLabel: 'Root Cause',
    unlocked: true,
    actionable: rootCauseAdvice,
  };
};

// 5. Detect growth over time (motivational)
const detectGrowthPattern = (logs: Log[]): Insight | null => {
  if (logs.length < 20) return null;

  // Split logs into first half and second half (chronologically)
  const sortedLogs = [...logs].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const midpoint = Math.floor(sortedLogs.length / 2);
  const olderLogs = sortedLogs.slice(0, midpoint);
  const recentLogs = sortedLogs.slice(midpoint);

  const olderResistRate = olderLogs.filter(log => log.type === 'resisted').length / olderLogs.length;
  const recentResistRate = recentLogs.filter(log => log.type === 'resisted').length / recentLogs.length;

  const improvement = ((recentResistRate - olderResistRate) / (olderResistRate || 0.01)) * 100;

  if (improvement > 20) {
    const improvementPercent = Math.round(improvement);
    return {
      id: 'growth_pattern',
      title: `Progress • ${improvementPercent}% Stronger`,
      message: `Your resistance went from **${Math.round(olderResistRate * 100)}%** to **${Math.round(recentResistRate * 100)}%**.\n\n**This isn't luck. You're rewiring your brain.**`,
      type: 'growth',
      typeLabel: 'Growth Tracking',
      unlocked: true,
      actionable: `**What's working? Double down on it.**\n\n• Maintain your tracking habit\n• Notice what strategies work\n• Protect this progress\n\nYou've proven you can change.`,
    };
  } else if (improvement < -20) {
    const declinePercent = Math.round(Math.abs(improvement));
    return {
      id: 'growth_pattern',
      title: `Warning • ${declinePercent}% Decline`,
      message: `Your resistance went from **${Math.round(olderResistRate * 100)}%** to **${Math.round(recentResistRate * 100)}%**.\n\n**This isn't failure—it's data.**`,
      type: 'growth',
      typeLabel: 'Growth Tracking',
      unlocked: true,
      actionable: `**What changed?**\n\n• More stress?\n• Less sleep?\n• Different environment?\n\nFix the context, not just the behavior.\n\nKeep tracking—awareness alone will reverse this.`,
    };
  }

  return null;
};
