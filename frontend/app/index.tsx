import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight } from '@/src/constants/theme';
import { useAuthStore } from '@/src/store/authStore';

export default function SplashScreen() {
  const router = useRouter();
  const { loadUser, isAuthenticated, isLoading } = useAuthStore();
  const scaleAnim = new Animated.Value(0);
  const glowAnim = new Animated.Value(0);

  useEffect(() => {
    loadUser();
    
    // Logo animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Navigate after animation
      setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/(main)/home');
        } else {
          router.replace('/onboarding');
        }
      }, 2500);
    }
  }, [isLoading, isAuthenticated]);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 1],
  });

  return (
    <LinearGradient
      colors={[Colors.background, Colors.darkForest]}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.logoContainer,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Animated.View
          style={[
            styles.glow,
            { opacity: glowOpacity },
          ]}
        />
        <View style={styles.logo}>
          <Text style={styles.logoText}>Ping</Text>
          <Text style={[styles.logoText, styles.logoAccent]}>Buz</Text>
        </View>
      </Animated.View>
      
      <Text style={styles.tagline}>Instant Local Work</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primary,
    opacity: 0.3,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: fontSize.xxxl + 20,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  logoAccent: {
    color: Colors.primary,
    marginLeft: 8,
  },
  tagline: {
    position: 'absolute',
    bottom: 80,
    color: Colors.gray,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    letterSpacing: 2,
  },
});