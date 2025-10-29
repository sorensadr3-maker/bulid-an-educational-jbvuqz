
import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { sampleWorkouts } from "@/data/workouts";
import { exercises } from "@/data/exercises";
import { SafeAreaView } from "react-native-safe-area-context";

interface SetLog {
  reps: number;
  weight: number;
  completed: boolean;
}

export default function WorkoutSessionScreen() {
  const { id } = useLocalSearchParams();
  const workout = sampleWorkouts.find(w => w.id === id);
  
  const [exerciseLogs, setExerciseLogs] = useState<{
    [exerciseId: string]: SetLog[];
  }>(() => {
    if (!workout) return {};
    const logs: { [exerciseId: string]: SetLog[] } = {};
    workout.exercises.forEach(ex => {
      logs[ex.exerciseId] = Array(ex.sets).fill(null).map(() => ({
        reps: ex.reps,
        weight: ex.weight,
        completed: false,
      }));
    });
    return logs;
  });

  const [startTime] = useState(new Date());

  if (!workout) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Workout not found</Text>
      </View>
    );
  }

  const updateSet = (exerciseId: string, setIndex: number, field: 'reps' | 'weight', value: string) => {
    setExerciseLogs(prev => {
      const newLogs = { ...prev };
      const numValue = parseInt(value) || 0;
      newLogs[exerciseId][setIndex] = {
        ...newLogs[exerciseId][setIndex],
        [field]: numValue,
      };
      return newLogs;
    });
  };

  const toggleSetComplete = (exerciseId: string, setIndex: number) => {
    setExerciseLogs(prev => {
      const newLogs = { ...prev };
      newLogs[exerciseId][setIndex] = {
        ...newLogs[exerciseId][setIndex],
        completed: !newLogs[exerciseId][setIndex].completed,
      };
      return newLogs;
    });
  };

  const handleFinishWorkout = () => {
    const totalSets = Object.values(exerciseLogs).flat().length;
    const completedSets = Object.values(exerciseLogs).flat().filter(s => s.completed).length;
    const duration = Math.round((new Date().getTime() - startTime.getTime()) / 60000);

    Alert.alert(
      "Finish Workout?",
      `You completed ${completedSets} out of ${totalSets} sets in ${duration} minutes.\n\nGreat job!`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Finish", 
          onPress: () => {
            console.log('Workout completed:', { workout, exerciseLogs, duration });
            router.back();
          }
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: workout.name,
          headerBackTitle: "Cancel",
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Workout Header */}
          <View style={styles.header}>
            <Text style={styles.workoutName}>{workout.name}</Text>
            <Text style={styles.workoutDescription}>{workout.description}</Text>
          </View>

          {/* Exercises */}
          {workout.exercises.map((workoutEx, exerciseIndex) => {
            const exercise = exercises.find(e => e.id === workoutEx.exerciseId);
            if (!exercise) return null;

            const sets = exerciseLogs[workoutEx.exerciseId] || [];
            const completedSets = sets.filter(s => s.completed).length;

            return (
              <View key={workoutEx.exerciseId} style={styles.exerciseCard}>
                {/* Exercise Header */}
                <Pressable 
                  style={styles.exerciseHeader}
                  onPress={() => router.push(`/exercise/${exercise.id}`)}
                >
                  <View style={styles.exerciseInfo}>
                    <Text style={styles.exerciseNumber}>Exercise {exerciseIndex + 1}</Text>
                    <Text style={styles.exerciseName}>{exercise.name}</Text>
                    <Text style={styles.exerciseEquipment}>{exercise.equipment}</Text>
                  </View>
                  <View style={styles.progressBadge}>
                    <Text style={styles.progressText}>
                      {completedSets}/{sets.length}
                    </Text>
                  </View>
                </Pressable>

                {/* Sets */}
                <View style={styles.setsContainer}>
                  <View style={styles.setsHeader}>
                    <Text style={styles.setHeaderText}>Set</Text>
                    <Text style={styles.setHeaderText}>Reps</Text>
                    <Text style={styles.setHeaderText}>Weight (lbs)</Text>
                    <Text style={styles.setHeaderText}>✓</Text>
                  </View>

                  {sets.map((set, setIndex) => (
                    <View 
                      key={setIndex} 
                      style={[
                        styles.setRow,
                        set.completed && styles.setRowCompleted
                      ]}
                    >
                      <Text style={styles.setNumber}>{setIndex + 1}</Text>
                      
                      <TextInput
                        style={[styles.setInput, set.completed && styles.setInputCompleted]}
                        value={set.reps.toString()}
                        onChangeText={(value) => updateSet(workoutEx.exerciseId, setIndex, 'reps', value)}
                        keyboardType="number-pad"
                        editable={!set.completed}
                      />
                      
                      <TextInput
                        style={[styles.setInput, set.completed && styles.setInputCompleted]}
                        value={set.weight.toString()}
                        onChangeText={(value) => updateSet(workoutEx.exerciseId, setIndex, 'weight', value)}
                        keyboardType="number-pad"
                        editable={!set.completed}
                      />
                      
                      <Pressable
                        style={[
                          styles.checkButton,
                          set.completed && styles.checkButtonCompleted
                        ]}
                        onPress={() => toggleSetComplete(workoutEx.exerciseId, setIndex)}
                      >
                        {set.completed && (
                          <IconSymbol name="checkmark" color={colors.card} size={18} />
                        )}
                      </Pressable>
                    </View>
                  ))}
                </View>

                {/* Exercise Notes */}
                <Pressable 
                  style={styles.notesButton}
                  onPress={() => router.push(`/exercise/${exercise.id}`)}
                >
                  <IconSymbol name="info.circle" color={colors.primary} size={16} />
                  <Text style={styles.notesButtonText}>View Form Tips</Text>
                </Pressable>
              </View>
            );
          })}

          {/* Finish Button */}
          <Pressable 
            style={styles.finishButton}
            onPress={handleFinishWorkout}
          >
            <IconSymbol name="checkmark.circle.fill" color={colors.card} size={24} />
            <Text style={styles.finishButtonText}>Finish Workout</Text>
          </Pressable>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  workoutName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  workoutDescription: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  exerciseCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 4,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  exerciseEquipment: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  progressBadge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  setsContainer: {
    marginBottom: 12,
  },
  setsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  setHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    flex: 1,
    textAlign: 'center',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  setRowCompleted: {
    backgroundColor: colors.highlight,
  },
  setNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  setInput: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginHorizontal: 4,
  },
  setInputCompleted: {
    backgroundColor: colors.card,
    color: colors.textSecondary,
  },
  checkButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  checkButtonCompleted: {
    backgroundColor: colors.success,
  },
  notesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
  },
  notesButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    padding: 18,
    borderRadius: 12,
    gap: 10,
    boxShadow: '0px 4px 12px rgba(76, 175, 80, 0.3)',
    elevation: 4,
  },
  finishButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
});
