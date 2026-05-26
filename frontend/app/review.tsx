import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Button } from '@/src/components/ui/Button';

export default function ReviewScreen() {
  const router = useRouter();
  const [overall, setOverall] = useState(0);
  const [quality, setQuality] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [punctuality, setPunctuality] = useState(0);
  const [review, setReview] = useState('');
  const [recommend, setRecommend] = useState<boolean | null>(null);

  const renderStars = (rating: number, setRating: (val: number) => void, size: number = 32) => (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)}>
          <Ionicons
            name={star <= rating ? 'star' : 'star-outline'}
            size={size}
            color={star <= rating ? Colors.warning : Colors.gray}
            style={{ marginRight: 4 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderRatingRow = (label: string, value: number, setter: (val: number) => void) => (
    <View style={styles.ratingRow}>
      <Text style={styles.ratingLabel}>{label}</Text>
      {renderStars(value, setter, 22)}
    </View>
  );

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Rate Worker</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Worker Card */}
          <GlassCard intensity={30} style={styles.workerCard}>
            <View style={styles.workerInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color={Colors.primary} />
              </View>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={14} color={Colors.white} />
              </View>
            </View>
            <Text style={styles.workerName}>John Doe</Text>
            <Text style={styles.workerJob}>Electrician • Job Completed</Text>
            <View style={styles.jobAmount}>
              <Text style={styles.amountLabel}>Total Paid</Text>
              <Text style={styles.amountValue}>$45.00</Text>
            </View>
          </GlassCard>

          {/* Overall Rating */}
          <Text style={styles.sectionTitle}>How was your experience?</Text>
          <View style={styles.overallContainer}>
            {renderStars(overall, setOverall, 44)}
            <Text style={styles.overallText}>
              {overall === 0 ? 'Tap to rate' :
               overall === 1 ? 'Poor' :
               overall === 2 ? 'Fair' :
               overall === 3 ? 'Good' :
               overall === 4 ? 'Very Good' : 'Excellent!'}
            </Text>
          </View>

          {/* Detailed Ratings */}
          <Text style={styles.sectionTitle}>Detailed Rating</Text>
          <GlassCard intensity={20} style={styles.ratingsCard}>
            {renderRatingRow('Service Quality', quality, setQuality)}
            <View style={styles.divider} />
            {renderRatingRow('Communication', communication, setCommunication)}
            <View style={styles.divider} />
            {renderRatingRow('Punctuality', punctuality, setPunctuality)}
          </GlassCard>

          {/* Written Review */}
          <Text style={styles.sectionTitle}>Write a Review</Text>
          <View style={styles.reviewInput}>
            <TextInput
              placeholder="Share your experience..."
              placeholderTextColor={Colors.darkGray}
              value={review}
              onChangeText={setReview}
              multiline
              numberOfLines={4}
              style={styles.textInput}
            />
          </View>

          {/* Recommend */}
          <Text style={styles.sectionTitle}>Would you recommend?</Text>
          <View style={styles.recommendRow}>
            <TouchableOpacity
              style={[styles.recommendButton, recommend === true && styles.recommendButtonYes]}
              onPress={() => setRecommend(true)}
            >
              <Ionicons name="thumbs-up" size={20} color={recommend === true ? Colors.white : Colors.success} />
              <Text style={[styles.recommendText, recommend === true && styles.recommendTextActive]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.recommendButton, recommend === false && styles.recommendButtonNo]}
              onPress={() => setRecommend(false)}
            >
              <Ionicons name="thumbs-down" size={20} color={recommend === false ? Colors.white : Colors.error} />
              <Text style={[styles.recommendText, recommend === false && styles.recommendTextActive]}>No</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="Submit Review"
            onPress={() => {
              Alert.alert('Thank you!', 'Your review has been submitted', [
                { text: 'OK', onPress: () => router.back() }
              ]);
            }}
            size="large"
            style={styles.submitButton}
            disabled={overall === 0}
          />
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
  workerCard: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  workerInfo: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.background,
  },
  workerName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  workerJob: {
    fontSize: fontSize.sm,
    color: Colors.gray,
    marginBottom: spacing.md,
  },
  jobAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(68, 189, 19, 0.15)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  amountLabel: {
    fontSize: fontSize.sm,
    color: Colors.gray,
  },
  amountValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: Colors.primary,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: Colors.white,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  overallContainer: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  overallText: {
    fontSize: fontSize.md,
    color: Colors.primary,
    fontWeight: fontWeight.semibold,
    marginTop: spacing.sm,
  },
  ratingsCard: {},
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  ratingLabel: {
    fontSize: fontSize.md,
    color: Colors.lightGray,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(68, 189, 19, 0.1)',
  },
  reviewInput: {
    backgroundColor: Colors.secondaryBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(68, 189, 19, 0.2)',
    padding: spacing.md,
    minHeight: 120,
  },
  textInput: {
    color: Colors.white,
    fontSize: fontSize.md,
    textAlignVertical: 'top',
    flex: 1,
  },
  recommendRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  recommendButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    backgroundColor: Colors.secondaryBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(68, 189, 19, 0.2)',
  },
  recommendButtonYes: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  recommendButtonNo: {
    backgroundColor: Colors.error,
    borderColor: Colors.error,
  },
  recommendText: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: Colors.lightGray,
  },
  recommendTextActive: {
    color: Colors.white,
  },
  submitButton: {
    marginTop: spacing.md,
  },
});
