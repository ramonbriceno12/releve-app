// FILE: app/_layout.tsx
import { AuthProvider } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { releveDarkTheme, releveLightTheme } from '@/theme/navigationThemes';
import { DarkTheme as NavDark, DefaultTheme as NavLight, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import 'react-native-reanimated';
import Toast from "react-native-toast-message";


export default function RootLayout() {
  const scheme = useColorScheme();
  const navTheme = scheme === 'dark'
    ? { ...NavDark, colors: { ...NavDark.colors, ...releveDarkTheme.colors } }
    : { ...NavLight, colors: { ...NavLight.colors, ...releveLightTheme.colors } };

  return (
    <AuthProvider>
      <ThemeProvider value={navTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ title: 'Crear cuenta' }} />
          <Stack.Screen name="apply/creator" options={{ title: 'Postularse como Creador' }} />
          <Stack.Screen name="apply/negocio" options={{ title: 'Registrar Negocio' }} />
          <Stack.Screen name="venue/[id]" options={{ title: 'Detalle del Lugar' }} />
          <Stack.Screen name="visit-pass/[id]" options={{ title: 'Pase de Visita' }} />
        </Stack>
        <StatusBar style="light" />
        <Toast />
      </ThemeProvider>
    </AuthProvider>
  );
}