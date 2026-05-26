import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';

const SECTIONS = [
  {
    title: 'Account',
    items: [
      { icon: 'person', label: 'Edit Profile', type: 'link' },
      { icon: 'shield-checkmark', label: 'Verification', type: 'link', badge: 'Verified' },
      { icon: 'wallet', label: 'Payment Methods', type: 'link' },
    ],
  },
  {
    title: 'Notifications',
    items: [
      { icon: 'notifications', label: 'Push Notifications', type: 'switch', value: true },
      { icon: 'mail', label: 'Email Notifications', type: 'switch', value: false },
      { icon: 'megaphone', label: 'Promotional', type: 'switch', value: true },
    ],
  },
  {
    title: 'Security',
    items: [
      { icon: 'lock-closed', label: 'Change Password', type: 'link' },
      { icon: 'finger-print', label: 'Biometric Login', type: 'switch', value: true },
      { icon: 'phone-portrait', label: 'Two-Factor Auth', type: 'switch', value: false },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { icon: 'language', label: 'Language', type: 'link', value: 'English' },
      { icon: 'moon', label: 'Dark Mode', type: 'switch', value: true },
      { icon: 'location', label: 'Location Services', type: 'switch', value: true },
    ],
  },
  {
    title: 'Support',
    items: [
      { icon: 'help-circle', label: 'Help Center', type: 'link' },
      { icon: 'chatbubble', label: 'Contact Support', type: 'link' },
      { icon: 'document-text', label: 'Terms & Privacy', type: 'link' },
      { icon: 'star', label: 'Rate App', type: 'link' },
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const [switches, setSwitches] = useState<Record<string, boolean>>({});

  const toggleSwitch = (key: string, defaultValue: boolean) => {
    setSwitches((prev) => ({
      ...prev,
      [key]: prev[key] === undefined ? !defaultValue : !prev[key],
    }));
  };

  const getSwitchValue = (key: string, defaultValue: boolean) => {
    return switches[key] !== undefined ? switches[key] : defaultValue;
  };

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {SECTIONS.map((section, sectionIdx) => (
            <View key={sectionIdx} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View style={styles.sectionContent}>
                {section.items.map((item, itemIdx) => (
                  <TouchableOpacity
                    key={itemIdx}
                    style={[
                      styles.item,
                      itemIdx === section.items.length - 1 && styles.itemLast,
                    ]}
                    activeOpacity={item.type === 'switch' ? 1 : 0.7}
                  >
                    <View style={styles.itemLeft}>
                      <View style={styles.itemIcon}>
                        <Ionicons name={item.icon as any} size={20} color={Colors.primary} />
                      </View>
                      <Text style={styles.itemLabel}>{item.label}</Text>
                    </View>
                    <View style={styles.itemRight}>
                      {item.type === 'switch' ? (
                        <Switch
                          value={getSwitchValue(`${sectionIdx}-${itemIdx}`, item.value as boolean)}
                          onValueChange={() => toggleSwitch(`${sectionIdx}-${itemIdx}`, item.value as boolean)}
                          trackColor={{ false: Colors.darkGray, true: Colors.primary }}
                          thumbColor={Colors.white}
                        />
                      ) : (
                        <>
                          {item.badge && (
                            <View style={styles.badge}>
                              <Text style={styles.badgeText}>{item.badge}</Text>
                            </View>
                          )}
                          {item.value && <Text style={styles.itemValue}>{item.value}</Text>}
                          <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.logoutButton} activeOpacity={0.7}>
            <Ionicons name="log-out" size={22} color={Colors.error} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <Text style={styles.version}>Ping Buz v1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: Colors.primary,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionContent: {
    backgroundColor: Colors.secondaryBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(68, 189, 19, 0.1)',
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(68, 189, 19, 0.1)',
  },
  itemLast: {
    borderBottomWidth: 0,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  itemIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(68, 189, 19, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemLabel: {
    fontSize: fontSize.md,
    color: Colors.white,
    fontWeight: fontWeight.medium,
  },
  itemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  itemValue: {
    fontSize: fontSize.sm,
    color: Colors.gray,
  },
  badge: {
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  badgeText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: fontWeight.bold,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginTop: spacing.lg,
  },
  logoutText: {
    color: Colors.error,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  version: {
    textAlign: 'center',
    color: Colors.darkGray,
    fontSize: fontSize.xs,
    marginTop: spacing.lg,
  },
});
