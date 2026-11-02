import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved session on startup
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem('hb_user');
        if (saved) {
          setUser(JSON.parse(saved));
        } else {
          // Pre-populate user for instant native testing
          const defaultUser = {
            id: 'usr-subash-1',
            name: 'Subash Sundaram',
            email: 'subash@hellobro.com',
            phone: '+91 98400 12345',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
            verified: true,
            rating: 4.95,
            tripsShared: 0,
          };
          setUser(defaultUser);
          await AsyncStorage.setItem('hb_user', JSON.stringify(defaultUser));
        }
      } catch {}
      finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem('hb_user', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('hb_user');
  };

  const updateUser = async (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    await AsyncStorage.setItem('hb_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
