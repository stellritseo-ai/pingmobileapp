import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { chatAPI, buildChatWsUrl, Conversation } from '@/src/services/api';
import { useAuthStore } from '@/src/store/authStore';

function timeAgo(iso: string | null) {
  if (!iso) return '';
  const date = new Date(iso);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return 'now';
  const m = Math.floor(seconds / 60);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} hr`;
  const d = Math.floor(h / 24);
  if (d === 1) return 'Yesterday';
  if (d < 7) return `${d}d`;
  return date.toLocaleDateString();
}

export default function ChatScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const load = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      setRefreshing(false);
      return;
    }
    try {
      const r = await chatAPI.listConversations(user.id);
      setConversations(r.conversations);
    } catch (e) {
      console.warn('Failed to load conversations', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  // Connect WebSocket for real-time updates of the conversation list
  useEffect(() => {
    if (!user?.id) return;
    const ws = new WebSocket(buildChatWsUrl(user.id));
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_message' || data.type === 'conversation_read') {
          // Refresh list to update unread count + last message
          load();
        }
      } catch {}
    };

    return () => {
      try { ws.close(); } catch {}
      wsRef.current = null;
    };
  }, [user?.id, load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Messages</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={Colors.primary} />
          </View>
        ) : conversations.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="chatbubbles-outline" size={80} color={Colors.darkGray} />
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySubtitle}>
              Start chatting with workers from a job page
            </Text>
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.primary}
              />
            }
          >
            {conversations.map((conv) => {
              const other = conv.other_user;
              const otherName = other?.name || 'Unknown';
              return (
                <TouchableOpacity
                  key={conv.id}
                  style={styles.chatItem}
                  activeOpacity={0.7}
                  onPress={() =>
                    router.push(
                      `/chat-detail?id=${conv.id}&name=${encodeURIComponent(otherName)}`
                    )
                  }
                >
                  <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                      <Ionicons name="person" size={24} color={Colors.primary} />
                    </View>
                  </View>

                  <View style={styles.chatContent}>
                    <View style={styles.chatHeader}>
                      <Text style={styles.chatName}>{otherName}</Text>
                      <Text style={styles.chatTime}>
                        {timeAgo(conv.last_message_at)}
                      </Text>
                    </View>
                    <View style={styles.chatFooter}>
                      <View style={{ flex: 1 }}>
                        {other?.role && (
                          <Text style={styles.chatRole}>
                            {other.role.replace(/_/g, ' ')}
                          </Text>
                        )}
                        <Text
                          style={[
                            styles.chatMessage,
                            conv.unread_count > 0 && styles.chatMessageUnread,
                          ]}
                          numberOfLines={1}
                        >
                          {conv.last_message || 'Say hello 👋'}
                        </Text>
                      </View>
                      {conv.unread_count > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadText}>{conv.unread_count}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
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
  avatarContainer: { position: 'relative', marginRight: spacing.md },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContent: { flex: 1 },
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
  chatTime: { fontSize: fontSize.xs, color: Colors.gray },
  chatFooter: { flexDirection: 'row', alignItems: 'center' },
  chatRole: {
    fontSize: fontSize.xs,
    color: Colors.primary,
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  chatMessage: { fontSize: fontSize.sm, color: Colors.gray },
  chatMessageUnread: { color: Colors.white, fontWeight: fontWeight.semibold },
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
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },
  emptyTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    marginTop: spacing.md,
  },
  emptySubtitle: {
    fontSize: fontSize.sm,
    color: Colors.gray,
    textAlign: 'center',
  },
});
