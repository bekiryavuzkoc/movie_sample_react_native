import { View, StyleSheet, Animated } from "react-native";
import { useEffect, useRef } from "react";

export default function MovieSkeleton() {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      {/* Poster skeleton */}
      <View style={styles.thumbnail} />

      {/* Text skeletons */}
      <View style={styles.info}>
        <View style={styles.line} />
        <View style={[styles.line, { width: "40%" }]} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 12,
    marginVertical: 8,
    alignItems: "center",
  },

  thumbnail: {
    width: 60,
    height: 90,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },

  info: {
    flex: 1,
    marginLeft: 12,
  },

  line: {
    height: 14,
    backgroundColor: "#ddd",
    borderRadius: 6,
    marginBottom: 8,
  },
});
