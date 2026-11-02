import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import { fetchRideById, bookRide } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RideDetailScreen({ route, navigation }) {
  const { rideId } = route.params || {};
  const { user } = useAuth();

  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchRideById(rideId);
      setRide(data);
      setLoading(false);
    })();
  }, [rideId]);

  const handleBooking = async () => {
    setBookingLoading(true);
    try {
      const res = await bookRide(ride.id, {
        passenger_name: user?.name || 'Verified Traveler',
        passenger_phone: user?.phone || '+91 98400 12345',
        seats: seatsToBook,
      });

      Alert.alert(
        'Booking Confirmed! 🎉',
        `Your ${seatsToBook} seat(s) on ${ride.origin} → ${ride.destination} have been reserved. Driver ${ride.driver_name} has been notified.`,
        [
          {
            text: 'Track Trip Live',
            onPress: () => navigation.navigate('LiveTracker', { rideId: ride.id }),
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch {
      Alert.alert('Booking Error', 'Could not complete booking. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || !ride) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const totalPrice = ride.price * seatsToBook;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trip Details</Text>
        <TouchableOpacity style={styles.shareBtn} onPress={() => Alert.alert('Share', `Check out this carpool ride from ${ride.origin} to ${ride.destination} on RB Rides!`)}>
          <Ionicons name="share-social-outline" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Date & Pricing Banner */}
        <View style={styles.dateBanner}>
          <View>
            <Text style={styles.bannerDateLabel}>DEPARTURE DATE</Text>
            <Text style={styles.bannerDateValue}>{ride.departure_date || 'Today'}</Text>
          </View>
          <View style={styles.bannerPriceGroup}>
            <Text style={styles.bannerPriceValue}>₹{ride.price}</Text>
            <Text style={styles.bannerPriceLabel}>per seat</Text>
          </View>
        </View>

        {/* Route Timeline Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>Route Itinerary</Text>

          <View style={styles.itineraryContainer}>
            {/* Origin */}
            <View style={styles.itineraryStop}>
              <View style={[styles.dot, { backgroundColor: COLORS.primary }]} />
              <View style={styles.stopInfo}>
                <View style={styles.stopHeader}>
                  <Text style={styles.cityName}>{ride.origin}</Text>
                  <Text style={styles.timeBadge}>{ride.departure_time}</Text>
                </View>
                <Text style={styles.addressText}>{ride.origin_address || `${ride.origin} Main Station`}</Text>
              </View>
            </View>

            {/* Intermediate Stops */}
            {ride.city_stops && ride.city_stops.slice(1, -1).map((s, idx) => (
              <View key={idx} style={styles.itineraryStop}>
                <View style={[styles.dot, { backgroundColor: COLORS.warning }]} />
                <View style={styles.stopInfo}>
                  <Text style={styles.intermediateCity}>{s.city}</Text>
                  <Text style={styles.intermediateDist}>{s.distance_km} km from start</Text>
                </View>
              </View>
            ))}

            {/* Destination */}
            <View style={styles.itineraryStop}>
              <View style={[styles.dot, { backgroundColor: COLORS.secondary }]} />
              <View style={styles.stopInfo}>
                <View style={styles.stopHeader}>
                  <Text style={styles.cityName}>{ride.destination}</Text>
                  <Text style={styles.timeBadge}>{ride.arrival_time}</Text>
                </View>
                <Text style={styles.addressText}>{ride.destination_address || `${ride.destination} Center`}</Text>
              </View>
            </View>
          </View>

          <View style={styles.durationChip}>
            <Ionicons name="time" size={14} color={COLORS.primary} />
            <Text style={styles.durationChipText}>Total Duration: {ride.duration || '3h 30m'}</Text>
          </View>
        </View>

        {/* Driver Profile Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>Your Driver</Text>
          <View style={styles.driverRow}>
            <Image
              source={{ uri: ride.driver_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }}
              style={styles.driverAvatar}
            />
            <View style={styles.driverTextDetails}>
              <View style={styles.driverNameRow}>
                <Text style={styles.driverName}>{ride.driver_name}</Text>
                <MaterialCommunityIcons name="check-decagram" size={18} color={COLORS.primary} />
              </View>
              <Text style={styles.verifiedText}>Aadhaar &amp; Driving License Verified</Text>
              <View style={styles.driverRating}>
                <Ionicons name="star" size={14} color="#f59e0b" />
                <Text style={styles.ratingNumber}>{ride.driver_rating || '4.9'}</Text>
                <Text style={styles.ratingCount}>&bull; {ride.rides_count || 48} rides completed</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Vehicle & Amenities Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTitle}>Vehicle &amp; Amenities</Text>
          <View style={styles.vehicleDetailsRow}>
            <View style={styles.vehicleIconCircle}>
              <Ionicons name="car-sport" size={22} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.vehicleModel}>{ride.vehicle_model || 'Innova Crysta (White)'}</Text>
              <Text style={styles.plateText}>{ride.plate_number || 'TN 07 BZ 8899'}</Text>
            </View>
          </View>

          <View style={styles.amenitiesGrid}>
            <View style={styles.amenityBadge}>
              <Ionicons name="snow" size={14} color={COLORS.primary} />
              <Text style={styles.amenityText}>Air Conditioned</Text>
            </View>
            <View style={styles.amenityBadge}>
              <Ionicons name="briefcase" size={14} color={COLORS.primary} />
              <Text style={styles.amenityText}>Luggage Space</Text>
            </View>
            {ride.max_2_in_back && (
              <View style={styles.amenityBadge}>
                <Ionicons name="people" size={14} color={COLORS.primary} />
                <Text style={styles.amenityText}>Max 2 in Back</Text>
              </View>
            )}
            <View style={styles.amenityBadge}>
              <Ionicons name="shield-checkmark" size={14} color={COLORS.accent} />
              <Text style={styles.amenityText}>Verified Travel</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Booking Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.seatsCounterGroup}>
          <Text style={styles.seatsCountLabel}>Seats to book</Text>
          <View style={styles.seatsCounter}>
            <TouchableOpacity
              style={styles.seatBtn}
              onPress={() => setSeatsToBook(Math.max(1, seatsToBook - 1))}
            >
              <Ionicons name="remove" size={16} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.seatCountValue}>{seatsToBook}</Text>
            <TouchableOpacity
              style={styles.seatBtn}
              onPress={() => setSeatsToBook(Math.min(ride.seats_available, seatsToBook + 1))}
            >
              <Ionicons name="add" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.bookButton}
          onPress={handleBooking}
          disabled={bookingLoading || ride.seats_available === 0}
          activeOpacity={0.85}
        >
          {bookingLoading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <>
              <Text style={styles.bookBtnText}>
                {ride.seats_available === 0 ? 'Sold Out' : `Book for ₹${totalPrice}`}
              </Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.text,
  },
  shareBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  dateBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    padding: 18,
    borderRadius: 20,
    marginBottom: 14,
    ...SHADOWS.md,
  },
  bannerDateLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#ddd6fe',
    letterSpacing: 0.8,
  },
  bannerDateValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
    marginTop: 2,
  },
  bannerPriceGroup: {
    alignItems: 'flex-end',
  },
  bannerPriceValue: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.white,
  },
  bannerPriceLabel: {
    fontSize: 11,
    color: '#ddd6fe',
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    ...SHADOWS.sm,
  },
  cardHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
  },
  itineraryContainer: {
    paddingLeft: 6,
    gap: 16,
  },
  itineraryStop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  stopInfo: {
    flex: 1,
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  timeBadge: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  addressText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  intermediateCity: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  intermediateDist: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  durationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 14,
    gap: 6,
    alignSelf: 'flex-start',
  },
  durationChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  driverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  driverAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  driverTextDetails: {
    flex: 1,
  },
  driverNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  driverName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  verifiedText: {
    fontSize: 11,
    color: COLORS.accent,
    fontWeight: '700',
    marginTop: 1,
  },
  driverRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  ratingNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.text,
  },
  ratingCount: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  vehicleDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  vehicleIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleModel: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  plateText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginTop: 1,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  amenityText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...SHADOWS.lg,
  },
  seatsCounterGroup: {
    alignItems: 'center',
  },
  seatsCountLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  seatsCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
  },
  seatBtn: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatCountValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  bookButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 50,
    borderRadius: 16,
    gap: 6,
    ...SHADOWS.md,
  },
  bookBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
});
