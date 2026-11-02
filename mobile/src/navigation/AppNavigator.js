import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { COLORS, SHADOWS } from '../constants/theme';
import HomeScreen from '../screens/HomeScreen';
import SearchRidesScreen from '../screens/SearchRidesScreen';
import RideDetailScreen from '../screens/RideDetailScreen';
import PublishRideScreen from '../screens/PublishRideScreen';
import LiveTripTrackerScreen from '../screens/LiveTripTrackerScreen';
import RideHistoryScreen from '../screens/RideHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopWidth: 1,
          borderTopColor: COLORS.borderLight,
          height: Platform.OS === 'ios' ? 88 : 66,
          paddingBottom: Platform.OS === 'ios' ? 28 : 10,
          paddingTop: 8,
          ...SHADOWS.md,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          if (route.name === 'HomeTab') iconName = focused ? 'compass' : 'compass-outline';
          else if (route.name === 'SearchTab') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'PublishTab') iconName = focused ? 'add-circle' : 'add-circle-outline';
          else if (route.name === 'TripsTab') iconName = focused ? 'car' : 'car-outline';
          else if (route.name === 'ProfileTab') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ tabBarLabel: 'Explore' }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchRidesScreen}
        options={{ tabBarLabel: 'Find Ride' }}
      />
      <Tab.Screen
        name="PublishTab"
        component={PublishRideScreen}
        options={{
          tabBarLabel: 'Offer Ride',
          tabBarIcon: ({ color, size }) => (
            <View style={styles.publishTabCircle}>
              <Ionicons name="add" size={26} color={COLORS.white} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="TripsTab"
        component={RideHistoryScreen}
        options={{ tabBarLabel: 'My Trips' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="SearchRides" component={SearchRidesScreen} />
        <Stack.Screen name="RideDetail" component={RideDetailScreen} />
        <Stack.Screen name="LiveTracker" component={LiveTripTrackerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  publishTabCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Platform.OS === 'ios' ? 16 : 8,
    ...SHADOWS.md,
  },
});
