import { useAuth } from '@/contexts/AuthContext';
import { palette } from '@/theme/palette';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function VenueDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const { tokens } = useAuth();
    const [venue, setVenue] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [slots, setSlots] = useState<any[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);

    const API_URL = "http://192.168.68.79:3000";

    useEffect(() => {
        const fetchVenue = async () => {
            try {
                const res = await fetch(`${API_URL}/business/${id}`, {
                    headers: { Authorization: `Bearer ${tokens?.accessToken}` },
                });
                if (!res.ok) throw new Error("Failed to load business");
                const data = await res.json();
                setVenue(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchVenue();
    }, [id, tokens]);

    useEffect(() => {
        const fetchSlots = async () => {
            try {
                const res = await fetch(`${API_URL}/business/${id}/slots`, {
                    headers: { Authorization: `Bearer ${tokens?.accessToken}` },
                });
                if (!res.ok) throw new Error("Failed to load slots");
                const data = await res.json();
                setSlots(data);
            } catch (err) {
                console.error(err);
            }
        };
        if (id) fetchSlots();
    }, [id, tokens]);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
                <ActivityIndicator color={palette.gold} size="large" />
            </View>
        );
    }

    if (!venue) {
        return (
            <View style={styles.container}>
                <Text style={{ color: "white", padding: 16 }}>No se encontró el negocio.</Text>
            </View>
        );
    }

    let requirements: string[] = [];
    if (venue.requirements) {
        if (Array.isArray(venue.requirements)) {
            requirements = venue.requirements;
        } else if (typeof venue.requirements === "string") {
            requirements = [venue.requirements];
        } else if (typeof venue.requirements === "object") {
            requirements = Object.values(venue.requirements);
        }
    }

    const renderSlot = ({ item }: { item: any }) => {
        const start = new Date(item.slot_start);
        const end = new Date(item.slot_end);
        const label = `${start.toLocaleDateString("es-ES", {
            weekday: "short",
            day: "2-digit",
            month: "short",
        })} ${start.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
        })} - ${end.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}`;
        const isSelected = selectedSlot && selectedSlot.slot_start === item.slot_start;

        return (
            <Pressable
                style={[styles.slotChip, isSelected && styles.slotChipSelected]}
                onPress={() => setSelectedSlot(item)}
            >
                <Text style={[styles.slotText, isSelected && styles.slotTextSelected]}>
                    {label} ({item.available})
                </Text>
            </Pressable>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                {/* Hero Section */}
                <ImageBackground
                    source={{ uri: venue.avatar_url || "https://placehold.co/600x400" }}
                    style={styles.hero}
                >
                    <View style={styles.heroOverlay} />
                    <Pressable style={styles.backBtn} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={22} color="white" />
                    </Pressable>
                    <Text style={styles.heroTitle}>{venue.name}</Text>
                </ImageBackground>

                <View style={styles.body}>
                    {/* Info Pills */}
                    <View style={styles.infoRow}>
                        <View style={styles.infoPill}>
                            <Text style={styles.infoLabel}>Ciudad</Text>
                            <Text style={styles.infoValue}>{venue.city}</Text>
                        </View>
                        <View style={styles.infoPill}>
                            <Text style={styles.infoLabel}>Categoría</Text>
                            <Text style={styles.infoValue}>{venue.category_name}</Text>
                        </View>
                        <View style={styles.infoPill}>
                            <Text style={styles.infoLabel}>Crédito</Text>
                            <Text style={styles.infoValue}>${venue.default_visit_credit}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    {venue.description && (
                        <>
                            <Text style={styles.sectionTitle}>Descripción</Text>
                            <Text style={styles.desc}>{venue.description}</Text>
                        </>
                    )}

                    {/* Requirements */}
                    {requirements.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Requisitos</Text>
                            {requirements.map((r, i) => (
                                <Text key={i} style={styles.reqItem}>• {r}</Text>
                            ))}
                        </>
                    )}

                    {/* Slots */}
                    {slots.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Próximos horarios disponibles</Text>
                            <FlatList
                                data={slots}
                                renderItem={renderSlot}
                                keyExtractor={(_, i) => i.toString()}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingVertical: 10 }}
                            />
                        </>
                    )}
                </View>
            </ScrollView>

            {/* Footer CTA */}
            <View style={styles.footer}>
                <Pressable
                    style={[styles.cta, !selectedSlot && styles.ctaDisabled]}
                    disabled={!selectedSlot}
                    onPress={() =>
                        router.push(
                            `/visit-pass/${venue.id}?slot=${encodeURIComponent(selectedSlot.slot_start)}`
                        )
                    }
                >
                    <Text style={styles.ctaTxt}>
                        {selectedSlot ? "Confirmar Visita" : "Selecciona un horario"}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background },

    // Hero
    hero: { height: 280, justifyContent: "flex-end" },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.35)",
    },
    heroTitle: {
        color: "white",
        fontSize: 28,
        fontWeight: "800",
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    backBtn: {
        position: "absolute",
        top: 40,
        left: 16,
        backgroundColor: "rgba(0,0,0,0.6)",
        padding: 8,
        borderRadius: 20,
    },

    // Info Pills
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 12,
        marginBottom: 12,
    },
    infoPill: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 20,
        alignItems: "center",
        borderColor: palette.gold,
        borderWidth: 1,
    },
    infoLabel: { color: palette.textMuted, fontSize: 11 },
    infoValue: { color: "white", fontWeight: "600", fontSize: 13 },

    // Sections
    body: { padding: 16 },
    sectionTitle: {
        color: "white",
        fontWeight: "600",
        fontSize: 16,
        marginTop: 20,
        marginBottom: 6,
    },
    desc: { color: palette.textMuted, fontSize: 14, lineHeight: 20 },
    reqItem: { color: "white", marginBottom: 6, fontSize: 14 },

    // Slots
    slotChip: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: 18,
        marginRight: 8,
        borderWidth: 1,
        borderColor: palette.gold,
        backgroundColor: "transparent",
    },
    slotChipSelected: { backgroundColor: palette.gold },
    slotText: { color: palette.gold, fontSize: 13, fontWeight: "500" },
    slotTextSelected: { color: palette.background, fontWeight: "700" },

    // Footer CTA
    footer: {
        padding: 16,
        backgroundColor: "transparent",
    },
    cta: {
        backgroundColor: palette.gold,
        padding: 16,
        borderRadius: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 5,
    },
    ctaDisabled: { opacity: 0.5 },
    ctaTxt: { color: palette.background, fontWeight: "700", fontSize: 16 },
});
