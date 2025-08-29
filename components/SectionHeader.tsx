// FILE: components/SectionHeader.tsx
import { palette } from "@/theme/palette";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Link = {
  label: string;
  href?: string;
  onPress?: () => void;
};

type Props = {
  title: string;
  link?: Link;
};

export const SectionHeader: React.FC<Props> = ({ title, link }) => {
  const router = useRouter();

  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {link && (
        <Pressable
          onPress={() => {
            if (link.onPress) {
              link.onPress();
            } else if (link.href) {
              router.push(link.href);
            }
          }}
        >
          <Text style={styles.link}>{link.label}</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8, marginTop: 20 },
  title: { color: "white", fontWeight: "700", fontSize: 16 },
  link: { color: palette.gold, fontWeight: "600", fontSize: 14 },
});
