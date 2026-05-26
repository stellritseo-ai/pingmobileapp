import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Button } from '@/src/components/ui/Button';
import { useAuthStore } from '@/src/store/authStore';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  const handleBecomeWorker = () => {
    router.push('/become-worker');
  };

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Profile Header */}
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['rgba(68, 189, 19, 0.3)', 'transparent']}
                style={styles.avatar}
              >
                <Ionicons name="person" size={48} color={Colors.primary} />
              </LinearGradient>
            </View>
            <Text style={styles.name}>{user?.full_name || 'User'}</Text>
            <Text style={styles.email}>{user?.email || user?.mobile || ''}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {user?.role === 'individual_worker' ? 'Worker' : 
                 user?.role === 'business_owner' ? 'Business' : 'User'}
              </Text>
            </View>
          </View>

          {/* Become Worker Card (only for normal users) */}
          {user?.role === 'normal_user' && (
            <GlassCard intensity={30} style={styles.becomeWorkerCard}>
              <View style={styles.becomeWorkerContent}>
                <View style={styles.becomeWorkerHeader}>
                  <View style={styles.becomeWorkerIcon}>
                    <Ionicons name="briefcase" size={32} color={Colors.primary} />
                  </View>
                  <View style={styles.becomeWorkerText}>
                    <Text style={styles.becomeWorkerTitle}>Become a Worker</Text>
                    <Text style={styles.becomeWorkerSubtitle}>
                      Start earning by accepting jobs
                    </Text>
                  </View>
                </View>
                <Button
                  title="Get Started"
                  onPress={handleBecomeWorker}
                  size="small"
                />
              </View>
            </GlassCard>
          )}

          {/* Verification Status */}
          {user?.role === 'individual_worker' && (
            <GlassCard intensity={30} style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Text style={styles.statusTitle}>Verification Status</Text>
                <View style={[
                  styles.statusBadge,
                  user?.worker_verified ? styles.approvedBadge : styles.pendingBadge
                ]}>
                  <Text style={styles.statusBadgeText}>
                    {user?.worker_verified ? 'Verified' : 'Pending'}
                  </Text>
                </View>
              </View>
              {!user?.worker_verified && (
                <TouchableOpacity onPress={() => router.push('/worker/verification')}>
                  <Text style={styles.statusLink}>Complete Verification →</Text>
                </TouchableOpacity>
              )}
            </GlassCard>
          )}

          {user?.role === 'business_owner' && (
            <GlassCard intensity={30} style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Text style={styles.statusTitle}>Business Verification</Text>
                <View style={[
                  styles.statusBadge,
                  user?.business_verified ? styles.approvedBadge : styles.pendingBadge
                ]}>
                  <Text style={styles.statusBadgeText}>
                    {user?.business_verified ? 'Verified' : 'Pending'}
                  </Text>
                </View>
              </View>
              {!user?.business_verified && (
                <TouchableOpacity onPress={() => router.push('/business/verification')}>
                  <Text style={styles.statusLink}>Complete Verification →</Text>
                </TouchableOpacity>
              )}
            </GlassCard>
          )}

          {/* Menu Items */}
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/edit-profile')}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="person-outline" size={24} color={Colors.primary} />
                <Text style={styles.menuItemText}>Edit Profile</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/wallet')}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="wallet-outline" size={24} color={Colors.primary} />
                <Text style={styles.menuItemText}>Wallet</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/worker-dashboard')}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="stats-chart-outline" size={24} color={Colors.primary} />
                <Text style={styles.menuItemText}>Worker Dashboard</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/live-tracking')}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="navigate-outline" size={24} color={Colors.primary} />
                <Text style={styles.menuItemText}>Live Tracking Demo</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/review')}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="star-outline" size={24} color={Colors.primary} />
                <Text style={styles.menuItemText}>Rate Worker Demo</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/job-history')}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="time-outline" size={24} color={Colors.primary} />
                <Text style={styles.menuItemText}>Job History</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/settings')}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="settings-outline" size={24} color={Colors.primary} />
                <Text style={styles.menuItemText}>Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <View style={styles.menuItemLeft}>
                <Ionicons name="help-circle-outline" size={24} color={Colors.primary} />
                <Text style={styles.menuItemText}>Help & Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </TouchableOpacity>
          </View>

          {/* Logout Button */}
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="outline"
            size="large"
            style={styles.logoutButton}
          />
        </ScrollView>
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  avatarContainer: {
    marginBottom: spacing.md,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primary,
  },
  name: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    marginBottom: spacing.xs,
  },
  email: {
    fontSize: fontSize.md,
    color: Colors.gray,
    marginBottom: spacing.sm,
  },
  roleBadge: {
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  roleText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: Colors.primary,
  },
  becomeWorkerCard: {
    marginBottom: spacing.lg,
  },
  becomeWorkerContent: {},
  becomeWorkerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  becomeWorkerIcon: {},
  becomeWorkerText: {
    flex: 1,
  },
  becomeWorkerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    marginBottom: spacing.xs,
  },
  becomeWorkerSubtitle: {
    fontSize: fontSize.sm,
    color: Colors.gray,
  },
  statusCard: {
    marginBottom: spacing.lg,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  statusTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: Colors.white,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  approvedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  pendingBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  statusBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: Colors.primary,
  },
  statusLink: {
    fontSize: fontSize.md,
    color: Colors.primary,
    fontWeight: fontWeight.semibold,
  },
  menu: {
    marginBottom: spacing.xl,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(68, 189, 19, 0.1)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  menuItemText: {
    fontSize: fontSize.md,
    color: Colors.lightGray,
  },
  logoutButton: {},
});