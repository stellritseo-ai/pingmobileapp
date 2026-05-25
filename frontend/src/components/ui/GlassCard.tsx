import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Colors } from '@/src/constants/Colors';
import { borderRadius, shadows } from '@/src/constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  intensity?: number;
  style?: any;
}

export function GlassCard({ children, intensity = 20, style }: GlassCardProps) {
  return (
    <View style={[styles.container, style]}>
      <BlurView intensity={intensity} style={styles.blur}>
        <View style={styles.content}>{children}</View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(28, 30, 34, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(68, 189, 19, 0.2)',
    ...shadows.medium,
  },
  blur: {
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
});