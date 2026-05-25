import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { businessAPI } from '@/src/services/api';
import { useAuthStore } from '@/src/store/authStore';

export default function BusinessVerificationScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessLicense, setBusinessLicense] = useState<string | null>(null);
  const [logo, setLogo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async (type: 'license' | 'logo') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      if (type === 'license') {
        setBusinessLicense(base64Image);
      } else {
        setLogo(base64Image);
      }
    }
  };

  const handleSubmit = async () => {
    if (!businessName || !businessCategory || !businessAddress || !phoneNumber || !businessEmail || !businessLicense) {
      Alert.alert('Missing Information', 'Please fill all required fields');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not found');
      return;
    }

    setLoading(true);
    try {
      await businessAPI.submitVerification(user.id, {
        business_name: businessName,
        business_category: businessCategory,
        business_address: businessAddress,
        phone_number: phoneNumber,
        business_email: businessEmail,
        business_license: businessLicense,
        logo: logo,
        service_categories: [],
        service_radius: 10,
        business_location: {},
      });

      Alert.alert(
        'Verification Submitted',
        'Your business verification has been submitted for review.',
        [{
          text: 'OK',
          onPress: () => router.replace('/(main)/home'),
        }]
      );
    } catch (error: any) {
      console.error('Verification error:', error);
      Alert.alert(
        'Submission Failed',
        error.response?.data?.detail || 'Failed to submit verification. Please try again.'
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
            showsVerticalScrollIndicator={false}
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
                  <Ionicons name="business" size={56} color={Colors.primary} />
                </LinearGradient>
              </View>
              <Text style={styles.title}>Business Verification</Text>
              <Text style={styles.subtitle}>
                Verify your business to receive jobs and leads
              </Text>
            </View>

            <View style={styles.form}>
              <Input
                label="Business Name *"
                placeholder="Enter business name"
                value={businessName}
                onChangeText={setBusinessName}
                leftIcon="business"
              />

              <Input
                label="Business Category *"
                placeholder="e.g., Electrician, Plumber, etc."
                value={businessCategory}
                onChangeText={setBusinessCategory}
                leftIcon="grid"
              />

              <Input
                label="Business Address *"
                placeholder="Enter business address"
                value={businessAddress}
                onChangeText={setBusinessAddress}
                leftIcon="location"
                multiline
              />

              <Input
                label="Phone Number *"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                leftIcon="call"
                keyboardType="phone-pad"
              />

              <Input
                label="Business Email *"
                placeholder="Enter business email"
                value={businessEmail}
                onChangeText={setBusinessEmail}
                leftIcon="mail"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Text style={styles.sectionTitle}>Upload Documents</Text>

              <GlassCard intensity={20} style={styles.uploadCard}>
                <TouchableOpacity onPress={() => pickImage('license')} style={styles.uploadCardContent}>
                  {businessLicense ? (
                    <Image source={{ uri: businessLicense }} style={styles.uploadedImage} />
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <Ionicons name="document" size={40} color={Colors.primary} />
                      <Text style={styles.uploadTitle}>Business License *</Text>
                      <Text style={styles.uploadSubtitle}>Tap to upload</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </GlassCard>

              <GlassCard intensity={20} style={styles.uploadCard}>
                <TouchableOpacity onPress={() => pickImage('logo')} style={styles.uploadCardContent}>
                  {logo ? (
                    <Image source={{ uri: logo }} style={styles.uploadedImage} />
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <Ionicons name="image" size={40} color={Colors.primary} />
                      <Text style={styles.uploadTitle}>Business Logo</Text>
                      <Text style={styles.uploadSubtitle}>Optional</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </GlassCard>

              <Button
                title="Submit for Verification"
                onPress={handleSubmit}
                loading={loading}
                size="large"
                style={styles.submitButton}
              />
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  backButton: {
    marginBottom: spacing.lg,
    padding: spacing.sm,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: fontSize.md,
    color: Colors.gray,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: Colors.white,
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  uploadCard: {
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  uploadCardContent: {
    minHeight: 150,
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xl,
  },
  uploadTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: Colors.white,
    marginTop: spacing.sm,
  },
  uploadSubtitle: {
    fontSize: fontSize.sm,
    color: Colors.gray,
    marginTop: spacing.xs,
  },
  uploadedImage: {
    width: '100%',
    height: 150,
    borderRadius: borderRadius.lg,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
});
