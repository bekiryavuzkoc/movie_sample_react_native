import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

type SearchBarProps = {
  value: string;
  onChange: (text: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <View style={styles.container}>
      <Ionicons name="search" size={20} color="#888" style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search movies..."
        placeholderTextColor="#999"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#DDD",
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,

    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 12,
  },

  icon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
});