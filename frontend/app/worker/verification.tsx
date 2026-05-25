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
import { workerAPI } from '@/src/services/api';
import { useAuthStore } from '@/src/store/authStore';

export default function WorkerVerificationScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [frontId, setFrontId] = useState<string | null>(null);
  const [backId, setBackId] = useState<string | null>(null);
  const [selfie, setSelfie] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async (type: 'front' | 'back' | 'selfie') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera roll permissions!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: type === 'selfie' ? [1, 1] : [16, 9],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      switch (type) {
        case 'front':
          setFrontId(base64Image);
          break;
        case 'back':
          setBackId(base64Image);
          break;
        case 'selfie':
          setSelfie(base64Image);
          break;
      }
    }
  };

  const handleSubmit = async () => {
    if (!frontId || !backId || !selfie) {
      Alert.alert('Missing Documents', 'Please upload all required documents');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'User not found');
      return;
    }

    setLoading(true);
    try {
      await workerAPI.submitVerification(user.id, {
        front_id: frontId,
        back_id: backId,
        selfie: selfie,
      });

      Alert.alert(
        'Verification Submitted',
        'Your documents have been submitted for review. We\'ll notify you once approved.',
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

  const renderUploadCard = (
    title: string,
    subtitle: string,
    icon: keyof typeof Ionicons.glyphMap,
    image: string | null,
    onPress: () => void
  ) => (
    <GlassCard intensity={20} style={styles.uploadCard}>
      <TouchableOpacity onPress={onPress} style={styles.uploadCardContent}>
        {image ? (
          <Image source={{ uri: image }} style={styles.uploadedImage} />
        ) : (
          <View style={styles.uploadPlaceholder}>
            <View style={styles.uploadIcon}>
              <Ionicons name={icon} size={40} color={Colors.primary} />
            </View>
            <Text style={styles.uploadTitle}>{title}</Text>
            <Text style={styles.uploadSubtitle}>{subtitle}</Text>
          </View>
        )}
        {image && (
          <View style={styles.changeButton}>
            <Ionicons name="camera" size={20} color={Colors.white} />
          </View>
        )}
      </TouchableOpacity>
    </GlassCard>
  );

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
                  <Ionicons name="shield-checkmark" size={56} color={Colors.primary} />
                </LinearGradient>
              </View>
              <Text style={styles.title}>Verify Your Identity</Text>
              <Text style={styles.subtitle}>
                Complete identity verification to start accepting jobs
              </Text>
            </View>

            <View style={styles.stepsContainer}>
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>Upload Front ID</Text>
              </View>
              <View style={styles.stepDivider} />
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>Upload Back ID</Text>
              </View>
              <View style={styles.stepDivider} />
              <View style={styles.step}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>Take Selfie</Text>
              </View>
            </View>

            {renderUploadCard(
              'Front Government ID',
              'Upload front side of your ID card',
              'card',
              frontId,
              () => pickImage('front')
            )}

            {renderUploadCard(
              'Back Government ID',
              'Upload back side of your ID card',
              'card',
              backId,
              () => pickImage('back')
            )}

            {renderUploadCard(
              'Live Selfie',
              'Take a clear selfie photo',
              'camera',
              selfie,
              () => pickImage('selfie')
            )}

            <View style={styles.infoCard}>
              <Ionicons name="information-circle" size={24} color={Colors.primary} />
              <Text style={styles.infoText}>
                Your documents are securely encrypted and will only be used for verification purposes.
              </Text>
            </View>

            <Button
              title="Submit for Verification"
              onPress={handleSubmit}
              loading={loading}
              disabled={!frontId || !backId || !selfie}
              size="large"
              style={styles.submitButton}
            />
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
    lineHeight: 22,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  step: {
    alignItems: 'center',
    flex: 1,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  stepNumberText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: Colors.primary,
  },
  stepText: {
    fontSize: fontSize.xs,
    color: Colors.gray,
    textAlign: 'center',
  },
  stepDivider: {
    width: 20,
    height: 2,
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    marginBottom: 30,
  },
  uploadCard: {
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  uploadCardContent: {
    position: 'relative',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  uploadIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(68, 189, 19, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  uploadTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: Colors.white,
    marginBottom: spacing.xs,
  },
  uploadSubtitle: {
    fontSize: fontSize.sm,
    color: Colors.gray,
  },
  uploadedImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.lg,
  },
  changeButton: {
    position: 'absolute',
    bottom: spacing.md,
    right: spacing.md,
    backgroundColor: Colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoCard: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: 'rgba(68, 189, 19, 0.1)',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  infoText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: Colors.gray,
    lineHeight: 20,
  },
  submitButton: {},
});