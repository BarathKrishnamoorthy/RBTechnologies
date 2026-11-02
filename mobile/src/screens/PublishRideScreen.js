import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import CityAutocompleteModal from '../components/CityAutocompleteModal';
import { publishRide } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getCityCoordinates, calculateRoadDistanceKm } from '../services/mapApi';

const VEHICLE_CONFIGS = {
  car: {
    label: 'Car / Sedan',
    icon: 'car-sport',
    defaultSeats: 3,
    defaultPricePerKm: 1.2,
    defaultModel: 'Honda City (White)',
  },
  bike: {
    label: 'Motorcycle',
    icon: 'bicycle',
    defaultSeats: 1,
    defaultPricePerKm: 0.8,
    defaultModel: 'Royal Enfield Classic 350',
  },
  van: {
    label: 'Van / Group',
    icon: 'bus',
    defaultSeats: 7,
    defaultPricePerKm: 1.5,
    defaultModel: 'Force Traveller AC',
  },
};

export default function PublishRideScreen({ navigation, route }) {
  const initialData = route.params || {};
  const { user } = useAuth();

  const [origin, setOrigin] = useState(initialData.origin || 'Chennai');
  const [destination, setDestination] = useState(initialData.destination || 'Bengaluru');
  const [stops, setStops] = useState(['Vellore', 'Hosur']);
  const [customStop, setCustomStop] = useState('');

  const [vehicleType, setVehicleType] = useState('car');
  const [vehicleModel, setVehicleModel] = useState('Honda City (White)');
  const [plateNumber, setPlateNumber] = useState('TN 07 BZ 8899');
  const [driverPhone, setDriverPhone] = useState(user?.phone || '+91 98400 12345');

  const [departureDate, setDepartureDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [departureTime, setDepartureTime] = useState('07:00');
  const [seatsAvailable, setSeatsAvailable] = useState(3);
  const [pricePerSeat, setPricePerSeat] = useState(450);

  // Amenity toggles
  const [hasAc, setHasAc] = useState(true);
  const [hasLuggage, setHasLuggage] = useState(true);
  const [instantBooking, setInstantBooking] = useState(true);

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('origin'); // 'origin' | 'destination' | 'stop'

  // Auto calculate recommended price when origin or destination changes
  useEffect(() => {
    (async () => {
      try {
        const [c1, c2] = await Promise.all([
          getCityCoordinates(origin),
          getCityCoordinates(destination),
        ]);
        if (c1 && c2) {
          const km = calculateRoadDistanceKm(c1, c2) || 300;
          const rate = VEHICLE_CONFIGS[vehicleType].defaultPricePerKm;
          const suggested = Math.round((km * rate) / 50) * 50;
          setPricePerSeat(Math.max(100, suggested));
        }
      } catch {}
    })();
  }, [origin, destination, vehicleType]);

  const handleSelectCity = (cityName) => {
    if (modalMode === 'origin') setOrigin(cityName);
    else if (modalMode === 'destination') setDestination(cityName);
    else if (modalMode === 'stop' && cityName && !stops.includes(cityName)) {
      setStops([...stops, cityName]);
    }
  };

  const handleVehicleChange = (type) => {
    setVehicleType(type);
    const cfg = VEHICLE_CONFIGS[type];
    setSeatsAvailable(cfg.defaultSeats);
    setVehicleModel(cfg.defaultModel);
  };

  const addStop = () => {
    if (customStop.trim() && !stops.includes(customStop.trim())) {
      setStops([...stops, customStop.trim()]);
      setCustomStop('');
    }
  };

  const removeStop = (stopName) => {
    setStops(stops.filter((s) => s !== stopName));
  };

  const handlePublish = async () => {
    if (!origin || !destination) {
      Alert.alert('Required Fields', 'Please select both Origin and Destination.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        origin,
        destination,
        origin_address: `${origin} Main Bus Terminus`,
        destination_address: `${destination} City Center`,
        departure_date: departureDate,
        departure_time: departureTime,
        arrival_time: '12:00',
        duration: '5h 00m',
        price: Number(pricePerSeat),
        seats_available: Number(seatsAvailable),
        total_seats: Number(seatsAvailable),
        driver_name: user?.name || 'Verified Driver',
        driver_phone: driverPhone,
        driver_avatar: user?.avatar || '',
        vehicle_type: vehicleType,
        vehicle_model: vehicleModel,
        plate_number: plateNumber,
        has_ac: hasAc,
        luggage_allowed: hasLuggage,
        instant_booking: instantBooking,
        city_stops: [
          { city: origin, distance_km: 0 },
          ...stops.map((s, i) => ({ city: s, distance_km: (i + 1) * 100 })),
          { city: destination, distance_km: 350 },
        ],
      };

      const newRide = await publishRide(payload);

      Alert.alert(
        'Ride Published Successfully! 🚗',
        `Your ride from ${origin} to ${destination} is now live on the Hello Bro network. Co-travelers can now discover and book seats.`,
        [
          {
            text: 'View in Search',
            onPress: () => navigation.navigate('SearchTab', { screen: 'SearchRides', params: { origin, destination } }),
          },
          {
            text: 'OK',
            onPress: () => navigation.navigate('HomeTab'),
          },
        ]
      );
    } catch {
      Alert.alert('Publish Error', 'Could not publish ride. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Offer a Ride</Text>
          <Text style={styles.headerSub}>Recover fuel costs &amp; travel with verified passengers</Text>
        </View>

        {/* 1. Vehicle Selection */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>1. Select Your Vehicle</Text>
          <View style={styles.vehicleRow}>
            {Object.keys(VEHICLE_CONFIGS).map((key) => {
              const cfg = VEHICLE_CONFIGS[key];
              const isSelected = vehicleType === key;
              return (
                <TouchableOpacity
                  key={key}
                  style={[styles.vehicleCard, isSelected && styles.vehicleCardActive]}
                  onPress={() => handleVehicleChange(key)}
                >
                  <Ionicons
                    name={cfg.icon}
                    size={22}
                    color={isSelected ? COLORS.white : COLORS.primary}
                  />
                  <Text style={[styles.vehicleLabel, isSelected && styles.vehicleLabelActive]}>
                    {cfg.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 2. Route & Stops */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>2. Route Itinerary</Text>

          {/* Pickup */}
          <TouchableOpacity
            style={styles.locationInput}
            onPress={() => {
              setModalMode('origin');
              setModalVisible(true);
            }}
          >
            <Ionicons name="navigate" size={18} color={COLORS.primary} />
            <View style={styles.locationTextGroup}>
              <Text style={styles.locationLabel}>PICKUP CITY (ORIGIN)</Text>
              <Text style={styles.locationValue}>{origin}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.border} />
          </TouchableOpacity>

          {/* Dropoff */}
          <TouchableOpacity
            style={styles.locationInput}
            onPress={() => {
              setModalMode('destination');
              setModalVisible(true);
            }}
          >
            <Ionicons name="location" size={18} color={COLORS.secondary} />
            <View style={styles.locationTextGroup}>
              <Text style={styles.locationLabel}>DROPOFF CITY (DESTINATION)</Text>
              <Text style={styles.locationValue}>{destination}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={COLORS.border} />
          </TouchableOpacity>

          {/* En-route Stops */}
          <View style={styles.stopsSection}>
            <Text style={styles.stopsTitle}>En-route Highway Stops:</Text>
            <View style={styles.stopsList}>
              {stops.map((s, idx) => (
                <View key={idx} style={styles.stopChip}>
                  <Text style={styles.stopChipText}>{s}</Text>
                  <TouchableOpacity onPress={() => removeStop(s)}>
                    <Ionicons name="close-circle" size={16} color={COLORS.primaryDark} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.addStopRow}>
              <TextInput
                style={styles.addStopInput}
                placeholder="Add intermediate town or hub..."
                placeholderTextColor={COLORS.textMuted}
                value={customStop}
                onChangeText={setCustomStop}
              />
              <TouchableOpacity style={styles.addStopBtn} onPress={addStop}>
                <Ionicons name="add" size={18} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 3. Seats & Pricing */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>3. Seats &amp; Price</Text>

          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.fieldLabel}>Available Seats</Text>
              <Text style={styles.fieldSub}>Co-passengers you can take</Text>
            </View>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setSeatsAvailable(Math.max(1, seatsAvailable - 1))}
              >
                <Ionicons name="remove" size={16} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.stepValue}>{seatsAvailable}</Text>
              <TouchableOpacity
                style={styles.stepBtn}
                onPress={() => setSeatsAvailable(Math.min(12, seatsAvailable + 1))}
              >
                <Ionicons name="add" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.rowBetween, { marginTop: 16 }]}>
            <View>
              <Text style={styles.fieldLabel}>Price Per Seat (₹)</Text>
              <Text style={styles.fieldSub}>Recommended based on highway km</Text>
            </View>
            <View style={styles.priceInputBox}>
              <Text style={styles.rupeeSymbol}>₹</Text>
              <TextInput
                style={styles.priceInput}
                keyboardType="numeric"
                value={String(pricePerSeat)}
                onChangeText={(val) => setPricePerSeat(Number(val) || 0)}
              />
            </View>
          </View>
        </View>

        {/* 4. Vehicle & Driver Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>4. Vehicle &amp; Driver Details</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabelSmall}>Vehicle Model</Text>
            <TextInput
              style={styles.textInput}
              value={vehicleModel}
              onChangeText={setVehicleModel}
              placeholder="e.g. Innova Crysta (White)"
              placeholderTextColor={COLORS.textMuted}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabelSmall}>Registration Number (Plate)</Text>
            <TextInput
              style={styles.textInput}
              value={plateNumber}
              onChangeText={setPlateNumber}
              placeholder="e.g. TN 07 BZ 8899"
              placeholderTextColor={COLORS.textMuted}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabelSmall}>Driver Contact Phone</Text>
            <TextInput
              style={styles.textInput}
              value={driverPhone}
              onChangeText={setDriverPhone}
              placeholder="+91 98765 43210"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="phone-pad"
            />
          </View>

          {/* Toggle Switches */}
          <View style={styles.togglesContainer}>
            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setHasAc(!hasAc)}
              activeOpacity={0.8}
            >
              <View style={styles.toggleInfo}>
                <Ionicons name="snow" size={16} color={COLORS.primary} />
                <Text style={styles.toggleText}>Air Conditioned (AC)</Text>
              </View>
              <Ionicons
                name={hasAc ? 'checkbox' : 'square-outline'}
                size={22}
                color={hasAc ? COLORS.primary : COLORS.border}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.toggleRow}
              onPress={() => setInstantBooking(!instantBooking)}
              activeOpacity={0.8}
            >
              <View style={styles.toggleInfo}>
                <Ionicons name="flash" size={16} color="#f59e0b" />
                <Text style={styles.toggleText}>Instant Booking (No manual approval)</Text>
              </View>
              <Ionicons
                name={instantBooking ? 'checkbox' : 'square-outline'}
                size={22}
                color={instantBooking ? COLORS.primary : COLORS.border}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Publish CTA Button */}
        <TouchableOpacity
          style={styles.publishBtn}
          onPress={handlePublish}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={20} color={COLORS.white} />
              <Text style={styles.publishBtnText}>Publish Ride to RB Network</Text>
            </>
          )}
        </TouchableOpacity>

        {/* City Modal */}
        <CityAutocompleteModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelectCity={handleSelectCity}
          title={modalMode === 'origin' ? 'Select Origin' : modalMode === 'destination' ? 'Select Destination' : 'Add Stop'}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
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
  sectionCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    ...SHADOWS.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 14,
  },
  vehicleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  vehicleCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    gap: 6,
  },
  vehicleCardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  vehicleLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.text,
  },
  vehicleLabelActive: {
    color: COLORS.white,
  },
  locationInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    gap: 10,
  },
  locationTextGroup: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.6,
  },
  locationValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  stopsSection: {
    marginTop: 10,
  },
  stopsTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  stopsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  stopChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
  },
  stopChipText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  addStopRow: {
    flexDirection: 'row',
    gap: 8,
  },
  addStopInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 13,
    color: COLORS.text,
  },
  addStopBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.text,
  },
  fieldSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepValue: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  priceInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 44,
  },
  rupeeSymbol: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginRight: 4,
  },
  priceInput: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primaryDark,
    width: 60,
  },
  inputGroup: {
    marginBottom: 12,
  },
  inputLabelSmall: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  togglesContainer: {
    marginTop: 8,
    gap: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  publishBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: 18,
    gap: 8,
    marginTop: 10,
    ...SHADOWS.md,
  },
  publishBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
});
