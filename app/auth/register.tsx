import { useAuth } from '@/contexts/AuthContext';
import { palette } from '@/theme/palette';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import Toast from "react-native-toast-message";

export default function RegisterScreen() {
    const router = useRouter();
    const { register, loading } = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState<string | null>(null);
    const [validEmail, setValidEmail] = useState(false);

    // validate email as user types
    const validateEmail = (value: string) => {
        setEmail(value);
        //regular expression for valid email
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!re.test(value)) {
            setEmailError('Email no válido');
            setValidEmail(false);
        } else {
            setEmailError(null);
            setValidEmail(true);
        }
    };

    const onRegister = async () => {
        if (!validEmail || !email) {
            Toast.show({
                type: "error",
                text1: "Email inválido",
                text2: "Introduce un email correcto antes de registrarte",
            });
            return;
        }

        try {
            const user = await register(
                name || "Nuevo Creador",
                email,
                password || "dev"
            );

            setTimeout(() => {
                router.replace("/");
            }, 1000);

            Toast.show({
                type: "success",
                text1: "Registro exitoso 🎉",
                text2: `Bienvenido, ${user.name}`,
            });
        } catch (err: any) {
            Toast.show({
                type: "error",
                text1: "Error al registrarse",
                text2: err.message || "Inténtalo de nuevo",
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>RELEVÉ</Text>

            <TextInput
                placeholder="Nombre"
                placeholderTextColor={palette.textMuted}
                style={styles.input}
                value={name}
                onChangeText={setName}
            />

            <TextInput
                placeholder="Email"
                placeholderTextColor={palette.textMuted}
                style={[
                    styles.input,
                    emailError ? { borderColor: 'red' } : null,
                ]}
                value={email}
                onChangeText={validateEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            {emailError && <Text style={styles.error}>{emailError}</Text>}

            <TextInput
                placeholder="Contraseña"
                placeholderTextColor={palette.textMuted}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <Pressable
                style={[styles.btn, styles.btnPrimary]}
                onPress={onRegister}
                disabled={loading || !validEmail || !password}
            >
                <Text style={styles.btnTxtPrimary}>
                    {loading ? 'Creando…' : 'Registrarme'}
                </Text>
            </Pressable>

            <Pressable style={[styles.btn, styles.btnOutlined]} onPress={onRegister}>
                <Ionicons name="logo-apple" size={18} color="white" />
                <Text style={styles.btnTxt}>Continuar con Apple (mock)</Text>
            </Pressable>
            <Pressable style={[styles.btn, styles.btnOutlined]} onPress={onRegister}>
                <Ionicons name="logo-google" size={18} color="white" />
                <Text style={styles.btnTxt}>Continuar con Google (mock)</Text>
            </Pressable>

            <Text style={styles.small}>
                ¿Ya tienes cuenta? <Link href="/auth/login">Inicia sesión</Link>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: palette.background,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        color: palette.gold,
        fontSize: 36,
        fontWeight: '800',
        marginBottom: 28,
        letterSpacing: 6,
    },
    btnOutlined: { borderColor: 'white', borderWidth: 1 },
    btnTxt: { color: 'white', fontWeight: '600' },
    input: {
        width: '100%',
        borderColor: palette.border,
        borderWidth: 1,
        borderRadius: 14,
        padding: 12,
        color: 'white',
        marginBottom: 12,
        backgroundColor: palette.surface,
    },
    btn: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    btnPrimary: { backgroundColor: palette.gold },
    btnTxtPrimary: { color: palette.background, fontWeight: '800' },
    small: { color: 'white', marginTop: 10 },
    error: {
        alignSelf: 'flex-start',
        color: 'red',
        marginBottom: 8,
        fontSize: 12,
    },
});
