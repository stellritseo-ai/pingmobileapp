import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';

const SKILLS_OPTIONS = ['Electrical', 'Plumbing', 'Cleaning', 'Carpentry', 'Painting', 'Moving', 'Delivery', 'Gardening'];
const LANGUAGES = ['English', 'Spanish', 'Hindi', 'Nepali', 'Mandarin'];

export default function BecomeWorkerScreen() {
  const router = useRouter();
  const [skills, setSkills] = useState<string[]>(['Electrical']);
  const [languages, setLanguages] = useState<string[]>(['English']);
  const [experience, setExperience] = useState('');
  const [rate, setRate] = useState('');
  const [radius, setRadius] = useState('10');

  const toggleSkill = (skill: string) => {
    setSkills(skills.includes(skill) ? skills.filter((s) => s !== skill) : [...skills, skill]);
  };

  const toggleLanguage = (lang: string) => {
    setLanguages(languages.includes(lang) ? languages.filter((l) => l !== lang) : [...languages, lang]);
  };

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Become a Worker</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Hero */}
            <View style={styles.hero}>
              <View style={styles.iconWrapper}>
                <LinearGradient
                  colors={['rgba(68, 189, 19, 0.3)', 'transparent']}
                  style={styles.iconCircle}
                >
                  <Ionicons name="briefcase" size={48} color={Colors.primary} />
                </LinearGradient>
              </View>
              <Text style={styles.heroTitle}>Start Earning Today</Text>
              <Text style={styles.heroSubtitle}>
                Tell us about your skills and start receiving job offers
              </Text>
            </View>

            {/* Earnings preview */}
            <LinearGradient
              colors={['rgba(68, 189, 19, 0.15)', 'rgba(32, 62, 41, 0.5)']}
              style={styles.earningsPreview}
            >
              <View>
                <Text style={styles.earningsLabel}>Potential Monthly Earnings</Text>
                <Text style={styles.earningsValue}>$2,000 - $5,000</Text>
              </View>
              <Ionicons name="trending-up" size={32} color={Colors.primary} />
            </LinearGradient>

            {/* Skills */}
            <Text style={styles.sectionTitle}>Your Skills *</Text>
            <Text style={styles.sectionSubtitle}>Select at least one</Text>
            <View style={styles.chipsRow}>
              {SKILLS_OPTIONS.map((skill) => (
                <TouchableOpacity
                  key={skill}
                  style={[styles.chip, skills.includes(skill) && styles.chipActive]}
                  onPress={() => toggleSkill(skill)}
                >
                  <Text style={[styles.chipText, skills.includes(skill) && styles.chipTextActive]}>
                    {skill}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Experience */}
            <Input
              label="Years of Experience *"
              placeholder="e.g., 5"
              value={experience}
              onChangeText={setExperience}
              leftIcon="time"
              keyboardType="numeric"
            />

            {/* Hourly Rate */}
            <Input
              label="Hourly Rate ($) *"
              placeholder="e.g., 25"
              value={rate}
              onChangeText={setRate}
              leftIcon="cash"
              keyboardType="numeric"
            />

            {/* Service Radius */}
            <Text style={styles.sectionTitle}>Service Radius</Text>
            <View style={styles.radiusContainer}>
              {['5', '10', '20', '50'].map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[styles.radiusChip, radius === r && styles.radiusChipActive]}
                  onPress={() => setRadius(r)}
                >
                  <Text style={[styles.radiusText, radius === r && styles.radiusTextActive]}>
                    {r} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Languages */}
            <Text style={styles.sectionTitle}>Languages You Speak</Text>
            <View style={styles.chipsRow}>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[styles.chip, languages.includes(lang) && styles.chipActive]}
                  onPress={() => toggleLanguage(lang)}
                >
                  <Text style={[styles.chipText, languages.includes(lang) && styles.chipTextActive]}>
                    {lang}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Info Card */}
            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={20} color={Colors.primary} />
              <Text style={styles.infoText}>
                After submitting, you'll need to complete identity verification (Government ID + Selfie) before accepting jobs.
              </Text>
            </View>

            <Button
              title="Continue to Verification"
              onPress={() => {
                Alert.alert('Saved!', 'Now complete identity verification', [
                  { text: 'OK', onPress: () => router.push('/worker/verification') }
                ]);
              }}
              size="large"
              style={{ marginTop: spacing.lg }}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.md,
  },
  iconButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: Colors.white },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  hero: { alignItems: 'center', marginBottom: spacing.lg },
  iconWrapper: { marginBottom: spacing.md },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: Colors.primary,
  },
  heroTitle: { fontSize: fontSize.xxl, fontWeight: fontWeight.bold, color: Colors.white, marginBottom: 4 },
  heroSubtitle: { fontSize: fontSize.md, color: Colors.gray, textAlign: 'center' },
  earningsPreview: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: spacing.lg, borderRadius: borderRadius.lg, marginBottom: spacing.lg,
    borderWidth: 1, borderColor: 'rgba(68, 189, 19, 0.3)',
  },
  earningsLabel: { fontSize: fontSize.xs, color: Colors.gray, marginBottom: 4 },
  earningsValue: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: Colors.primary },
  sectionTitle: {
    fontSize: fontSize.md, fontWeight: fontWeight.semibold,
    color: Colors.white, marginTop: spacing.md, marginBottom: 4,
  },
  sectionSubtitle: { fontSize: fontSize.xs, color: Colors.gray, marginBottom: spacing.md },
  chipsRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: spacing.sm, marginBottom: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    backgroundColor: Colors.secondaryBackground,
    borderRadius: borderRadius.full,
    borderWidth: 1, borderColor: 'rgba(68, 189, 19, 0.2)',
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { color: Colors.gray, fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  chipTextActive: { color: Colors.white },
  radiusContainer: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  radiusChip: {
    flex: 1, paddingVertical: spacing.md, alignItems: 'center',
    backgroundColor: Colors.secondaryBackground,
    borderRadius: borderRadius.md,
    borderWidth: 1, borderColor: 'rgba(68, 189, 19, 0.2)',
  },
  radiusChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  radiusText: { color: Colors.gray, fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  radiusTextActive: { color: Colors.white },
  infoCard: {
    flexDirection: 'row', gap: spacing.sm,
    backgroundColor: 'rgba(68, 189, 19, 0.1)',
    padding: spacing.md, borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  infoText: { flex: 1, fontSize: fontSize.sm, color: Colors.lightGray, lineHeight: 20 },
});
