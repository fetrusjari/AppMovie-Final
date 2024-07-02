// components/search/CategorySearch.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { API_ACCESS_TOKEN } from '@env';
import MovieItem from '../movies/Movieitem';
import type { Movie } from '../../types/app';

interface CategorySearchProps {
  genres: { id: number; name: string }[];
  onSelectGenre: (genreId: number) => void;
}

const CategorySearch: React.FC<CategorySearchProps> = ({ genres, onSelectGenre }) => {
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);

  const fetchMoviesByGenre = async (genreId: number) => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&page=1`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        // Filter and map movies with necessary details
        const detailedMovies = data.results.map((movie: any) => ({
          id: movie.id,
          title: movie.title,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          vote_average: movie.vote_average,
        }));
        setMovies(detailedMovies);
        setSelectedGenre(genreId); // Set genre yang dipilih
      } else {
        console.error('Failed to fetch movies by genre');
      }
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
    }
  };

  const numColumns = 3;
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 90) / numColumns; // Adjust padding as necessary
  const itemHeight = itemWidth * 1.4; // Adjust aspect ratio based on your MovieItem design

  const renderItem = ({ item }: { item: Movie }) => (
    <MovieItem
      movie={item}
      size={{ width: itemWidth, height: itemHeight }}
      coverType="poster"
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Category</Text>
      <View style={styles.genreContainer}>
        {genres.map((genre) => (
          (selectedGenre === null || selectedGenre === genre.id) && (
            <TouchableOpacity
              key={genre.id}
              style={{
                ...styles.genreButton,
                backgroundColor: selectedGenre === genre.id ? '#8978A4' : '#C0B4D5',
              }}
              onPress={() => {
                onSelectGenre(genre.id);
                fetchMoviesByGenre(genre.id); // Panggil fungsi untuk mengambil film berdasarkan genre
              }}
            >
              <Text style={styles.genreLabel}>{genre.name}</Text>
            </TouchableOpacity>
          )
        ))}
      </View>
      {movies.length > 0 && (
        <FlatList
          data={movies}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={numColumns}
          contentContainerStyle={styles.movieList}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  genreButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 8,
    borderRadius: 20,
    backgroundColor: '#C0B4D5',
  },
  genreLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  movieList: {
    paddingVertical: 16,
    marginTop: 10,
  },
});

export default CategorySearch;