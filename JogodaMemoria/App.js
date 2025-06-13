import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView, StatusBar } from 'react-native';
import Inicio from './src/telas/inicio';
import MemoryGame from './src/components/MemoryGame';
import RankScreen from './src/telas/RankScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Inicio">
            <Stack.Screen 
              name="Inicio" 
              component={Inicio} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="MemoryGame" 
              component={MemoryGame} 
              options={{ 
                title: 'Jogo da Memória Pokémon',
                headerStyle: {
                  backgroundColor: '#3c5aa6',
                },
                headerTintColor: '#ffcb05',
                headerTitleStyle: {
                  fontWeight: 'bold',
                }
              }} 
            />
            <Stack.Screen 
              name="Rank" 
              component={RankScreen} 
              options={{ 
                title: 'Ranking',
                headerStyle: {
                  backgroundColor: '#3c5aa6',
                },
                headerTintColor: '#ffcb05',
                headerTitleStyle: {
                  fontWeight: 'bold',
                }
              }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </>
  );
};

export default App;