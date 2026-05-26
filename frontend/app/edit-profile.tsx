import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';

export default function EditProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [phone, setPhone] = useState('+1 234 567 8900');
  const [bio, setBio] = useState('Professional electrician with 5+ years of experience');
  const [skills, setSkills] = useState('Electrical wiring, Installation, Repairs');

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={() => {
              Alert.alert('Saved', 'Profile updated successfully');
              router.back();
            }}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Profile Picture */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['rgba(68, 189, 19, 0.3)', 'transparent']}
                  style={styles.avatar}
                >
                  <Ionicons name="person" size={48} color={Colors.primary} />
                </LinearGradient>
                <TouchableOpacity style={styles.cameraButton}>
                  <Ionicons name="camera" size={18} color={Colors.white} />
                </TouchableOpacity>
              </View>
              <Text style={styles.changePhoto}>Change Photo</Text>
            </View>

            {/* Form */}
            <View style={styles.form}>
              <Input
                label="Full Name"
                value={name}
                onChangeText={setName}
                leftIcon="person"
              />

              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                leftIcon="mail"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              <Input
                label="Phone Number"
                value={phone}
                onChangeText={setPhone}
                leftIcon="call"
                keyboardType="phone-pad"
              />

              <Input
                label="Bio"
                value={bio}
                onChangeText={setBio}
                leftIcon="document-text"
                multiline
                numberOfLines={3}
                style={{ minHeight: 80, textAlignVertical: 'top' }}
              />

              <Input
                label="Skills"
                value={skills}
                onChangeText={setSkills}
                leftIcon="construct"
              />
            </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  saveButton: {
    fontSize: fontSize.md,
    color: Colors.primary,
    fontWeight: fontWeight.semibold,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.background,
  },
  changePhoto: {
    color: Colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  form: {},
});
