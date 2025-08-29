import { CategoryPills } from "@/components/CategoryPills";
import { VenueCard } from "@/components/VenueCard";
import { useAuth } from "@/contexts/AuthContext";
import { palette } from "@/theme/palette";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function Businesses() {
    const router = useRouter();
    const { tokens } = useAuth();

    const [businesses, setBusinesses] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);

    const API_URL = "http://192.168.68.79:3000";

    const fetchBusinesses = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (selectedCategory) params.append("category", selectedCategory);
            if (search) params.append("q", search);

            const res = await fetch(`${API_URL}/business?${params.toString()}`, {
                headers: { Authorization: `Bearer ${tokens?.accessToken}` },
            });
            if (!res.ok) throw new Error("Failed to load businesses");
            const data = await res.json();
            setBusinesses(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/business-categories`, {
                headers: { Authorization: `Bearer ${tokens?.accessToken}` },
            });
            if (!res.ok) throw new Error("Failed to load categories");
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (tokens?.accessToken) {
            fetchCategories();
            fetchBusinesses();
        }
    }, [tokens]);

    // refetch when category/search changes
    useEffect(() => {
        if (tokens?.accessToken) {
            fetchBusinesses();
        }
    }, [selectedCategory, search]);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 32, paddingTop: 50 }}
        >
            {/* Header row */}
            <View style={styles.headerRow}>
                <Text style={styles.screenTitle}>Todos los negocios</Text>
                <Pressable onPress={() => setSelectedCategory(null)}>
                    <Text style={styles.resetBtn}>Ver todo</Text>
                </Pressable>
            </View>

            {/* Search bar */}
            <View style={styles.searchRow}>
                <Ionicons name="search" size={18} color={palette.textMuted} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar negocios..."
                    placeholderTextColor={palette.textMuted}
                    value={search}
                    onChangeText={setSearch}
                />
                {search.length > 0 && (
                    <Pressable onPress={() => setSearch("")}>
                        <Ionicons name="close" size={18} color={palette.textMuted} />
                    </Pressable>
                )}
            </View>

            {/* Category filters */}
            <CategoryPills
                categories={categories}
                selected={selectedCategory}
                onSelect={(category) =>
                    setSelectedCategory((prev) =>
                        prev === category.slug ? null : category.slug
                    )
                }
            />

            {/* Businesses list */}
            {loading ? (
                <ActivityIndicator color={palette.gold} style={{ marginTop: 24 }} />
            ) : businesses.length === 0 ? (
                <Text style={{ color: "white", marginTop: 24, textAlign: "center" }}>
                    No se encontraron negocios
                </Text>
            ) : (
                <View style={styles.list}>
                    {businesses.map((b) => (
                        <View key={b.id} style={{ marginBottom: 12 }}>
                            <VenueCard
                                venue={{
                                    id: b.id,
                                    title: b.name,
                                    description: b.description,
                                    image: b.avatar_url || "https://placehold.co/400x300",
                                    price: `$${b.default_visit_credit}`,
                                    category: b.category_name ?? b.category, // adjust depending on backend
                                }}
                                onPress={() => router.push(`/venue/${b.id}`)}
                            />
                        </View>
                    ))}
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.background, padding: 16 },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    screenTitle: { color: "white", fontWeight: "700", fontSize: 20 },
    resetBtn: { color: palette.gold, fontWeight: "600", fontSize: 14 },
    searchRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: palette.surface,
        borderColor: palette.border,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        color: "white",
        paddingVertical: 8,
        marginLeft: 8,
    },
    list: { marginTop: 16 },
});
