import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserLevel, TaskStatus } from '@/types';

interface AppState {
  // User state
  level: UserLevel;
  score: number;
  streak: number;
  lastActiveDate: string | null;
  hasCompletedPlacement: boolean;
  weeklyProgress: Record<string, TaskStatus>;

  // Actions
  setLevel: (level: UserLevel) => void;
  setScore: (score: number) => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  setHasCompletedPlacement: (value: boolean) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  resetAll: () => void;
}

const initialWeeklyProgress: Record<string, TaskStatus> = {
  monday: 'available',
  tuesday: 'locked',
  wednesday: 'locked',
  thursday: 'locked',
  friday: 'locked',
  saturday: 'locked',
  sunday: 'locked',
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      level: null,
      score: 0,
      streak: 0,
      lastActiveDate: null,
      hasCompletedPlacement: false,
      weeklyProgress: { ...initialWeeklyProgress },

      setLevel: (level) => set({ level }),

      setScore: (score) => set({ score }),

      incrementStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastActiveDate, streak } = get();

        if (lastActiveDate === today) return;

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        if (lastActiveDate === yesterdayStr) {
          set({ streak: streak + 1, lastActiveDate: today });
        } else {
          set({ streak: 1, lastActiveDate: today });
        }
      },

      resetStreak: () => set({ streak: 0, lastActiveDate: null }),

      setHasCompletedPlacement: (value) => set({ hasCompletedPlacement: value }),

      updateTaskStatus: (taskId, status) =>
        set((state) => {
          const newProgress = { ...state.weeklyProgress, [taskId]: status };
          
          if (status === 'completed') {
            const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            const currentIndex = daysOrder.indexOf(taskId);
            if (currentIndex !== -1 && currentIndex < daysOrder.length - 1) {
              const nextDay = daysOrder[currentIndex + 1];
              if (newProgress[nextDay] === 'locked') {
                newProgress[nextDay] = 'available';
              }
            }
          }

          return { weeklyProgress: newProgress };
        }),

      resetAll: () =>
        set({
          level: null,
          score: 0,
          streak: 0,
          lastActiveDate: null,
          hasCompletedPlacement: false,
          weeklyProgress: { ...initialWeeklyProgress },
        }),
    }),
    {
      name: 'desenrola-english-storage',
    }
  )
);
