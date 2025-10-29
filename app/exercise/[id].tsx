
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import React, { useState } from "react";
import { useEvent } from 'expo';
import { useVideoPlayer, VideoView } from 'expo-video';
import { SafeAreaView } from "react-native-safe-area-context";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image,
  Pressable,
  Platform,
} from "react-native";
import { exercises } from "@/data/exercises";
import { Stack, useLocalSearchParams, router } from "expo-router";

export default function ExerciseDetailScreen() {
  const { id } = useLocalSearchParams();
  const exercise = exercises.find((ex) => ex.id === id);
  const [isPlaying, setIsPlaying] = useState(false);

  const player = useVideoPlayer(exercise?.videoUrl || '', (player) => {
    player.loop = true;
    player.play();
  });

  const { isPlaying: videoIsPlaying } = useEvent(player, 'playingChange', { 
    isPlaying: player.playing 
  });

  React.useEffect(() => {
    setIsPlaying(videoIsPlaying);
  }, [videoIsPlaying]);

  const togglePlayPause = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  if (!exercise) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Exercise Not Found",
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTintColor: colors.text,
          }}
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Exercise not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: exercise.name,
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerRight: () => (
            <Pressable
              onPress={() => router.push('/(tabs)/ai-assistant')}
              style={styles.aiButton}
            >
              <IconSymbol name="sparkles" size={20} color={colors.primary} />
            </Pressable>
          ),
        }}
      />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {exercise.videoUrl && (
          <View style={styles.videoContainer}>
            <VideoView
              player={player}
              style={styles.video}
              allowsFullscreen
              allowsPictureInPicture
            />
            <Pressable
              style={styles.playPauseButton}
              onPress={togglePlayPause}
            >
              <IconSymbol
                name={isPlaying ? "pause.circle.fill" : "play.circle.fill"}
                size={64}
                color="rgba(255, 255, 255, 0.9)"
              />
            </Pressable>
          </View>
        )}

        {exercise.imageUrl && !exercise.videoUrl && (
          <Image
            source={{ uri: exercise.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        )}

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{exercise.name}</Text>
            <View style={styles.badges}>
              <View style={[styles.badge, styles.difficultyBadge]}>
                <Text style={styles.badgeText}>{exercise.difficulty}</Text>
              </View>
              <View style={[styles.badge, styles.categoryBadge]}>
                <Text style={styles.badgeText}>{exercise.category}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <IconSymbol name="figure.strengthtraining.traditional" size={20} color={colors.primary} />
              <Text style={styles.infoText}>{exercise.equipment}</Text>
            </View>
            <View style={styles.infoRow}>
              <IconSymbol name="flame.fill" size={20} color={colors.accent} />
              <Text style={styles.infoText}>{exercise.musclesWorked.join(", ")}</Text>
            </View>
          </View>

          <View style={styles.aiPromptCard}>
            <View style={styles.aiPromptHeader}>
              <IconSymbol name="sparkles" size={24} color={colors.primary} />
              <Text style={styles.aiPromptTitle}>Ask AI Assistant</Text>
            </View>
            <Text style={styles.aiPromptText}>
              Have questions about this exercise? Tap the AI icon above to ask about form, variations, or get personalized advice!
            </Text>
          </View>

          <View style={styles.recommendationsCard}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            <View style={styles.recommendationRow}>
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationLabel}>Sets</Text>
                <Text style={styles.recommendationValue}>{exercise.recommendedSets}</Text>
              </View>
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationLabel}>Reps</Text>
                <Text style={styles.recommendationValue}>{exercise.recommendedReps}</Text>
              </View>
              <View style={styles.recommendationItem}>
                <Text style={styles.recommendationLabel}>Weight</Text>
                <Text style={styles.recommendationValue}>{exercise.recommendedWeight}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructions</Text>
            {exercise.instructions.map((instruction, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.numberBadge}>
                  <Text style={styles.numberText}>{index + 1}</Text>
                </View>
                <Text style={styles.listText}>{instruction}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Form Tips</Text>
            {exercise.formTips.map((tip, index) => (
              <View key={index} style={styles.listItem}>
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                <Text style={styles.listText}>{tip}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Common Mistakes</Text>
            {exercise.commonMistakes.map((mistake, index) => (
              <View key={index} style={styles.listItem}>
                <IconSymbol name="xmark.circle.fill" size={20} color={colors.error} />
                <Text style={styles.listText}>{mistake}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
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
  scrollContent: {
    paddingBottom: 32,
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
  playPauseButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -32 }, { translateY: -32 }],
  },
  image: {
    width: '100%',
    height: 250,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  difficultyBadge: {
    backgroundColor: colors.highlight,
  },
  categoryBadge: {
    backgroundColor: '#e8f5e9',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    textTransform: 'capitalize',
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: colors.text,
    marginLeft: 12,
    flex: 1,
  },
  aiPromptCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  aiPromptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiPromptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginLeft: 8,
  },
  aiPromptText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  recommendationsCard: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  recommendationRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  recommendationItem: {
    alignItems: 'center',
  },
  recommendationLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  recommendationValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  numberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  numberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  listText: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    marginLeft: 12,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 18,
    color: colors.error,
  },
  aiButton: {
    padding: 8,
    marginRight: 8,
  },
});
