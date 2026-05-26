import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';

const CHATS = [
  { id: '1', name: 'John Doe', role: 'Electrician', message: 'I am on the way!', time: '2 min', unread: 2, online: true },
  { id: '2', name: 'Sarah Wilson', role: 'Cleaner', message: 'Thanks for the great job!', time: '1 hr', unread: 0, online: true },
  { id: '3', name: 'Mike Chen', role: 'Handyman', message: 'When should I arrive?', time: '3 hr', unread: 1, online: false },
  { id: '4', name: 'Emma Davis', role: 'Delivery', message: 'Package delivered', time: 'Yesterday', unread: 0, online: false },
  { id: '5', name: 'Alex Kumar', role: 'Plumber', message: 'I can fix that today', time: 'Yesterday', unread: 0, online: true },
];

export default function ChatScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {CHATS.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={styles.chatItem}
              activeOpacity={0.7}
              onPress={() => router.push(`/chat-detail?id=${chat.id}&name=${chat.name}`)}
            >
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <Ionicons name="person" size={24} color={Colors.primary} />
                </View>
                {chat.online && <View style={styles.onlineDot} />}
              </View>

              <View style={styles.chatContent}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>{chat.name}</Text>
                  <Text style={styles.chatTime}>{chat.time}</Text>
                </View>
                <View style={styles.chatFooter}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.chatRole}>{chat.role}</Text>
                    <Text style={[styles.chatMessage, chat.unread > 0 && styles.chatMessageUnread]} numberOfLines={1}>
                      {chat.message}
                    </Text>
                  </View>
                  {chat.unread > 0 && (
                    <View style={styles.unreadBadge}>
                      <Text style={styles.unreadText}>{chat.unread}</Text>
                    </View>
                  )}
                </View>
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
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: fontSize.xxxl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.secondaryBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  chatItem: {
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: Colors.secondaryBackground,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(68, 189, 19, 0.1)',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: spacing.md,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2,
    borderColor: Colors.secondaryBackground,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  chatName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: Colors.white,
  },
  chatTime: {
    fontSize: fontSize.xs,
    color: Colors.gray,
  },
  chatFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatRole: {
    fontSize: fontSize.xs,
    color: Colors.primary,
    marginBottom: 2,
  },
  chatMessage: {
    fontSize: fontSize.sm,
    color: Colors.gray,
  },
  chatMessageUnread: {
    color: Colors.white,
    fontWeight: fontWeight.semibold,
  },
  unreadBadge: {
    backgroundColor: Colors.primary,
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: Colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
});
