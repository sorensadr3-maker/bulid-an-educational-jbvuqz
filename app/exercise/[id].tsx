
import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  Pressable,
  Platform,
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { exercises } from "@/data/exercises";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const exercise = exercises.find(e => e.id === id);
  const [activeTab, setActiveTab] = useState<'instructions' | 'form' | 'mistakes'>('instructions');

  // Initialize video player if video URL exists
  const player = useVideoPlayer(exercise?.videoUrl || null, player => {
    if (player) {
      player.loop = true;
      player.muted = false;
    }
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

  if (!exercise) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Exercise not found</Text>
      </View>
    );
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: exercise.name,
          headerBackTitle: "Back",
        }}
      />
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Video Player */}
          {exercise.videoUrl && (
            <View style={styles.videoContainer}>
              <VideoView 
                style={styles.video} 
                player={player}
                allowsFullscreen
                allowsPictureInPicture
                nativeControls={false}
              />
              <View style={styles.videoControls}>
                <Pressable 
                  style={styles.playButton}
                  onPress={togglePlayPause}
                >
                  <IconSymbol 
                    name={isPlaying ? "pause.fill" : "play.fill"} 
                    color={colors.card} 
                    size={24} 
                  />
                </Pressable>
                <View style={styles.videoInfo}>
                  <IconSymbol name="video.fill" color={colors.card} size={16} />
                  <Text style={styles.videoLabel}>Exercise Demonstration</Text>
                </View>
              </View>
            </View>
          )}

          {/* Exercise Image (fallback if no video) */}
          {!exercise.videoUrl && exercise.imageUrl && (
            <Image 
              source={{ uri: exercise.imageUrl }}
              style={styles.exerciseImage}
              resizeMode="cover"
            />
          )}

          {/* Exercise Header */}
          <View style={styles.header}>
            <Text style={styles.exerciseName}>{exercise.name}</Text>
            <View style={styles.headerBadges}>
              <View style={[
                styles.difficultyBadge,
                { backgroundColor: 
                  exercise.difficulty === 'beginner' ? colors.success :
                  exercise.difficulty === 'intermediate' ? colors.warning :
                  colors.error
                }
              ]}>
                <Text style={styles.badgeText}>
                  {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                </Text>
              </View>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryBadgeText}>
                  {exercise.category.charAt(0).toUpperCase() + exercise.category.slice(1)}
                </Text>
              </View>
            </View>
          </View>

          {/* Equipment & Muscles */}
          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <IconSymbol name="wrench.fill" color={colors.primary} size={24} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Equipment</Text>
                <Text style={styles.infoValue}>{exercise.equipment}</Text>
              </View>
            </View>
            
            <View style={styles.infoCard}>
              <IconSymbol name="figure.strengthtraining.traditional" color={colors.secondary} size={24} />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Muscles Worked</Text>
                <Text style={styles.infoValue}>{exercise.musclesWorked.join(', ')}</Text>
              </View>
            </View>
          </View>

          {/* Recommendations */}
          <View style={styles.recommendationsCard}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <View style={styles.recommendationRow}>
              <View style={styles.recommendationItem}>
                <IconSymbol name="repeat" color={colors.accent} size={20} />
                <Text style={styles.recommendationLabel}>Sets</Text>
                <Text style={styles.recommendationValue}>{exercise.recommendedSets}</Text>
              </View>
              <View style={styles.recommendationItem}>
                <IconSymbol name="number" color={colors.accent} size={20} />
                <Text style={styles.recommendationLabel}>Reps</Text>
                <Text style={styles.recommendationValue}>{exercise.recommendedReps}</Text>
              </View>
              <View style={styles.recommendationItem}>
                <IconSymbol name="scalemass.fill" color={colors.accent} size={20} />
                <Text style={styles.recommendationLabel}>Weight</Text>
                <Text style={styles.recommendationValue}>{exercise.recommendedWeight}</Text>
              </View>
            </View>
          </View>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <Pressable
              style={[styles.tab, activeTab === 'instructions' && styles.tabActive]}
              onPress={() => setActiveTab('instructions')}
            >
              <Text style={[styles.tabText, activeTab === 'instructions' && styles.tabTextActive]}>
                Instructions
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'form' && styles.tabActive]}
              onPress={() => setActiveTab('form')}
            >
              <Text style={[styles.tabText, activeTab === 'form' && styles.tabTextActive]}>
                Form Tips
              </Text>
            </Pressable>
            <Pressable
              style={[styles.tab, activeTab === 'mistakes' && styles.tabActive]}
              onPress={() => setActiveTab('mistakes')}
            >
              <Text style={[styles.tabText, activeTab === 'mistakes' && styles.tabTextActive]}>
                Mistakes
              </Text>
            </Pressable>
          </View>

          {/* Tab Content */}
          <View style={styles.contentCard}>
            {activeTab === 'instructions' && (
              <View>
                <Text style={styles.contentTitle}>How to Perform</Text>
                {exercise.instructions.map((instruction, index) => (
                  <View key={index} style={styles.listItem}>
                    <View style={styles.stepNumber}>
                      <Text style={styles.stepNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.listItemText}>{instruction}</Text>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 'form' && (
              <View>
                <Text style={styles.contentTitle}>Form Tips</Text>
                {exercise.formTips.map((tip, index) => (
                  <View key={index} style={styles.listItem}>
                    <IconSymbol name="checkmark.circle.fill" color={colors.success} size={20} />
                    <Text style={styles.listItemText}>{tip}</Text>
                  </View>
                ))}
              </View>
            )}

            {activeTab === 'mistakes' && (
              <View>
                <Text style={styles.contentTitle}>Common Mistakes to Avoid</Text>
                {exercise.commonMistakes.map((mistake, index) => (
                  <View key={index} style={styles.listItem}>
                    <IconSymbol name="xmark.circle.fill" color={colors.error} size={20} />
                    <Text style={styles.listItemText}>{mistake}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

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
  videoContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.3)',
    elevation: 5,
  },
  videoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  videoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.card,
  },
  exerciseImage: {
    width: '100%',
    height: 250,
    backgroundColor: colors.highlight,
  },
  header: {
    padding: 20,
    backgroundColor: colors.card,
  },
  exerciseName: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  headerBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.highlight,
  },
  categoryBadgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.card,
  },
  infoSection: {
    padding: 16,
    gap: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  recommendationsCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  recommendationRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  recommendationItem: {
    alignItems: 'center',
    gap: 6,
  },
  recommendationLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  recommendationValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 4,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.card,
  },
  contentCard: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.card,
  },
  listItemText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: colors.text,
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
  },
});
