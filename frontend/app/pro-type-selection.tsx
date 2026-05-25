import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { GlassCard } from '@/src/components/ui/GlassCard';

export default function ProTypeSelectionScreen() {
  const router = useRouter();

  const handleTypeSelect = (type: 'individual_worker' | 'business_owner') => {
    router.push(`/login?role=${type}`);
  };

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>Join as Pro</Text>
            <Text style={styles.subtitle}>Choose your professional category</Text>
          </View>

          <View style={styles.cardsContainer}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleTypeSelect('individual_worker')}
            >
              <GlassCard intensity={30} style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={styles.iconWrapper}>
                    <LinearGradient
                      colors={['rgba(68, 189, 19, 0.3)', 'transparent']}
                      style={styles.iconGradient}
                    >
                      <Ionicons name="person-circle" size={56} color={Colors.primary} />
                    </LinearGradient>
                  </View>
                  <Text style={styles.cardTitle}>Individual Worker</Text>
                  <Text style={styles.cardDescription}>
                    Join as a freelance service provider and start accepting jobs
                  </Text>
                  <View style={styles.features}>
                    <View style={styles.feature}>
                      <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                      <Text style={styles.featureText}>Work independently</Text>
                    </View>
                    <View style={styles.feature}>
                      <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                      <Text style={styles.featureText}>Flexible schedule</Text>
                    </View>
                    <View style={styles.feature}>
                      <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                      <Text style={styles.featureText}>Quick verification</Text>
                    </View>
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleTypeSelect('business_owner')}
            >
              <GlassCard intensity={30} style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={styles.iconWrapper}>
                    <LinearGradient
                      colors={['rgba(68, 189, 19, 0.3)', 'transparent']}
                      style={styles.iconGradient}
                    >
                      <Ionicons name="business" size={56} color={Colors.primary} />
                    </LinearGradient>
                  </View>
                  <Text style={styles.cardTitle}>Business Owner</Text>
                  <Text style={styles.cardDescription}>
                    Register your business and manage your team
                  </Text>
                  <View style={styles.features}>
                    <View style={styles.feature}>
                      <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                      <Text style={styles.featureText}>Business profile</Text>
                    </View>
                    <View style={styles.feature}>
                      <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                      <Text style={styles.featureText}>Team management</Text>
                    </View>
                    <View style={styles.feature}>
                      <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />
                      <Text style={styles.featureText}>Business leads</Text>
                    </View>
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
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
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  backButton: {
    marginBottom: spacing.lg,
    padding: spacing.sm,
  },
  header: {
    marginBottom: spacing.xxl,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.lg,
    color: Colors.gray,
  },
  cardsContainer: {
    gap: spacing.lg,
  },
  card: {},
  cardContent: {
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: spacing.lg,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    marginBottom: spacing.sm,
  },
  cardDescription: {
    fontSize: fontSize.md,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  features: {
    width: '100%',
    gap: spacing.sm,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    fontSize: fontSize.sm,
    color: Colors.lightGray,
  },
});