// FILE: app/(tabs)/ofertas.tsx
import { SectionHeader } from '@/components/SectionHeader';
import { VenueCard } from '@/components/VenueCard';
import { myOffers } from '@/constants/sample-data';
import { palette } from '@/theme/palette';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function OfertasScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
            <SectionHeader title="Mis Ofertas" />
            {myOffers.map((offer) => (
                <View key={offer.id} style={{ marginBottom: 12 }}>
                    <VenueCard venue={offer} showStatus statusLabel="Activa" />
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background, padding: 16, paddingTop: 50 },
});