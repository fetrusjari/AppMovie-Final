import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, StackActions } from '@react-navigation/native';
import { API_ACCESS_TOKEN } from '@env';
import type { MovieListProps, Movie } from '../../types/app';
import MovieItem from './Movieitem';

const Rekomendasi = ({ movieId }: { movieId: number }): JSX.Element => {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchRecommendations();
  }, [movieId]);

  const fetchRecommendations = async () => {
    const url = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?language=en-US&page=1`;
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_ACCESS_TOKEN}`,
      },
    };

    try {
      console.log(`Fetching recommendations from: ${url}`);
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Network response was not ok: ${errorText}`);
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      setRecommendations(data.results);
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  const pushAction = (movieId: number) => {
    return StackActions.push('MovieDetail', { id: movieId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <View style={styles.purpleLabel}></View>
        <Text style={styles.label}>Rekomendasi</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {recommendations.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.dispatch(pushAction(item.id))}
            style={styles.movieContainer}
          >
            <MovieItem movie={item} size={{ width: 100, height: 160 }} coverType="poster" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  purpleLabel: {
    width: 20,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8978A4',
    marginRight: 12,
  },
  movieContainer: {
    marginRight: 8,
  },
});

export default Rekomendasi;
