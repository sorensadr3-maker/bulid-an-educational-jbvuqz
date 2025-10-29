
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { exercises } from '@/data/exercises';

type EquipmentType = 'bodyweight' | 'dumbbells' | 'barbells' | 'cables';

export default function ExerciseListScreen() {
  const params = useLocalSearchParams();
  const muscle = params.muscle as string;
  const equipment = params.equipment as EquipmentType;

  // Filter exercises based on muscle group and equipment type
  const filteredExercises = exercises.filter(exercise => {
    // Check if exercise matches the muscle group
    const matchesMuscle = 
      exercise.category === muscle ||
      exercise.musclesWorked.some(m => 
        m.toLowerCase().includes(muscle?.toLowerCase() || '')
      );

    // Check if exercise matches the equipment type
    const equipmentLower = exercise.equipment.toLowerCase();
    let matchesEquipment = false;

    switch (equipment) {
      case 'bodyweight':
        matchesEquipment = 
          equipmentLower.includes('bodyweight') ||
          equipmentLower.includes('none') ||
          equipmentLower === 'none';
        break;
      case 'dumbbells':
        matchesEquipment = equipmentLower.includes('dumbbell');
        break;
      case 'barbells':
        matchesEquipment = equipmentLower.includes('barbell');
        break;
      case 'cables':
        matchesEquipment = 
          equipmentLower.includes('cable') ||
          equipmentLower.includes('machine');
        break;
    }

    return matchesMuscle && matchesEquipment;
  });

  const getEquipmentIcon = (equipmentType: EquipmentType) => {
    switch (equipmentType) {
      case 'bodyweight':
        return 'figure.walk';
      case 'dumbbells':
        return 'circle.hexagongrid.fill';
      case 'barbells':
        return 'minus.circle.fill';
      case 'cables':
        return 'arrow.up.arrow.down';
      default:
        return 'questionmark.circle';
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: `${muscle?.charAt(0).toUpperCase() + muscle?.slice(1)} Exercises`,
          headerBackTitle: 'Back',
        }}
      />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
        {/* Header Info */}
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <View style={styles.iconContainer}>
              <IconSymbol 
                name={getEquipmentIcon(equipment) as any} 
                color={colors.card} 
                size={32} 
              />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>
                {equipment.charAt(0).toUpperCase() + equipment.slice(1)} Exercises
              </Text>
              <Text style={styles.headerSubtitle}>
                {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
              </Text>
            </View>
          </View>
        </View>

        {/* Exercise List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {filteredExercises.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol name="exclamationmark.triangle" color={colors.textSecondary} size={48} />
              <Text style={styles.emptyTitle}>No Exercises Found</Text>
              <Text style={styles.emptyText}>
                We couldn&apos;t find any {equipment} exercises for {muscle}.
              </Text>
              <Text style={styles.emptyText}>
                Try selecting a different equipment type or muscle group.
              </Text>
              <Pressable
                style={styles.backButton}
                onPress={() => router.back()}
              >
                <Text style={styles.backButtonText}>Go Back</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {/* Common Exercises Section */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Common Exercises</Text>
                {filteredExercises
                  .filter(ex => ex.difficulty === 'beginner' || ex.difficulty === 'intermediate')
                  .map(exercise => (
                    <Pressable
                      key={exercise.id}
                      style={styles.exerciseCard}
                      onPress={() => router.push(`/exercise/${exercise.id}`)}
                    >
                      <View style={styles.exerciseHeader}>
                        <View style={styles.exerciseInfo}>
                          <Text style={styles.exerciseName}>{exercise.name}</Text>
                          <Text style={styles.exerciseEquipment}>{exercise.equipment}</Text>
                        </View>
                        <View style={[
                          styles.difficultyBadge,
                          { backgroundColor: 
                            exercise.difficulty === 'beginner' ? colors.success :
                            exercise.difficulty === 'intermediate' ? colors.warning :
                            colors.error
                          }
                        ]}>
                          <Text style={styles.difficultyText}>
                            {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                          </Text>
                        </View>
                      </View>
                      
                      <View style={styles.muscleContainer}>
                        {exercise.musclesWorked.slice(0, 3).map((muscleWorked, index) => (
                          <View key={index} style={styles.muscleBadge}>
                            <Text style={styles.muscleText}>{muscleWorked}</Text>
                          </View>
                        ))}
                      </View>

                      <View style={styles.exerciseFooter}>
                        <View style={styles.exerciseDetail}>
                          <IconSymbol name="repeat" color={colors.textSecondary} size={16} />
                          <Text style={styles.exerciseDetailText}>{exercise.recommendedSets}</Text>
                        </View>
                        <View style={styles.exerciseDetail}>
                          <IconSymbol name="number" color={colors.textSecondary} size={16} />
                          <Text style={styles.exerciseDetailText}>{exercise.recommendedReps}</Text>
                        </View>
                        <IconSymbol name="chevron.right" color={colors.primary} size={20} />
                      </View>
                    </Pressable>
                  ))}
              </View>

              {/* Advanced/Unique Exercises Section */}
              {filteredExercises.some(ex => ex.difficulty === 'advanced') && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Advanced & Unique Exercises</Text>
                  {filteredExercises
                    .filter(ex => ex.difficulty === 'advanced')
                    .map(exercise => (
                      <Pressable
                        key={exercise.id}
                        style={styles.exerciseCard}
                        onPress={() => router.push(`/exercise/${exercise.id}`)}
                      >
                        <View style={styles.exerciseHeader}>
                          <View style={styles.exerciseInfo}>
                            <Text style={styles.exerciseName}>{exercise.name}</Text>
                            <Text style={styles.exerciseEquipment}>{exercise.equipment}</Text>
                          </View>
                          <View style={[
                            styles.difficultyBadge,
                            { backgroundColor: colors.error }
                          ]}>
                            <Text style={styles.difficultyText}>Advanced</Text>
                          </View>
                        </View>
                        
                        <View style={styles.muscleContainer}>
                          {exercise.musclesWorked.slice(0, 3).map((muscleWorked, index) => (
                            <View key={index} style={styles.muscleBadge}>
                              <Text style={styles.muscleText}>{muscleWorked}</Text>
                            </View>
                          ))}
                        </View>

                        <View style={styles.exerciseFooter}>
                          <View style={styles.exerciseDetail}>
                            <IconSymbol name="repeat" color={colors.textSecondary} size={16} />
                            <Text style={styles.exerciseDetailText}>{exercise.recommendedSets}</Text>
                          </View>
                          <View style={styles.exerciseDetail}>
                            <IconSymbol name="number" color={colors.textSecondary} size={16} />
                            <Text style={styles.exerciseDetailText}>{exercise.recommendedReps}</Text>
                          </View>
                          <IconSymbol name="chevron.right" color={colors.primary} size={20} />
                        </View>
                      </Pressable>
                    ))}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  scrollContentWithTabBar: {
    paddingBottom: 100,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  exerciseCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  exerciseEquipment: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.card,
  },
  muscleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  muscleBadge: {
    backgroundColor: colors.highlight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  muscleText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  exerciseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  exerciseDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exerciseDetailText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  backButton: {
    marginTop: 24,
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
  },
});
