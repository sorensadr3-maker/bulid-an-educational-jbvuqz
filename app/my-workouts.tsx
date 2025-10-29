
import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  Pressable,
  Alert,
} from "react-native";
import { Stack, router } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { sampleWorkouts } from "@/data/workouts";
import { exercises } from "@/data/exercises";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyWorkoutsScreen() {
  const [workouts, setWorkouts] = useState(sampleWorkouts);

  const handleStartWorkout = (workoutId: string) => {
    router.push(`/workout-session/${workoutId}`);
  };

  const handleCreateWorkout = () => {
    Alert.alert(
      "Create Workout",
      "Workout creation feature coming soon! You can start with the sample workouts below.",
      [{ text: "OK" }]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "My Workouts",
          headerBackTitle: "Back",
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your Workout Plans</Text>
            <Text style={styles.headerSubtitle}>
              Create and manage your custom workout routines
            </Text>
          </View>

          {/* Create New Workout Button */}
          <Pressable 
            style={styles.createButton}
            onPress={handleCreateWorkout}
          >
            <IconSymbol name="plus.circle.fill" color={colors.card} size={24} />
            <Text style={styles.createButtonText}>Create New Workout</Text>
          </Pressable>

          {/* Workout List */}
          <View style={styles.workoutList}>
            <Text style={styles.sectionTitle}>Sample Workouts</Text>
            
            {workouts.map(workout => {
              const exerciseCount = workout.exercises.length;
              const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
              
              return (
                <View key={workout.id} style={styles.workoutCard}>
                  <View style={styles.workoutHeader}>
                    <View style={styles.workoutInfo}>
                      <Text style={styles.workoutName}>{workout.name}</Text>
                      <Text style={styles.workoutDescription}>{workout.description}</Text>
                    </View>
                    <View style={styles.workoutIcon}>
                      <IconSymbol 
                        name="figure.strengthtraining.traditional" 
                        color={colors.primary} 
                        size={32}
                      />
                    </View>
                  </View>

                  <View style={styles.workoutStats}>
                    <View style={styles.statItem}>
                      <IconSymbol name="list.bullet" color={colors.textSecondary} size={16} />
                      <Text style={styles.statText}>{exerciseCount} exercises</Text>
                    </View>
                    <View style={styles.statItem}>
                      <IconSymbol name="repeat" color={colors.textSecondary} size={16} />
                      <Text style={styles.statText}>{totalSets} total sets</Text>
                    </View>
                  </View>

                  {/* Exercise Preview */}
                  <View style={styles.exercisePreview}>
                    {workout.exercises.slice(0, 3).map((workoutEx, index) => {
                      const exercise = exercises.find(e => e.id === workoutEx.exerciseId);
                      if (!exercise) return null;
                      
                      return (
                        <View key={index} style={styles.exercisePreviewItem}>
                          <Text style={styles.exercisePreviewText}>
                            • {exercise.name}
                          </Text>
                          <Text style={styles.exercisePreviewDetail}>
                            {workoutEx.sets}x{workoutEx.reps}
                          </Text>
                        </View>
                      );
                    })}
                    {workout.exercises.length > 3 && (
                      <Text style={styles.moreExercises}>
                        +{workout.exercises.length - 3} more exercises
                      </Text>
                    )}
                  </View>

                  <Pressable 
                    style={styles.startButton}
                    onPress={() => handleStartWorkout(workout.id)}
                  >
                    <IconSymbol name="play.fill" color={colors.card} size={18} />
                    <Text style={styles.startButtonText}>Start Workout</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 10,
    boxShadow: '0px 4px 12px rgba(255, 64, 129, 0.3)',
    elevation: 4,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
  workoutList: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  workoutCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 4,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  workoutDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  workoutIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutStats: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  exercisePreview: {
    marginBottom: 16,
  },
  exercisePreviewItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  exercisePreviewText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  exercisePreviewDetail: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  moreExercises: {
    fontSize: 13,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 14,
    borderRadius: 10,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.card,
  },
});
