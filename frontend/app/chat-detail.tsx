import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import {
  chatAPI,
  buildChatWsUrl,
  ChatMessage,
} from '@/src/services/api';
import { useAuthStore } from '@/src/store/authStore';

function formatTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatDetailScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { id: convId, name } = useLocalSearchParams<{ id: string; name: string }>();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [otherTyping, setOtherTyping] = useState(false);

  const scrollRef = useRef<ScrollView | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const otherTypingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 60);
  }, []);

  // Initial load + mark-as-read
  useEffect(() => {
    if (!user?.id || !convId) {
      setLoading(false);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const r = await chatAPI.getMessages(convId, user.id);
        if (mounted) {
          setMessages(r.messages);
          scrollToEnd();
        }
        // Mark unread as read
        await chatAPI.markRead(convId, user.id);
      } catch (e) {
        console.warn('Failed to load messages', e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user?.id, convId, scrollToEnd]);

  // WebSocket for real-time updates
  useEffect(() => {
    if (!user?.id || !convId) return;
    const ws = new WebSocket(buildChatWsUrl(user.id));
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_message' && data.conversation_id === convId) {
          const msg: ChatMessage = data.message;
          setMessages((prev) => {
            // De-dup if we already optimistically added
            if (prev.some((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          scrollToEnd();
          // Mark read since user is viewing this conv
          if (msg.sender_id !== user.id) {
            chatAPI.markRead(convId, user.id).catch(() => {});
          }
        } else if (
          data.type === 'typing' &&
          data.conversation_id === convId &&
          data.user_id !== user.id
        ) {
          setOtherTyping(!!data.is_typing);
          if (otherTypingTimerRef.current) clearTimeout(otherTypingTimerRef.current);
          if (data.is_typing) {
            otherTypingTimerRef.current = setTimeout(() => setOtherTyping(false), 4000);
          }
        }
      } catch {}
    };

    return () => {
      try {
        ws.close();
      } catch {}
      wsRef.current = null;
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (otherTypingTimerRef.current) clearTimeout(otherTypingTimerRef.current);
    };
  }, [user?.id, convId, scrollToEnd]);

  // Send typing indicator (debounced)
  const broadcastTyping = useCallback(
    (isTyping: boolean) => {
      try {
        wsRef.current?.send(
          JSON.stringify({ type: 'typing', conversation_id: convId, is_typing: isTyping })
        );
      } catch {}
    },
    [convId]
  );

  const onChangeText = (value: string) => {
    setText(value);
    broadcastTyping(true);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => broadcastTyping(false), 1500);
  };

  const handleSend = async () => {
    if (!text.trim() || !user?.id || !convId || sending) return;
    const draft = text.trim();
    setText('');
    setSending(true);
    try {
      const r = await chatAPI.sendMessage(convId, user.id, draft);
      // Optimistically append (WS may also push same message — we de-dup on id)
      setMessages((prev) => {
        if (prev.some((m) => m.id === r.message.id)) return prev;
        return [...prev, r.message];
      });
      scrollToEnd();
    } catch (e: any) {
      console.warn('Send failed', e);
      // Put text back so user can retry
      setText(draft);
    } finally {
      setSending(false);
      broadcastTyping(false);
    }
  };

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={20} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.userName}>{name || 'Chat'}</Text>
                <View style={styles.statusRow}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.statusText}>
                    {otherTyping ? 'typing…' : 'Online'}
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="call" size={22} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          ) : (
            <ScrollView
              ref={scrollRef}
              contentContainerStyle={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() =>
                scrollRef.current?.scrollToEnd({ animated: false })
              }
            >
              {messages.length === 0 ? (
                <View style={styles.emptyChat}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={56}
                    color={Colors.darkGray}
                  />
                  <Text style={styles.emptyText}>Start the conversation</Text>
                </View>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.sender_id === user?.id;
                  return (
                    <View
                      key={msg.id}
                      style={[
                        styles.messageWrapper,
                        isMe ? styles.messageWrapperMe : styles.messageWrapperOther,
                      ]}
                    >
                      <View
                        style={[
                          styles.messageBubble,
                          isMe ? styles.messageBubbleMe : styles.messageBubbleOther,
                        ]}
                      >
                        <Text style={[styles.messageText, isMe && styles.messageTextMe]}>
                          {msg.text}
                        </Text>
                        <View style={styles.messageMeta}>
                          <Text style={[styles.messageTime, isMe && styles.messageTimeMe]}>
                            {formatTime(msg.created_at)}
                          </Text>
                          {isMe && (
                            <Ionicons
                              name="checkmark-done"
                              size={14}
                              color={
                                msg.read_by.length > 1
                                  ? Colors.primary
                                  : 'rgba(255,255,255,0.6)'
                              }
                            />
                          )}
                        </View>
                      </View>
                    </View>
                  );
                })
              )}

              {otherTyping && (
                <View style={styles.typingIndicator}>
                  <View style={styles.typingBubble}>
                    <View style={[styles.typingDot, styles.dot1]} />
                    <View style={[styles.typingDot, styles.dot2]} />
                    <View style={[styles.typingDot, styles.dot3]} />
                  </View>
                </View>
              )}
            </ScrollView>
          )}

          {/* Input */}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="add-circle" size={28} color={Colors.primary} />
            </TouchableOpacity>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                placeholderTextColor={Colors.darkGray}
                value={text}
                onChangeText={onChangeText}
                multiline
                onSubmitEditing={handleSend}
              />
              <TouchableOpacity style={styles.emojiButton}>
                <Ionicons name="happy-outline" size={22} color={Colors.gray} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSend}
              disabled={sending || !text.trim()}
            >
              {sending ? (
                <ActivityIndicator color={Colors.white} size="small" />
              ) : (
                <Ionicons name={text ? 'send' : 'mic'} size={20} color={Colors.white} />
              )}
            </TouchableOpacity>
          </View>
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
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(68, 189, 19, 0.1)',
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: { fontSize: fontSize.md, fontWeight: fontWeight.bold, color: Colors.white },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.success },
  statusText: { fontSize: fontSize.xs, color: Colors.success },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  messagesContainer: { padding: spacing.md, paddingBottom: spacing.lg, flexGrow: 1 },
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xxl,
  },
  emptyText: { color: Colors.gray, fontSize: fontSize.sm },
  messageWrapper: { marginBottom: spacing.sm, maxWidth: '80%' },
  messageWrapperMe: { alignSelf: 'flex-end' },
  messageWrapperOther: { alignSelf: 'flex-start' },
  messageBubble: { padding: spacing.md, borderRadius: 18 },
  messageBubbleMe: { backgroundColor: Colors.primary, borderBottomRightRadius: 4 },
  messageBubbleOther: {
    backgroundColor: Colors.secondaryBackground,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(68, 189, 19, 0.1)',
  },
  messageText: { fontSize: fontSize.md, color: Colors.white, marginBottom: 4 },
  messageTextMe: { color: Colors.white },
  messageMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 4 },
  messageTime: { fontSize: fontSize.xs, color: Colors.gray },
  messageTimeMe: { color: 'rgba(255, 255, 255, 0.7)' },
  typingIndicator: { alignSelf: 'flex-start', marginTop: spacing.sm },
  typingBubble: {
    flexDirection: 'row',
    backgroundColor: Colors.secondaryBackground,
    padding: spacing.md,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    gap: 4,
  },
  typingDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.gray },
  dot1: { opacity: 0.4 },
  dot2: { opacity: 0.7 },
  dot3: { opacity: 1 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.sm,
    gap: spacing.sm,
    backgroundColor: Colors.secondaryBackground,
  },
  attachButton: { paddingBottom: 8 },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    minHeight: 44,
    maxHeight: 100,
  },
  input: { flex: 1, color: Colors.white, fontSize: fontSize.md, paddingVertical: 10 },
  emojiButton: { paddingLeft: spacing.sm },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
