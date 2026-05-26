import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';

const NOTIFICATIONS = [
  { id: '1', type: 'offer', title: 'New offer received', message: 'John Doe offered $45 for your job', time: '2 min ago', icon: 'pricetag', color: Colors.primary, unread: true },
  { id: '2', type: 'job', title: 'Job accepted', message: 'Your job "Fix sink" has been accepted by Sarah', time: '1 hr ago', icon: 'checkmark-circle', color: Colors.success, unread: true },
  { id: '3', type: 'payment', title: 'Payment received', message: 'You received $120 from Mike Chen', time: '3 hr ago', icon: 'cash', color: Colors.success, unread: false },
  { id: '4', type: 'chat', title: 'New message', message: 'Emma: I am on the way!', time: '5 hr ago', icon: 'chatbubble', color: Colors.primary, unread: false },
  { id: '5', type: 'verification', title: 'Verification approved', message: 'Your worker profile is now verified ✅', time: 'Yesterday', icon: 'shield-checkmark', color: Colors.primary, unread: false },
  { id: '6', type: 'review', title: 'New review', message: 'Alex rated you 5 stars!', time: '2 days ago', icon: 'star', color: Colors.warning, unread: false },
];

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <TouchableOpacity>
            <Text style={styles.markAll}>Mark all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.filterRow}>
            <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}>
              <Text style={styles.filterTextActive}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>Jobs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>Payments</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterChip}>
              <Text style={styles.filterText}>Chat</Text>
            </TouchableOpacity>
          </View>

          {NOTIFICATIONS.map((notif) => (
            <TouchableOpacity
              key={notif.id}
              activeOpacity={0.7}
              style={[styles.notification, notif.unread && styles.notificationUnread]}
            >
              <View style={[styles.notifIcon, { backgroundColor: `${notif.color}30` }]}>
                <Ionicons name={notif.icon as any} size={22} color={notif.color} />
              </View>
              <View style={styles.notifContent}>
                <View style={styles.notifHeader}>
                  <Text style={styles.notifTitle}>{notif.title}</Text>
                  {notif.unread && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifMessage}>{notif.message}</Text>
                <Text style={styles.notifTime}>{notif.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
  markAll: {
    color: Colors.primary,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: Colors.secondaryBackground,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    color: Colors.gray,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  filterTextActive: {
    color: Colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  notification: {
    flexDirection: 'row',
    gap: spacing.md,
    padding: spacing.md,
    backgroundColor: Colors.secondaryBackground,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(68, 189, 19, 0.1)',
  },
  notificationUnread: {
    borderColor: 'rgba(68, 189, 19, 0.3)',
    backgroundColor: 'rgba(68, 189, 19, 0.05)',
  },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifContent: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  notifMessage: {
    fontSize: fontSize.sm,
    color: Colors.lightGray,
    marginBottom: 4,
  },
  notifTime: {
    fontSize: fontSize.xs,
    color: Colors.gray,
  },
});
