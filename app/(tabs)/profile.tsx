
import React from "react";
import { View, Text, StyleSheet, ScrollView, Platform, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { useTheme } from "@react-navigation/native";
import { colors } from "@/styles/commonStyles";
import { router } from "expo-router";

export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <IconSymbol name="person.circle.fill" size={80} color={colors.primary} />
          </View>
          <Text style={styles.name}>Fitness Enthusiast</Text>
          <Text style={styles.subtitle}>Track your progress and stay motivated!</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <IconSymbol name="flame.fill" color={colors.accent} size={32} />
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          
          <View style={styles.statCard}>
            <IconSymbol name="calendar" color={colors.secondary} size={32} />
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          
          <View style={styles.statCard}>
            <IconSymbol name="chart.line.uptrend.xyaxis" color={colors.success} size={32} />
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <Pressable 
            style={styles.actionCard}
            onPress={() => router.push('/my-workouts')}
          >
            <View style={styles.actionIcon}>
              <IconSymbol name="list.bullet" color={colors.primary} size={24} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>My Workouts</Text>
              <Text style={styles.actionDescription}>View and manage your workout plans</Text>
            </View>
            <IconSymbol name="chevron.right" color={colors.textSecondary} size={20} />
          </Pressable>

          <Pressable 
            style={styles.actionCard}
            onPress={() => router.push('/(tabs)/(home)/')}
          >
            <View style={styles.actionIcon}>
              <IconSymbol name="book.fill" color={colors.secondary} size={24} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Exercise Library</Text>
              <Text style={styles.actionDescription}>Browse all available exercises</Text>
            </View>
            <IconSymbol name="chevron.right" color={colors.textSecondary} size={20} />
          </Pressable>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          
          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <IconSymbol name="checkmark.circle.fill" color={colors.success} size={28} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Push Day Completed</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <IconSymbol name="checkmark.circle.fill" color={colors.success} size={28} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Leg Day Completed</Text>
              <Text style={styles.activityTime}>Yesterday</Text>
            </View>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <IconSymbol name="checkmark.circle.fill" color={colors.success} size={28} />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Pull Day Completed</Text>
              <Text style={styles.activityTime}>2 days ago</Text>
            </View>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitness Tips</Text>
          
          <View style={styles.tipCard}>
            <IconSymbol name="lightbulb.fill" color={colors.warning} size={24} />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Stay Hydrated</Text>
              <Text style={styles.tipText}>
                Drink water before, during, and after your workout to maintain optimal performance.
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <IconSymbol name="moon.fill" color={colors.primary} size={24} />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Rest & Recovery</Text>
              <Text style={styles.tipText}>
                Give your muscles time to recover. Aim for 7-9 hours of sleep each night.
              </Text>
            </View>
          </View>

          <View style={styles.tipCard}>
            <IconSymbol name="fork.knife" color={colors.accent} size={24} />
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Proper Nutrition</Text>
              <Text style={styles.tipText}>
                Fuel your body with balanced meals rich in protein, carbs, and healthy fats.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
    elevation: 4,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
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
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.highlight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  activityIcon: {
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  tipContent: {
    flex: 1,
    marginLeft: 12,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  tipText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
});
