// src/telas/RankScreen.js (Tela de ranking)
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { loadPokemonRanking } from '../components/MemoryGame';
import RankingScreen from './rank';

const RankScreen = ({ navigation }) => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRankingData = async () => {
      try {
        const loadedRanking = await loadPokemonRanking();
        setRanking(loadedRanking);
      } catch (error) {
        console.error('Erro ao carregar ranking:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadRankingData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3c5aa6" />
      </View>
    );
  }

  return (
    <RankingScreen 
      ranking={ranking}
      onBack={() => navigation.goBack()}
    />
  );
};

export default RankScreen;