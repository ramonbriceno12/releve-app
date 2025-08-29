import { useAuth } from '@/contexts/AuthContext';
import { palette } from '@/theme/palette';
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Animated,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';

const PasteIconButton = ({ onPaste }: { onPaste: (text: string) => void }) => {
    const scale = new Animated.Value(1);
    const handlePress = async () => {
        const text = await Clipboard.getStringAsync();
        onPaste(text.trim());
        Animated.sequence([
            Animated.timing(scale, { toValue: 0.8, duration: 100, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
    };
    return (
        <Animated.View style={{ transform: [{ scale }] }}>
            <Pressable style={styles.pasteIconBtn} onPress={handlePress}>
                <Ionicons name="clipboard-outline" size={20} color={palette.background} />
            </Pressable>
        </Animated.View>
    );
};

export default function ApplyCreatorScreen() {
    const { user, tokens, updateUser } = useAuth();
    const router = useRouter();

    const [instagram, setInstagram] = useState('');
    const [tiktok, setTiktok] = useState('');

    const [cities, setCities] = useState<any[]>([]);
    const [cityId, setCityId] = useState<string | null>(null);
    const [cityName, setCityName] = useState<string>('Selecciona una ciudad');
    const [modalVisible, setModalVisible] = useState(false);

    const API_URL = "http://192.168.68.79:3000";

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const res = await fetch(`${API_URL}/cities`, {
                    headers: { Authorization: `Bearer ${tokens?.accessToken}` },
                });
                if (!res.ok) throw new Error("Failed to load cities");
                const data = await res.json();
                setCities(data);
            } catch (err) {
                console.error(err);
            }
        };
        if (tokens?.accessToken) fetchCities();
    }, [tokens]);

    const submit = async () => {
        
        if (!cityId) {
            Toast.show({ type: "error", text1: "Debes seleccionar una ciudad." });
            return;
        }
        if (!instagram && !tiktok) {
            Toast.show({ type: "error", text1: "Debes ingresar al menos una red social." });
            return;
        }
        try {
            const res = await fetch(`${API_URL}/apply/creator`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${tokens?.accessToken}`,
                },
                body: JSON.stringify({
                    city_id: cityId,
                    instagram_link: instagram,
                    tiktok_link: tiktok,
                }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Error al postularse");
            }
            const data = await res.json();
            Toast.show({ type: "success", text1: "Solicitud enviada", text2: "Estamos revisando tu perfil" });
            updateUser({ influencer_status: data.profile.status });
            setTimeout(() => router.replace("/(tabs)/cuenta"), 1500);
        } catch (err: any) {
            Toast.show({ type: "error", text1: "Error", text2: err.message });
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
                <Text style={styles.title}>Postularse como Creador</Text>
                <Text style={styles.subtitle}>Cuéntanos sobre tu audiencia y categorías.</Text>

                <Text style={styles.label}>Nombre</Text>
                <TextInput
                    style={[styles.input, { backgroundColor: palette.surface, color: palette.textMuted }]}
                    value={user?.name || ''}
                    editable={false}
                />

                <Text style={styles.label}>Ciudad</Text>
                <Pressable style={styles.input} onPress={() => setModalVisible(true)}>
                    <Text style={{ color: cityId ? "white" : palette.textMuted }}>
                        {cityName}
                    </Text>
                </Pressable>

                <Modal visible={modalVisible} transparent animationType="slide">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalBox}>
                            <Text style={styles.modalTitle}>Selecciona una ciudad</Text>
                            <FlatList
                                data={cities}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <Pressable
                                        style={styles.modalItem}
                                        onPress={() => {
                                            setCityId(item.id);
                                            setCityName(item.name);
                                            setModalVisible(false);
                                        }}
                                    >
                                        <Text style={{ color: "white" }}>{item.name}</Text>
                                    </Pressable>
                                )}
                            />
                            <Pressable style={styles.closeBtn} onPress={() => setModalVisible(false)}>
                                <Text style={{ color: palette.background }}>Cerrar</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>

                <Text style={styles.label}>Instagram (link)</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        placeholder="https://instagram.com/tuusuario"
                        placeholderTextColor={palette.textMuted}
                        style={[styles.input, { flex: 1, borderWidth: 0, backgroundColor: "transparent" }]}
                        value={instagram}
                        onChangeText={setInstagram}
                    />
                    <PasteIconButton onPaste={setInstagram} />
                </View>

                <Text style={styles.label}>TikTok (link)</Text>
                <View style={styles.inputRow}>
                    <TextInput
                        placeholder="https://tiktok.com/@tuusuario"
                        placeholderTextColor={palette.textMuted}
                        style={[styles.input, { flex: 1, borderWidth: 0, backgroundColor: "transparent" }]}
                        value={tiktok}
                        onChangeText={setTiktok}
                    />
                    <PasteIconButton onPaste={setTiktok} />
                </View>

                <Pressable style={styles.submit} onPress={submit}>
                    <Text style={styles.submitTxt}>Enviar solicitud</Text>
                </Pressable>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background, padding: 16 },
    title: { color: 'white', fontSize: 22, fontWeight: '700' },
    subtitle: { color: palette.textMuted, marginBottom: 16 },
    label: { color: palette.textMuted, marginTop: 12 },
    input: {
        borderColor: palette.border,
        borderWidth: 1,
        borderRadius: 12,
        marginTop: 6,
        justifyContent: "center",
        height: 48,
        paddingHorizontal: 12,
        backgroundColor: palette.surface,
        color: palette.textMuted,
    },
    submit: {
        backgroundColor: palette.gold,
        padding: 14,
        borderRadius: 14,
        alignItems: 'center',
        marginTop: 20,
    },
    submitTxt: { color: palette.background, fontWeight: '800' },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: palette.border,
        borderWidth: 1,
        borderRadius: 12,
        marginTop: 6,
        overflow: "hidden",
        backgroundColor: palette.surface, // 👈 add this
    },
    pasteIconBtn: {
        backgroundColor: palette.gold,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
        marginRight: 5,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        padding: 20,
    },
    modalBox: {
        backgroundColor: palette.surface,
        borderRadius: 12,
        padding: 16,
        maxHeight: "70%",
    },
    modalTitle: { color: "white", fontSize: 18, marginBottom: 12, fontWeight: "600" },
    modalItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: palette.border,
    },
    closeBtn: {
        marginTop: 12,
        alignSelf: "center",
        backgroundColor: palette.gold,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
});
