import { DEFAULT_IMAGE } from "@/constants/images";
import { useFavouriteStore } from "@/src/features/favouriteStore";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  id: string;
  title: string;
  posterURL: string;
  imdbId: string;
  onPress: () => void;
};

export default function MovieCard({ id, title, posterURL, imdbId, onPress }: Props) {
  const favourites = useFavouriteStore((s) => s.favourites);
  const toggleFavourite = useFavouriteStore((s) => s.toggleFavourite);
  const isFavourite = favourites.includes(id);

  return (
    <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.8}>
      <Image
        source={{ uri: posterURL || DEFAULT_IMAGE }}
        style={styles.thumbnail}
      />

      <View style={styles.infoContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={styles.title}>{title}</Text>

          <TouchableOpacity
            onPress={() => toggleFavourite(id)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.favIcon}>
              {isFavourite ? "❤️" : "🤍"}
            </Text>
          </TouchableOpacity>
        </View>

        {imdbId && <Text style={styles.desc}>IMDb: {imdbId}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 12,
    marginVertical: 8,
    flexDirection: "row",
    gap: 12,
  },
  thumbnail: {
    width: 70,
    height: 105,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    flexShrink: 1,
  },
  desc: {
    color: "#555",
    marginTop: 4,
  },
  favIcon: {
    fontSize: 22,
  },
});
