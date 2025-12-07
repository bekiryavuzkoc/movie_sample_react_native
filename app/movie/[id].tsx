import AnimatedHeart from "@/components/ui/animatedHearth";
import { DEFAULT_IMAGE } from "@/constants/images";
import { useFavouriteStore } from "@/src/features/favouriteStore";
import { useMovieDetailStore } from "@/src/store/useMovieDetailStore";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();
  const { movie, loading, error, loadMovie, clear } = useMovieDetailStore();

  const favourites = useFavouriteStore((s) => s.favourites);
  const toggleFavourite = useFavouriteStore((s) => s.toggleFavourite);

  const isFavourite = favourites.includes(String(id));

  useEffect(() => {
    if (id) {
      loadMovie(id as string);
    }
    return () => clear();
  }, [id]);

  if (loading || !movie) {
    return <Text style={{ margin: 20 }}>Loading...</Text>;
  }

  if (error) {
    return (
      <Text style={{ margin: 20, color: "red" }}>Error: {error}</Text>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.posterWrapper}>
        <Image
          source={{ uri: movie.posterURL || DEFAULT_IMAGE }}
          style={styles.poster}
        />

        <TouchableOpacity
          style={styles.favButton}
          onPress={() => toggleFavourite(String(movie.id))}
          activeOpacity={0.7}
        >
          <AnimatedHeart
             active={isFavourite}
             onPress={() => toggleFavourite(String(movie.id))}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{movie.title}</Text>

      <Text style={styles.imdb}>IMDb: {movie.imdbId}</Text>

      <Text style={styles.desc}>
        This is sample movie data from SampleAPIs, so detailed description is
        not provided.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },

  posterWrapper: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
  },

  poster: {
    width: "100%",
    height: 420,
  },

  favButton: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.35)",
    padding: 10,
    borderRadius: 30,
  },

  favIcon: {
    fontSize: 30,
    color: "white",
  },

  title: {
    fontWeight: "bold",
    fontSize: 28,
    marginTop: 16,
  },

  imdb: {
    color: "#666",
    fontSize: 16,
    marginTop: 6,
  },

  desc: {
    marginTop: 14,
    fontSize: 16,
    lineHeight: 22,
    color: "#444",
  },
});
