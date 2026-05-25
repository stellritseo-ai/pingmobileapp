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

export default function RegisterScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: string }>();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loginType, setLoginType] = useState<'email' | 'mobile'>('email');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const getRoleTitle = () => {
    switch (role) {
      case 'individual_worker':
        return 'Worker Registration';
      case 'business_owner':
        return 'Business Registration';
      default:
        return 'Create Account';
    }
  };

  const validate = () => {
    const newErrors: any = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (loginType === 'email') {
      if (!email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Invalid email format';
      }
    } else {
      if (!mobile.trim()) {
        newErrors.mobile = 'Mobile number is required';
      } else if (!/^\d{10,15}$/.test(mobile.replace(/[^\d]/g, ''))) {
        newErrors.mobile = 'Invalid mobile number';
      }
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    
    setLoading(true);
    try {
      const response = await authAPI.register({
        full_name: fullName.trim(),
        email: loginType === 'email' ? email.trim() : undefined,
        mobile: loginType === 'mobile' ? mobile.trim() : undefined,
        password: password,
        role: role as any,
      });

      Alert.alert(
        'Registration Successful',
        'Please verify your account with the OTP sent to your ' + loginType,
        [{
          text: 'OK',
          onPress: () => {
            router.push({
              pathname: '/verify-otp',
              params: {
                emailOrMobile: loginType === 'email' ? email.trim() : mobile.trim(),
                userId: response.user_id,
                otp: response.otp, // For development
                role: role,
              },
            });
          },
        }]
      );
    } catch (error: any) {
      console.error('Registration error:', error);
      Alert.alert(
        'Registration Failed',
        error.response?.data?.detail || 'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
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
              <Text style={styles.title}>{getRoleTitle()}</Text>
              <Text style={styles.subtitle}>Create your account to get started</Text>
            </View>

            <View style={styles.form}>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                leftIcon="person"
                error={errors.fullName}
              />

              <View style={styles.loginTypeToggle}>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    loginType === 'email' && styles.toggleButtonActive,
                  ]}
                  onPress={() => setLoginType('email')}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      loginType === 'email' && styles.toggleTextActive,
                    ]}
                  >
                    Email
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.toggleButton,
                    loginType === 'mobile' && styles.toggleButtonActive,
                  ]}
                  onPress={() => setLoginType('mobile')}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      loginType === 'mobile' && styles.toggleTextActive,
                    ]}
                  >
                    Mobile
                  </Text>
                </TouchableOpacity>
              </View>

              {loginType === 'email' ? (
                <Input
                  label="Email Address"
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  leftIcon="mail"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  error={errors.email}
                />
              ) : (
                <Input
                  label="Mobile Number"
                  placeholder="Enter your mobile number"
                  value={mobile}
                  onChangeText={setMobile}
                  leftIcon="call"
                  keyboardType="phone-pad"
                  error={errors.mobile}
                />
              )}

              <Input
                label="Password"
                placeholder="Create a password"
                value={password}
                onChangeText={setPassword}
                leftIcon="lock-closed"
                secureTextEntry
                error={errors.password}
              />

              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                leftIcon="lock-closed"
                secureTextEntry
                error={errors.confirmPassword}
              />

              <Button
                title="Create Account"
                onPress={handleRegister}
                loading={loading}
                size="large"
                style={styles.registerButton}
              />

              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginText}>
                  Already have an account?{' '}
                  <Text style={styles.loginLink}>Login</Text>
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
    paddingBottom: spacing.xxl,
  },
  backButton: {
    marginBottom: spacing.lg,
    padding: spacing.sm,
  },
  header: {
    marginBottom: spacing.xl,
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
  },
  form: {
    width: '100%',
  },
  loginTypeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.secondaryBackground,
    borderRadius: 12,
    padding: 4,
    marginBottom: spacing.md,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: Colors.primary,
  },
  toggleText: {
    color: Colors.gray,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
  },
  toggleTextActive: {
    color: Colors.white,
  },
  registerButton: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  loginText: {
    color: Colors.gray,
    fontSize: fontSize.md,
    textAlign: 'center',
  },
  loginLink: {
    color: Colors.primary,
    fontWeight: fontWeight.semibold,
  },
});