import React, { useEffect, useState } from 'react';
import { Text, View, Image, ScrollView, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Feather, FontAwesome, AntDesign } from '@expo/vector-icons';
import { API_ACCESS_TOKEN } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Rekomendasi from '../components/movies/Rekomendasi';
import { WebView } from 'react-native-webview';

interface Genre {
  id: number;
  name: string;
}

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  vote_count: number;
  release_date: string;
  popularity: number;
  overview: string;
  genres: Genre[];
  runtime: number;
}

interface Trailer {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

const MovieDetail = ({ route }: any): JSX.Element => {
  const { id } = route.params;
  const [movieDetails, setMovieDetails] = useState<Movie | null>(null);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    fetchMovieDetails();
    fetchMovieTrailers();
    checkIsFavorite(id);
  }, [id]);

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${id}?language=en-US`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const movie = await response.json();
      setMovieDetails(movie);
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  const fetchMovieTrailers = async () => {
    try {
      const response = await fetch(`https://api.themoviedb.org/3/movie/${id}/videos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_ACCESS_TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const youtubeTrailers = data.results.filter((video: Trailer) => video.site === 'YouTube' && video.type === 'Trailer');
      setTrailers(youtubeTrailers);
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  const checkIsFavorite = async (movieId: number): Promise<void> => {
    try {
      const favoriteMovies = await AsyncStorage.getItem('@FavoriteList');
      if (favoriteMovies !== null) {
        const parsedFavorites: Movie[] = JSON.parse(favoriteMovies);
        const isFav = parsedFavorites.some(movie => movie.id === movieId);
        setIsFavorite(isFav);
      } else {
        setIsFavorite(false);
      }
    } catch (error) {
      console.error('Error checking favorite:', error);
    }
  };

  const addFavorite = async (movie: Movie): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      let favMovieList: Movie[] = initialData ? JSON.parse(initialData) : [];
  
      const movieExists = favMovieList.some(favMovie => favMovie.id === movie.id);
  
      if (!movieExists) {
        favMovieList = [...favMovieList, movie];
        await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList));
        setIsFavorite(true);
      }
    } catch (error) {
      console.log('Error adding to favorites:', error);
    }
  };
  
  const removeFavorite = async (movieId: number): Promise<void> => {
    try {
      const initialData: string | null = await AsyncStorage.getItem('@FavoriteList');
      
      if (initialData !== null) {
        let favMovieList: Movie[] = JSON.parse(initialData);
        favMovieList = favMovieList.filter(movie => movie.id !== movieId);
        
        await AsyncStorage.setItem('@FavoriteList', JSON.stringify(favMovieList));
        setIsFavorite(false);
      }
    } catch (error) {
      console.log('Error removing from favorites:', error);
    }
  };

  if (!movieDetails) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {trailers.length > 0 && (
        <View style={styles.trailerContainer}>
          <WebView
            style={styles.trailer}
            source={{ uri: `https://www.youtube.com/embed/${trailers[0].key}` }}
          />
        </View>
        
      )}
      
      <Text style={[styles.title, styles.textCenter]}>{movieDetails.title}</Text>
      
      <View style={styles.container1}>
      <TouchableOpacity style={styles.favoriteIcon} onPress={isFavorite ? () => removeFavorite(id) : () => addFavorite(movieDetails)}>
        <FontAwesome
          name={isFavorite ? 'heart' : 'heart-o'}
          size={30}
          color={isFavorite ? 'red' : 'black'}
        />
      </TouchableOpacity>
        <Image
          style={styles.poster1}
          source={{ uri: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` }}
          resizeMode="contain"
        />
        <View style={styles.detailsContainer}>
          
          <Text style={styles.detail}><Text style={styles.label}>Genre: </Text>{movieDetails.genres.map(genre => genre.name).join(', ')}</Text>
          <Text style={styles.detail}><Text style={styles.label}>Durasi: </Text>{movieDetails.runtime} menit</Text>
          <Text style={styles.detail}><Text style={styles.label}>Rilis: </Text>{movieDetails.release_date}</Text>
          <Text style={styles.detail}><Text style={styles.label}>Rating: </Text>{movieDetails.vote_average.toFixed(1)}</Text>
        </View>
      </View>
      <View style={styles.container2}>
        <Text style={styles.overview}><Text style={styles.label}>Sinopsis: </Text>{movieDetails.overview}</Text>
        <Rekomendasi movieId={id} />
      </View>
      
    </ScrollView>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  overview: {
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
  },
  textCenter: {
    textAlign: 'center',
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  trailerContainer: {
    marginBottom: 26,
    alignItems: 'center',
    width: windowWidth * 0.75, 
    height: (windowWidth * 0.55),
  },
  trailer: {
    width: windowWidth - 32,
    height: 150, 
  },
  poster: {
    width: windowWidth - 32,
    height: 400,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailsWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  detailsContainer: {
    flex: 1,
    paddingLeft: 16,
    borderRadius: 8,
    padding: 1,
    marginLeft: 16,
  },
  detailsContainer1: {
    flex: 1,
    marginTop: 12,
    fontSize: 16,
    lineHeight: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  detail: {
    fontSize: 16,
    marginBottom: 4,
  },
  label: {
    fontWeight: 'bold',
  },
  favoriteIcon: {
    marginTop:150,
    position: 'absolute',
    top: 14,
    right: 25,
    zIndex: 1,
  },
  container1: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
  },
  container2: {
    flexDirection: 'column',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    margin: 10,
  },
  poster1: {
    width: windowWidth * 0.3,
    height: windowWidth * 0.45,
    borderRadius: 8,
  },
});

export default MovieDetail;
