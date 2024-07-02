
// export default Favorite;
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MovieItem from '../components/movies/Movieitem';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import MovieDetail from './MovieDetail';
import { Movie } from '../types/app'; // Import Movie interface from types/app

const FavoriteScreen = (): JSX.Element => {
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchFavoriteMovies();
  }, []);

  const fetchFavoriteMovies = async () => {
    try {
      const favoriteMoviesData = await AsyncStorage.getItem('@FavoriteList');
      if (favoriteMoviesData !== null) {
        const parsedFavoriteMovies: Movie[] = JSON.parse(favoriteMoviesData);
        const validFavoriteMovies = parsedFavoriteMovies.filter(movie => movie && movie.id);
        setFavoriteMovies(validFavoriteMovies);
      }
    } catch (error) {
      console.error('Error fetching favorite movies:', error);
    }
  };

  // Calculate item width based on screen width and number of columns
  const numColumns = 3;
  const screenWidth = Dimensions.get('window').width;
  const itemWidth = (screenWidth - 48) / numColumns; // Adjust padding as necessary
  const itemHeight = itemWidth * 1.3; // Adjust aspect ratio based on your MovieItem design

  const renderMovies = () => {
    const rows = Math.ceil(favoriteMovies.length / numColumns);
    const movieRows = [];

    for (let i = 0; i < rows; i++) {
      const row = favoriteMovies.slice(i * numColumns, (i + 1) * numColumns);
      const movieRow = (
        <View key={i} style={styles.row}>
          {row.map((movie, index) => (
            <MovieItem
              key={index}
              movie={movie}
              size={{ width: itemWidth, height: itemHeight }}
              coverType="poster"
            />
          ))}
        </View>
      );
      movieRows.push(movieRow);
    }

    return movieRows;
  };

  return (
    <View style={styles.container}>
      {favoriteMovies.length === 0 ? (
        <Text>No favorite movies found.</Text>
      ) : (

        <ScrollView contentContainerStyle={styles.scrollView}>
          {renderMovies()}
        </ScrollView>
      )}
    </View>
  );
};

const Stack = createNativeStackNavigator();

const Favorite = (): JSX.Element => (
  <NavigationContainer independent={true}>
    <Stack.Navigator>
      <Stack.Screen
        name="FavoriteScreen"
        component={FavoriteScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetail}
        options={{ title: 'Movie ' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30, // Adjust spacing from top
  },
  moviesContainer: {
    flexDirection: 'column', // Layout rows vertically
    alignItems: 'flex-start', // Start from top-left
    width: '100%',
  },
  row: {
    flexDirection: 'row', // Layout items horizontally
    justifyContent: 'space-between', // Adjust spacing between items
    marginBottom: 12, // Adjust spacing between rows
  },
  scrollView: {
    flexDirection: 'column', // Layout rows vertically
    alignItems: 'flex-start', // Start from top-left
    width: '100%',
  },
});

export default Favorite;
