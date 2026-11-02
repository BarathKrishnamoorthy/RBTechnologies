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
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import RideCard from '../components/RideCard';
import { fetchRides } from '../services/api';

const VEHICLE_FILTERS = [
  { id: 'all', label: 'All Rides', icon: 'grid-outline' },
  { id: 'car', label: 'Cars', icon: 'car-sport' },
  { id: 'bike', label: 'Bikes', icon: 'bicycle' },
  { id: 'van', label: 'Vans / Groups', icon: 'bus' },
];

export default function SearchRidesScreen({ route, navigation }) {
  const params = route.params || {};
  const origin = params.origin || 'Chennai';
  const destination = params.destination || 'Bengaluru';

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const loadRides = async (vehicleType = selectedFilter) => {
    setLoading(true);
    try {
      const results = await fetchRides({
        origin,
        destination,
        vehicle_type: vehicleType,
      });
      setRides(results);
    } catch {}
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadRides(selectedFilter);
  }, [origin, destination, selectedFilter]);

  const onRefresh = () => {
    setRefreshing(true);
    loadRides();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Search Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.routePill}>
            <Text style={styles.routeText} numberOfLines={1}>
              {origin}
            </Text>
            <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
            <Text style={styles.routeText} numberOfLines={1}>
              {destination}
            </Text>
          </View>
          <Text style={styles.subText}>Showing available verified co-travelers</Text>
        </View>

        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => navigation.navigate('HomeTab')}
        >
          <Ionicons name="search" size={18} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Vehicle Type Filter Pills */}
      <View style={styles.filterScrollContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={VEHICLE_FILTERS}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isSelected = selectedFilter === item.id;
            return (
              <TouchableOpacity
                style={[styles.filterChip, isSelected && styles.filterChipActive]}
                onPress={() => setSelectedFilter(item.id)}
              >
                <Ionicons
                  name={item.icon}
                  size={14}
                  color={isSelected ? COLORS.white : COLORS.textSecondary}
                />
                <Text style={[styles.filterLabel, isSelected && styles.filterLabelActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Ride Results List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Fetching available rides...</Text>
        </View>
      ) : (
        <FlatList
          data={rides}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
          renderItem={({ item }) => (
            <RideCard
              ride={item}
              onPress={() => navigation.navigate('RideDetail', { rideId: item.id })}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="car-outline" size={44} color={COLORS.primary} />
              </View>
              <Text style={styles.emptyTitle}>No exact rides found</Text>
              <Text style={styles.emptySubtitle}>
                No drivers currently scheduled from {origin} to {destination}.
              </Text>
              <TouchableOpacity
                style={styles.publishPromptBtn}
                onPress={() => navigation.navigate('PublishTab', { screen: 'PublishRide', params: { origin, destination } })}
              >
                <Ionicons name="add-circle" size={18} color={COLORS.white} />
                <Text style={styles.publishPromptText}>Be the First to Offer a Ride</Text>
              </TouchableOpacity>
            </View>
          }
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  routePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  routeText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  subText: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
  filterBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterScrollContainer: {
    paddingVertical: 10,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  filterLabelActive: {
    color: COLORS.white,
  },
  listContent: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 10,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  publishPromptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 20,
    gap: 8,
    ...SHADOWS.md,
  },
  publishPromptText: {
    color: COLORS.white,
    fontWeight: '800',
    fontSize: 14,
  },
});
