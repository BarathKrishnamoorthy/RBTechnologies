import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import RideCard from '../components/RideCard';
import { getUserRideHistory } from '../services/api';

export default function RideHistoryScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('upcoming'); // 'upcoming' | 'completed'
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {
    try {
      const data = await getUserRideHistory();
      setTrips(data || []);
    } catch {}
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const upcomingTrips = trips.filter((t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED');
  const pastTrips = trips.filter((t) => t.status === 'COMPLETED' || t.status === 'CANCELLED');
  const displayedTrips = activeFilter === 'upcoming' ? upcomingTrips : pastTrips;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Trips</Text>
        <Text style={styles.headerSub}>Manage your Hello Bro bookings & shared rides</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeFilter === 'upcoming' && styles.tabActive]}
          onPress={() => setActiveFilter('upcoming')}
        >
          <Text style={[styles.tabText, activeFilter === 'upcoming' && styles.tabTextActive]}>
            Upcoming ({upcomingTrips.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeFilter === 'completed' && styles.tabActive]}
          onPress={() => setActiveFilter('completed')}
        >
          <Text style={[styles.tabText, activeFilter === 'completed' && styles.tabTextActive]}>
            Past Trips ({pastTrips.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading your trips...</Text>
        </View>
      ) : (
        <FlatList
          data={displayedTrips}
          keyExtractor={(item) => item.id || item.booking_id || String(Math.random())}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="car-outline" size={36} color={COLORS.primary} />
              </View>
              <Text style={styles.emptyTitle}>
                {activeFilter === 'upcoming' ? 'No Upcoming Trips' : 'No Past Trips Yet'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {activeFilter === 'upcoming'
                  ? 'Book a co-traveler seat or publish your route to save money.'
                  : 'Completed journeys with Hello Bro will appear here.'}
              </Text>
              <TouchableOpacity
                style={styles.findRideBtn}
                onPress={() => navigation.navigate('SearchTab')}
              >
                <Text style={styles.findRideText}>Find a Ride</Text>
              </TouchableOpacity>
            </View>
          }
          renderItem={({ item }) => (
            <RideCard
              ride={item}
              onPress={() => navigation.navigate('RideDetail', { rideId: item.id || item.ride_id })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
  },
  headerSub: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.background,
  },
  tabActive: {
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primaryDark,
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  findRideBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
    ...SHADOWS.sm,
  },
  findRideText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '800',
  },
});
