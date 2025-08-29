// FILE: app/auth/login.tsx
import { useAuth } from '@/contexts/AuthContext';
import { palette } from '@/theme/palette';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from "react-native-toast-message";

export default function LoginScreen() {
    const router = useRouter();
    const { login, loading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = async () => {
        try {
            const user = await login(email, password);

            setTimeout(() => {
                router.replace('/');
            }, 1000);

            Toast.show({
                type: 'success',
                text1: '¡Bienvenido de nuevo!',
                text2: `Hola, ${user.name}`,
            });

        } catch (err: any) {
            console.error(err.message);
            Toast.show({
                type: 'error',
                text1: 'Error al iniciar sesión',
                text2: err.message || 'Credenciales inválidas',
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>RELEVÉ</Text>

            <TextInput
                placeholder="Email"
                placeholderTextColor={palette.textMuted}
                style={styles.input}
                autoCapitalize='none'
                keyboardType='email-address'
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                placeholder="Contraseña"
                placeholderTextColor={palette.textMuted}
                style={styles.input}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Pressable style={[styles.btn, styles.btnPrimary]} onPress={onLogin} disabled={loading}>
                <Text style={styles.btnTxtPrimary}>{loading ? 'Entrando…' : 'Iniciar sesión'}</Text>
            </Pressable>

            <Pressable style={[styles.btn, styles.btnOutlined]} onPress={onLogin}>
                <Ionicons name="logo-apple" size={18} color="white" />
                <Text style={styles.btnTxt}>Continuar con Apple (mock)</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnOutlined]} onPress={onLogin}>
                <Ionicons name="logo-google" size={18} color="white" />
                <Text style={styles.btnTxt}>Continuar con Google (mock)</Text>
            </Pressable>

            <Text style={styles.small}>¿Aún no tienes cuenta? <Link href="/auth/register">Regístrate</Link></Text>
            <Text style={styles.terms}>Al continuar aceptas nuestros Términos y Privacidad</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background, padding: 24, alignItems: 'center', justifyContent: 'center' },
    logo: { color: palette.gold, fontSize: 36, fontWeight: '800', marginBottom: 28, letterSpacing: 6 },
    input: { width: '100%', borderColor: palette.border, borderWidth: 1, borderRadius: 14, padding: 12, color: 'white', marginBottom: 12, backgroundColor: palette.surface },
    btn: { width: '100%', paddingVertical: 14, borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginBottom: 12 },
    btnPrimary: { backgroundColor: palette.gold },
    btnOutlined: { borderColor: 'white', borderWidth: 1 },
    btnTxt: { color: 'white', fontWeight: '600' },
    btnTxtPrimary: { color: palette.background, fontWeight: '800' },
    small: { color: 'white', marginTop: 10 },
    terms: { color: palette.textMuted, marginTop: 6, fontSize: 12, textAlign: 'center' },
});