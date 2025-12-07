import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MovieCard from "@/components/ui/movieCard";
import MovieSkeleton from "@/components/ui/movieSkeleton";
import SearchBar from "@/components/ui/searchBar";
import { useMoviesStore } from "@/src/store/useMoviesStore";

export default function HomeScreen() {
  const { movies, loading, error, loadMovies } = useMoviesStore();
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    loadMovies();
  }, []);

  const filteredMovies = useMemo(() => {
    return movies.filter((m) =>
      m.title.toLowerCase().includes(query.toLowerCase())
    );
  }, [movies, query]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ padding: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <MovieSkeleton key={i} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>

      <SearchBar value={query} onChange={setQuery} />

      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MovieCard
            id={String(item.id)}
            title={item.title}
            posterURL={item.posterURL}
            imdbId={item.imdbId}
            onPress={() => router.push(`/movie/${item.id}`)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  loading: {
    marginTop: 50,
    textAlign: "center",
    fontSize: 16,
  },

  error: {
    marginTop: 50,
    textAlign: "center",
    color: "red",
    fontSize: 16,
  },
});
