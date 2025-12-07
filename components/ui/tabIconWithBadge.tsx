import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

type Props = {
  count: number;
  color: string;
};

export default function TabIconWithBadge({ count, color }: Props) {
  const scale = useSharedValue(count > 0 ? 1 : 0);

  // Badge görünüm animasyonu
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Her değişimde animasyonu tetikle
  React.useEffect(() => {
    scale.value = withTiming(count > 0 ? 1 : 0, { duration: 180 });
  }, [count]);

  return (
    <View style={styles.container}>
      {/* Ana icon */}
      <Text style={[styles.star, { color }]}>{count > 0 ? "⭐" : "☆"}</Text>

      {/* Badge (count > 0 olduğunda) */}
      {count > 0 && (
        <Animated.View style={[styles.badge, animatedStyle]}>
          <Text style={styles.badgeText}>{count}</Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  star: {
    fontSize: 22,
  },

  badge: {
    position: "absolute",
    top: -2,
    right: -4,
    backgroundColor: "#FF3B30", // iOS native badge red
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    justifyContent: "center",
    alignItems: "center",

    // iOS-style elevation
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },

  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 12,
  },
});
