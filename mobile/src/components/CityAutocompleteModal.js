import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SHADOWS } from '../constants/theme';
import { searchCities, POPULAR_CITIES } from '../services/mapApi';

export default function CityAutocompleteModal({
  visible,
  onClose,
  onSelectCity,
  title = 'Select Location',
  placeholder = 'Search city, town, or transport hub...',
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(POPULAR_CITIES);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 150);
      setResults(POPULAR_CITIES);
      setQuery('');
    }
  }, [visible]);

  // Debounced live map search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults(POPULAR_CITIES);
      setLoading(false);
      return;
    }

    let isCancelled = false;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const data = await searchCities(trimmed, 10);
        if (!isCancelled) {
          setResults(data);
        }
      } catch {
        if (!isCancelled) setResults([]);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }, 240);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const handleSelect = (city) => {
    onSelectCity(city.name, city);
    onClose();
  };

  const getPlaceIcon = (type) => {
    if (type === 'airport') return 'airplane';
    if (type === 'station') return 'train';
    if (type === 'district') return 'business';
    return 'location-sharp';
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>{title}</Text>
              <Text style={styles.headerSub}>Live Map Search &bull; India</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={COLORS.text} />
            </TouchableOpacity>
          </View>

          {/* Search Input Box */}
          <View style={styles.searchBox}>
            <Ionicons name="search" size={20} color={COLORS.primary} style={styles.searchIcon} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder={placeholder}
              placeholderTextColor={COLORS.textMuted}
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              autoCapitalize="words"
              clearButtonMode="while-editing"
            />
            {loading && <ActivityIndicator size="small" color={COLORS.primary} />}
            {!loading && query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Section Indicator */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {query.trim() ? 'LIVE MAP SEARCH RESULTS' : 'POPULAR PICKUP CITIES'}
            </Text>
            <Text style={styles.sectionCount}>
              {loading ? 'Searching...' : `${results.length} found`}
            </Text>
          </View>

          {/* Results List */}
          <FlatList
            data={results}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.cityItem}
                onPress={() => handleSelect(item)}
                activeOpacity={0.7}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name={getPlaceIcon(item.type)} size={18} color={COLORS.primary} />
                </View>
                <View style={styles.cityDetails}>
                  <View style={styles.cityNameRow}>
                    <Text style={styles.cityName}>{item.name}</Text>
                    {item.state ? (
                      <View style={styles.stateBadge}>
                        <Text style={styles.stateText}>{item.state}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={styles.cityDisplay} numberOfLines={1}>
                    {item.hubs ? `Hubs: ${item.hubs}` : item.display || 'India'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={COLORS.border} />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              !loading && query.trim() ? (
                <View style={styles.emptyContainer}>
                  <Ionicons name="map-outline" size={44} color={COLORS.primaryLight} />
                  <Text style={styles.emptyTitle}>No exact map location found</Text>
                  <Text style={styles.emptyDesc}>You can still use this as your custom stop:</Text>
                  <TouchableOpacity
                    style={styles.customSelectBtn}
                    onPress={() => handleSelect({ name: query.trim(), state: '' })}
                  >
                    <Ionicons name="checkmark-circle" size={18} color={COLORS.white} />
                    <Text style={styles.customSelectText}>Use &ldquo;{query.trim()}&rdquo;</Text>
                  </TouchableOpacity>
                </View>
              ) : null
            }
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },
  headerSub: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    paddingHorizontal: 14,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.primaryBorder,
    ...SHADOWS.sm,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 0.8,
  },
  sectionCount: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  cityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 14,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.sm,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cityDetails: {
    flex: 1,
  },
  cityNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  cityName: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.text,
  },
  stateBadge: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.primaryBorder,
  },
  stateText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  cityDisplay: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  customSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 14,
    gap: 6,
  },
  customSelectText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
