import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { Button } from '@/src/components/ui/Button';
import { authAPI } from '@/src/services/api';
import { useAuthStore } from '@/src/store/authStore';

export default function VerifyOTPScreen() {
  const router = useRouter();
  const { emailOrMobile, userId, otp: devOtp, role } = useLocalSearchParams<{
    emailOrMobile: string;
    userId: string;
    otp: string;
    role?: string;
  }>();
  const { login } = useAuthStore();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Auto-fill OTP in development
  useEffect(() => {
    if (devOtp && __DEV__) {
      const otpArray = devOtp.split('');
      setOtp(otpArray);
    }
  }, [devOtp]);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      // Focus next input (would need refs in production)
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter all 6 digits');
      return;
    }

    setLoading(true);
    try {
      const response = await authAPI.verifyOTP({
        email_or_mobile: emailOrMobile,
        otp: otpString,
      });

      if (response.success) {
        await login(response.user);
        
        Alert.alert(
          'Verification Successful',
          'Your account has been verified!',
          [{
            text: 'OK',
            onPress: () => {
              // Navigate based on role
              if (response.user.role === 'individual_worker') {
                router.replace('/worker/verification');
              } else if (response.user.role === 'business_owner') {
                router.replace('/business/verification');
              } else {
                router.replace('/(main)/home');
              }
            },
          }]
        );
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      Alert.alert(
        'Verification Failed',
        error.response?.data?.detail || 'Invalid OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const response = await authAPI.sendOTP(emailOrMobile);
      Alert.alert('OTP Sent', 'A new OTP has been sent to your ' + (emailOrMobile.includes('@') ? 'email' : 'mobile'));
      setTimer(60);
      
      // Auto-fill in development
      if (response.otp && __DEV__) {
        const otpArray = response.otp.split('');
        setOtp(otpArray);
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={['rgba(68, 189, 19, 0.3)', 'transparent']}
                style={styles.iconGradient}
              >
                <Ionicons name="shield-checkmark" size={56} color={Colors.primary} />
              </LinearGradient>
            </View>
            <Text style={styles.title}>Verify OTP</Text>
            <Text style={styles.subtitle}>
              Enter the 6-digit code sent to{' '}
              <Text style={styles.highlight}>{emailOrMobile}</Text>
            </Text>
          </View>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <View key={index} style={styles.otpBox}>
                <TextInput
                  style={styles.otpInput}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  placeholderTextColor={Colors.darkGray}
                />
              </View>
            ))}
          </View>

          <Button
            title="Verify"
            onPress={handleVerify}
            loading={loading}
            size="large"
            style={styles.verifyButton}
          />

          <View style={styles.resendContainer}>
            {timer > 0 ? (
              <Text style={styles.timerText}>
                Resend OTP in {timer}s
              </Text>
            ) : (
              <TouchableOpacity onPress={handleResend} disabled={resending}>
                <Text style={styles.resendText}>
                  {resending ? 'Sending...' : 'Resend OTP'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {__DEV__ && devOtp && (
            <View style={styles.devHelper}>
              <Text style={styles.devText}>Dev OTP: {devOtp}</Text>
            </View>
          )}
        </View>
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
  backButton: {
    marginTop: spacing.lg,
    marginLeft: spacing.lg,
    padding: spacing.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  iconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
    lineHeight: 24,
  },
  highlight: {
    color: Colors.primary,
    fontWeight: fontWeight.semibold,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
    gap: spacing.sm,
  },
  otpBox: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: Colors.secondaryBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: 'rgba(68, 189, 19, 0.3)',
  },
  otpInput: {
    flex: 1,
    color: Colors.white,
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
  },
  verifyButton: {},
  resendContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  timerText: {
    color: Colors.gray,
    fontSize: fontSize.sm,
  },
  resendText: {
    color: Colors.primary,
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
  },
  devHelper: {
    marginTop: spacing.xl,
    padding: spacing.md,
    backgroundColor: 'rgba(68, 189, 19, 0.1)',
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  devText: {
    color: Colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
});