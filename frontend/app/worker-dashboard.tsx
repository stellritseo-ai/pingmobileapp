import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { workerDashboardAPI } from '@/src/services/api';
import { useAuthStore } from '@/src/store/authStore';

export default function WorkerDashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [isOnline, setIsOnline] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const response = await workerDashboardAPI.getDashboard(user.id);
      setData(response);
      setIsOnline(response.worker?.is_online || false);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = () => { setRefreshing(true); load(); };

  const handleToggleOnline = async (value: boolean) => {
    if (!user?.id) return;
    setIsOnline(value);
    try {
      await workerDashboardAPI.updateStatus(user.id, value);
    } catch (error) {
      setIsOnline(!value); // Revert on error
      console.error('Failed to update status:', error);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
        <SafeAreaView style={[styles.safeArea, styles.centerLoading]}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const earnings = data?.earnings || { today: 0, this_month: 0, weekly: [] };
  const stats = data?.stats || { jobs_today: 0, active_jobs: 0, pending_offers: 0, completed_jobs: 0, rating: 0, acceptance_rate: 0 };
  const nearbyJobs = data?.nearby_jobs || [];
  const weeklyData = earnings.weekly.length > 0 ? earnings.weekly : [{ day: '-', value: 0 }];
  const maxEarnings = Math.max(...weeklyData.map((d: any) => d.value), 1);

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome back,</Text>
              <Text style={styles.name}>{user?.full_name || data?.worker?.name || 'Worker'}</Text>
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
                onValueChange={handleToggleOnline}
                trackColor={{ false: Colors.darkGray, true: Colors.primary }}
                thumbColor={Colors.white}
              />
            </View>
          </View>

          {/* Earnings Hero Card */}
          <GlassCard intensity={30} style={styles.heroCard}>
            <LinearGradient colors={['rgba(68, 189, 19, 0.2)', 'transparent']} style={styles.heroGradient}>
              <Text style={styles.heroLabel}>Today's Earnings</Text>
              <Text style={styles.heroAmount}>${earnings.today.toFixed(2)}</Text>
              <View style={styles.heroBadges}>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeNumber}>{stats.jobs_today}</Text>
                  <Text style={styles.heroBadgeLabel}>Jobs Today</Text>
                </View>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeNumber}>{stats.rating || '-'}</Text>
                  <Text style={styles.heroBadgeLabel}>Rating</Text>
                </View>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeNumber}>{stats.acceptance_rate}%</Text>
                  <Text style={styles.heroBadgeLabel}>Acceptance</Text>
                </View>
              </View>
            </LinearGradient>
          </GlassCard>

          {/* Weekly Chart */}
          <Text style={styles.sectionTitle}>Weekly Earnings</Text>
          <GlassCard intensity={20} style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartTotal}>${earnings.this_month.toFixed(2)}</Text>
              <Text style={{ color: Colors.gray, fontSize: fontSize.xs }}>This month</Text>
            </View>
            <View style={styles.chart}>
              {weeklyData.map((item: any, idx: number) => (
                <View key={idx} style={styles.barContainer}>
                  <View style={styles.barWrapper}>
                    <LinearGradient
                      colors={[Colors.primary, 'rgba(68, 189, 19, 0.3)']}
                      style={[styles.bar, { height: `${(item.value / maxEarnings) * 100}%` }]}
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
              <Text style={styles.statCardValue}>{stats.active_jobs}</Text>
              <Text style={styles.statCardLabel}>Active Jobs</Text>
            </GlassCard>
            <GlassCard intensity={20} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                <Ionicons name="time" size={20} color={Colors.warning} />
              </View>
              <Text style={styles.statCardValue}>{stats.pending_offers}</Text>
              <Text style={styles.statCardLabel}>Pending</Text>
            </GlassCard>
            <GlassCard intensity={20} style={styles.statCard}>
              <View style={[styles.statIconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              </View>
              <Text style={styles.statCardValue}>{stats.completed_jobs}</Text>
              <Text style={styles.statCardLabel}>Completed</Text>
            </GlassCard>
          </View>

          {/* Nearby Jobs */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby Jobs</Text>
            <TouchableOpacity onPress={() => router.push('/(main)/jobs')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {nearbyJobs.length === 0 ? (
            <View style={styles.emptyNearby}>
              <Ionicons name="search" size={40} color={Colors.darkGray} />
              <Text style={styles.emptyNearbyText}>No nearby jobs right now</Text>
            </View>
          ) : nearbyJobs.map((job: any) => {
            const urgencyLabel = job.urgency === 'high' ? 'Urgent' : job.urgency === 'low' ? 'Flexible' : 'Normal';
            const urgencyColor = job.urgency === 'high' ? Colors.error : job.urgency === 'low' ? Colors.success : Colors.warning;
            return (
              <TouchableOpacity key={job.id} activeOpacity={0.8} onPress={() => router.push(`/job-details?id=${job.id}`)}>
                <GlassCard intensity={20} style={styles.jobCard}>
                  <View style={styles.jobHeader}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.jobTitle}>{job.title}</Text>
                      <Text style={styles.jobCategory}>{job.category}</Text>
                    </View>
                    <View style={[styles.urgencyBadge, { backgroundColor: `${urgencyColor}30` }]}>
                      <Text style={[styles.urgencyText, { color: urgencyColor }]}>{urgencyLabel}</Text>
                    </View>
                  </View>
                  <View style={styles.jobFooter}>
                    <View style={styles.jobInfo}>
                      <Ionicons name="cash" size={14} color={Colors.primary} />
                      <Text style={styles.jobInfoText}>${job.budget}</Text>
                    </View>
                    <View style={styles.jobInfo}>
                      <Ionicons name="location" size={14} color={Colors.gray} />
                      <Text style={styles.jobInfoText} numberOfLines={1}>{job.location}</Text>
                    </View>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })}
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
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyNearby: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
  emptyNearbyText: {
    color: Colors.gray,
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
  },
});
