import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CategorySearch from '../components/search/CategorySearch';
import KeywordSearch from '../components/search/KeywordSearch';
import { API_ACCESS_TOKEN } from '@env';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import MovieDetail from './MovieDetail';
import { Movie } from '../types/app'; // Import Movie interface from types/app

const SearchScreen = (): JSX.Element => {
  const [selectedBar, setSelectedBar] = useState<string>('category');
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?language=en`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${API_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setGenres(data.genres); // Simpan data genre ke dalam state
        } else {
          console.error('Failed to fetch genres');
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreSelect = (genreId: number) => {
    console.log('Selected genre:', genreId);
    // Lakukan sesuatu dengan genreId seperti pencarian film berdasarkan genre
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBarContainer}>
        {['keyword', 'category'].map((item: string, index: number) => (
          <TouchableOpacity
            key={item}
            activeOpacity={0.9}
            style={{
              ...styles.topBar,
              backgroundColor: item === selectedBar ? '#8978A4' : '#C0B4D5',
              borderTopLeftRadius: index === 0 ? 100 : 0,
              borderBottomLeftRadius: index === 0 ? 100 : 0,
              borderTopRightRadius: index === 1 ? 100 : 0,
              borderBottomRightRadius: index === 1 ? 100 : 0,
            }}
            onPress={() => {
              setSelectedBar(item);
            }}
          >
            <Text style={styles.topBarLabel}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {selectedBar === 'keyword' ? (
        <KeywordSearch />
      ) : (
        <CategorySearch genres={genres} onSelectGenre={handleGenreSelect} />
      )}
    </View>
  );
};

const Stack = createNativeStackNavigator();

const Search = (): JSX.Element => (
  <NavigationContainer independent={true}>
    <Stack.Navigator>
      <Stack.Screen
        name="SearchScreen"
        component={SearchScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MovieDetail"
        component={MovieDetail}
        options={{ title: 'Movie Detail' }}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  topBarContainer: {
    flexDirection: 'row',
    width: '100%',
  },
  topBar: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
    height: 60,
  },
  topBarLabel: {
    color: 'white',
    fontSize: 20,
    fontWeight: '400',
    textTransform: 'capitalize',
  },
});

export default Search;
