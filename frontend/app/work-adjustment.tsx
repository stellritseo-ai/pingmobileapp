import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Button } from '@/src/components/ui/Button';

const TIPS = [0, 5, 10, 15, 20];

export default function WorkTimeAdjustmentScreen() {
  const router = useRouter();
  const [hours, setHours] = useState('1.5');
  const [extraCharges, setExtraCharges] = useState('0');
  const [tip, setTip] = useState(10);
  const [customTip, setCustomTip] = useState(false);

  const hourlyRate = 30;
  const baseAmount = parseFloat(hours) * hourlyRate || 0;
  const extras = parseFloat(extraCharges) || 0;
  const subtotal = baseAmount + extras;
  const total = subtotal + tip;

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Adjust Work Time</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Worker Card */}
          <GlassCard intensity={20} style={styles.workerCard}>
            <View style={styles.workerInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={28} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.workerName}>John Doe</Text>
                <Text style={styles.workerJob}>Electrician • Fix kitchen wiring</Text>
              </View>
              <View style={styles.completedBadge}>
                <Ionicons name="checkmark-circle" size={16} color={Colors.success} />
                <Text style={styles.completedText}>Done</Text>
              </View>
            </View>
          </GlassCard>

          {/* Time Adjustment */}
          <Text style={styles.sectionTitle}>Work Duration</Text>
          <GlassCard intensity={20} style={styles.card}>
            <View style={styles.row}>
              <View>
                <Text style={styles.label}>Estimated</Text>
                <Text style={styles.estimated}>1 hour</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color={Colors.gray} />
              <View>
                <Text style={styles.label}>Actual Hours</Text>
                <View style={styles.hoursInput}>
                  <TouchableOpacity
                    onPress={() => setHours((Math.max(0.5, parseFloat(hours) - 0.5)).toString())}
                    style={styles.hoursButton}
                  >
                    <Ionicons name="remove" size={20} color={Colors.white} />
                  </TouchableOpacity>
                  <Text style={styles.hoursValue}>{hours} hr</Text>
                  <TouchableOpacity
                    onPress={() => setHours((parseFloat(hours) + 0.5).toString())}
                    style={styles.hoursButton}
                  >
                    <Ionicons name="add" size={20} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.rateRow}>
              <Text style={styles.rateLabel}>Hourly Rate</Text>
              <Text style={styles.rateValue}>${hourlyRate}/hr</Text>
            </View>
          </GlassCard>

          {/* Extra Charges */}
          <Text style={styles.sectionTitle}>Extra Charges (Materials, etc.)</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="cash" size={20} color={Colors.gray} />
            <TextInput
              style={styles.input}
              placeholder="0.00"
              placeholderTextColor={Colors.darkGray}
              value={extraCharges}
              onChangeText={setExtraCharges}
              keyboardType="numeric"
            />
            <Text style={styles.currency}>USD</Text>
          </View>

          {/* Tip Section */}
          <Text style={styles.sectionTitle}>Add Tip 💚</Text>
          <View style={styles.tipsRow}>
            {TIPS.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[styles.tipChip, tip === amount && !customTip && styles.tipChipActive]}
                onPress={() => {
                  setTip(amount);
                  setCustomTip(false);
                }}
              >
                <Text style={[styles.tipText, tip === amount && !customTip && styles.tipTextActive]}>
                  ${amount}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.tipChip, customTip && styles.tipChipActive]}
              onPress={() => setCustomTip(true)}
            >
              <Text style={[styles.tipText, customTip && styles.tipTextActive]}>Custom</Text>
            </TouchableOpacity>
          </View>

          {/* Summary */}
          <GlassCard intensity={30} style={styles.summary}>
            <LinearGradient
              colors={['rgba(68, 189, 19, 0.15)', 'transparent']}
              style={styles.summaryGradient}
            >
              <Text style={styles.summaryTitle}>Payment Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Base ({hours} hrs × ${hourlyRate})</Text>
                <Text style={styles.summaryValue}>${baseAmount.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Extra Charges</Text>
                <Text style={styles.summaryValue}>${extras.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tip</Text>
                <Text style={[styles.summaryValue, { color: Colors.primary }]}>${tip.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.summaryTotal}>Total</Text>
                <Text style={styles.summaryTotalValue}>${total.toFixed(2)}</Text>
              </View>
            </LinearGradient>
          </GlassCard>

          <View style={styles.noteCard}>
            <Ionicons name="information-circle" size={18} color={Colors.warning} />
            <Text style={styles.noteText}>
              Worker must approve this amount before payment is processed.
            </Text>
          </View>

          <Button
            title="Send to Worker for Approval"
            onPress={() => router.push('/payment-checkout')}
            size="large"
            style={{ marginTop: spacing.lg }}
          />
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
  iconButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: fontSize.xl, fontWeight: fontWeight.bold, color: Colors.white },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  workerCard: { marginBottom: spacing.lg },
  workerInfo: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  workerName: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: Colors.white },
  workerJob: { fontSize: fontSize.sm, color: Colors.gray, marginTop: 2 },
  completedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  completedText: { fontSize: fontSize.xs, color: Colors.success, fontWeight: fontWeight.bold },
  sectionTitle: {
    fontSize: fontSize.md, fontWeight: fontWeight.semibold,
    color: Colors.white, marginBottom: spacing.sm, marginTop: spacing.sm,
  },
  card: { marginBottom: spacing.md },
  row: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: spacing.md,
  },
  label: { fontSize: fontSize.xs, color: Colors.gray, marginBottom: 4 },
  estimated: { fontSize: fontSize.lg, fontWeight: fontWeight.semibold, color: Colors.lightGray },
  hoursInput: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: spacing.sm, paddingVertical: 4,
    borderRadius: borderRadius.md,
  },
  hoursButton: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  hoursValue: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: Colors.white, minWidth: 50, textAlign: 'center' },
  rateRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1, borderTopColor: 'rgba(68, 189, 19, 0.1)',
  },
  rateLabel: { fontSize: fontSize.sm, color: Colors.gray },
  rateValue: { fontSize: fontSize.sm, color: Colors.primary, fontWeight: fontWeight.bold },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: Colors.secondaryBackground,
    borderRadius: borderRadius.lg,
    borderWidth: 1, borderColor: 'rgba(68, 189, 19, 0.2)',
    paddingHorizontal: spacing.md, marginBottom: spacing.md,
  },
  input: { flex: 1, color: Colors.white, fontSize: fontSize.md, paddingVertical: spacing.md },
  currency: { color: Colors.gray, fontSize: fontSize.sm },
  tipsRow: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: spacing.sm, marginBottom: spacing.lg,
  },
  tipChip: {
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: Colors.secondaryBackground,
    borderWidth: 1, borderColor: 'rgba(68, 189, 19, 0.2)',
    minWidth: 60, alignItems: 'center',
  },
  tipChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tipText: { color: Colors.gray, fontSize: fontSize.sm, fontWeight: fontWeight.semibold },
  tipTextActive: { color: Colors.white },
  summary: { padding: 0, overflow: 'hidden', marginTop: spacing.sm },
  summaryGradient: { padding: spacing.lg },
  summaryTitle: { fontSize: fontSize.lg, fontWeight: fontWeight.bold, color: Colors.white, marginBottom: spacing.md },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.xs },
  summaryLabel: { fontSize: fontSize.sm, color: Colors.lightGray },
  summaryValue: { fontSize: fontSize.sm, color: Colors.white, fontWeight: fontWeight.semibold },
  summaryDivider: {
    height: 1, backgroundColor: 'rgba(68, 189, 19, 0.2)',
    marginVertical: spacing.sm,
  },
  summaryTotal: { fontSize: fontSize.md, color: Colors.white, fontWeight: fontWeight.bold },
  summaryTotalValue: { fontSize: fontSize.xl, color: Colors.primary, fontWeight: fontWeight.bold },
  noteCard: {
    flexDirection: 'row', gap: spacing.sm,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    padding: spacing.md, borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  noteText: { flex: 1, fontSize: fontSize.xs, color: Colors.warning, lineHeight: 16 },
});
