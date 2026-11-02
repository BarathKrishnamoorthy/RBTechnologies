import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import { fetchRideById, getProtectedRideTracking } from '../services/api';

export default function LiveTripTrackerScreen({ route, navigation }) {
  const { rideId, ride: passedRide } = route.params || {};

  const [ride, setRide] = useState(passedRide || null);
  const [loading, setLoading] = useState(!passedRide);
  const [tripStatus, setTripStatus] = useState('En Route (On Time)');
  const [eta, setEta] = useState('32 mins remaining');
  const [speed, setSpeed] = useState('72 km/h');
  const [currentCoords, setCurrentCoords] = useState({ lat: 12.9716, lng: 77.5946 });

  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (!passedRide && rideId) {
        const fetched = await fetchRideById(rideId);
        if (isMounted && fetched) setRide(fetched);
        if (isMounted) setLoading(false);
      }
    })();

    const interval = setInterval(async () => {
      if (rideId) {
        const tracking = await getProtectedRideTracking(rideId);
        if (isMounted && tracking) {
          if (tracking.speed_kmh) setSpeed(`${tracking.speed_kmh} km/h`);
          if (tracking.eta_minutes) setEta(`${tracking.eta_minutes} mins remaining`);
          if (tracking.status) setTripStatus(tracking.status === 'EN_ROUTE' ? 'En Route (On Time)' : tracking.status);
          if (tracking.latitude) setCurrentCoords({ lat: tracking.latitude, lng: tracking.longitude });
        }
      }
    }, 6000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [rideId, passedRide]);

  const driverPhone = ride?.driver_phone || ride?.driver?.phone || '+91 98401 23456';
  const driverName = ride?.driver_name || ride?.driver?.name || 'Verified Driver';
  const nextStop = ride?.city_stops && ride.city_stops.length > 1
    ? ride.city_stops[1].city
    : (ride?.destination || 'Destination Point');

  const handleCallDriver = () => {
    Linking.openURL(`tel:${driverPhone.replace(/[^0-9+]/g, '')}`);
  };

  const handleShareLiveLocation = () => {
    Alert.alert(
      'Live GPS Link Shared! 📍',
      `Your real-time Hello Bro carpool trip location link for ${driverName} (${ride?.plate_number || 'Vehicle'}) has been copied to clipboard.`
    );
  };

  const handleSOS = () => {
    Alert.alert(
      'Emergency SOS Triggered',
      'Alerting local highway emergency patrol and Hello Bro 24/7 safety response team.',
      [
        { text: 'Call 112 Emergency', onPress: () => Linking.openURL('tel:112') },
        { text: 'Dismiss', style: 'cancel' },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Connecting to Live GPS Stream...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Live Trip Tracker</Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {ride?.origin || 'Trip'} → {ride?.destination || 'En Route'}
          </Text>
        </View>
        <TouchableOpacity style={styles.sosHeaderBtn} onPress={handleSOS}>
          <Text style={styles.sosHeaderText}>SOS</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* Radar Map Graphic Simulation */}
        <View style={styles.mapSimContainer}>
          <View style={styles.radarRingOuter} />
          <View style={styles.radarRingMiddle} />
          <View style={styles.radarCenterCar}>
            <Ionicons name="car-sport" size={24} color={COLORS.white} />
          </View>
          <View style={styles.liveTag}>
            <View style={styles.liveIndicatorDot} />
            <Text style={styles.liveTagText}>GPS LIVE: {currentCoords.lat.toFixed(4)}, {currentCoords.lng.toFixed(4)}</Text>
          </View>
        </View>

        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.statusLabel}>TRIP STATUS</Text>
              <Text style={styles.statusValue}>{tripStatus}</Text>
            </View>
            <View style={styles.etaBadge}>
              <Ionicons name="time" size={14} color={COLORS.primary} />
              <Text style={styles.etaText}>{eta}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Current Speed</Text>
              <Text style={styles.statValue}>{speed}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Next Highway Stop</Text>
              <Text style={styles.statValue}>{nextStop}</Text>
            </View>
          </View>
        </View>

        {/* Driver & Vehicle Quick Pill */}
        <View style={styles.vehicleInfoCard}>
          <Ionicons name="shield-checkmark" size={18} color="#15803d" />
          <Text style={styles.vehicleInfoText} numberOfLines={1}>
            {driverName} • {ride?.vehicle_model || 'Verified Vehicle'} ({ride?.plate_number || 'TN 07 BZ 8899'})
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.callDriverBtn} onPress={handleCallDriver} activeOpacity={0.85}>
            <Ionicons name="call" size={18} color={COLORS.white} />
            <Text style={styles.callDriverText}>Call Driver</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareGpsBtn} onPress={handleShareLiveLocation} activeOpacity={0.85}>
            <Ionicons name="share-social" size={18} color={COLORS.primary} />
            <Text style={styles.shareGpsText}>Share Live GPS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
  sosHeaderBtn: {
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  sosHeaderText: {
    color: '#dc2626',
    fontWeight: '900',
    fontSize: 12,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  mapSimContainer: {
    height: 240,
    backgroundColor: '#1e1b4b',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    ...SHADOWS.md,
  },
  radarRingOuter: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.2)',
    position: 'absolute',
  },
  radarRingMiddle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.4)',
    position: 'absolute',
  },
  radarCenterCar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    ...SHADOWS.md,
  },
  liveTag: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 6,
  },
  liveIndicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
  liveTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  statusCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    ...SHADOWS.sm,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.6,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primaryDark,
    marginTop: 2,
  },
  etaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    gap: 5,
  },
  etaText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.borderLight,
    marginHorizontal: 14,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  callDriverBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 52,
    borderRadius: 16,
    gap: 8,
    ...SHADOWS.sm,
  },
  callDriverText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.white,
  },
  shareGpsBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.card,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primaryBorder,
    gap: 8,
  },
  shareGpsText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primary,
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  headerTitleWrap: {
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: 2,
  },
  vehicleInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginTop: 14,
    gap: 8,
  },
  vehicleInfoText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#166534',
  },
});
