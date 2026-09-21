import { PlacementQuestion } from '@/types';

/**
 * Placement test questions for the Desenrola English nivelamento.
 * Each question tests a different skill at varying difficulty levels.
 */
export const placementQuestions: PlacementQuestion[] = [
  {
    id: 1,
    type: 'listen-select',
    prompt: 'Listen to the greeting and select the best response.',
    audioPrompt: 'Hey! How are you doing today?',
    options: [
      "I'm doing great, thanks! How about you?",
      'Yes, I am do good.',
      'My name is student.',
      'I no understand.',
    ],
    difficulty: 'beginner',
    points: 10,
  },
  {
    id: 2,
    type: 'listen-speak',
    prompt: 'Listen to the question and answer it with your voice.',
    audioPrompt: 'Can you tell me about your daily routine? What do you usually do in the morning?',
    expectedKeywords: ['wake', 'morning', 'breakfast', 'go', 'work', 'school', 'get up', 'shower', 'eat', 'start'],
    difficulty: 'beginner',
    points: 15,
  },
  {
    id: 3,
    type: 'listen-select',
    prompt: 'Listen to the situation and choose the most natural response.',
    audioPrompt: "You're at a coffee shop and the barista asks: \"Would you like anything else with your order?\"",
    options: [
      "No, that'll be all. Thank you!",
      'I am not wanting more things.',
      'No want.',
      'The coffee is being mine only.',
    ],
    difficulty: 'intermediate',
    points: 20,
  },
  {
    id: 4,
    type: 'speak-free',
    prompt: 'Speak for 15 seconds about this topic:',
    audioPrompt: 'If you could live anywhere in the world, where would you choose and why? Think about the culture, weather, and opportunities.',
    expectedKeywords: ['would', 'because', 'like', 'think', 'culture', 'weather', 'opportunity', 'live', 'country', 'city', 'people', 'experience'],
    difficulty: 'intermediate',
    points: 25,
  },
  {
    id: 5,
    type: 'listen-speak',
    prompt: 'Listen and respond naturally to this workplace scenario.',
    audioPrompt: "Your manager says: \"We need to push back the deadline for the project. How do you think we should reprioritize our tasks to accommodate the new timeline?\"",
    expectedKeywords: ['prioritize', 'deadline', 'focus', 'important', 'first', 'suggest', 'think', 'should', 'team', 'plan', 'schedule', 'adjust', 'critical'],
    difficulty: 'advanced',
    points: 30,
  },
];

/**
 * Calculate the user's level based on their total score.
 */
export function calculateLevel(totalScore: number): {
  level: 'branca' | 'azul' | 'preta';
  levelName: string;
  levelDescription: string;
} {
  const maxScore = placementQuestions.reduce((sum, q) => sum + q.points, 0); // 100
  const percentage = (totalScore / maxScore) * 100;

  if (percentage >= 70) {
    return {
      level: 'preta',
      levelName: 'Faixa Preta',
      levelDescription: 'Advanced — You have a strong command of English. Time to polish and perfect!',
    };
  } else if (percentage >= 40) {
    return {
      level: 'azul',
      levelName: 'Faixa Azul',
      levelDescription: 'Intermediate — You can communicate well. Let\'s level up your fluency!',
    };
  } else {
    return {
      level: 'branca',
      levelName: 'Faixa Branca',
      levelDescription: 'Beginner — Welcome to the journey! We\'ll build your English from the ground up.',
    };
  }
}
