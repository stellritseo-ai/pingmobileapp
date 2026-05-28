import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SectionList,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import type { ServiceItem } from '@/src/services/api';

interface Props {
  visible: boolean;
  services: ServiceItem[];
  groups: string[];
  selectedId?: string;
  onClose: () => void;
  onSelect: (service: ServiceItem) => void;
}

export function ServicePickerModal({
  visible,
  services,
  groups,
  selectedId,
  onClose,
  onSelect,
}: Props) {
  const [query, setQuery] = useState('');

  const sections = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? services.filter(
          (s) =>
            s.label.toLowerCase().includes(q) ||
            s.group.toLowerCase().includes(q)
        )
      : services;

    return groups
      .map((g) => ({
        title: g,
        data: filtered.filter((s) => s.group === g),
      }))
      .filter((section) => section.data.length > 0);
  }, [services, groups, query]);

  const handleSelect = (service: ServiceItem) => {
    onSelect(service);
    setQuery('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.sheet}>
          <LinearGradient
            colors={[Colors.darkForest, Colors.background]}
            style={styles.gradient}
          >
            <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
              >
                {/* Handle */}
                <View style={styles.handle} />

                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Select a Service</Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                    <Ionicons name="close" size={22} color={Colors.white} />
                  </TouchableOpacity>
                </View>

                {/* Search */}
                <View style={styles.searchWrap}>
                  <Ionicons
                    name="search"
                    size={18}
                    color={Colors.lightGray}
                    style={{ marginRight: spacing.sm }}
                  />
                  <TextInput
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search services..."
                    placeholderTextColor={Colors.lightGray}
                    style={styles.searchInput}
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  {query.length > 0 && (
                    <TouchableOpacity onPress={() => setQuery('')}>
                      <Ionicons
                        name="close-circle"
                        size={18}
                        color={Colors.lightGray}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {/* List */}
                <SectionList
                  sections={sections}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.listContent}
                  stickySectionHeadersEnabled={false}
                  keyboardShouldPersistTaps="handled"
                  renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                  )}
                  renderItem={({ item }) => {
                    const active = item.id === selectedId;
                    return (
                      <TouchableOpacity
                        onPress={() => handleSelect(item)}
                        style={[styles.row, active && styles.rowActive]}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.iconWrap,
                            active && styles.iconWrapActive,
                          ]}
                        >
                          <Ionicons
                            name={item.icon as any}
                            size={18}
                            color={active ? Colors.white : Colors.primary}
                          />
                        </View>
                        <Text
                          style={[
                            styles.rowLabel,
                            active && styles.rowLabelActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                        {active && (
                          <Ionicons
                            name="checkmark-circle"
                            size={20}
                            color={Colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                  ListEmptyComponent={
                    <View style={styles.empty}>
                      <Ionicons
                        name="search-outline"
                        size={36}
                        color={Colors.lightGray}
                      />
                      <Text style={styles.emptyText}>
                        No services match "{query}"
                      </Text>
                    </View>
                  }
                />
              </KeyboardAvoidingView>
            </SafeAreaView>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  sheet: {
    height: '85%',
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    borderTopWidth: 1,
    borderColor: 'rgba(68, 189, 19, 0.25)',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.lightGray,
    opacity: 0.4,
    alignSelf: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.secondaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryBackground,
    marginHorizontal: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? spacing.sm : 2,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: 'rgba(68, 189, 19, 0.15)',
    marginBottom: spacing.md,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontSize: fontSize.md,
    paddingVertical: spacing.sm,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: Colors.secondaryBackground,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    marginBottom: spacing.xs,
  },
  rowActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(68, 189, 19, 0.08)',
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(68, 189, 19, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: Colors.primary,
  },
  rowLabel: {
    flex: 1,
    fontSize: fontSize.md,
    color: Colors.white,
    fontWeight: fontWeight.medium,
  },
  rowLabelActive: {
    fontWeight: fontWeight.semibold,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
    gap: spacing.sm,
  },
  emptyText: {
    color: Colors.lightGray,
    fontSize: fontSize.sm,
  },
});
