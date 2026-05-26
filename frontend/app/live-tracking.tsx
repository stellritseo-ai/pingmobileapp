import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Button } from '@/src/components/ui/Button';

export default function LiveTrackingScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Worker on the way</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-social" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Mock Map View */}
        <View style={styles.mapContainer}>
          <LinearGradient
            colors={['rgba(68, 189, 19, 0.1)', 'rgba(28, 30, 34, 0.5)']}
            style={styles.mapBackground}
          >
            {/* Mock map grid */}
            <View style={styles.mapGrid}>
              {[...Array(8)].map((_, i) => (
                <View key={`h-${i}`} style={[styles.gridLine, { top: `${i * 12.5}%` }]} />
              ))}
              {[...Array(6)].map((_, i) => (
                <View key={`v-${i}`} style={[styles.gridLineVertical, { left: `${i * 20}%` }]} />
              ))}
            </View>

            {/* Route path */}
            <View style={styles.routePath} />

            {/* Worker marker */}
            <View style={[styles.marker, styles.workerMarker]}>
              <View style={styles.markerPulse} />
              <View style={styles.workerMarkerInner}>
                <Ionicons name="person" size={20} color={Colors.white} />
              </View>
            </View>

            {/* Destination marker */}
            <View style={[styles.marker, styles.destinationMarker]}>
              <View style={styles.destinationMarkerInner}>
                <Ionicons name="location" size={20} color={Colors.white} />
              </View>
            </View>

            {/* ETA Badge */}
            <View style={styles.etaBadge}>
              <Ionicons name="time" size={16} color={Colors.primary} />
              <Text style={styles.etaText}>8 min away</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Bottom Sheet */}
        <View style={styles.bottomSheet}>
          <View style={styles.handle} />

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <LinearGradient
                colors={[Colors.primary, '#7BD93A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressFill, { width: '60%' }]}
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>On the way</Text>
              <Text style={styles.progressLabel}>Arriving</Text>
              <Text style={styles.progressLabelInactive}>Working</Text>
            </View>
          </View>

          {/* Worker Card */}
          <GlassCard intensity={20} style={styles.workerCard}>
            <View style={styles.workerInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={28} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.nameRow}>
                  <Text style={styles.workerName}>John Doe</Text>
                  <Ionicons name="checkmark-circle" size={16} color={Colors.primary} />
                </View>
                <Text style={styles.workerJob}>Electrician</Text>
                <View style={styles.ratingRow}>
                  <Ionicons name="star" size={14} color={Colors.warning} />
                  <Text style={styles.ratingText}>4.9 (124 jobs)</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.callButton}>
                <Ionicons name="call" size={22} color={Colors.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.chatButton}>
                <Ionicons name="chatbubble" size={22} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </GlassCard>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Ionicons name="speedometer" size={20} color={Colors.primary} />
              <Text style={styles.statLabel}>Distance</Text>
              <Text style={styles.statValue}>2.4 km</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Ionicons name="time" size={20} color={Colors.primary} />
              <Text style={styles.statLabel}>ETA</Text>
              <Text style={styles.statValue}>8 min</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Ionicons name="cash" size={20} color={Colors.primary} />
              <Text style={styles.statLabel}>Price</Text>
              <Text style={styles.statValue}>$45</Text>
            </View>
          </View>

          <Button
            title="Cancel Booking"
            onPress={() => router.back()}
            variant="outline"
            size="large"
          />
        </View>
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
    paddingVertical: spacing.md,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  mapBackground: {
    flex: 1,
    position: 'relative',
  },
  mapGrid: {
    ...StyleSheet.absoluteFillObject,
  },
  gridLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: 'rgba(68, 189, 19, 0.05)',
  },
  gridLineVertical: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: 'rgba(68, 189, 19, 0.05)',
  },
  routePath: {
    position: 'absolute',
    top: '30%',
    left: '20%',
    width: '60%',
    height: 3,
    backgroundColor: Colors.primary,
    transform: [{ rotate: '25deg' }],
    borderRadius: 2,
    opacity: 0.6,
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workerMarker: {
    top: '30%',
    left: '20%',
  },
  destinationMarker: {
    top: '60%',
    right: '20%',
  },
  markerPulse: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    opacity: 0.3,
  },
  workerMarkerInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  destinationMarkerInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  etaBadge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.secondaryBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(68, 189, 19, 0.3)',
  },
  etaText: {
    color: Colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  bottomSheet: {
    backgroundColor: Colors.secondaryBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    paddingTop: spacing.sm,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.darkGray,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.background,
    borderRadius: 3,
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: fontSize.xs,
    color: Colors.primary,
    fontWeight: fontWeight.semibold,
  },
  progressLabelInactive: {
    fontSize: fontSize.xs,
    color: Colors.gray,
  },
  workerCard: {
    marginBottom: spacing.md,
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  workerName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  workerJob: {
    fontSize: fontSize.sm,
    color: Colors.gray,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  ratingText: {
    fontSize: fontSize.xs,
    color: Colors.gray,
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.darkGray,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: Colors.gray,
    marginTop: 4,
  },
  statValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
});
