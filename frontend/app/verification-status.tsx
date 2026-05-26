import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Button } from '@/src/components/ui/Button';

export default function VerificationStatusScreen() {
  const router = useRouter();
  const { status = 'pending' } = useLocalSearchParams<{ status?: 'pending' | 'approved' | 'rejected' }>();

  const pulseAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const getConfig = () => {
    if (status === 'approved') {
      return {
        color: Colors.success,
        icon: 'checkmark-circle' as const,
        title: 'Verification Approved!',
        subtitle: 'Your account is now verified',
        description: 'You can now accept jobs and start earning. Welcome to Ping Buz!',
        gradient: ['rgba(16, 185, 129, 0.3)', 'rgba(16, 185, 129, 0.05)'] as [string, string],
        buttonText: 'Continue to Dashboard',
      };
    }
    if (status === 'rejected') {
      return {
        color: Colors.error,
        icon: 'close-circle' as const,
        title: 'Verification Rejected',
        subtitle: 'Some documents need re-upload',
        description: 'The submitted documents could not be verified. Please re-upload clearer copies.',
        gradient: ['rgba(239, 68, 68, 0.3)', 'rgba(239, 68, 68, 0.05)'] as [string, string],
        buttonText: 'Re-upload Documents',
      };
    }
    return {
      color: Colors.warning,
      icon: 'time' as const,
      title: 'Verification Pending',
      subtitle: 'We are reviewing your documents',
      description: 'Our team will review your documents within 24 hours. You\'ll be notified once approved.',
      gradient: ['rgba(245, 158, 11, 0.3)', 'rgba(245, 158, 11, 0.05)'] as [string, string],
      buttonText: 'Go to Home',
    };
  };

  const config = getConfig();
  const scale = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.15] });
  const opacity = pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.6] });

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.iconWrapper}>
            <Animated.View style={[styles.pulse, { backgroundColor: config.color, transform: [{ scale }], opacity }]} />
            <LinearGradient colors={config.gradient} style={styles.iconContainer}>
              <Ionicons name={config.icon} size={80} color={config.color} />
            </LinearGradient>
          </View>

          <Text style={styles.title}>{config.title}</Text>
          <Text style={styles.subtitle}>{config.subtitle}</Text>

          <GlassCard intensity={20} style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Ionicons name="information-circle" size={20} color={config.color} />
              <Text style={styles.infoText}>{config.description}</Text>
            </View>
          </GlassCard>

          {/* Progress steps */}
          {status === 'pending' && (
            <View style={styles.steps}>
              <View style={styles.step}>
                <View style={[styles.stepDot, styles.stepDotComplete]}>
                  <Ionicons name="checkmark" size={14} color={Colors.white} />
                </View>
                <Text style={styles.stepText}>Documents Submitted</Text>
              </View>
              <View style={[styles.stepLine, styles.stepLineActive]} />
              <View style={styles.step}>
                <View style={[styles.stepDot, styles.stepDotActive]}>
                  <View style={styles.stepDotInner} />
                </View>
                <Text style={styles.stepText}>Under Review</Text>
              </View>
              <View style={styles.stepLine} />
              <View style={styles.step}>
                <View style={styles.stepDot}>
                  <Text style={styles.stepDotText}>3</Text>
                </View>
                <Text style={[styles.stepText, styles.stepTextInactive]}>Approval</Text>
              </View>
            </View>
          )}

          {status === 'approved' && (
            <View style={styles.badge}>
              <Ionicons name="shield-checkmark" size={24} color={Colors.primary} />
              <Text style={styles.badgeText}>Verified Worker</Text>
            </View>
          )}
        </View>

        <View style={styles.footer}>
          <Button
            title={config.buttonText}
            onPress={() => {
              if (status === 'approved') router.replace('/(main)/home');
              else if (status === 'rejected') router.push('/worker/verification');
              else router.replace('/(main)/home');
            }}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  iconWrapper: {
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  pulse: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  iconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  infoCard: {
    width: '100%',
    marginBottom: spacing.xl,
  },
  infoRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: Colors.lightGray,
    lineHeight: 20,
  },
  steps: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
  },
  step: {
    alignItems: 'center',
    width: 90,
  },
  stepDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondaryBackground,
    borderWidth: 2,
    borderColor: Colors.darkGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  stepDotComplete: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepDotActive: {
    borderColor: Colors.warning,
  },
  stepDotInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.warning,
  },
  stepDotText: {
    color: Colors.gray,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  stepText: {
    fontSize: fontSize.xs,
    color: Colors.white,
    textAlign: 'center',
    fontWeight: fontWeight.semibold,
  },
  stepTextInactive: {
    color: Colors.gray,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.darkGray,
    marginHorizontal: -10,
    marginBottom: 24,
  },
  stepLineActive: {
    backgroundColor: Colors.primary,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(68, 189, 19, 0.15)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  badgeText: {
    color: Colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  footer: {
    padding: spacing.lg,
  },
});
