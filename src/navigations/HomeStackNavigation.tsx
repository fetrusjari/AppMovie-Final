import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Home';
import MovieDetailScreen from '../screens/MovieDetail';

const Stack = createNativeStackNavigator();

const HomeStackNavigation = (): JSX.Element => (
  <Stack.Navigator>
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{ headerShown: true,title: 'Dashboard ' }}
    />
    <Stack.Screen
      name="MovieDetail"
      component={MovieDetailScreen}
      options={{ title: 'Movie ' }}
    />
  </Stack.Navigator>
);

export default HomeStackNavigation;
