import { useAuth } from '@/contexts/AuthContext';
import { palette } from '@/theme/palette';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';

export default function CuentaScreen() {
    const router = useRouter();
    const { user, logout, tokens, updateUser } = useAuth();
    const [avatar, setAvatar] = useState(user?.avatar_url);
    const [influencerStatus, setInfluencerStatus] = useState(user?.influencer_status);
    const API_URL = "http://192.168.68.79:3000";

    //fetch influencer status for the current user
    useEffect(() => {
        const fetchInfluencerStatus = async () => {
            if (!tokens?.accessToken) return;
            const res = await fetch(`${API_URL}/user/influencer`, {
                headers: { Authorization: `Bearer ${tokens.accessToken}` },
            });
            if (res.ok) {
                const data = await res.json();
                setInfluencerStatus(data.influencer_status);
            }
        };
        fetchInfluencerStatus();
    }, [tokens]);

    const pickFromLibrary = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Habilita el acceso a la galería en ajustes');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            handleAvatarUpdate(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permiso denegado', 'Habilita el acceso a la cámara en ajustes');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            handleAvatarUpdate(result.assets[0].uri);
        }
    };

    const handleAvatarUpdate = async (uri: string) => {
        if (!uri.match(/\.(png|jpg|jpeg)$/i)) {
            Toast.show({ type: 'error', text1: 'Formato inválido', text2: 'Solo PNG/JPG permitidos' });
            return;
        }

        setAvatar(uri);

        try {
            const res = await fetch(`${API_URL}/user/avatar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${tokens?.accessToken}`,
                },
                body: JSON.stringify({ avatar_url: uri }),
            });

            if (res.ok) {
                const data = await res.json(); // return { avatar_url }
                updateUser({ avatar_url: data.avatar_url });   // 👈 updates context
                Toast.show({ type: 'success', text1: 'Avatar actualizado' });
            } else {
                const err = await res.json();
                Toast.show({ type: 'error', text1: 'Error', text2: err.error || 'No se pudo actualizar' });
            }
        } catch (err) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Error de conexión' });
        }
    };

    return (
        <View style={styles.container}>
            {/* Avatar */}
            {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
                <View
                    style={[
                        styles.avatar,
                        { backgroundColor: palette.surface, justifyContent: 'center', alignItems: 'center' },
                    ]}
                >
                    <Ionicons name="camera" size={24} color={palette.textMuted} />
                </View>
            )}

            {/* Buttons for camera/gallery */}
            <View style={styles.avatarActions}>
                <Pressable style={styles.actionBtn} onPress={takePhoto}>
                    <Ionicons name="camera" size={18} color="white" />
                    <Text style={styles.actionText}>Tomar foto</Text>
                </Pressable>
                <Pressable style={styles.actionBtn} onPress={pickFromLibrary}>
                    <Ionicons name="images" size={18} color="white" />
                    <Text style={styles.actionText}>Elegir de galería</Text>
                </Pressable>
            </View>

            {/* User info */}
            <View style={styles.card}>
                <Text style={styles.label}>Nombre</Text>
                <Text style={styles.value}>{user?.name}</Text>
                <Text style={[styles.label, { marginTop: 12 }]}>Correo</Text>
                <Text style={styles.value}>{user?.email}</Text>
            </View>

            {/* Creator application */}
            {influencerStatus === "pending" ? (
                <View style={[styles.row, { opacity: 0.6 }]}>
                    <Ionicons name="time-outline" size={18} color={palette.textMuted} />
                    <Text style={[styles.rowText, { color: palette.textMuted }]}>
                        A espera de aprobación como Creador
                    </Text>
                </View>
            ) : influencerStatus === "approved" ? (
                <View style={[styles.row, { opacity: 0.6 }]}>
                    <Ionicons name="checkmark-circle" size={18} color={palette.gold} />
                    <Text style={styles.rowText}>Ya eres Creador aprobado</Text>
                </View>
            ) : (
                <Pressable style={styles.row} onPress={() => router.push('/apply/creator')}>
                    <Ionicons name="sparkles" size={18} color={palette.gold} />
                    <Text style={styles.rowText}>Postularse como Creador</Text>
                </Pressable>
            )}

            <Pressable style={styles.row} onPress={() => router.push('/apply/negocio')}>
                <Ionicons name="storefront" size={18} color={palette.gold} />
                <Text style={styles.rowText}>Registrar mi Negocio</Text>
            </Pressable>
            <Pressable
                style={styles.row}
                onPress={() => {
                    logout();
                    router.replace('/auth/login');
                }}
            >
                <Ionicons name="log-out" size={18} color={palette.gold} />
                <Text style={styles.rowText}>Cerrar sesión</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background, padding: 16, paddingTop: 50 },
    title: { color: 'white', fontSize: 22, fontWeight: '700', marginBottom: 16 },
    avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 16, alignSelf: 'center' },
    avatarActions: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 20 },
    actionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: palette.gold,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    actionText: { color: palette.background, fontWeight: '600' },
    card: {
        backgroundColor: palette.surface,
        borderColor: palette.border,
        borderWidth: 1,
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    label: { color: palette.textMuted, fontSize: 12 },
    value: { color: 'white', fontSize: 16, fontWeight: '600' },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 14,
        borderBottomColor: palette.border,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    rowText: { color: 'white', fontSize: 16 },
});
