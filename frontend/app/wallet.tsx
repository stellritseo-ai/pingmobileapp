import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Button } from '@/src/components/ui/Button';

const TRANSACTIONS = [
  { id: '1', type: 'credit', title: 'Payment from John', amount: '+$45.00', date: 'Today, 2:30 PM', icon: 'arrow-down-circle' },
  { id: '2', type: 'debit', title: 'Withdrawal', amount: '-$200.00', date: 'Yesterday', icon: 'arrow-up-circle' },
  { id: '3', type: 'credit', title: 'Payment from Sarah', amount: '+$120.00', date: '2 days ago', icon: 'arrow-down-circle' },
  { id: '4', type: 'credit', title: 'Tip from Mike', amount: '+$10.00', date: '3 days ago', icon: 'gift' },
];

const PAYMENT_METHODS = [
  { id: '1', type: 'Stripe', last4: '4242', icon: 'card', primary: true },
  { id: '2', type: 'Khalti', last4: 'KH-83', icon: 'wallet', primary: false },
  { id: '3', type: 'eSewa', last4: 'ES-92', icon: 'wallet', primary: false },
];

export default function WalletScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wallet</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="ellipsis-vertical" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Balance Card */}
          <GlassCard intensity={30} style={styles.balanceCard}>
            <LinearGradient
              colors={['rgba(68, 189, 19, 0.3)', 'rgba(32, 62, 41, 0.5)']}
              style={styles.balanceGradient}
            >
              <View style={styles.balanceHeader}>
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <Ionicons name="eye" size={20} color={Colors.gray} />
              </View>
              <Text style={styles.balanceAmount}>$1,247.50</Text>
              <Text style={styles.balanceSubtext}>Available for withdrawal</Text>

              <View style={styles.balanceActions}>
                <TouchableOpacity style={styles.balanceAction}>
                  <View style={styles.balanceActionIcon}>
                    <Ionicons name="add" size={20} color={Colors.white} />
                  </View>
                  <Text style={styles.balanceActionText}>Add Money</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.balanceAction}>
                  <View style={styles.balanceActionIcon}>
                    <Ionicons name="arrow-up" size={20} color={Colors.white} />
                  </View>
                  <Text style={styles.balanceActionText}>Withdraw</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.balanceAction}>
                  <View style={styles.balanceActionIcon}>
                    <Ionicons name="swap-horizontal" size={20} color={Colors.white} />
                  </View>
                  <Text style={styles.balanceActionText}>Transfer</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </GlassCard>

          {/* Quick Stats */}
          <View style={styles.statsRow}>
            <GlassCard intensity={20} style={styles.statCard}>
              <Ionicons name="trending-up" size={24} color={Colors.success} />
              <Text style={styles.statValue}>$895</Text>
              <Text style={styles.statLabel}>This Month</Text>
            </GlassCard>
            <GlassCard intensity={20} style={styles.statCard}>
              <Ionicons name="time" size={24} color={Colors.warning} />
              <Text style={styles.statValue}>$120</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </GlassCard>
          </View>

          {/* Payment Methods */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Payment Methods</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {PAYMENT_METHODS.map((pm) => (
            <GlassCard key={pm.id} intensity={20} style={styles.paymentMethod}>
              <View style={styles.pmIcon}>
                <Ionicons name={pm.icon as any} size={24} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.pmHeader}>
                  <Text style={styles.pmType}>{pm.type}</Text>
                  {pm.primary && (
                    <View style={styles.primaryBadge}>
                      <Text style={styles.primaryText}>Primary</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.pmLast4}>**** {pm.last4}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.gray} />
            </GlassCard>
          ))}

          {/* Transactions */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.sectionAction}>See All</Text>
            </TouchableOpacity>
          </View>

          {TRANSACTIONS.map((tx) => (
            <View key={tx.id} style={styles.transaction}>
              <View style={[
                styles.txIcon,
                { backgroundColor: tx.type === 'credit' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' }
              ]}>
                <Ionicons
                  name={tx.icon as any}
                  size={22}
                  color={tx.type === 'credit' ? Colors.success : Colors.error}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.txTitle}>{tx.title}</Text>
                <Text style={styles.txDate}>{tx.date}</Text>
              </View>
              <Text style={[
                styles.txAmount,
                { color: tx.type === 'credit' ? Colors.success : Colors.error }
              ]}>{tx.amount}</Text>
            </View>
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  balanceCard: {
    marginBottom: spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  balanceGradient: {
    padding: spacing.lg,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  balanceLabel: {
    color: Colors.gray,
    fontSize: fontSize.sm,
  },
  balanceAmount: {
    fontSize: 42,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: fontSize.sm,
    color: Colors.lightGray,
    marginBottom: spacing.lg,
  },
  balanceActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  balanceAction: {
    alignItems: 'center',
  },
  balanceActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  balanceActionText: {
    color: Colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    marginTop: spacing.sm,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: Colors.gray,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  sectionAction: {
    fontSize: fontSize.sm,
    color: Colors.primary,
    fontWeight: fontWeight.semibold,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  pmIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  pmType: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  primaryBadge: {
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  primaryText: {
    fontSize: 10,
    color: Colors.primary,
    fontWeight: fontWeight.bold,
  },
  pmLast4: {
    fontSize: fontSize.sm,
    color: Colors.gray,
    marginTop: 2,
  },
  transaction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(68, 189, 19, 0.1)',
  },
  txIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: Colors.white,
  },
  txDate: {
    fontSize: fontSize.xs,
    color: Colors.gray,
    marginTop: 2,
  },
  txAmount: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
