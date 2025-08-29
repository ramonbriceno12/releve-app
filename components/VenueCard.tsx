// FILE: components/VenueCard.tsx
import { palette } from '@/theme/palette';
import React from 'react';
import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';

export type Venue = { id: string; title: string; city: string; price: number; image: string; category: string };

type Props = { venue: Venue; onPress?: () => void; size?: 'sm' | 'lg'; showStatus?: boolean; statusLabel?: string };
export const VenueCard: React.FC<Props> = ({ venue, onPress, size = 'sm', showStatus = false, statusLabel }) => {
    const big = size === 'lg';
    return (
        <Pressable onPress={onPress} style={[styles.card, big && { height: 160, width: 240 }]}>
            <ImageBackground source={{ uri: venue.image }} style={styles.bg} imageStyle={{ borderRadius: 14 }}>
                <View style={styles.topRow}>
                    <Text style={styles.badge}>{venue.category}</Text>
                    {showStatus ? <Text style={styles.badgeMuted}>{statusLabel}</Text> : null}
                </View>
                <View style={styles.bottom}>
                    <Text style={styles.title} numberOfLines={1}>{venue.title}</Text>
                    <Text style={styles.price}>{venue.price.toLocaleString()}</Text>
                </View>
            </ImageBackground>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    card: { height: 120, width: '100%' },
    bg: { flex: 1, justifyContent: 'space-between' },
    topRow: { flexDirection: 'row', justifyContent: 'space-between', padding: 10 },
    bottom: { padding: 10 },
    title: { color: 'white', fontWeight: '700', fontSize: 16 },
    price: { color: 'white', fontWeight: '800', marginTop: 2 },
    badge: { backgroundColor: palette.vinotinto, color: 'white', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: 'hidden', fontSize: 11, borderColor: palette.gold, borderWidth: 1 },
    badgeMuted: { backgroundColor: palette.surface, color: 'white', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, overflow: 'hidden', fontSize: 11, borderColor: palette.border, borderWidth: 1 },
});