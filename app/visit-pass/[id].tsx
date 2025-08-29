// FILE: app/visit-pass/[id].tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { palette } from '@/theme/palette';

export default function VisitPass() {
    const { id } = useLocalSearchParams<{ id: string }>();
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Pase de Visita</Text>
            <View style={styles.fakeQr} />
            <Text style={styles.code}>RELEVE-{String(id).slice(0, 6).toUpperCase()}</Text>
            <Text style={styles.small}>Muestra este código al llegar para canjear tu beneficio.</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background, alignItems: 'center', justifyContent: 'center', padding: 16 },
    title: { color: 'white', fontSize: 22, fontWeight: '800', marginBottom: 16 },
    fakeQr: { width: 180, height: 180, backgroundColor: palette.surface, borderColor: palette.border, borderWidth: 1, borderRadius: 12, marginBottom: 12 },
    code: { color: 'white', fontSize: 18, fontWeight: '700', letterSpacing: 2 },
    small: { color: palette.textMuted, marginTop: 10, textAlign: 'center' },
});