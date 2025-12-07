import MovieCard from "@/components/ui/movieCard";
import { useFavouriteStore } from "@/src/features/favouriteStore";
import { useMoviesStore } from "@/src/store/useMoviesStore";
import { router } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FavouritesScreen() {
  const favourites = useFavouriteStore((s) => s.favourites);
  const movies = useMoviesStore((s) => s.movies);

  const favMovies = movies.filter((m) => favourites.includes(String(m.id)));

  return (
    <SafeAreaView style={styles.safeArea}>
      {favMovies.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Please add a favourite movie</Text>
        </View>
      ) : (
        <FlatList
          data={favMovies}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <MovieCard
              id={String(item.id)}
              title={item.title}
              posterURL={item.posterURL}
              imdbId={item.imdbId}
              onPress={() => router.push(`/movie/${item.id}`)}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "white",
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },

  emptyText: {
    fontSize: 18,
    color: "#777",
    textAlign: "center",
  },

  listContainer: {
    padding: 16,
    paddingBottom: 24,
  },
});
