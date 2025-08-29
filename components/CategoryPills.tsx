// FILE: components/CategoryPills.tsx
import { palette } from "@/theme/palette";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

type Category = {
    id: string;
    name: string;
    slug: string;
};

type Props = {
    categories: Category[];
    onSelect?: (cat: { id: string; name: string; slug: string }) => void;
    selected?: string | null;
};

export const CategoryPills: React.FC<Props> = ({ categories, onSelect, selected }) => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {categories.map((c) => {
            const active = selected === c.slug;
            return (
                <Pressable
                    key={c.id}
                    style={[styles.pill, active && { borderColor: palette.gold }]}
                    onPress={() => onSelect?.(c)}
                >
                    <Text style={[styles.pillTxt]}>
                        {c.name}
                    </Text>
                </Pressable>
            );
        })}
    </ScrollView>
);

const styles = StyleSheet.create({
    pill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: palette.surface,
        borderColor: palette.border,
        borderWidth: 1,
        borderRadius: 20,
        marginRight: 8,
    },
    pillTxt: { color: "white", fontSize: 12 },
});
