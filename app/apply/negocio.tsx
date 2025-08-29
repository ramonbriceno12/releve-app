// FILE: app/apply/negocio.tsx
import React from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { palette } from '@/theme/palette';

export default function ApplyBusinessScreen() {
    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
            <Text style={styles.title}>Registrar Negocio</Text>
            <Text style={styles.subtitle}>Conecta tu venue con creadores verificados.</Text>

            <Text style={styles.label}>Nombre del negocio</Text>
            <TextInput placeholder="Mi restaurante" placeholderTextColor={palette.textMuted} style={styles.input} />

            <Text style={styles.label}>Ciudad</Text>
            <TextInput placeholder="Caracas" placeholderTextColor={palette.textMuted} style={styles.input} />

            <Text style={styles.label}>Contacto</Text>
            <TextInput placeholder="email o teléfono" placeholderTextColor={palette.textMuted} style={styles.input} />

            <Pressable style={styles.submit} onPress={() => { }}>
                <Text style={styles.submitTxt}>Enviar</Text>
            </Pressable>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background, padding: 16 },
    title: { color: 'white', fontSize: 22, fontWeight: '700' },
    subtitle: { color: palette.textMuted, marginBottom: 16 },
    label: { color: palette.textMuted, marginTop: 12 },
    input: { borderColor: palette.border, borderWidth: 1, borderRadius: 12, padding: 12, color: 'white', marginTop: 6 },
    submit: { backgroundColor: palette.vinotinto, padding: 14, borderRadius: 14, alignItems: 'center', marginTop: 20 },
    submitTxt: { color: 'white', fontWeight: '800' },
});