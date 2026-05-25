import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius, shadows } from '@/src/constants/theme';
import { GlassCard } from '@/src/components/ui/GlassCard';

export default function RoleSelectionScreen() {
  const router = useRouter();

  const handleRoleSelect = (role: 'pro' | 'normal') => {
    if (role === 'pro') {
      router.push('/pro-type-selection');
    } else {
      router.push('/login?role=normal_user');
    }
  };

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Choose Your Role</Text>
            <Text style={styles.subtitle}>How do you want to use Ping Buz?</Text>
          </View>

          <View style={styles.cardsContainer}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleRoleSelect('pro')}
            >
              <GlassCard intensity={30} style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={styles.iconWrapper}>
                    <LinearGradient
                      colors={['rgba(68, 189, 19, 0.3)', 'transparent']}
                      style={styles.iconGradient}
                    >
                      <Ionicons name="briefcase" size={48} color={Colors.primary} />
                    </LinearGradient>
                  </View>
                  <Text style={styles.cardTitle}>Join as Pro</Text>
                  <Text style={styles.cardSubtitle}>
                    For business owners & service providers
                  </Text>
                  <View style={styles.features}>
                    <View style={styles.feature}>
                      <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                      <Text style={styles.featureText}>Accept jobs & earn money</Text>
                    </View>
                    <View style={styles.feature}>
                      <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                      <Text style={styles.featureText}>Build your business profile</Text>
                    </View>
                    <View style={styles.feature}>
                      <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                      <Text style={styles.featureText}>Get nearby job alerts</Text>
                    </View>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>PRO</Text>
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handleRoleSelect('normal')}
            >
              <GlassCard intensity={30} style={styles.card}>
                <View style={styles.cardContent}>
                  <View style={styles.iconWrapper}>
                    <LinearGradient
                      colors={['rgba(68, 189, 19, 0.3)', 'transparent']}
                      style={styles.iconGradient}
                    >
                      <Ionicons name="person" size={48} color={Colors.primary} />
                    </LinearGradient>
                  </View>
                  <Text style={styles.cardTitle}>Normal User</Text>
                  <Text style={styles.cardSubtitle}>
                    Post jobs & hire nearby workers
                  </Text>
                  <View style={styles.features}>
                    <View style={styles.feature}>
                      <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                      <Text style={styles.featureText}>Post jobs instantly</Text>
                    </View>
                    <View style={styles.feature}>
                      <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                      <Text style={styles.featureText}>Track workers live</Text>
                    </View>
                    <View style={styles.feature}>
                      <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
                      <Text style={styles.featureText}>Secure payments</Text>
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
    paddingTop: spacing.xxl,
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
  card: {
    ...shadows.large,
  },
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
  cardSubtitle: {
    fontSize: fontSize.md,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  features: {
    width: '100%',
    gap: spacing.md,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    fontSize: fontSize.md,
    color: Colors.lightGray,
  },
  badge: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    backgroundColor: Colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  badgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
});