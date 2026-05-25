import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing } from '@/src/constants/theme';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { authAPI } from '@/src/services/api';
import { useAuthStore } from '@/src/store/authStore';

export default function LoginScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: string }>();
  const { login } = useAuthStore();
  
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const getRoleTitle = () => {
    switch (role) {
      case 'individual_worker':
        return 'Worker Login';
      case 'business_owner':
        return 'Business Login';
      default:
        return 'Login';
    }
  };

  const validate = () => {
    const newErrors: any = {};
    
    if (!emailOrMobile.trim()) {
      newErrors.emailOrMobile = 'Email or mobile number is required';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      const response = await authAPI.login({
        email_or_mobile: emailOrMobile.trim(),
        password: password,
      });

      if (response.requires_otp) {
        // Navigate to OTP verification
        router.push({
          pathname: '/verify-otp',
          params: {
            emailOrMobile: emailOrMobile.trim(),
            userId: response.user_id,
            otp: response.otp, // For development
          },
        });
      } else {
        // Login successful
        await login(response.user);
        
        // Navigate based on role
        if (response.user.role === 'individual_worker') {
          if (response.user.worker_verified) {
            router.replace('/(main)/home');
          } else {
            router.replace('/worker/verification');
          }
        } else if (response.user.role === 'business_owner') {
          if (response.user.business_verified) {
            router.replace('/(main)/home');
          } else {
            router.replace('/business/verification');
          }
        } else {
          router.replace('/(main)/home');
        }
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        error.response?.data?.detail || 'Invalid credentials. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = () => {
    router.push({
      pathname: '/register',
      params: { role },
    });
  };

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>

            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <LinearGradient
                  colors={['rgba(68, 189, 19, 0.3)', 'transparent']}
                  style={styles.iconGradient}
                >
                  <Ionicons name="log-in" size={48} color={Colors.primary} />
                </LinearGradient>
              </View>
              <Text style={styles.title}>{getRoleTitle()}</Text>
              <Text style={styles.subtitle}>Welcome back! Please login to continue</Text>
            </View>

            <View style={styles.form}>
              <Input
                label="Email or Mobile Number"
                placeholder="Enter your email or mobile"
                value={emailOrMobile}
                onChangeText={setEmailOrMobile}
                leftIcon="person"
                autoCapitalize="none"
                keyboardType="email-address"
                error={errors.emailOrMobile}
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                leftIcon="lock-closed"
                secureTextEntry
                error={errors.password}
              />

              <Button
                title="Login"
                onPress={handleLogin}
                loading={loading}
                size="large"
                style={styles.loginButton}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                <TouchableOpacity
                  style={styles.socialButton}
                  activeOpacity={0.7}
                  onPress={() => Alert.alert('Coming Soon', 'Google login will be available soon')}
                >
                  <Ionicons name="logo-google" size={24} color={Colors.white} />
                  <Text style={styles.socialButtonText}>Google</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.socialButton}
                  activeOpacity={0.7}
                  onPress={() => Alert.alert('Coming Soon', 'Apple login will be available soon')}
                >
                  <Ionicons name="logo-apple" size={26} color={Colors.white} />
                  <Text style={styles.socialButtonText}>Apple</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={handleRegister}>
                <Text style={styles.registerText}>
                  Don't have an account?{' '}
                  <Text style={styles.registerLink}>Register Now</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardView: {
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
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  iconGradient: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: Colors.gray,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  loginButton: {
    marginTop: spacing.md,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.darkGray,
  },
  dividerText: {
    color: Colors.gray,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.sm,
  },
  registerText: {
    color: Colors.gray,
    fontSize: fontSize.md,
    textAlign: 'center',
  },
  registerLink: {
    color: Colors.primary,
    fontWeight: fontWeight.semibold,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    backgroundColor: Colors.secondaryBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(68, 189, 19, 0.2)',
  },
  socialButtonText: {
    color: Colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
});