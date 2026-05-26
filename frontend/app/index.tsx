import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight } from '@/src/constants/theme';
import { useAuthStore } from '@/src/store/authStore';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { loadUser, isAuthenticated, isLoading } = useAuthStore();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const zoomAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const loaderAnim = useRef(new Animated.Value(0)).current;
  const particleAnim1 = useRef(new Animated.Value(0)).current;
  const particleAnim2 = useRef(new Animated.Value(0)).current;
  const particleAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUser();

    // Entry animation: Fade + Scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 30,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous zoom in/out loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(zoomAnim, {
          toValue: 1.1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(zoomAnim, {
          toValue: 1,
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Tagline fade in after logo
    Animated.timing(taglineAnim, {
      toValue: 1,
      duration: 800,
      delay: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Loader bar progress
    Animated.timing(loaderAnim, {
      toValue: 1,
      duration: 2800,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Floating particles
    const createParticle = (anim: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000,
            delay,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 3000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
    };
    createParticle(particleAnim1, 0).start();
    createParticle(particleAnim2, 800).start();
    createParticle(particleAnim3, 1500).start();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      // Show splash for 3 seconds
      setTimeout(() => {
        if (isAuthenticated) {
          router.replace('/(main)/home');
        } else {
          router.replace('/onboarding');
        }
      }, 3000);
    }
  }, [isLoading, isAuthenticated]);

  // Interpolations
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 0.35],
  });

  const glowScale = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  const loaderWidth = loaderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const particle1Y = particleAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  });
  const particle2Y = particleAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });
  const particle3Y = particleAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });

  return (
    <LinearGradient
      colors={[Colors.background, '#0a0d10', Colors.darkForest]}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      {/* Floating Particles */}
      <Animated.View
        style={[
          styles.particle,
          { left: '20%', bottom: '30%', opacity: particleAnim1, transform: [{ translateY: particle1Y }] },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          { right: '25%', bottom: '40%', opacity: particleAnim2, transform: [{ translateY: particle2Y }] },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          { left: '70%', bottom: '20%', opacity: particleAnim3, transform: [{ translateY: particle3Y }] },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          { left: '15%', top: '30%', opacity: particleAnim2, transform: [{ translateY: particle2Y }] },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          { right: '20%', top: '25%', opacity: particleAnim1, transform: [{ translateY: particle1Y }] },
        ]}
      />

      <View style={styles.content}>
        {/* Logo with Glow */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          {/* Outer glow */}
          <Animated.View
            style={[
              styles.outerGlow,
              {
                opacity: glowOpacity,
                transform: [{ scale: glowScale }],
              },
            ]}
          />

          {/* Inner glow */}
          <Animated.View
            style={[
              styles.innerGlow,
              {
                opacity: glowAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.15, 0.4],
                }),
              },
            ]}
          />

          {/* Logo image with continuous zoom */}
          <Animated.View
            style={[
              styles.logoWrapper,
              { transform: [{ scale: zoomAnim }] },
            ]}
          >
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
        </Animated.View>

        {/* Tagline */}
        <Animated.View
          style={[
            styles.taglineContainer,
            {
              opacity: taglineAnim,
              transform: [
                {
                  translateY: taglineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={styles.tagline}>Instant Local Work</Text>
          <View style={styles.taglineLine} />
        </Animated.View>
      </View>

      {/* Loader at bottom */}
      <Animated.View
        style={[
          styles.loaderContainer,
          { opacity: fadeAnim },
        ]}
      >
        <View style={styles.loaderTrack}>
          <Animated.View style={[styles.loaderFill, { width: loaderWidth }]}>
            <LinearGradient
              colors={[Colors.primary, '#7BD93A', Colors.primary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.loaderGradient}
            />
          </Animated.View>
        </View>
        <Text style={styles.loaderText}>Loading premium experience...</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.7,
    height: width * 0.5,
  },
  outerGlow: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: Colors.primary,
    opacity: 0.3,
  },
  innerGlow: {
    position: 'absolute',
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: Colors.primary,
    opacity: 0.2,
  },
  logoWrapper: {
    width: width * 0.7,
    height: width * 0.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  taglineContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  tagline: {
    color: Colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.medium,
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  taglineLine: {
    width: 60,
    height: 2,
    backgroundColor: Colors.primary,
    borderRadius: 1,
    marginTop: 12,
  },
  loaderContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 60,
  },
  loaderTrack: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(68, 189, 19, 0.15)',
    borderRadius: 1.5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  loaderFill: {
    height: '100%',
    borderRadius: 1.5,
  },
  loaderGradient: {
    flex: 1,
  },
  loaderText: {
    color: Colors.gray,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    letterSpacing: 1.5,
  },
  particle: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
  },
});
;
