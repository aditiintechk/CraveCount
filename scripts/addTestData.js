/**
 * TEST DATA GENERATOR
 *
 * HOW TO USE:
 * 1. Open your app in the emulator
 * 2. Open Chrome DevTools (Ctrl+M in emulator → "Debug with Chrome")
 * 3. Open Console tab
 * 4. Copy-paste this ENTIRE file into the console
 * 5. Press Enter
 * 6. Wait 3-5 seconds for all logs to be added
 * 7. Go to Insights tab to see the patterns!
 */

console.log('🚀 Starting test data generation...');

// Get the store (assuming it's available globally in dev)
const addLog = (category, type, emotion, reflection) => {
  // This will be called from the console where the app is running
  // We need to access the Zustand store
  const { useStore } = require('./store/useStore');
  useStore.getState().addLog(category, type, emotion, reflection);
};

// Test logs with patterns
const testLogs = [
  // Pattern 1: Stressed -> Sugar (happens a lot)
  { category: 'Sugar', type: 'observed', emotion: 'Stressed', reflection: 'feeling stressed from work' },
  { category: 'Sugar', type: 'resisted', emotion: 'Stressed', reflection: 'work stress triggering cravings' },
  { category: 'Sugar', type: 'observed', emotion: 'Stressed', reflection: 'so tired after long day' },
  { category: 'Sugar', type: 'resisted', emotion: 'Stressed', reflection: 'anxious about deadlines' },
  { category: 'Sugar', type: 'observed', emotion: 'Stressed', reflection: 'need something sweet' },
  { category: 'Sugar', type: 'resisted', emotion: 'Stressed', reflection: 'tired but staying strong' },

  // Pattern 2: Bored -> Instagram/TikTok (substitution pattern)
  { category: 'Instagram', type: 'resisted', emotion: 'Bored', reflection: 'bored waiting for meeting' },
  { category: 'TikTok', type: 'observed', emotion: 'Bored', reflection: 'sitting alone at home' }, // Substitution!
  { category: 'Instagram', type: 'resisted', emotion: 'Bored', reflection: 'feeling bored but aware' },
  { category: 'TikTok', type: 'observed', emotion: 'Bored', reflection: 'procrastinating on work' }, // Substitution!
  { category: 'Instagram', type: 'observed', emotion: 'Bored', reflection: 'waiting around' },

  // Morning strength (high resistance)
  { category: 'Instagram', type: 'resisted', emotion: 'Curious', reflection: undefined },
  { category: 'Sugar', type: 'resisted', emotion: 'Stressed', reflection: undefined },
  { category: 'YouTube', type: 'resisted', emotion: 'Bored', reflection: undefined },
  { category: 'TikTok', type: 'resisted', emotion: 'Restless', reflection: undefined },

  // Night weakness (low resistance)
  { category: 'YouTube', type: 'observed', emotion: 'Restless', reflection: 'late at night before bed' },
  { category: 'Sugar', type: 'observed', emotion: 'Stressed', reflection: 'tired after work' },
  { category: 'Junk Food', type: 'observed', emotion: 'Stressed', reflection: undefined },
  { category: 'TikTok', type: 'observed', emotion: 'Bored', reflection: 'cant sleep' },

  // More variety for patterns
  { category: 'Junk Food', type: 'resisted', emotion: 'Excited', reflection: undefined },
  { category: 'YouTube', type: 'resisted', emotion: 'Curious', reflection: undefined },
  { category: 'Other', type: 'observed', emotion: 'Restless', reflection: undefined },
  { category: 'Instagram', type: 'resisted', emotion: 'Bored', reflection: undefined },
  { category: 'Sugar', type: 'resisted', emotion: 'Stressed', reflection: 'getting better at this' },

  // Recent growth (more resistance)
  { category: 'Sugar', type: 'resisted', emotion: 'Stressed', reflection: undefined },
  { category: 'Instagram', type: 'resisted', emotion: 'Bored', reflection: undefined },
  { category: 'TikTok', type: 'resisted', emotion: 'Restless', reflection: undefined },
  { category: 'YouTube', type: 'resisted', emotion: 'Curious', reflection: undefined },
  { category: 'Junk Food', type: 'resisted', emotion: 'Excited', reflection: undefined },
  { category: 'Sugar', type: 'resisted', emotion: 'Stressed', reflection: undefined },
  { category: 'Instagram', type: 'resisted', emotion: 'Bored', reflection: undefined },
];

// Add them with delays to avoid overwhelming
let count = 0;
const addInterval = setInterval(() => {
  if (count >= testLogs.length) {
    clearInterval(addInterval);
    console.log(`✅ Successfully added ${testLogs.length} test logs!`);
    console.log('📊 Go to the Insights tab to see your patterns');
    return;
  }

  const log = testLogs[count];
  try {
    addLog(log.category, log.type, log.emotion, log.reflection);
    console.log(`✓ Added log ${count + 1}/${testLogs.length}: ${log.emotion} → ${log.category} (${log.type})`);
  } catch (error) {
    console.error(`✗ Failed to add log ${count + 1}:`, error);
  }

  count++;
}, 100); // Add one log every 100ms

console.log(`📝 Adding ${testLogs.length} test logs...`);
