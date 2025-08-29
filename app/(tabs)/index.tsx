import { BalanceCard } from '@/components/BalanceCard';
import { CategoryPills } from '@/components/CategoryPills';
import { SectionHeader } from '@/components/SectionHeader';
import { VenueCard } from '@/components/VenueCard';
import { useAuth } from '@/contexts/AuthContext';
import { palette } from '@/theme/palette';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user, tokens } = useAuth();
  const [businesses, setBusinesses] = useState<any[]>([]);

  // 👇 new wallet state
  const [balance, setBalance] = useState(0);
  const [weeklyAllowance, setWeeklyAllowance] = useState(0);

  // 👇 new categories state
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const API_URL = "http://192.168.68.79:3000";

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await fetch(`${API_URL}/business`, {
          headers: { Authorization: `Bearer ${tokens?.accessToken}` },
        });
        if (!res.ok) throw new Error("Failed to load businesses");
        const data = await res.json();
        setBusinesses(data);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchWallet = async () => {
      try {
        const res = await fetch(`${API_URL}/wallet`, {
          headers: { Authorization: `Bearer ${tokens?.accessToken}` },
        });
        if (!res.ok) throw new Error("Failed to load wallet");
        const data = await res.json();
        setBalance(data.balance ?? 0);
        setWeeklyAllowance(data.weekly_allowance ?? 0);
      } catch (err) {
        console.error(err);
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

    if (tokens?.accessToken) {
      fetchBusinesses();
      fetchWallet();
      fetchCategories();
    }
  }, [tokens]);

  const filteredBusinesses = selectedCategory
    ? businesses.filter(b => b.category_slug?.toLowerCase() === selectedCategory.toLowerCase())
    : businesses;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 32, paddingTop: 50 }}
    >
      {/* Top bar */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.push("/cuenta")}>
          <View style={styles.profileRow}>
            <Image source={{ uri: user?.avatar_url }} style={styles.avatar} />
            <View>
              <Text style={styles.userName}>{user?.name}</Text>
            </View>
          </View>
        </Pressable>
        <Pressable
          style={styles.supportBtn}
          onPress={() => router.push("/")}
        >
          <Ionicons
            name="chatbubble-ellipses"
            size={16}
            color={palette.background}
          />
          <Text style={styles.supportTxt}>Soporte</Text>
        </Pressable>
      </View>

      {/* Wallet (now dynamic) */}
      <BalanceCard
        balance={balance}
        allowanceWeekly={weeklyAllowance}
        userId={user?.id} // just as a fake card number
      />

      <View style={styles.categoryRow}>
        <Text style={styles.categoryTitle}>Categorías</Text>
        <Ionicons name="chevron-down" size={18} color={palette.textMuted} />
      </View>
      <CategoryPills
        categories={categories}
        selected={selectedCategory}
        onSelect={(category) =>
          setSelectedCategory(prev => prev === category.slug ? null : category.slug)
        }
      />
      
      <SectionHeader
        title="Destacados"
        link={{
          label: "Ver todo",
          onPress: () => setSelectedCategory(null), // 👈 clears the filter
        }}
      />

      {/* Featured Businesses */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 8 }}
      >
        {filteredBusinesses.map((b) => (
          <View key={b.id} style={{ marginRight: 12 }}>
            <VenueCard
              venue={{
                id: b.id,
                title: b.name,
                description: b.description,
                image: b.avatar_url || "https://placehold.co/400x300",
                price: `$${b.default_visit_credit}`, // shows credit as price
                category: b.category_name,
              }}
              size="lg"
              onPress={() => router.push(`/venue/${b.id}`)}
            />
          </View>
        ))}
      </ScrollView>

      {/* Available Venues */}
      <SectionHeader title="Lugares disponibles" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginBottom: 8 }}
      >
        {filteredBusinesses.map((b) => (
          <View key={b.id} style={{ marginRight: 12 }}>
            <VenueCard
              venue={{
                id: b.id,
                title: b.name,
                description: b.description,
                image: b.avatar_url || "https://placehold.co/400x300",
                price: `$${b.default_visit_credit}`,
                category: b.category_name,
              }}
            />

          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.background, padding: 16 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  userName: { color: 'white', fontWeight: '600' },
  tier: { color: palette.textMuted, fontSize: 12 },
  supportBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: palette.gold, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  supportTxt: { color: palette.background, fontWeight: '700', fontSize: 12 },
  categoryRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 18, marginBottom: 12 },
  categoryTitle: { color: 'white', fontWeight: '600', fontSize: 16 },
});
