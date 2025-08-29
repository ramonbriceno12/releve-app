// FILE: app/(tabs)/mapa.tsx
import { palette } from '@/theme/palette';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import MapView, { Callout, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

const CARACAS_REGION: Region = {
    latitude: 10.4806,
    longitude: -66.9036,
    latitudeDelta: 0.06,
    longitudeDelta: 0.06,
};

// Marcadores de demo (luego podemos moverlos a constants)
const MARKERS = [
    { id: 'm1', title: 'Las Mercedes — Restaurante', description: 'Restaurante', latitude: 10.4801, longitude: -66.8542, venueId: '1' },
    { id: 'm2', title: 'Altamira — Experiencia', description: 'Experiencia', latitude: 10.4980, longitude: -66.8529, venueId: '3' },
    { id: 'm3', title: 'Plaza Venezuela — Retail', description: 'Retail', latitude: 10.4931, longitude: -66.8778, venueId: '6' },
    { id: 'm4', title: 'CCCT — Belleza', description: 'Belleza', latitude: 10.4822, longitude: -66.8589, venueId: '7' },
    { id: 'm5', title: 'El Hatillo — Spa', description: 'Belleza', latitude: 10.4335, longitude: -66.8159 },
];

export default function MapaScreen() {
    const router = useRouter();
    const mapRef = useRef<MapView | null>(null);
    const [hasLocationPerm, setHasLocationPerm] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setHasLocationPerm(true);
                const loc = await Location.getCurrentPositionAsync({});
                mapRef.current?.animateToRegion({
                    latitude: loc.coords.latitude,
                    longitude: loc.coords.longitude,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                }, 600);
            }
        })();
    }, []);

    return (
        <View style={styles.container}>
            <MapView
                ref={mapRef}
                style={StyleSheet.absoluteFillObject}
                initialRegion={CARACAS_REGION}
                showsUserLocation={hasLocationPerm}
                provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            >
                {MARKERS.map((m) => (
                    <Marker key={m.id} coordinate={{ latitude: m.latitude, longitude: m.longitude }} title={m.title} description={m.description}>
                        <Callout onPress={() => m.venueId && router.push(`/venue/${m.venueId}`)}>
                            <View style={styles.calloutRow}>
                                <View style={styles.dot} />
                                <View style={{ maxWidth: 200 }}>
                                    <Text style={styles.calloutTitle}>{m.title}</Text>
                                    <Text style={styles.calloutSubtitle}>{m.description}</Text>
                                    {m.venueId ? <Text style={styles.link}>Ver detalle →</Text> : null}
                                </View>
                            </View>
                        </Callout>
                    </Marker>
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background },
    calloutRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingRight: 8 },
    calloutTitle: { fontWeight: '700' },
    calloutSubtitle: { opacity: 0.8 },
    link: { marginTop: 4, textDecorationLine: 'underline' },
    dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: palette.gold },
});