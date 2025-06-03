import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import MemoryGame from './src/components/MemoryGame';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={{ flex: 1 }}>
        <MemoryGame />
      </SafeAreaView>
    </>
  );
};

export default App;