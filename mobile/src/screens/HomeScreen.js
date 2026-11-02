import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import CityAutocompleteModal from '../components/CityAutocompleteModal';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const TRENDING_CORRIDORS = [
  { from: 'Chennai', to: 'Bengaluru', price: 400, regularPrice: 1600, duration: '5h 15m' },
  { from: 'Mumbai', to: 'Pune', price: 350, regularPrice: 1200, duration: '3h 10m' },
  { from: 'Bengaluru', to: 'Hyderabad', price: 650, regularPrice: 2200, duration: '8h 00m' },
  { from: 'Delhi', to: 'Jaipur', price: 450, regularPrice: 1800, duration: '4h 45m' },
  { from: 'Coimbatore', to: 'Chennai', price: 550, regularPrice: 2000, duration: '7h 30m' },
];

export default function HomeScreen({ navigation }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('find'); // 'find' | 'offer'
  const [fromCity, setFromCity] = useState('Chennai');
  const [toCity, setToCity] = useState('Bengaluru');
  const [travelDate, setTravelDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [seats, setSeats] = useState(1);

  // Modal selector states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState('from'); // 'from' | 'to'

  const handleSwap = () => {
    const tmp = fromCity;
    setFromCity(toCity);
    setToCity(tmp);
  };

  const openCityPicker = (mode) => {
    setModalMode(mode);
    setModalVisible(true);
  };

  const handleCitySelected = (cityName) => {
    if (modalMode === 'from') setFromCity(cityName);
    else setToCity(cityName);
  };

  const handleSearch = () => {
    navigation.navigate('SearchRides', {
      origin: fromCity,
      destination: toCity,
      date: travelDate,
      seats,
    });
  };

  const handleOfferRide = () => {
    navigation.navigate('PublishTab', {
      screen: 'PublishRide',
      params: { origin: fromCity, destination: toCity },
    });
  };

  const handleQuickCorridor = (corridor) => {
    setFromCity(corridor.from);
    setToCity(corridor.to);
    navigation.navigate('SearchRides', {
      origin: corridor.from,
      destination: corridor.to,
      date: travelDate,
      seats: 1,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Top Branded App Bar (Exact Reference Header) */}
      <View style={styles.topBrandedBar}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => navigation.navigate('ProfileTab')}
          activeOpacity={0.7}
        >
          <Ionicons name="menu-outline" size={28} color="#1e1b4b" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => navigation.navigate('HomeTab')}
          activeOpacity={0.8}
        >
          <Image
            source={require('../../assets/hello_bro_logo.png')}
            style={styles.brandLogo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.topRightActions}>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => navigation.navigate('SearchTab')}
            activeOpacity={0.7}
          >
            <Ionicons name="search-outline" size={24} color="#1e1b4b" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => Alert.alert('Hello Bro Alerts', 'You have no unread ride notifications.')}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color="#1e1b4b" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ProfileTab')}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120' }}
              style={styles.profileAvatarThumb}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Community Pill Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.pillBadge}>
            <View style={styles.livePulse} />
            <Text style={styles.pillText}>
              Over <Text style={styles.pillHighlight}>120,000+ Trips</Text> Shared Across 80+ Cities
            </Text>
            <Ionicons name="sparkles" size={13} color={COLORS.primary} />
          </View>
        </View>

        {/* Main Headline */}
        <View style={styles.heroTextContainer}>
          <Text style={styles.heroTitle}>Travel Together.</Text>
          <Text style={styles.heroTitleGradient}>Save Up to 70% on Every Trip.</Text>
          <Text style={styles.heroSubtitle}>
            Connect with verified co-travelers and empty car seats heading your way. Safe, budget-friendly, and air-conditioned city-to-city carpooling.
          </Text>
        </View>

        {/* Mode Switcher Pill (Find a Ride / Offer a Ride) */}
        <View style={styles.modeSwitcherContainer}>
          <View style={styles.modeSwitcher}>
            <TouchableOpacity
              style={[styles.modeTab, activeTab === 'find' && styles.modeTabActive]}
              onPress={() => setActiveTab('find')}
            >
              <Ionicons
                name="search"
                size={16}
                color={activeTab === 'find' ? COLORS.white : COLORS.textSecondary}
              />
              <Text style={[styles.modeTabText, activeTab === 'find' && styles.modeTabTextActive]}>
                Find a Ride
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeTab, activeTab === 'offer' && styles.modeTabActive]}
              onPress={() => {
                setActiveTab('offer');
                handleOfferRide();
              }}
            >
              <Ionicons
                name="car"
                size={16}
                color={activeTab === 'offer' ? COLORS.white : COLORS.textSecondary}
              />
              <Text style={[styles.modeTabText, activeTab === 'offer' && styles.modeTabTextActive]}>
                Offer a Ride
              </Text>
              <View style={styles.earnBadge}>
                <Text style={styles.earnBadgeText}>Earn ₹</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Elevated Booking Card */}
        <View style={styles.searchCard}>
          {/* Origin Input */}
          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => openCityPicker('from')}
            activeOpacity={0.8}
          >
            <View style={[styles.inputIconCircle, { backgroundColor: COLORS.primarySoft }]}>
              <Ionicons name="navigate" size={18} color={COLORS.primary} />
            </View>
            <View style={styles.inputTextWrapper}>
              <Text style={styles.inputLabel}>LEAVING FROM</Text>
              <Text style={styles.inputValue} numberOfLines={1}>{fromCity}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.primaryBorder} />
          </TouchableOpacity>

          {/* Swap Button */}
          <View style={styles.swapBtnContainer}>
            <TouchableOpacity style={styles.swapBtn} onPress={handleSwap} activeOpacity={0.8}>
              <Ionicons name="swap-vertical" size={18} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Destination Input */}
          <TouchableOpacity
            style={styles.inputBox}
            onPress={() => openCityPicker('to')}
            activeOpacity={0.8}
          >
            <View style={[styles.inputIconCircle, { backgroundColor: '#ede9fe' }]}>
              <Ionicons name="location" size={18} color={COLORS.secondary} />
            </View>
            <View style={styles.inputTextWrapper}>
              <Text style={styles.inputLabel}>GOING TO</Text>
              <Text style={styles.inputValue} numberOfLines={1}>{toCity}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.primaryBorder} />
          </TouchableOpacity>

          {/* Row: Date & Seats */}
          <View style={styles.metaRow}>
            {/* Date Box */}
            <View style={[styles.inputBox, styles.metaBox]}>
              <View style={[styles.inputIconCircle, { backgroundColor: COLORS.primarySoft }]}>
                <Ionicons name="calendar-outline" size={16} color={COLORS.primary} />
              </View>
              <View style={styles.inputTextWrapper}>
                <Text style={styles.inputLabel}>DATE</Text>
                <Text style={styles.inputValueSmall}>Today</Text>
              </View>
            </View>

            {/* Seats Box */}
            <View style={[styles.inputBox, styles.metaBox]}>
              <View style={[styles.inputIconCircle, { backgroundColor: COLORS.primarySoft }]}>
                <Ionicons name="people-outline" size={16} color={COLORS.primary} />
              </View>
              <View style={styles.inputTextWrapper}>
                <Text style={styles.inputLabel}>PASSENGERS</Text>
                <View style={styles.seatCounterRow}>
                  <TouchableOpacity
                    onPress={() => setSeats(Math.max(1, seats - 1))}
                    style={styles.counterBtn}
                  >
                    <Ionicons name="remove" size={14} color={COLORS.primary} />
                  </TouchableOpacity>
                  <Text style={styles.seatNumber}>{seats}</Text>
                  <TouchableOpacity
                    onPress={() => setSeats(Math.min(6, seats + 1))}
                    style={styles.counterBtn}
                  >
                    <Ionicons name="add" size={14} color={COLORS.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          {/* Find Rides CTA Button */}
          <TouchableOpacity
            style={styles.searchSubmitBtn}
            onPress={handleSearch}
            activeOpacity={0.88}
          >
            <Ionicons name="search" size={20} color={COLORS.white} />
            <Text style={styles.searchSubmitText}>Find Verified Rides</Text>
          </TouchableOpacity>
        </View>

        {/* Trending Routes / Corridors */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionMainTitle}>Trending Daily Corridors</Text>
              <Text style={styles.sectionSubtitle}>Book popular routes with instant verification</Text>
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.corridorScroll}>
            {TRENDING_CORRIDORS.map((c, i) => (
              <TouchableOpacity
                key={i}
                style={styles.corridorCard}
                onPress={() => handleQuickCorridor(c)}
                activeOpacity={0.85}
              >
                <View style={styles.corridorTop}>
                  <View style={styles.corridorRoute}>
                    <Text style={styles.corridorCity}>{c.from}</Text>
                    <Ionicons name="arrow-forward" size={14} color={COLORS.primary} />
                    <Text style={styles.corridorCity}>{c.to}</Text>
                  </View>
                  <View style={styles.savingsPill}>
                    <Text style={styles.savingsText}>Save 70%</Text>
                  </View>
                </View>

                <View style={styles.corridorDivider} />

                <View style={styles.corridorBottom}>
                  <View>
                    <Text style={styles.corridorRegular}>Bus/Cab: ₹{c.regularPrice}</Text>
                    <Text style={styles.corridorPrice}>₹{c.price}</Text>
                  </View>
                  <View style={styles.corridorBookBtn}>
                    <Text style={styles.corridorBookText}>View</Text>
                    <Ionicons name="chevron-forward" size={14} color={COLORS.primary} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Safety & Trust Features */}
        <View style={styles.safetySection}>
          <Text style={styles.safetyHeader}>RB Rides Safety &amp; Trust</Text>

          <View style={styles.safetyCard}>
            <View style={styles.safetyIcon}>
              <MaterialCommunityIcons name="shield-check" size={26} color={COLORS.primary} />
            </View>
            <View style={styles.safetyText}>
              <Text style={styles.safetyTitle}>Government ID &amp; License Verified</Text>
              <Text style={styles.safetyDesc}>Every car owner submits Aadhaar/DL verification before offering rides.</Text>
            </View>
          </View>

          <View style={styles.safetyCard}>
            <View style={styles.safetyIcon}>
              <MaterialCommunityIcons name="radar" size={26} color={COLORS.secondary} />
            </View>
            <View style={styles.safetyText}>
              <Text style={styles.safetyTitle}>Real-time GPS Tracking</Text>
              <Text style={styles.safetyDesc}>Share live trip coordinates with family members with one tap.</Text>
            </View>
          </View>

          <View style={styles.safetyCard}>
            <View style={styles.safetyIcon}>
              <MaterialCommunityIcons name="credit-card-check" size={26} color={COLORS.accent} />
            </View>
            <View style={styles.safetyText}>
              <Text style={styles.safetyTitle}>100% Cashless &amp; Secure Payments</Text>
              <Text style={styles.safetyDesc}>UPI, NetBanking, and Wallets. Driver gets paid only after safe arrival.</Text>
            </View>
          </View>
        </View>

        {/* City Autocomplete Modal */}
        <CityAutocompleteModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelectCity={handleCitySelected}
          title={modalMode === 'from' ? 'Pickup Location' : 'Destination'}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  badgeContainer: {
    alignItems: 'center',
    marginTop: 18,
    marginBottom: 12,
  },
  pillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
    ...SHADOWS.sm,
  },
  livePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  pillHighlight: {
    fontWeight: '800',
    color: COLORS.text,
  },
  heroTextContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  heroTitleGradient: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.primaryDark,
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 10,
    maxWidth: 340,
  },
  modeSwitcherContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modeSwitcher: {
    flexDirection: 'row',
    backgroundColor: '#ede9fe',
    borderRadius: 24,
    padding: 4,
  },
  modeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 20,
    gap: 6,
  },
  modeTabActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.sm,
  },
  modeTabText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  modeTabTextActive: {
    color: COLORS.white,
  },
  earnBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 2,
  },
  earnBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803d',
  },
  searchCard: {
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    ...SHADOWS.lg,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 12,
  },
  inputIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  inputTextWrapper: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 0.6,
  },
  inputValue: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  swapBtnContainer: {
    alignItems: 'center',
    marginVertical: -10,
    zIndex: 10,
  },
  swapBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.sm,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  metaBox: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  inputValueSmall: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 2,
  },
  seatCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 2,
  },
  counterBtn: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seatNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  searchSubmitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    height: 54,
    marginTop: 18,
    gap: 8,
    ...SHADOWS.md,
  },
  searchSubmitText: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 0.3,
  },
  sectionContainer: {
    marginTop: 28,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionMainTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  corridorScroll: {
    paddingLeft: 16,
  },
  corridorCard: {
    backgroundColor: COLORS.card,
    width: 220,
    borderRadius: 18,
    padding: 14,
    marginRight: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
    ...SHADOWS.sm,
  },
  corridorTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  corridorRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  corridorCity: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },
  savingsPill: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  savingsText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#15803d',
  },
  corridorDivider: {
    height: 1,
    backgroundColor: COLORS.borderLight,
    marginVertical: 10,
  },
  corridorBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  corridorRegular: {
    fontSize: 10,
    color: COLORS.textMuted,
    textDecorationLine: 'line-through',
  },
  corridorPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  corridorBookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 2,
  },
  corridorBookText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  safetySection: {
    marginTop: 28,
    paddingHorizontal: 16,
  },
  safetyHeader: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 14,
    marginLeft: 4,
  },
  safetyCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  safetyIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  safetyText: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.text,
  },
  safetyDesc: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 2,
    lineHeight: 16,
  },
  topBrandedBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f0f7',
  },
  headerIconBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 8,
  },
  brandLogo: {
    width: 140,
    height: 38,
  },
  topRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileAvatarThumb: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    marginLeft: 4,
  },
});
