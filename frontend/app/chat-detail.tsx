import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';

const MOCK_MESSAGES = [
  { id: '1', text: 'Hi! I saw your job posting', isMe: false, time: '10:30 AM' },
  { id: '2', text: 'Hello! Yes, I need help with the electrical work', isMe: true, time: '10:32 AM' },
  { id: '3', text: 'I can do it today. What time works for you?', isMe: false, time: '10:33 AM' },
  { id: '4', text: 'Around 3 PM would be perfect', isMe: true, time: '10:35 AM' },
  { id: '5', text: 'Great! I am on the way! 🚗', isMe: false, time: '10:40 AM' },
];

export default function ChatDetailScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name: string }>();
  const [message, setMessage] = useState('');

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
                <Text style={styles.userName}>{name || 'John Doe'}</Text>
                <View style={styles.statusRow}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.statusText}>Online</Text>
                </View>
              </View>
            </View>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="call" size={22} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <ScrollView contentContainerStyle={styles.messagesContainer} showsVerticalScrollIndicator={false}>
            <View style={styles.dateBadge}>
              <Text style={styles.dateText}>Today</Text>
            </View>

            {MOCK_MESSAGES.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageWrapper,
                  msg.isMe ? styles.messageWrapperMe : styles.messageWrapperOther,
                ]}
              >
                <View
                  style={[
                    styles.messageBubble,
                    msg.isMe ? styles.messageBubbleMe : styles.messageBubbleOther,
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    msg.isMe && styles.messageTextMe,
                  ]}>{msg.text}</Text>
                  <View style={styles.messageMeta}>
                    <Text style={[
                      styles.messageTime,
                      msg.isMe && styles.messageTimeMe,
                    ]}>{msg.time}</Text>
                    {msg.isMe && (
                      <Ionicons name="checkmark-done" size={14} color={Colors.primary} />
                    )}
                  </View>
                </View>
              </View>
            ))}

            <View style={styles.typingIndicator}>
              <View style={styles.typingBubble}>
                <View style={[styles.typingDot, styles.dot1]} />
                <View style={[styles.typingDot, styles.dot2]} />
                <View style={[styles.typingDot, styles.dot3]} />
              </View>
            </View>
          </ScrollView>

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
                value={message}
                onChangeText={setMessage}
                multiline
              />
              <TouchableOpacity style={styles.emojiButton}>
                <Ionicons name="happy-outline" size={22} color={Colors.gray} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.sendButton}>
              <Ionicons name={message ? 'send' : 'mic'} size={20} color={Colors.white} />
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
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  statusText: {
    fontSize: fontSize.xs,
    color: Colors.success,
  },
  messagesContainer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  dateBadge: {
    alignSelf: 'center',
    backgroundColor: Colors.secondaryBackground,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginBottom: spacing.md,
  },
  dateText: {
    color: Colors.gray,
    fontSize: fontSize.xs,
  },
  messageWrapper: {
    marginBottom: spacing.sm,
    maxWidth: '80%',
  },
  messageWrapperMe: {
    alignSelf: 'flex-end',
  },
  messageWrapperOther: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: spacing.md,
    borderRadius: 18,
  },
  messageBubbleMe: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  messageBubbleOther: {
    backgroundColor: Colors.secondaryBackground,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(68, 189, 19, 0.1)',
  },
  messageText: {
    fontSize: fontSize.md,
    color: Colors.white,
    marginBottom: 4,
  },
  messageTextMe: {
    color: Colors.white,
  },
  messageMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
  },
  messageTime: {
    fontSize: fontSize.xs,
    color: Colors.gray,
  },
  messageTimeMe: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  typingIndicator: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
  typingBubble: {
    flexDirection: 'row',
    backgroundColor: Colors.secondaryBackground,
    padding: spacing.md,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.gray,
  },
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
  attachButton: {
    paddingBottom: 8,
  },
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
  input: {
    flex: 1,
    color: Colors.white,
    fontSize: fontSize.md,
    paddingVertical: 10,
  },
  emojiButton: {
    paddingLeft: spacing.sm,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
