// FILE: components/BalanceCard.tsx
import { palette } from '@/theme/palette';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = { balance: number; allowanceWeekly: number; userId?: string };

function formatAsCard(userId?: string) {
    if (!userId) return "**** **** **** 0000";
    // strip non-alphanumeric
    const clean = userId.replace(/[^a-zA-Z0-9]/g, "");
    const last4 = clean.slice(-4);
    // build fake card number with masking
    return `**** **** **** ${last4}`;
}

export const BalanceCard: React.FC<Props> = ({ balance, allowanceWeekly, userId }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.brand}>RELEVÉ</Text>
            <Text style={styles.label}>Saldo disponible</Text>
            <Text style={styles.balance}>$ {balance.toFixed(2)}</Text>
            <Text style={styles.sub}>Asignación semanal $ {allowanceWeekly.toFixed(2)}</Text>
            <Text style={styles.number}>{formatAsCard(userId)}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: palette.surface,
        borderWidth: 1,
        borderColor: palette.gold,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    brand: { color: palette.gold, fontWeight: '800', letterSpacing: 4, marginBottom: 6 },
    label: { color: palette.textMuted, fontSize: 12 },
    balance: { color: 'white', fontSize: 28, fontWeight: '800' },
    sub: { color: palette.textMuted, marginTop: 4, marginBottom: 10 },
    number: { color: palette.textMuted, fontSize: 14, letterSpacing: 2, fontWeight: "600" },
});
