import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { GlassCard } from '@/src/components/ui/GlassCard';

const EARNINGS_DATA = [
  { day: 'M', value: 45 },
  { day: 'T', value: 72 },
  { day: 'W', value: 35 },
  { day: 'T', value: 90 },
  { day: 'F', value: 110 },
  { day: 'S', value: 145 },
  { day: 'S', value: 85 },
];

const NEARBY_JOBS = [
  { id: '1', title: 'Fix kitchen sink', category: 'Plumbing', budget: '$45', distance: '1.2 km', urgency: 'Urgent' },
  { id: '2', title: 'Install ceiling fan', category: 'Electrician', budget: '$60', distance: '2.5 km', urgency: 'Normal' },
  { id: '3', title: 'Move furniture', category: 'Moving', budget: '$120', distance: '3.1 km', urgency: 'Flexible' },
];

export default function WorkerDashboardScreen() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const maxEarnings = Math.max(...EARNINGS_DATA.map((d) => d.value));

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.name}>John Doe</Text>
            </View>
            <View style={styles.onlineToggle}>
              <View style={styles.onlineIndicator}>
                <View style={[styles.dot, { backgroundColor: isOnline ? Colors.success : Colors.gray }]} />
                <Text style={[styles.onlineText, { color: isOnline ? Colors.success : Colors.gray }]}>
                  {isOnline ? 'Online' : 'Offline'}
                </Text>
              </View>
              <Switch
                value={isOnline}
                onValueChange={setIsOnline}
                trackColor={{ false: Colors.darkGray, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>
          </View>

          {/* Earnings Hero Card */}
          <GlassCard intensity={30} style={styles.heroCard}>
            <LinearGradient
              colors={['rgba(68, 189, 19, 0.2)', 'transparent']}
              style={styles.heroGradient}
            >
              <Text style={styles.heroLabel}>Today's Earnings</Text>
              <Text style={styles.heroAmount}>$245.50</Text>
              <View style={styles.heroStats}>
                <View style={styles.heroStat}>
                  <Ionicons name="trending-up" size={16} color={Colors.success} />
                  <Text style={styles.heroStatText}>+12% from yesterday</Text>
                </View>
              </View>
              <View style={styles.heroBadges}>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeNumber}>5</Text>
                  <Text style={styles.heroBadgeLabel}>Jobs Today</Text>
                </View>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeNumber}>4.9</Text>
                  <Text style={styles.heroBadgeLabel}>Rating</Text>
                </View>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeNumber}>98%</Text>
                  <Text style={styles.heroBadgeLabel}>Acceptance</Text>
                </View>
              </View>
            </LinearGradient>
          </GlassCard>

          {/* Weekly Chart */}
          <Text style={styles.sectionTitle}>Weekly Earnings</Text>
          <GlassCard intensity={20} style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTotal}>$582.00</Text>
              <View style={styles.chartTrend}>
                <Ionicons name="trending-up" size={14} color={Colors.success} />
                <Text style={styles.chartTrendText}>+24%</Text>
              </View>
            </View>
            <View style={styles.chart}>
              {EARNINGS_DATA.map((item, idx) => (
                <View key={idx} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <LinearGradient
                      colors={[Colors.primary, 'rgba(68, 189, 19, 0.3)']}
                      style={[
                        styles.bar,
                        { height: `${(item.value / maxEarnings) * 100}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{item.day}</Text>
                </View>
              ))}
            </View>
          </GlassCard>

          {/* Quick Stats */}
          <View style={styles.statsGrid}>
            <GlassCard intensity={20} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(68, 189, 19, 0.2)' }]}>
                <Ionicons name="briefcase" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.statCardValue}>12</Text>
              <Text style={styles.statCardLabel}>Active Jobs</Text>
            </GlassCard>
            <GlassCard intensity={20} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                <Ionicons name="time" size={20} color={Colors.warning} />
              </View>
              <Text style={styles.statCardValue}>3</Text>
              <Text style={styles.statCardLabel}>Pending</Text>
            </GlassCard>
            <GlassCard intensity={20} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              </View>
              <Text style={styles.statCardValue}>247</Text>
              <Text style={styles.statCardLabel}>Completed</Text>
            </GlassCard>
          </View>

          {/* Nearby Jobs */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Jobs</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {NEARBY_JOBS.map((job) => (
            <TouchableOpacity key={job.id} activeOpacity={0.8}>
              <GlassCard intensity={20} style={styles.jobCard}>
                <View style={styles.jobHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.jobCategory}>{job.category}</Text>
                  </View>
                  <View style={[
                    styles.urgencyBadge,
                    job.urgency === 'Urgent' && { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
                    job.urgency === 'Normal' && { backgroundColor: 'rgba(245, 158, 11, 0.2)' },
                    job.urgency === 'Flexible' && { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
                  ]}>
                    <Text style={[
                      styles.urgencyText,
                      job.urgency === 'Urgent' && { color: Colors.error },
                      job.urgency === 'Normal' && { color: Colors.warning },
                      job.urgency === 'Flexible' && { color: Colors.success },
                    ]}>{job.urgency}</Text>
                  </View>
                </View>
                <View style={styles.jobFooter}>
                  <View style={styles.jobInfo}>
                    <Ionicons name="cash" size={14} color={Colors.primary} />
                    <Text style={styles.jobInfoText}>{job.budget}</Text>
                  </View>
                  <View style={styles.jobInfo}>
                    <Ionicons name="location" size={14} color={Colors.gray} />
                    <Text style={styles.jobInfoText}>{job.distance}</Text>
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    fontSize: fontSize.sm,
    color: Colors.gray,
  },
  name: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  onlineToggle: {
    alignItems: 'flex-end',
    gap: 4,
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  onlineText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  heroCard: {
    marginBottom: spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  heroGradient: {
    padding: spacing.lg,
  },
  heroLabel: {
    fontSize: fontSize.sm,
    color: Colors.gray,
    marginBottom: 4,
  },
  heroAmount: {
    fontSize: 40,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    marginBottom: spacing.sm,
  },
  heroStats: {
    marginBottom: spacing.md,
  },
  heroStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  heroStatText: {
    fontSize: fontSize.sm,
    color: Colors.success,
    fontWeight: fontWeight.semibold,
  },
  heroBadges: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  heroBadge: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  heroBadgeNumber: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: Colors.primary,
  },
  heroBadgeLabel: {
    fontSize: fontSize.xs,
    color: Colors.gray,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    marginBottom: spacing.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  seeAll: {
    fontSize: fontSize.sm,
    color: Colors.primary,
    fontWeight: fontWeight.semibold,
  },
  chartCard: {
    marginBottom: spacing.lg,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  chartTotal: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  chartTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  chartTrendText: {
    color: Colors.success,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  chart: {
    flexDirection: 'row',
    height: 120,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.sm,
  },
  barWrapper: {
    width: '60%',
    height: '90%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: borderRadius.sm,
    minHeight: 8,
  },
  barLabel: {
    fontSize: fontSize.xs,
    color: Colors.gray,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statCardValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  statCardLabel: {
    fontSize: fontSize.xs,
    color: Colors.gray,
    marginTop: 2,
  },
  jobCard: {
    marginBottom: spacing.md,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  jobTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: Colors.white,
    marginBottom: 2,
  },
  jobCategory: {
    fontSize: fontSize.sm,
    color: Colors.primary,
  },
  urgencyBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  urgencyText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  jobFooter: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  jobInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobInfoText: {
    fontSize: fontSize.sm,
    color: Colors.lightGray,
  },
});
