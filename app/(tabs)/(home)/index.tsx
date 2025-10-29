
import React, { useState } from "react";
import { Stack } from "expo-router";
import { 
  ScrollView, 
  Pressable, 
  StyleSheet, 
  View, 
  Text, 
  Platform,
  TextInput,
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors, commonStyles } from "@/styles/commonStyles";
import { exercises, categories } from "@/data/exercises";
import { router } from "expo-router";

export default function HomeScreen() {
  const theme = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredExercises = exercises.filter(exercise => {
    const matchesCategory = selectedCategory === 'all' || exercise.category === selectedCategory;
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exercise.musclesWorked.some(m => m.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => router.push('/my-workouts')}
      style={styles.headerButtonContainer}
    >
      <IconSymbol name="list.bullet" color={colors.primary} size={24} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Exercise Library",
            headerRight: renderHeaderRight,
          }}
        />
      )}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <IconSymbol name="magnifyingglass" color={colors.textSecondary} size={20} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Category Filter */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScroll}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map(category => (
            <Pressable
              key={category.id}
              style={[
                styles.categoryChip,
                selectedCategory === category.id && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <IconSymbol 
                name={category.icon as any} 
                color={selectedCategory === category.id ? colors.card : colors.primary} 
                size={18}
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Exercise List */}
        <ScrollView
          style={styles.exerciseList}
          contentContainerStyle={[
            styles.exerciseListContent,
            Platform.OS !== 'ios' && styles.listContainerWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.resultCount}>
            {filteredExercises.length} exercise{filteredExercises.length !== 1 ? 's' : ''} found
          </Text>
          
          {filteredExercises.map(exercise => (
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
                {exercise.musclesWorked.slice(0, 3).map((muscle, index) => (
                  <View key={index} style={styles.muscleBadge}>
                    <Text style={styles.muscleText}>{muscle}</Text>
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
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  categoryScroll: {
    maxHeight: 50,
  },
  categoryContainer: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 12,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.card,
    gap: 6,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  categoryTextActive: {
    color: colors.card,
  },
  exerciseList: {
    flex: 1,
  },
  exerciseListContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listContainerWithTabBar: {
    paddingBottom: 100,
  },
  resultCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    marginTop: 4,
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
  headerButtonContainer: {
    padding: 6,
  },
});
