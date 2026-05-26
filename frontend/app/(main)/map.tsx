import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { GlassCard } from '@/src/components/ui/GlassCard';

const WORKERS = [
  { name: 'John Doe', role: 'Electrician', distance: '0.8 km', rating: 4.9, top: '20%', left: '30%' },
  { name: 'Sarah W.', role: 'Cleaner', distance: '1.2 km', rating: 4.8, top: '40%', left: '60%' },
  { name: 'Mike Chen', role: 'Handyman', distance: '2.1 km', rating: 4.7, top: '65%', left: '35%' },
  { name: 'Emma D.', role: 'Plumber', distance: '2.5 km', rating: 4.9, top: '30%', left: '75%' },
];

export default function MapScreen() {
  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Nearby Workers</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="options" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Map Container */}
        <View style={styles.mapContainer}>
          <LinearGradient
            colors={['rgba(68, 189, 19, 0.05)', 'rgba(28, 30, 34, 0.5)']}
            style={styles.mapBackground}
          >
            {/* Grid */}
            {[...Array(10)].map((_, i) => (
              <View key={`h-${i}`} style={[styles.gridLine, { top: `${i * 10}%` }]} />
            ))}
            {[...Array(8)].map((_, i) => (
              <View key={`v-${i}`} style={[styles.gridLineV, { left: `${i * 12.5}%` }]} />
            ))}

            {/* Center - You marker */}
            <View style={styles.userMarker}>
              <View style={styles.userPulse} />
              <View style={styles.userDot} />
            </View>

            {/* Radius circle */}
            <View style={styles.radiusCircle} />

            {/* Worker markers */}
            {WORKERS.map((w, i) => (
              <View key={i} style={[styles.workerMarker, { top: w.top as any, left: w.left as any }]}>
                <View style={styles.workerMarkerInner}>
                  <Ionicons name="person" size={14} color={Colors.white} />
                </View>
              </View>
            ))}
          </LinearGradient>

          {/* Map Controls */}
          <View style={styles.mapControls}>
            <TouchableOpacity style={styles.mapButton}>
              <Ionicons name="locate" size={20} color={Colors.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapButton}>
              <Ionicons name="add" size={20} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.mapButton}>
              <Ionicons name="remove" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Workers List */}
        <View style={styles.bottomSheet}>
          <View style={styles.handle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>4 workers online</Text>
            <TouchableOpacity>
              <Text style={styles.sheetAction}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.workersList}>
            {WORKERS.map((worker, idx) => (
              <TouchableOpacity key={idx} activeOpacity={0.8}>
                <GlassCard intensity={20} style={styles.workerCard}>
                  <View style={styles.workerAvatar}>
                    <Ionicons name="person" size={20} color={Colors.primary} />
                    <View style={styles.workerOnlineDot} />
                  </View>
                  <Text style={styles.workerName}>{worker.name}</Text>
                  <Text style={styles.workerRole}>{worker.role}</Text>
                  <View style={styles.workerStats}>
                    <Ionicons name="star" size={12} color={Colors.warning} />
                    <Text style={styles.workerStatText}>{worker.rating}</Text>
                    <Text style={styles.workerStatDot}>•</Text>
                    <Text style={styles.workerStatText}>{worker.distance}</Text>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            ))}
          </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  mapBackground: { flex: 1, position: 'relative' },
  gridLine: { position: 'absolute', width: '100%', height: 1, backgroundColor: 'rgba(68, 189, 19, 0.05)' },
  gridLineV: { position: 'absolute', height: '100%', width: 1, backgroundColor: 'rgba(68, 189, 19, 0.05)' },
  userMarker: {
    position: 'absolute',
    top: '45%',
    left: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userPulse: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    opacity: 0.2,
  },
  userDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    borderWidth: 3,
    borderColor: Colors.white,
  },
  radiusCircle: {
    position: 'absolute',
    top: '20%',
    left: '20%',
    width: '70%',
    aspectRatio: 1,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: 'rgba(68, 189, 19, 0.3)',
    borderStyle: 'dashed',
  },
  workerMarker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workerMarkerInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  mapControls: {
    position: 'absolute',
    right: spacing.md,
    top: spacing.md,
    gap: spacing.sm,
  },
  mapButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(68, 189, 19, 0.2)',
  },
  bottomSheet: {
    backgroundColor: Colors.secondaryBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    marginTop: spacing.md,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.darkGray,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sheetTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  sheetAction: {
    color: Colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  workersList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  workerCard: {
    width: 140,
    marginRight: spacing.sm,
    alignItems: 'center',
  },
  workerAvatar: {
    position: 'relative',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  workerOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.secondaryBackground,
  },
  workerName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  workerRole: {
    fontSize: fontSize.xs,
    color: Colors.primary,
    marginTop: 2,
  },
  workerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  workerStatText: {
    fontSize: fontSize.xs,
    color: Colors.gray,
  },
  workerStatDot: {
    color: Colors.gray,
    fontSize: fontSize.xs,
    marginHorizontal: 2,
  },
});
