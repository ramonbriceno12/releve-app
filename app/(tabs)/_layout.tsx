// FILE: app/(tabs)/_layout.tsx
import { useAuth } from '@/contexts/AuthContext';
import { palette } from '@/theme/palette';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  const { user, loading } = useAuth();

  if (loading) return null; // or splash screen

  if (!user) return <Redirect href="/auth/login" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.gold,
        tabBarInactiveTintColor: '#E8D9CF',
        tabBarStyle: {
          backgroundColor: palette.surface,
          borderTopColor: palette.border,
        },
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen name="index" options={{
        title: 'Inicio',
        tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
      }} />
      <Tabs.Screen name="businesses" options={{
        title: 'Venues',
        tabBarIcon: ({ color, size }) => <Ionicons name="business" size={size} color={color} />,
      }} />
      <Tabs.Screen name="mapa" options={{
        title: 'Mapa',
        tabBarIcon: ({ color, size }) => <Ionicons name="map" size={size} color={color} />,
      }} />
      <Tabs.Screen name="ofertas" options={{
        title: 'Mis Ofertas',
        tabBarIcon: ({ color, size }) => <Ionicons name="pricetags" size={size} color={color} />,
      }} />
      <Tabs.Screen name="cuenta" options={{
        title: 'Cuenta',
        tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
      }} />
    </Tabs>
  );
}