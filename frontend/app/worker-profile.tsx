import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Button } from '@/src/components/ui/Button';

const REVIEWS = [
  { id: '1', name: 'Sarah W.', rating: 5, text: 'Excellent work! Very professional and on time.', date: '2 days ago' },
  { id: '2', name: 'Mike Chen', rating: 5, text: 'Great electrician, fixed everything quickly.', date: '1 week ago' },
  { id: '3', name: 'Emma D.', rating: 4, text: 'Good service, will hire again.', date: '2 weeks ago' },
];

const SKILLS = ['Electrical Wiring', 'Installation', 'Repairs', 'Smart Home', 'Lighting'];

export default function WorkerProfileScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Profile Hero */}
          <View style={styles.hero}>
            <View style={styles.avatarWrapper}>
              <LinearGradient
                colors={['rgba(68, 189, 19, 0.3)', 'transparent']}
                style={styles.avatar}
              >
                <Ionicons name="person" size={60} color={Colors.primary} />
              </LinearGradient>
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={16} color={Colors.white} />
              </View>
              <View style={styles.onlineBadge}>
                <View style={styles.onlineDot} />
              </View>
            </View>

            <View style={styles.nameRow}>
              <Text style={styles.name}>John Doe</Text>
              <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.title}>Professional Electrician</Text>

            <View style={styles.ratingRow}>
              {[1,2,3,4,5].map((s) => (
                <Ionicons key={s} name="star" size={18} color={Colors.warning} />
              ))}
              <Text style={styles.ratingText}>4.9 (124 reviews)</Text>
            </View>
          </View>

          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <GlassCard intensity={20} style={styles.statCard}>
              <Ionicons name="briefcase" size={20} color={Colors.primary} />
              <Text style={styles.statValue}>247</Text>
              <Text style={styles.statLabel}>Jobs Done</Text>
            </GlassCard>
            <GlassCard intensity={20} style={styles.statCard}>
              <Ionicons name="time" size={20} color={Colors.warning} />
              <Text style={styles.statValue}>5+ yrs</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </GlassCard>
            <GlassCard intensity={20} style={styles.statCard}>
              <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
              <Text style={styles.statValue}>98%</Text>
              <Text style={styles.statLabel}>Success</Text>
            </GlassCard>
          </View>

          {/* Pricing */}
          <GlassCard intensity={20} style={styles.pricingCard}>
            <View>
              <Text style={styles.pricingLabel}>Hourly Rate</Text>
              <View style={styles.pricingRow}>
                <Text style={styles.pricingValue}>$30</Text>
                <Text style={styles.pricingUnit}>/hour</Text>
              </View>
            </View>
            <View style={styles.responseTime}>
              <Ionicons name="flash" size={16} color={Colors.warning} />
              <Text style={styles.responseText}>Responds in 5 min</Text>
            </View>
          </GlassCard>

          {/* About */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Professional electrician with 5+ years of experience in residential and commercial wiring,
            installations, and repairs. Licensed and insured. Available 7 days a week.
          </Text>

          {/* Skills */}
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsRow}>
            {SKILLS.map((skill) => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>

          {/* Languages */}
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.languages}>
            <View style={styles.languageItem}>
              <Text style={styles.languageName}>English</Text>
              <Text style={styles.languageLevel}>Native</Text>
            </View>
            <View style={styles.languageItem}>
              <Text style={styles.languageName}>Nepali</Text>
              <Text style={styles.languageLevel}>Fluent</Text>
            </View>
          </View>

          {/* Reviews */}
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          {REVIEWS.map((review) => (
            <GlassCard key={review.id} intensity={20} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <View style={styles.reviewerAvatar}>
                    <Ionicons name="person" size={16} color={Colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.reviewerName}>{review.name}</Text>
                    <View style={styles.reviewStars}>
                      {[1,2,3,4,5].map((s) => (
                        <Ionicons
                          key={s}
                          name="star"
                          size={10}
                          color={s <= review.rating ? Colors.warning : Colors.darkGray}
                        />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewDate}>{review.date}</Text>
              </View>
              <Text style={styles.reviewText}>{review.text}</Text>
            </GlassCard>
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.chatButton}>
            <Ionicons name="chatbubble" size={22} color={Colors.primary} />
          </TouchableOpacity>
          <Button
            title="Hire Now • $30/hr"
            onPress={() => router.push('/post-job')}
            size="large"
            style={{ flex: 1 }}
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
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.sm,
  },
  iconButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.secondaryBackground,
    alignItems: 'center', justifyContent: 'center',
  },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: 100 },
  hero: { alignItems: 'center', marginBottom: spacing.lg },
  avatarWrapper: { position: 'relative', marginBottom: spacing.md },
  avatar: {
    width: 140, height: 140, borderRadius: 70,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 4, borderColor: Colors.primary,
  },
  verifiedBadge: {
    position: 'absolute', bottom: 8, right: 8,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.background,
  },
  onlineBadge: {
    position: 'absolute', top: 8, right: 8,
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: Colors.success,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: Colors.background,
  },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.white },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 4 },
  name: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: Colors.white },
  title: { fontSize: fontSize.md, color: Colors.primary, marginBottom: spacing.sm },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  ratingText: { color: Colors.gray, fontSize: fontSize.sm, marginLeft: spacing.sm },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  statCard: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: Colors.white, marginTop: spacing.sm },
  statLabel: { fontSize: fontSize.xs, color: Colors.gray, marginTop: 2 },
  pricingCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: spacing.lg,
  },
  pricingLabel: { fontSize: fontSize.xs, color: Colors.gray, marginBottom: 4 },
  pricingRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  pricingValue: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: Colors.primary },
  pricingUnit: { fontSize: fontSize.sm, color: Colors.gray },
  responseTime: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  responseText: { color: Colors.warning, fontSize: fontSize.xs, fontWeight: fontWeight.bold },
  sectionTitle: {
    fontSize: fontSize.lg, fontWeight: fontWeight.bold,
    color: Colors.white, marginBottom: spacing.sm, marginTop: spacing.md,
  },
  aboutText: { fontSize: fontSize.sm, color: Colors.lightGray, lineHeight: 22 },
  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  skillChip: {
    backgroundColor: 'rgba(68, 189, 19, 0.15)',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1, borderColor: Colors.primary,
  },
  skillText: { color: Colors.primary, fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  languages: { gap: spacing.sm },
  languageItem: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: Colors.secondaryBackground,
    padding: spacing.md, borderRadius: borderRadius.md,
  },
  languageName: { color: Colors.white, fontSize: fontSize.md, fontWeight: fontWeight.semibold },
  languageLevel: { color: Colors.primary, fontSize: fontSize.sm },
  reviewsHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: spacing.md,
  },
  seeAll: { color: Colors.primary, fontSize: fontSize.sm, fontWeight: fontWeight.semibold, marginTop: spacing.md },
  reviewCard: { marginBottom: spacing.sm },
  reviewHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: spacing.sm,
  },
  reviewerInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  reviewerAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  reviewerName: { fontSize: fontSize.sm, fontWeight: fontWeight.bold, color: Colors.white },
  reviewStars: { flexDirection: 'row', gap: 2, marginTop: 2 },
  reviewDate: { fontSize: fontSize.xs, color: Colors.gray },
  reviewText: { fontSize: fontSize.sm, color: Colors.lightGray, lineHeight: 20 },
  footer: {
    flexDirection: 'row', gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: Colors.secondaryBackground,
    borderTopWidth: 1, borderTopColor: 'rgba(68, 189, 19, 0.1)',
  },
  chatButton: {
    width: 56, height: 56, borderRadius: 16,
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.primary,
  },
});
