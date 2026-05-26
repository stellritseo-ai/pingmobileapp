import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Button } from '@/src/components/ui/Button';

const METHODS = [
  { id: 'stripe', name: 'Credit Card', subtitle: '**** 4242', icon: 'card', primary: true },
  { id: 'khalti', name: 'Khalti', subtitle: 'Mobile wallet', icon: 'wallet' },
  { id: 'esewa', name: 'eSewa', subtitle: 'Mobile wallet', icon: 'wallet' },
  { id: 'wallet', name: 'Ping Buz Wallet', subtitle: 'Balance: $1,247.50', icon: 'cash' },
];

export default function PaymentCheckoutScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState('stripe');

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Payment</Text>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="help-circle-outline" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Amount Card */}
          <GlassCard intensity={30} style={styles.amountCard}>
            <LinearGradient
              colors={['rgba(68, 189, 19, 0.3)', 'rgba(32, 62, 41, 0.5)']}
              style={styles.amountGradient}
            >
              <Text style={styles.amountLabel}>Total to Pay</Text>
              <Text style={styles.amountValue}>$55.00</Text>
              <View style={styles.amountWorker}>
                <View style={styles.amountAvatar}>
                  <Ionicons name="person" size={16} color={Colors.primary} />
                </View>
                <Text style={styles.amountWorkerText}>To John Doe • Electrician</Text>
              </View>
            </LinearGradient>
          </GlassCard>

          {/* Breakdown */}
          <Text style={styles.sectionTitle}>Breakdown</Text>
          <GlassCard intensity={20} style={styles.breakdown}>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Service (1.5 hrs × $30)</Text>
              <Text style={styles.rowValue}>$45.00</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Tip</Text>
              <Text style={styles.rowValue}>$10.00</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>$55.00</Text>
            </View>
          </GlassCard>

          {/* Payment Methods */}
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {METHODS.map((method) => (
            <TouchableOpacity
              key={method.id}
              activeOpacity={0.7}
              onPress={() => setSelected(method.id)}
            >
              <GlassCard intensity={20} style={[styles.method, selected === method.id && styles.methodSelected]}>
                <View style={styles.methodIcon}>
                  <Ionicons name={method.icon as any} size={24} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.methodName}>{method.name}</Text>
                  <Text style={styles.methodSubtitle}>{method.subtitle}</Text>
                </View>
                <View style={[styles.radio, selected === method.id && styles.radioSelected]}>
                  {selected === method.id && <View style={styles.radioInner} />}
                </View>
              </GlassCard>
            </TouchableOpacity>
          ))}

          {/* Security */}
          <View style={styles.security}>
            <Ionicons name="shield-checkmark" size={20} color={Colors.primary} />
            <Text style={styles.securityText}>
              Your payment is secured with end-to-end encryption
            </Text>
          </View>
        </ScrollView>

        {/* Pay Button */}
        <View style={styles.footer}>
          <Button
            title="Pay $55.00"
            onPress={() => {
              Alert.alert('Payment Successful! 🎉', 'Your payment has been processed', [
                { text: 'Rate Worker', onPress: () => router.replace('/review') }
              ]);
            }}
            size="large"
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.md,
  },
  iconButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: Colors.white },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: 120 },
  amountCard: { padding: 0, overflow: 'hidden', marginBottom: spacing.lg },
  amountGradient: { padding: spacing.lg, alignItems: 'center' },
  amountLabel: { fontSize: fontSize.sm, color: Colors.gray, marginBottom: 4 },
  amountValue: { fontSize: 48, fontWeight: fontWeight.bold, color: Colors.white, marginBottom: spacing.md },
  amountWorker: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  amountAvatar: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(68, 189, 19, 0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  amountWorkerText: { fontSize: fontSize.sm, color: Colors.lightGray },
  sectionTitle: {
    fontSize: fontSize.md, fontWeight: fontWeight.semibold,
    color: Colors.white, marginBottom: spacing.sm, marginTop: spacing.md,
  },
  breakdown: { marginBottom: spacing.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.sm },
  rowLabel: { fontSize: fontSize.sm, color: Colors.lightGray },
  rowValue: { fontSize: fontSize.sm, color: Colors.white, fontWeight: fontWeight.semibold },
  divider: { height: 1, backgroundColor: 'rgba(68, 189, 19, 0.1)', marginVertical: spacing.xs },
  totalLabel: { fontSize: fontSize.md, color: Colors.white, fontWeight: fontWeight.bold },
  totalValue: { fontSize: fontSize.xl, color: Colors.primary, fontWeight: fontWeight.bold },
  method: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    marginBottom: spacing.sm,
  },
  methodSelected: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  methodIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  methodName: { fontSize: fontSize.md, fontWeight: fontWeight.semibold, color: Colors.white },
  methodSubtitle: { fontSize: fontSize.sm, color: Colors.gray, marginTop: 2 },
  radio: {
    width: 24, height: 24, borderRadius: 12,
    borderWidth: 2, borderColor: Colors.darkGray,
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: Colors.primary },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },
  security: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    marginTop: spacing.md,
  },
  securityText: { flex: 1, fontSize: fontSize.xs, color: Colors.gray },
  footer: {
    padding: spacing.lg,
    backgroundColor: Colors.secondaryBackground,
    borderTopWidth: 1, borderTopColor: 'rgba(68, 189, 19, 0.1)',
  },
});
