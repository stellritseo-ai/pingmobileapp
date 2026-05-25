import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/src/constants/Colors';
import { fontSize, fontWeight, spacing, borderRadius } from '@/src/constants/theme';
import { GlassCard } from '@/src/components/ui/GlassCard';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { jobsAPI, offersAPI } from '@/src/services/api';
import { useAuthStore } from '@/src/store/authStore';

export default function JobDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuthStore();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [showCounterModal, setShowCounterModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [offerPrice, setOfferPrice] = useState('');
  const [offerMessage, setOfferMessage] = useState('');

  const isOwner = data?.job?.user_id === user?.id;
  const isWorker = user?.role === 'individual_worker';
  const myOffer = data?.offers?.find((o: any) => o.worker_id === user?.id);

  useEffect(() => {
    loadJob();
  }, [id]);

  const loadJob = async () => {
    if (!id) return;
    try {
      const response = await jobsAPI.getJob(id);
      setData(response);
    } catch (error) {
      Alert.alert('Error', 'Failed to load job');
    } finally {
      setLoading(false);
    }
  };

  const handleMakeOffer = async () => {
    if (!offerPrice || !user?.id) return;
    setActionLoading(true);
    try {
      await offersAPI.createOffer(id!, user.id, {
        proposed_price: parseFloat(offerPrice),
        message: offerMessage,
      });
      Alert.alert('Offer Sent! 🎉', 'Your offer has been submitted');
      setShowOfferModal(false);
      setOfferPrice('');
      setOfferMessage('');
      loadJob();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to send offer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAccept = async (offerId: string) => {
    setActionLoading(true);
    try {
      await offersAPI.acceptOffer(offerId);
      Alert.alert('Offer Accepted! 🎉', 'The worker has been notified');
      loadJob();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.detail || 'Failed to accept offer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (offerId: string) => {
    setActionLoading(true);
    try {
      await offersAPI.rejectOffer(offerId);
      loadJob();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to reject offer');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCounterSubmit = async () => {
    if (!selectedOffer || !offerPrice) return;
    setActionLoading(true);
    try {
      await offersAPI.counterOffer(selectedOffer.id, {
        counter_offer_price: parseFloat(offerPrice),
        counter_offer_message: offerMessage,
      });
      Alert.alert('Counter Offer Sent', 'The worker will be notified');
      setShowCounterModal(false);
      setSelectedOffer(null);
      setOfferPrice('');
      setOfferMessage('');
      loadJob();
    } catch (error: any) {
      Alert.alert('Error', 'Failed to send counter offer');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
        <SafeAreaView style={styles.centerContent}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!data?.job) {
    return (
      <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
        <SafeAreaView style={styles.centerContent}>
          <Text style={styles.errorText}>Job not found</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const { job, offers } = data;

  return (
    <LinearGradient colors={[Colors.background, Colors.darkForest]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Job Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Job Info Card */}
          <GlassCard intensity={20} style={styles.mainCard}>
            <View style={styles.jobHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobCategory}>{job.category}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{job.status.toUpperCase()}</Text>
              </View>
            </View>

            <Text style={styles.description}>{job.description}</Text>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Ionicons name="cash" size={20} color={Colors.primary} />
                <View>
                  <Text style={styles.statLabel}>Budget</Text>
                  <Text style={styles.statValue}>${job.budget}</Text>
                </View>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="time" size={20} color={Colors.primary} />
                <View>
                  <Text style={styles.statLabel}>Duration</Text>
                  <Text style={styles.statValue}>{job.estimated_duration}</Text>
                </View>
              </View>
            </View>

            <View style={styles.locationRow}>
              <Ionicons name="location" size={20} color={Colors.gray} />
              <Text style={styles.locationText}>{job.location}</Text>
            </View>

            {job.photos && job.photos.length > 0 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosRow}>
                {job.photos.map((photo: string, idx: number) => (
                  <Image key={idx} source={{ uri: photo }} style={styles.photo} />
                ))}
              </ScrollView>
            )}

            {job.final_price && (
              <View style={styles.finalPriceCard}>
                <Text style={styles.finalPriceLabel}>Final Price</Text>
                <Text style={styles.finalPriceValue}>${job.final_price}</Text>
              </View>
            )}
          </GlassCard>

          {/* Worker Action: Make Offer */}
          {isWorker && !isOwner && !myOffer && job.status === 'open' && (
            <Button
              title="Make an Offer"
              onPress={() => setShowOfferModal(true)}
              size="large"
              style={{ marginBottom: spacing.lg }}
            />
          )}

          {isWorker && !isOwner && job.status === 'negotiating' && !myOffer && (
            <Button
              title="Make an Offer"
              onPress={() => setShowOfferModal(true)}
              size="large"
              style={{ marginBottom: spacing.lg }}
            />
          )}

          {/* Offers Section */}
          {offers && offers.length > 0 && (
            <View style={styles.offersSection}>
              <Text style={styles.sectionTitle}>
                {isOwner ? `Offers (${offers.length})` : 'Your Offer'}
              </Text>

              {offers.map((offer: any) => {
                const isMyOffer = offer.worker_id === user?.id;
                if (!isOwner && !isMyOffer) return null;

                return (
                  <GlassCard key={offer.id} intensity={20} style={styles.offerCard}>
                    <View style={styles.offerHeader}>
                      <View style={styles.workerInfo}>
                        <View style={styles.workerAvatar}>
                          <Ionicons name="person" size={20} color={Colors.primary} />
                        </View>
                        <View>
                          <Text style={styles.workerName}>{offer.worker_name}</Text>
                          <View style={styles.ratingRow}>
                            <Ionicons name="star" size={12} color={Colors.warning} />
                            <Text style={styles.ratingText}>{offer.worker_rating}</Text>
                          </View>
                        </View>
                      </View>
                      <View style={[
                        styles.offerStatusBadge,
                        offer.status === 'accepted' && styles.acceptedBadge,
                        offer.status === 'rejected' && styles.rejectedBadge,
                        offer.status === 'counter_offered' && styles.counterBadge,
                      ]}>
                        <Text style={styles.offerStatusText}>
                          {offer.status.replace('_', ' ').toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.priceComparisonRow}>
                      <View style={styles.priceItem}>
                        <Text style={styles.priceLabel}>Job Budget</Text>
                        <Text style={styles.priceValue}>${job.budget}</Text>
                      </View>
                      <Ionicons name="arrow-forward" size={20} color={Colors.gray} />
                      <View style={styles.priceItem}>
                        <Text style={styles.priceLabel}>Offer</Text>
                        <Text style={[styles.priceValue, styles.offerPriceText]}>
                          ${offer.proposed_price}
                        </Text>
                      </View>
                    </View>

                    {offer.message && (
                      <View style={styles.messageBox}>
                        <Text style={styles.messageText}>{offer.message}</Text>
                      </View>
                    )}

                    {offer.counter_offer_price && (
                      <View style={styles.counterOfferBox}>
                        <Text style={styles.counterLabel}>Counter Offer:</Text>
                        <Text style={styles.counterPrice}>${offer.counter_offer_price}</Text>
                        {offer.counter_offer_message && (
                          <Text style={styles.counterMessage}>{offer.counter_offer_message}</Text>
                        )}
                      </View>
                    )}

                    {/* Owner Actions */}
                    {isOwner && offer.status === 'pending' && (
                      <View style={styles.actionRow}>
                        <Button
                          title="Accept"
                          onPress={() => handleAccept(offer.id)}
                          size="small"
                          style={{ flex: 1 }}
                          loading={actionLoading}
                        />
                        <Button
                          title="Counter"
                          onPress={() => {
                            setSelectedOffer(offer);
                            setOfferPrice(offer.proposed_price.toString());
                            setShowCounterModal(true);
                          }}
                          variant="outline"
                          size="small"
                          style={{ flex: 1 }}
                        />
                        <TouchableOpacity
                          style={styles.rejectButton}
                          onPress={() => handleReject(offer.id)}
                        >
                          <Ionicons name="close" size={20} color={Colors.error} />
                        </TouchableOpacity>
                      </View>
                    )}

                    {/* Worker Actions for Counter Offer */}
                    {isMyOffer && offer.status === 'counter_offered' && (
                      <View style={styles.actionRow}>
                        <Button
                          title={`Accept $${offer.counter_offer_price}`}
                          onPress={() => handleAccept(offer.id)}
                          size="small"
                          style={{ flex: 1 }}
                          loading={actionLoading}
                        />
                        <Button
                          title="Reject"
                          onPress={() => handleReject(offer.id)}
                          variant="outline"
                          size="small"
                          style={{ flex: 1 }}
                        />
                      </View>
                    )}
                  </GlassCard>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Make Offer Modal */}
        <Modal
          visible={showOfferModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowOfferModal(false)}
        >
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContainer}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>Make Your Offer</Text>
                <Text style={styles.modalSubtitle}>
                  Job budget: <Text style={styles.modalHighlight}>${job.budget}</Text>
                </Text>

                <Input
                  label="Your Price ($)"
                  placeholder="Enter your price"
                  value={offerPrice}
                  onChangeText={setOfferPrice}
                  leftIcon="cash"
                  keyboardType="numeric"
                />

                <Input
                  label="Message (Optional)"
                  placeholder="Add a message to the customer..."
                  value={offerMessage}
                  onChangeText={setOfferMessage}
                  leftIcon="chatbox"
                  multiline
                />

                <View style={styles.modalActions}>
                  <Button
                    title="Cancel"
                    onPress={() => setShowOfferModal(false)}
                    variant="outline"
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Send Offer"
                    onPress={handleMakeOffer}
                    loading={actionLoading}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>

        {/* Counter Offer Modal */}
        <Modal
          visible={showCounterModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowCounterModal(false)}
        >
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={styles.modalContainer}
            >
              <View style={styles.modalContent}>
                <View style={styles.modalHandle} />
                <Text style={styles.modalTitle}>Counter Offer</Text>
                <Text style={styles.modalSubtitle}>
                  Worker proposed: <Text style={styles.modalHighlight}>${selectedOffer?.proposed_price}</Text>
                </Text>

                <Input
                  label="Your Counter Price ($)"
                  placeholder="Enter counter price"
                  value={offerPrice}
                  onChangeText={setOfferPrice}
                  leftIcon="cash"
                  keyboardType="numeric"
                />

                <Input
                  label="Message (Optional)"
                  placeholder="Add a message..."
                  value={offerMessage}
                  onChangeText={setOfferMessage}
                  leftIcon="chatbox"
                  multiline
                />

                <View style={styles.modalActions}>
                  <Button
                    title="Cancel"
                    onPress={() => setShowCounterModal(false)}
                    variant="outline"
                    style={{ flex: 1 }}
                  />
                  <Button
                    title="Send Counter"
                    onPress={handleCounterSubmit}
                    loading={actionLoading}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </Modal>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  centerContent: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: Colors.white, fontSize: fontSize.lg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  backButton: { padding: spacing.sm },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  mainCard: {
    marginBottom: spacing.lg,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  jobTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    marginBottom: 4,
  },
  jobCategory: {
    fontSize: fontSize.sm,
    color: Colors.primary,
    fontWeight: fontWeight.medium,
    textTransform: 'capitalize',
  },
  statusBadge: {
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: Colors.primary,
  },
  description: {
    fontSize: fontSize.md,
    color: Colors.lightGray,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginBottom: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: Colors.gray,
  },
  statValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  locationText: {
    fontSize: fontSize.sm,
    color: Colors.lightGray,
  },
  photosRow: {
    marginTop: spacing.md,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: borderRadius.md,
    marginRight: spacing.sm,
  },
  finalPriceCard: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: 'rgba(68, 189, 19, 0.15)',
    borderRadius: borderRadius.md,
    alignItems: 'center',
  },
  finalPriceLabel: {
    fontSize: fontSize.sm,
    color: Colors.gray,
    marginBottom: 4,
  },
  finalPriceValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: Colors.primary,
  },
  offersSection: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    marginBottom: spacing.md,
  },
  offerCard: {
    marginBottom: spacing.md,
  },
  offerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  workerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  workerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(68, 189, 19, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workerName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: fontSize.xs,
    color: Colors.gray,
  },
  offerStatusBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  acceptedBadge: { backgroundColor: 'rgba(16, 185, 129, 0.2)' },
  rejectedBadge: { backgroundColor: 'rgba(239, 68, 68, 0.2)' },
  counterBadge: { backgroundColor: 'rgba(68, 189, 19, 0.2)' },
  offerStatusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: Colors.warning,
  },
  priceComparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  priceItem: { flex: 1, alignItems: 'center' },
  priceLabel: {
    fontSize: fontSize.xs,
    color: Colors.gray,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: Colors.white,
  },
  offerPriceText: {
    color: Colors.primary,
  },
  messageBox: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
  },
  messageText: {
    fontSize: fontSize.sm,
    color: Colors.lightGray,
    fontStyle: 'italic',
  },
  counterOfferBox: {
    backgroundColor: 'rgba(68, 189, 19, 0.1)',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  counterLabel: {
    fontSize: fontSize.xs,
    color: Colors.gray,
    marginBottom: 4,
  },
  counterPrice: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: Colors.primary,
    marginBottom: 4,
  },
  counterMessage: {
    fontSize: fontSize.sm,
    color: Colors.lightGray,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  rejectButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.secondaryBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  modalContent: {},
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.darkGray,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: Colors.white,
    marginBottom: spacing.sm,
  },
  modalSubtitle: {
    fontSize: fontSize.md,
    color: Colors.gray,
    marginBottom: spacing.lg,
  },
  modalHighlight: {
    color: Colors.primary,
    fontWeight: fontWeight.semibold,
  },
  modalActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
});
