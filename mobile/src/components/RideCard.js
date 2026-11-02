import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';

export default function RideCard({ ride, onPress }) {
  const getVehicleIcon = (type) => {
    if (type === 'bike') return <MaterialCommunityIcons name="motorbike" size={16} color={COLORS.primary} />;
    if (type === 'van') return <FontAwesome5 name="shuttle-van" size={14} color={COLORS.primary} />;
    return <Ionicons name="car-sport" size={16} color={COLORS.primary} />;
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      {/* Top Bar: Driver & Badges */}
      <View style={styles.topRow}>
        <View style={styles.driverInfo}>
          <Image
            source={{ uri: ride.driver_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }}
            style={styles.avatar}
          />
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.driverName}>{ride.driver_name}</Text>
              <MaterialCommunityIcons name="check-decagram" size={14} color={COLORS.primary} />
            </View>
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={12} color="#f59e0b" />
              <Text style={styles.ratingText}>{ride.driver_rating || '4.9'} ({ride.rides_count || 48})</Text>
            </View>
          </View>
        </View>

        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>per seat</Text>
          <Text style={styles.priceValue}>₹{ride.price}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Middle: Route & Times */}
      <View style={styles.routeContainer}>
        {/* Timeline dots & line */}
        <View style={styles.timelineCol}>
          <View style={[styles.timelineDot, { backgroundColor: COLORS.primary }]} />
          <View style={styles.timelineLine} />
          <View style={[styles.timelineDot, { backgroundColor: COLORS.secondary }]} />
        </View>

        {/* Route Details */}
        <View style={styles.stopsCol}>
          {/* Pickup */}
          <View style={styles.stopRow}>
            <View style={styles.stopTextGroup}>
              <Text style={styles.cityName}>{ride.origin}</Text>
              <Text style={styles.stopAddress} numberOfLines={1}>{ride.origin_address || `${ride.origin} Pickup Point`}</Text>
            </View>
            <Text style={styles.timeText}>{ride.departure_time}</Text>
          </View>

          {/* En-route duration badge */}
          <View style={styles.durationRow}>
            <View style={styles.durationBadge}>
              <Ionicons name="time-outline" size={12} color={COLORS.primaryDark} />
              <Text style={styles.durationText}>{ride.duration || '3h 30m'}</Text>
            </View>
            {ride.city_stops && ride.city_stops.length > 2 && (
              <Text style={styles.stopsCountText}>
                +{ride.city_stops.length - 2} intermediate stops
              </Text>
            )}
          </View>

          {/* Dropoff */}
          <View style={styles.stopRow}>
            <View style={styles.stopTextGroup}>
              <Text style={styles.cityName}>{ride.destination}</Text>
              <Text style={styles.stopAddress} numberOfLines={1}>{ride.destination_address || `${ride.destination} Center`}</Text>
            </View>
            <Text style={styles.timeText}>{ride.arrival_time}</Text>
          </View>
        </View>
      </View>

      {/* Bottom Bar: Vehicle & Features */}
      <View style={styles.bottomRow}>
        <View style={styles.vehiclePill}>
          {getVehicleIcon(ride.vehicle_type)}
          <Text style={styles.vehicleText}>{ride.vehicle_model || 'Sedan (AC)'}</Text>
        </View>

        <View style={styles.rightBadges}>
          {ride.instant_booking && (
            <View style={styles.instantPill}>
              <Ionicons name="flash" size={11} color="#f59e0b" />
              <Text style={styles.instantText}>Instant</Text>
            </View>
          )}

          <View style={styles.seatsPill}>
            <Ionicons name="people" size={12} color={COLORS.primaryDark} />
            <Text style={styles.seatsText}>{ride.seats_available} left</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    ...SHADOWS.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  driverInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.textMuted,
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 12,
  },
  routeContainer: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  timelineCol: {
    alignItems: 'center',
    width: 20,
    paddingVertical: 4,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  stopsCol: {
    flex: 1,
    marginLeft: 8,
  },
  stopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stopTextGroup: {
    flex: 1,
    marginRight: 8,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  stopAddress: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 1,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  durationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 8,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  durationText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  stopsCountText: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  vehiclePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    maxWidth: '55%',
  },
  vehicleText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.text,
  },
  rightBadges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  instantPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
    gap: 3,
  },
  instantText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#b45309',
  },
  seatsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  seatsText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
});
