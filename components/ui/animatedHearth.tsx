import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from "react-native-reanimated";
import { TouchableOpacity, Text } from "react-native";

export default function AnimatedHeart({ active, onPress }: any) {
  const scale = useSharedValue(1);

  const animate = () => {
    scale.value = 0.7;
    scale.value = withSpring(1, {
      damping: 6,
      stiffness: 120,
    });
    onPress();
  };

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={style}>
      <TouchableOpacity onPress={animate}>
        <Text style={{ fontSize: 28 }}>
          {active ? "❤️" : "🤍"}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
}
