import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius, shadows } from '@/src/constants/theme';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Button } from '@/src/components/ui/Button';
import { useAuthStore } from '@/src/store/authStore';

const CATEGORIES = [
  { id: '1', name: 'Electrician', icon: 'flash' },
  { id: '2', name: 'Cleaning', icon: 'sparkles' },
  { id: '3', name: 'Delivery', icon: 'bicycle' },
  { id: '4', name: 'Handyman', icon: 'construct' },
  { id: '5', name: 'Event Helper', icon: 'calendar' },
  { id: '6', name: 'Moving', icon: 'car' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Hello,</Text>
              <Text style={styles.userName}>{user?.full_name || 'User'}</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>3</Text>
              </View>
              <Ionicons name="notifications" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {/* Location */}
          <TouchableOpacity style={styles.locationContainer}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text style={styles.locationText}>Kathmandu, Nepal</Text>
            <Ionicons name="chevron-down" size={20} color={Colors.gray} />
          </TouchableOpacity>

          {/* Hero Card */}
          <GlassCard intensity={30} style={styles.heroCard}>
            <LinearGradient
              colors={['rgba(68, 189, 19, 0.2)', 'transparent']}
              style={styles.heroGradient}
            >
              <Text style={styles.heroTitle}>Need help today?</Text>
              <Text style={styles.heroSubtitle}>
                Post a job and get instant responses from nearby workers
              </Text>
              <Button
                title="Post a Job"
                onPress={() => router.push('/post-job')}
                size="large"
                style={styles.heroButton}
              />
            </LinearGradient>
          </GlassCard>

          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Popular Categories</Text>
            <View style={styles.categoriesGrid}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity key={category.id} style={styles.categoryCard}>
                  <GlassCard intensity={20} style={styles.categoryCardInner}>
                    <View style={styles.categoryIcon}>
                      <Ionicons
                        name={category.icon as any}
                        size={32}
                        color={Colors.primary}
                      />
                    </View>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </GlassCard>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Live Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Nearby Workers</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            
            <GlassCard intensity={20} style={styles.workerCard}>
              <View style={styles.workerHeader}>
                <View style={styles.workerInfo}>
                  <View style={styles.workerAvatar}>
                    <Ionicons name="person" size={24} color={Colors.primary} />
                  </View>
                  <View style={styles.workerDetails}>
                    <Text style={styles.workerName}>John Doe</Text>
                    <Text style={styles.workerCategory}>Electrician</Text>
                  </View>
                </View>
                <View style={styles.onlineBadge}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.onlineText}>Online</Text>
                </View>
              </View>
              <View style={styles.workerStats}>
                <View style={styles.stat}>
                  <Ionicons name="star" size={16} color={Colors.primary} />
                  <Text style={styles.statText}>4.8 (120)</Text>
                </View>
                <View style={styles.stat}>
                  <Ionicons name="location" size={16} color={Colors.gray} />
                  <Text style={styles.statText}>2.5 km away</Text>
                </View>
              </View>
            </GlassCard>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: fontSize.md,
    color: Colors.gray,
  },
  userName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  notificationButton: {
    position: 'relative',
    padding: spacing.sm,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  notificationCount: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  locationText: {
    color: Colors.lightGray,
    fontSize: fontSize.md,
    flex: 1,
  },
  heroCard: {
    marginBottom: spacing.xl,
    ...shadows.large,
  },
  heroGradient: {
    padding: spacing.lg,
  },
  heroTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: fontSize.md,
    color: Colors.gray,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  heroButton: {},
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  seeAllText: {
    fontSize: fontSize.sm,
    color: Colors.primary,
    fontWeight: fontWeight.semibold,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  categoryCard: {
    width: '30%',
    aspectRatio: 1,
  },
  categoryCardInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    marginBottom: spacing.sm,
  },
  categoryName: {
    fontSize: fontSize.sm,
    color: Colors.lightGray,
    textAlign: 'center',
  },
  workerCard: {
    marginBottom: spacing.md,
  },
  workerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  workerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workerDetails: {},
  workerName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: Colors.white,
  },
  workerCategory: {
    fontSize: fontSize.sm,
    color: Colors.gray,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  onlineText: {
    fontSize: fontSize.xs,
    color: Colors.success,
    fontWeight: fontWeight.semibold,
  },
  workerStats: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statText: {
    fontSize: fontSize.sm,
    color: Colors.gray,
  },
});