
export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  description: string;
  exercises: WorkoutExercise[];
  createdAt: string;
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  date: string;
  exercises: {
    exerciseId: string;
    sets: {
      reps: number;
      weight: number;
      completed: boolean;
    }[];
  }[];
  duration?: number;
  notes?: string;
}

// Sample workouts
export const sampleWorkouts: Workout[] = [
  {
    id: 'workout-1',
    name: 'Push Day',
    description: 'Chest, Shoulders, and Triceps',
    exercises: [
      { exerciseId: 'bench-press', sets: 4, reps: 8, weight: 135 },
      { exerciseId: 'dumbbell-press', sets: 3, reps: 10, weight: 50 },
      { exerciseId: 'overhead-press', sets: 3, reps: 8, weight: 95 },
      { exerciseId: 'lateral-raise', sets: 3, reps: 12, weight: 20 },
      { exerciseId: 'tricep-dips', sets: 3, reps: 10, weight: 0 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'workout-2',
    name: 'Pull Day',
    description: 'Back and Biceps',
    exercises: [
      { exerciseId: 'deadlift', sets: 4, reps: 6, weight: 225 },
      { exerciseId: 'lat-pulldown', sets: 3, reps: 10, weight: 120 },
      { exerciseId: 'bent-over-row', sets: 3, reps: 8, weight: 135 },
      { exerciseId: 'barbell-curl', sets: 3, reps: 10, weight: 60 },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'workout-3',
    name: 'Leg Day',
    description: 'Legs and Core',
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: 8, weight: 185 },
      { exerciseId: 'leg-press', sets: 3, reps: 12, weight: 270 },
      { exerciseId: 'lunges', sets: 3, reps: 10, weight: 30 },
      { exerciseId: 'plank', sets: 3, reps: 60, weight: 0 },
    ],
    createdAt: new Date().toISOString(),
  },
];
