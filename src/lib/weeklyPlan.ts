import { WeekDay } from '@/types';

/**
 * Weekly roadmap for each level tier.
 * Each day has a themed lesson with specific tasks.
 */
export const weeklyPlan: WeekDay[] = [
  {
    id: 'monday',
    day: 'Monday',
    dayShort: 'MON',
    title: 'Survival Kit',
    titlePt: 'Kit de Sobrevivência',
    description: 'Essential phrases for everyday situations — ordering food, asking directions, making calls.',
    icon: 'Shield',
    duration: '20 min',
    tasks: [
      'Practice 10 survival phrases',
      'Role-play: Ordering at a restaurant',
      'Listen & repeat drill',
    ],
  },
  {
    id: 'tuesday',
    day: 'Tuesday',
    dayShort: 'TUE',
    title: 'Grammar Beats',
    titlePt: 'Gramática no Ritmo',
    description: 'Learn grammar through music and natural speech patterns — no boring rules!',
    icon: 'Music',
    duration: '25 min',
    tasks: [
      'Identify tenses in song lyrics',
      'Fill-in-the-blank with correct forms',
      'Create 5 sentences using today\'s pattern',
    ],
  },
  {
    id: 'wednesday',
    day: 'Wednesday',
    dayShort: 'WED',
    title: 'Slang & Street Talk',
    titlePt: 'Gírias & Papo de Rua',
    description: 'Real English from the streets — idioms, slang, and expressions natives actually use.',
    icon: 'MessageCircle',
    duration: '20 min',
    tasks: [
      'Learn 5 new slang expressions',
      'Watch a short clip and identify slang',
      'Use slang in a conversation practice',
    ],
  },
  {
    id: 'thursday',
    day: 'Thursday',
    dayShort: 'THU',
    title: 'Listening Lab',
    titlePt: 'Laboratório de Escuta',
    description: 'Train your ear with podcasts, movies, and real conversations at different speeds.',
    icon: 'Headphones',
    duration: '30 min',
    tasks: [
      'Listen to a 2-minute podcast clip',
      'Answer comprehension questions',
      'Shadow the speaker for 5 minutes',
    ],
  },
  {
    id: 'friday',
    day: 'Friday',
    dayShort: 'FRI',
    title: 'Happy Hour',
    titlePt: 'Happy Hour',
    description: 'Casual conversation practice — talk about your week, plans, and interests.',
    icon: 'Beer',
    duration: '25 min',
    tasks: [
      'Free conversation with AI tutor',
      'Describe your week in English',
      'Practice small talk topics',
    ],
  },
  {
    id: 'saturday',
    day: 'Saturday',
    dayShort: 'SAT',
    title: 'Culture Dive',
    titlePt: 'Mergulho Cultural',
    description: 'Explore English through culture — movies, memes, news, and social media.',
    icon: 'Globe',
    duration: '20 min',
    tasks: [
      'Read a trending article in English',
      'Discuss cultural differences',
      'Create a mini presentation',
    ],
  },
  {
    id: 'sunday',
    day: 'Sunday',
    dayShort: 'SUN',
    title: 'Boss Fight Review',
    titlePt: 'Revisão Chefe de Fase',
    description: 'Weekly review challenge — prove you learned everything this week!',
    icon: 'Trophy',
    duration: '30 min',
    tasks: [
      'Complete the weekly challenge quiz',
      'Record a 1-minute speech',
      'Review and correct your mistakes',
    ],
  },
];
