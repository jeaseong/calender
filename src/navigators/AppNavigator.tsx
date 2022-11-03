import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTapNavigator from './BottomTapNavigator';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Main" component={BottomTapNavigator} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
