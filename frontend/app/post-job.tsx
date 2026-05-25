import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
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
import { jobsAPI } from '@/src/services/api';
import { useAuthStore } from '@/src/store/authStore';

const CATEGORIES = [
  { id: 'electrician', label: 'Electrician', icon: 'flash' },
  { id: 'cleaning', label: 'Cleaning', icon: 'sparkles' },
  { id: 'delivery', label: 'Delivery', icon: 'bicycle' },
  { id: 'handyman', label: 'Handyman', icon: 'construct' },
  { id: 'event_helper', label: 'Event Helper', icon: 'calendar' },
  { id: 'moving', label: 'Moving', icon: 'car' },
];

const URGENCY_LEVELS = [
  { id: 'low', label: 'Flexible', color: Colors.success },
  { id: 'medium', label: 'Normal', color: Colors.warning },
  { id: 'high', label: 'Urgent', color: Colors.error },
];

export default function PostJobScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [budget, setBudget] = useState('');
  const [duration, setDuration] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [location, setLocation] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    if (photos.length >= 3) {
      Alert.alert('Max Photos', 'You can upload up to 3 photos');
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need photo library permissions');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      setPhotos([...photos, `data:image/jpeg;base64,${result.assets[0].base64}`]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title || !description || !category || !budget || !duration || !location) {
      Alert.alert('Missing Info', 'Please fill all required fields');
      return;
    }

    if (!user?.id) return;

    setLoading(true);
    try {
      await jobsAPI.create(user.id, {
        title,
        description,
        category,
        budget: parseFloat(budget),
        estimated_duration: duration,
        urgency,
        location,
        photos,
      });

      Alert.alert(
        'Job Posted! 🎉',
        'Your job has been posted. Workers will be notified.',
        [{ text: 'OK', onPress: () => router.replace('/(main)/jobs') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to post job');
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
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={Colors.white} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Post a Job</Text>
              <View style={{ width: 40 }} />
            </View>

            <Text style={styles.sectionLabel}>Category</Text>
            <View style={styles.categoriesGrid}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setCategory(cat.id)}
                  style={[
                    styles.categoryChip,
                    category === cat.id && styles.categoryChipActive,
                  ]}
                >
                  <Ionicons
                    name={cat.icon as any}
                    size={20}
                    color={category === cat.id ? Colors.white : Colors.primary}
                  />
                  <Text style={[
                    styles.categoryChipText,
                    category === cat.id && styles.categoryChipTextActive,
                  ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Job Title *"
              placeholder="e.g., Fix leaking pipe"
              value={title}
              onChangeText={setTitle}
              leftIcon="create"
            />

            <Input
              label="Description *"
              placeholder="Describe what needs to be done..."
              value={description}
              onChangeText={setDescription}
              leftIcon="document-text"
              multiline
              numberOfLines={4}
              style={{ minHeight: 100, textAlignVertical: 'top' }}
            />

            <Input
              label="Budget ($) *"
              placeholder="50"
              value={budget}
              onChangeText={setBudget}
              leftIcon="cash"
              keyboardType="numeric"
            />

            <Input
              label="Estimated Duration *"
              placeholder="e.g., 2 hours, 1 day"
              value={duration}
              onChangeText={setDuration}
              leftIcon="time"
            />

            <Input
              label="Location *"
              placeholder="Your address"
              value={location}
              onChangeText={setLocation}
              leftIcon="location"
            />

            <Text style={styles.sectionLabel}>Urgency Level</Text>
            <View style={styles.urgencyContainer}>
              {URGENCY_LEVELS.map((level) => (
                <TouchableOpacity
                  key={level.id}
                  onPress={() => setUrgency(level.id as any)}
                  style={[
                    styles.urgencyChip,
                    urgency === level.id && { backgroundColor: level.color },
                  ]}
                >
                  <Text style={[
                    styles.urgencyChipText,
                    urgency === level.id && styles.urgencyChipTextActive,
                  ]}>
                    {level.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Photos (Optional)</Text>
            <View style={styles.photosContainer}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoWrapper}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.removePhotoButton}
                    onPress={() => removePhoto(index)}
                  >
                    <Ionicons name="close" size={16} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              ))}
              {photos.length < 3 && (
                <TouchableOpacity onPress={pickImage} style={styles.addPhotoButton}>
                  <Ionicons name="add" size={32} color={Colors.primary} />
                  <Text style={styles.addPhotoText}>Add</Text>
                </TouchableOpacity>
              )}
            </View>

            <Button
              title="Post Job"
              onPress={handleSubmit}
              loading={loading}
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
  container: { flex: 1 },
  safeArea: { flex: 1 },
  keyboardView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  backButton: { padding: spacing.sm },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  sectionLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: Colors.lightGray,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: Colors.secondaryBackground,
    borderWidth: 1,
    borderColor: 'rgba(68, 189, 19, 0.2)',
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryChipText: {
    fontSize: fontSize.sm,
    color: Colors.lightGray,
    fontWeight: fontWeight.medium,
  },
  categoryChipTextActive: {
    color: Colors.white,
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  urgencyChip: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    backgroundColor: Colors.secondaryBackground,
    borderWidth: 1,
    borderColor: 'rgba(68, 189, 19, 0.2)',
  },
  urgencyChipText: {
    fontSize: fontSize.sm,
    color: Colors.lightGray,
    fontWeight: fontWeight.semibold,
  },
  urgencyChipTextActive: {
    color: Colors.white,
  },
  photosContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  photoWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  removePhotoButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.error,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
    backgroundColor: Colors.secondaryBackground,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: {
    fontSize: fontSize.xs,
    color: Colors.primary,
    marginTop: 4,
  },
  submitButton: {
    marginTop: spacing.lg,
  },
});
