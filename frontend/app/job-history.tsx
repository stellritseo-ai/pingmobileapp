import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { GlassCard } from '@/src/components/ui/GlassCard';

const JOBS_HISTORY = [
  { id: '1', title: 'Fix kitchen sink', category: 'Plumbing', date: 'Oct 28, 2024', status: 'completed', amount: '$45.00', rating: 5, worker: 'Sarah Wilson' },
  { id: '2', title: 'Install ceiling fan', category: 'Electrician', date: 'Oct 25, 2024', status: 'completed', amount: '$80.00', rating: 4, worker: 'John Doe' },
  { id: '3', title: 'Move furniture', category: 'Moving', date: 'Oct 22, 2024', status: 'completed', amount: '$120.00', rating: 5, worker: 'Mike Chen' },
  { id: '4', title: 'Deep cleaning', category: 'Cleaning', date: 'Oct 20, 2024', status: 'cancelled', amount: '$60.00', rating: 0, worker: 'Emma Davis' },
  { id: '5', title: 'Electrical repair', category: 'Electrician', date: 'Oct 15, 2024', status: 'completed', amount: '$95.00', rating: 5, worker: 'Alex Kumar' },
];

export default function JobHistoryScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');

  const filtered = JOBS_HISTORY.filter((j) => filter === 'all' || j.status === filter);

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job History</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Stats Summary */}
          <View style={styles.statsRow}>
            <GlassCard intensity={20} style={styles.statCard}>
              <Text style={styles.statValue}>27</Text>
              <Text style={styles.statLabel}>Total Jobs</Text>
            </GlassCard>
            <GlassCard intensity={20} style={styles.statCard}>
              <Text style={styles.statValue}>$1,847</Text>
              <Text style={styles.statLabel}>Spent</Text>
            </GlassCard>
            <GlassCard intensity={20} style={styles.statCard}>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Avg Rating</Text>
            </GlassCard>
          </View>

          {/* Filters */}
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterChip, filter === 'all' && styles.filterChipActive]}
              onPress={() => setFilter('all')}
            >
              <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, filter === 'completed' && styles.filterChipActive]}
              onPress={() => setFilter('completed')}
            >
              <Text style={[styles.filterText, filter === 'completed' && styles.filterTextActive]}>Completed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterChip, filter === 'cancelled' && styles.filterChipActive]}
              onPress={() => setFilter('cancelled')}
            >
              <Text style={[styles.filterText, filter === 'cancelled' && styles.filterTextActive]}>Cancelled</Text>
            </TouchableOpacity>
          </View>

          {/* Job Cards */}
          {filtered.map((job) => (
            <TouchableOpacity key={job.id} activeOpacity={0.8}>
              <GlassCard intensity={20} style={styles.jobCard}>
                <View style={styles.jobHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.jobCategory}>{job.category}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    job.status === 'completed' ? styles.completedBadge : styles.cancelledBadge,
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: job.status === 'completed' ? Colors.success : Colors.error },
                    ]}>
                      {job.status === 'completed' ? '✓ Completed' : '✗ Cancelled'}
                    </Text>
                  </View>
                </View>

                <View style={styles.jobMeta}>
                  <View style={styles.workerInfo}>
                    <View style={styles.workerAvatar}>
                      <Ionicons name="person" size={14} color={Colors.primary} />
                    </View>
                    <Text style={styles.workerName}>{job.worker}</Text>
                  </View>
                  <Text style={styles.jobDate}>{job.date}</Text>
                </View>

                <View style={styles.jobFooter}>
                  <Text style={styles.jobAmount}>{job.amount}</Text>
                  {job.rating > 0 && (
                    <View style={styles.ratingDisplay}>
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Ionicons
                          key={s}
                          name="star"
                          size={12}
                          color={s <= job.rating ? Colors.warning : Colors.darkGray}
                        />
                      ))}
                    </View>
                  )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: Colors.primary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: Colors.gray,
    marginTop: 2,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: Colors.secondaryBackground,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    color: Colors.gray,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  filterTextActive: {
    color: Colors.white,
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
    fontWeight: fontWeight.bold,
    color: Colors.white,
    marginBottom: 2,
  },
  jobCategory: {
    fontSize: fontSize.sm,
    color: Colors.primary,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  completedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  cancelledBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  jobMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  workerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workerName: {
    fontSize: fontSize.sm,
    color: Colors.lightGray,
  },
  jobDate: {
    fontSize: fontSize.xs,
    color: Colors.gray,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(68, 189, 19, 0.1)',
  },
  jobAmount: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: Colors.primary,
  },
  ratingDisplay: {
    flexDirection: 'row',
    gap: 2,
  },
});
