
import React, { useState } from "react";
import { Stack } from "expo-router";
import { 
  ScrollView, 
  Pressable, 
  StyleSheet, 
  View, 
  Text, 
  Platform,
  Modal,
  Dimensions,
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AnatomyDiagram from "@/components/AnatomyDiagram";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type EquipmentType = 'bodyweight' | 'dumbbells' | 'barbells' | 'cables';
type MuscleGroup = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'abs' | 'glutes' | 'calves';

export default function HomeScreen() {
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);

  const handleMusclePress = (muscle: MuscleGroup) => {
    console.log('Muscle selected:', muscle);
    setSelectedMuscle(muscle);
    setShowEquipmentModal(true);
  };

  const handleEquipmentSelect = (equipment: EquipmentType) => {
    console.log('Equipment selected:', equipment, 'for muscle:', selectedMuscle);
    setShowEquipmentModal(false);
    
    // Navigate to exercise list with filters
    router.push({
      pathname: '/exercise-list',
      params: {
        muscle: selectedMuscle,
        equipment: equipment,
      },
    });
  };

  const handleCloseModal = () => {
    setShowEquipmentModal(false);
    setSelectedMuscle(null);
  };

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
            title: "Select Muscle Group",
            headerRight: renderHeaderRight,
          }}
        />
      )}
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            Platform.OS !== 'ios' && styles.scrollContentWithTabBar
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Choose a Muscle Group</Text>
            <Text style={styles.subtitle}>
              Tap on any body part to see exercises
            </Text>
          </View>

          {/* Anatomy Diagram */}
          <View style={styles.diagramContainer}>
            <AnatomyDiagram onMusclePress={handleMusclePress} />
          </View>

          {/* Quick Access Cards */}
          <View style={styles.quickAccessContainer}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <View style={styles.quickAccessGrid}>
              <Pressable
                style={styles.quickAccessCard}
                onPress={() => handleMusclePress('chest')}
              >
                <IconSymbol name="heart.fill" color={colors.primary} size={32} />
                <Text style={styles.quickAccessText}>Chest</Text>
              </Pressable>
              <Pressable
                style={styles.quickAccessCard}
                onPress={() => handleMusclePress('back')}
              >
                <IconSymbol name="figure.walk" color={colors.primary} size={32} />
                <Text style={styles.quickAccessText}>Back</Text>
              </Pressable>
              <Pressable
                style={styles.quickAccessCard}
                onPress={() => handleMusclePress('legs')}
              >
                <IconSymbol name="figure.run" color={colors.primary} size={32} />
                <Text style={styles.quickAccessText}>Legs</Text>
              </Pressable>
              <Pressable
                style={styles.quickAccessCard}
                onPress={() => handleMusclePress('shoulders')}
              >
                <IconSymbol name="arrow.up.circle.fill" color={colors.primary} size={32} />
                <Text style={styles.quickAccessText}>Shoulders</Text>
              </Pressable>
              <Pressable
                style={styles.quickAccessCard}
                onPress={() => handleMusclePress('arms')}
              >
                <IconSymbol name="hand.raised.fill" color={colors.primary} size={32} />
                <Text style={styles.quickAccessText}>Arms</Text>
              </Pressable>
              <Pressable
                style={styles.quickAccessCard}
                onPress={() => handleMusclePress('core')}
              >
                <IconSymbol name="circle.fill" color={colors.primary} size={32} />
                <Text style={styles.quickAccessText}>Core</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>

        {/* Equipment Selection Modal */}
        <Modal
          visible={showEquipmentModal}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCloseModal}
        >
          <Pressable 
            style={styles.modalOverlay}
            onPress={handleCloseModal}
          >
            <Pressable 
              style={styles.modalContent}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Select Equipment Type
                </Text>
                <Text style={styles.modalSubtitle}>
                  {selectedMuscle && `${selectedMuscle.charAt(0).toUpperCase() + selectedMuscle.slice(1)} Exercises`}
                </Text>
              </View>

              <View style={styles.equipmentGrid}>
                <Pressable
                  style={styles.equipmentCard}
                  onPress={() => handleEquipmentSelect('bodyweight')}
                >
                  <View style={styles.equipmentIconContainer}>
                    <IconSymbol name="figure.walk" color={colors.card} size={40} />
                  </View>
                  <Text style={styles.equipmentTitle}>Body Weight</Text>
                  <Text style={styles.equipmentDescription}>
                    No equipment needed
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.equipmentCard}
                  onPress={() => handleEquipmentSelect('dumbbells')}
                >
                  <View style={styles.equipmentIconContainer}>
                    <IconSymbol name="circle.hexagongrid.fill" color={colors.card} size={40} />
                  </View>
                  <Text style={styles.equipmentTitle}>Dumbbells</Text>
                  <Text style={styles.equipmentDescription}>
                    Free weight exercises
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.equipmentCard}
                  onPress={() => handleEquipmentSelect('barbells')}
                >
                  <View style={styles.equipmentIconContainer}>
                    <IconSymbol name="minus.circle.fill" color={colors.card} size={40} />
                  </View>
                  <Text style={styles.equipmentTitle}>Barbells</Text>
                  <Text style={styles.equipmentDescription}>
                    Compound movements
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.equipmentCard}
                  onPress={() => handleEquipmentSelect('cables')}
                >
                  <View style={styles.equipmentIconContainer}>
                    <IconSymbol name="arrow.up.arrow.down" color={colors.card} size={40} />
                  </View>
                  <Text style={styles.equipmentTitle}>Cables</Text>
                  <Text style={styles.equipmentDescription}>
                    Cable machine exercises
                  </Text>
                </Pressable>
              </View>

              <Pressable
                style={styles.closeButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.closeButtonText}>Cancel</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  diagramContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  quickAccessContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  quickAccessCard: {
    width: (SCREEN_WIDTH - 56) / 3,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 3,
    minHeight: 100,
  },
  quickAccessText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  headerButtonContainer: {
    padding: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 24,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  equipmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  equipmentCard: {
    width: (SCREEN_WIDTH - 56) / 2,
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  equipmentIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  equipmentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  equipmentDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: colors.border,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
});
