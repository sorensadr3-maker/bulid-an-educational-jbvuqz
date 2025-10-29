
import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import Svg, { Path, Circle, G, Text as SvgText } from 'react-native-svg';
import { colors } from '@/styles/commonStyles';
import * as Haptics from 'expo-haptics';

type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'abs' | 'glutes' | 'calves';

interface AnatomyDiagramProps {
  onMusclePress: (muscle: MuscleGroup) => void;
}

export default function AnatomyDiagram({ onMusclePress }: AnatomyDiagramProps) {
  const handlePress = (muscle: MuscleGroup) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    onMusclePress(muscle);
  };

  return (
    <View style={styles.container}>
      <Svg width="300" height="500" viewBox="0 0 300 500">
        {/* Head */}
        <Circle cx="150" cy="40" r="25" fill={colors.border} />
        
        {/* Neck */}
        <Path
          d="M 140 60 L 140 80 L 160 80 L 160 60"
          fill={colors.border}
        />

        {/* Shoulders - Clickable */}
        <G onPress={() => handlePress('shoulders')}>
          <Path
            d="M 100 80 L 100 120 L 130 120 L 130 80 Z"
            fill={colors.primary}
            opacity={0.7}
          />
          <Path
            d="M 170 80 L 170 120 L 200 120 L 200 80 Z"
            fill={colors.primary}
            opacity={0.7}
          />
          {/* Shoulder Labels */}
          <SvgText x="65" y="100" fontSize="12" fill={colors.text} fontWeight="600">
            Shoulders
          </SvgText>
          <SvgText x="205" y="100" fontSize="12" fill={colors.text} fontWeight="600">
            →
          </SvgText>
        </G>

        {/* Chest - Clickable */}
        <G onPress={() => handlePress('chest')}>
          <Path
            d="M 130 80 L 130 150 L 170 150 L 170 80 Z"
            fill={colors.secondary}
            opacity={0.7}
          />
          {/* Chest Label */}
          <SvgText x="125" y="115" fontSize="12" fill={colors.text} fontWeight="600" textAnchor="middle">
            Chest
          </SvgText>
        </G>

        {/* Arms - Clickable */}
        <G onPress={() => handlePress('arms')}>
          <Path
            d="M 90 120 L 90 220 L 110 220 L 110 120 Z"
            fill={colors.accent}
            opacity={0.7}
          />
          <Path
            d="M 190 120 L 190 220 L 210 220 L 210 120 Z"
            fill={colors.accent}
            opacity={0.7}
          />
          {/* Arms Label */}
          <SvgText x="50" y="170" fontSize="12" fill={colors.text} fontWeight="600">
            ← Arms
          </SvgText>
        </G>

        {/* Core/Abs - Clickable */}
        <G onPress={() => handlePress('core')}>
          <Path
            d="M 130 150 L 130 230 L 170 230 L 170 150 Z"
            fill={colors.warning}
            opacity={0.7}
          />
          {/* Core Label */}
          <SvgText x="180" y="190" fontSize="12" fill={colors.text} fontWeight="600">
            → Core
          </SvgText>
        </G>

        {/* Back (shown as side indicator) */}
        <G onPress={() => handlePress('back')}>
          <Path
            d="M 110 80 L 110 230 L 120 230 L 120 80 Z"
            fill={colors.success}
            opacity={0.7}
          />
          <Path
            d="M 180 80 L 180 230 L 190 230 L 190 80 Z"
            fill={colors.success}
            opacity={0.7}
          />
          {/* Back Label */}
          <SvgText x="50" y="155" fontSize="12" fill={colors.text} fontWeight="600">
            ← Back
          </SvgText>
        </G>

        {/* Hips/Glutes - Clickable */}
        <G onPress={() => handlePress('glutes')}>
          <Path
            d="M 120 230 L 120 260 L 180 260 L 180 230 Z"
            fill="#9c27b0"
            opacity={0.7}
          />
          {/* Glutes Label */}
          <SvgText x="185" y="245" fontSize="12" fill={colors.text} fontWeight="600">
            → Glutes
          </SvgText>
        </G>

        {/* Legs - Clickable */}
        <G onPress={() => handlePress('legs')}>
          <Path
            d="M 120 260 L 120 420 L 140 420 L 140 260 Z"
            fill={colors.primary}
            opacity={0.7}
          />
          <Path
            d="M 160 260 L 160 420 L 180 420 L 180 260 Z"
            fill={colors.primary}
            opacity={0.7}
          />
          {/* Legs Label */}
          <SvgText x="50" y="340" fontSize="12" fill={colors.text} fontWeight="600">
            ← Legs
          </SvgText>
        </G>

        {/* Calves - Clickable */}
        <G onPress={() => handlePress('calves')}>
          <Path
            d="M 120 420 L 120 470 L 140 470 L 140 420 Z"
            fill={colors.secondary}
            opacity={0.7}
          />
          <Path
            d="M 160 420 L 160 470 L 180 470 L 180 420 Z"
            fill={colors.secondary}
            opacity={0.7}
          />
          {/* Calves Label */}
          <SvgText x="185" y="445" fontSize="12" fill={colors.text} fontWeight="600">
            → Calves
          </SvgText>
        </G>

        {/* Feet */}
        <Path
          d="M 115 470 L 115 485 L 145 485 L 145 470 Z"
          fill={colors.border}
        />
        <Path
          d="M 155 470 L 155 485 L 185 485 L 185 470 Z"
          fill={colors.border}
        />
      </Svg>

      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Tap any colored area to select</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.primary }]} />
            <Text style={styles.legendText}>Shoulders/Legs</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.secondary }]} />
            <Text style={styles.legendText}>Chest/Calves</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.success }]} />
            <Text style={styles.legendText}>Back</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.accent }]} />
            <Text style={styles.legendText}>Arms</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors.warning }]} />
            <Text style={styles.legendText}>Core</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#9c27b0' }]} />
            <Text style={styles.legendText}>Glutes</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
  },
  legend: {
    marginTop: 24,
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
