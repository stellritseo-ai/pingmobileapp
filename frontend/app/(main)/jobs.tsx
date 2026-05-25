import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Button } from '@/src/components/ui/Button';
import { jobsAPI } from '@/src/services/api';
import { useAuthStore } from '@/src/store/authStore';

const STATUS_COLORS: Record<string, string> = {
  open: Colors.success,
  negotiating: Colors.warning,
  accepted: Colors.primary,
  in_progress: Colors.primary,
  completed: Colors.gray,
  cancelled: Colors.error,
};

const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  negotiating: 'Negotiating',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export default function JobsScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'my' | 'nearby'>('my');

  const isWorker = user?.role === 'individual_worker';

  const loadJobs = useCallback(async () => {
    if (!user?.id) return;
    try {
      const response = activeTab === 'my' || !isWorker
        ? await jobsAPI.getMyJobs(user.id)
        : await jobsAPI.getNearbyJobs(user.id);
      setJobs(response.jobs || []);
    } catch (error) {
      console.error('Failed to load jobs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id, activeTab, isWorker]);

  useFocusEffect(
    useCallback(() => {
      loadJobs();
    }, [loadJobs])
  );

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const onRefresh = () => {
    setRefreshing(true);
    loadJobs();
  };

  const renderJob = (job: any) => (
    <TouchableOpacity
      key={job.id}
      activeOpacity={0.8}
      onPress={() => router.push(`/job-details?id=${job.id}`)}
    >
      <GlassCard intensity={20} style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.jobTitle} numberOfLines={1}>{job.title}</Text>
            <Text style={styles.jobCategory}>{job.category}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${STATUS_COLORS[job.status]}30` }]}>
            <Text style={[styles.statusText, { color: STATUS_COLORS[job.status] }]}>
              {STATUS_LABELS[job.status]}
            </Text>
          </View>
        </View>

        <Text style={styles.jobDescription} numberOfLines={2}>{job.description}</Text>

        <View style={styles.jobFooter}>
          <View style={styles.jobStat}>
            <Ionicons name="cash" size={16} color={Colors.primary} />
            <Text style={styles.jobStatText}>${job.budget}</Text>
          </View>
          <View style={styles.jobStat}>
            <Ionicons name="time" size={16} color={Colors.gray} />
            <Text style={styles.jobStatText}>{job.estimated_duration}</Text>
          </View>
          <View style={styles.jobStat}>
            <Ionicons name="location" size={16} color={Colors.gray} />
            <Text style={styles.jobStatText} numberOfLines={1}>{job.location}</Text>
          </View>
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>{isWorker ? 'Jobs' : 'My Jobs'}</Text>
          {!isWorker && (
            <TouchableOpacity
              style={styles.postButton}
              onPress={() => router.push('/post-job')}
            >
              <Ionicons name="add" size={24} color={Colors.white} />
            </TouchableOpacity>
          )}
        </View>

        {isWorker && (
          <View style={styles.tabs}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'nearby' && styles.tabActive]}
              onPress={() => setActiveTab('nearby')}
            >
              <Text style={[styles.tabText, activeTab === 'nearby' && styles.tabTextActive]}>
                Nearby
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'my' && styles.tabActive]}
              onPress={() => setActiveTab('my')}
            >
              <Text style={[styles.tabText, activeTab === 'my' && styles.tabTextActive]}>
                My Offers
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : jobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={80} color={Colors.darkGray} />
            <Text style={styles.emptyTitle}>
              {isWorker && activeTab === 'nearby' ? 'No jobs nearby' : 'No jobs yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {isWorker
                ? 'New jobs will appear here'
                : 'Post your first job to get started'}
            </Text>
            {!isWorker && (
              <Button
                title="Post a Job"
                onPress={() => router.push('/post-job')}
                size="large"
                style={{ marginTop: spacing.lg, minWidth: 200 }}
              />
            )}
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
              />
            }
          >
            {jobs.map(renderJob)}
          </ScrollView>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  postButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    backgroundColor: Colors.secondaryBackground,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: fontSize.md,
    color: Colors.gray,
    fontWeight: fontWeight.semibold,
  },
  tabTextActive: {
    color: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
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
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  jobCategory: {
    fontSize: fontSize.sm,
    color: Colors.primary,
    fontWeight: fontWeight.medium,
    textTransform: 'capitalize',
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  jobDescription: {
    fontSize: fontSize.sm,
    color: Colors.gray,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  jobFooter: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  jobStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  jobStatText: {
    fontSize: fontSize.sm,
    color: Colors.lightGray,
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: Colors.gray,
    textAlign: 'center',
  },
});
