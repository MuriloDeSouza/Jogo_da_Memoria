// src/telas/rank.js (Componente de apresentação)
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const RankingScreen = ({ ranking, onBack }) => {
  return (
    <View style={styles.rankingContainer}>
      <Text style={styles.rankingTitle}>Top Jogadores</Text>
      
      {ranking.length === 0 ? (
        <Text style={styles.noRankingText}>Nenhum registro de ranking ainda</Text>
      ) : (
        <View style={styles.rankingList}>
          {ranking.map((item, index) => (
            <View key={index} style={styles.rankingItem}>
              <Text style={styles.rankingPosition}>{index + 1}.</Text>
              <Text style={styles.rankingName}>{item.name}</Text>
              <Text style={styles.rankingScore}>{item.score} pts</Text>
              <Text style={styles.rankingTime}>{item.time}s</Text>
              <Text style={styles.rankingElement}>{item.element}</Text>
            </View>
          ))}
        </View>
      )}
      
      <TouchableOpacity 
        style={styles.backButton}
        onPress={onBack}
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  rankingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  rankingTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#3c5aa6',
  },
  noRankingText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  rankingList: {
    width: '100%',
    maxWidth: 350,
    marginBottom: 30,
  },
  rankingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rankingPosition: {
    fontWeight: 'bold',
    color: '#3c5aa6',
    width: 30,
  },
  rankingName: {
    flex: 1,
    marginLeft: 10,
  },
  rankingScore: {
    fontWeight: 'bold',
    color: '#ffcb05',
    width: 70,
    textAlign: 'right',
  },
  rankingTime: {
    color: '#666',
    width: 50,
    textAlign: 'right',
  },
  rankingElement: {
    color: '#666',
    width: 60,
    textAlign: 'center',
    marginLeft: 10,
  },
  backButton: {
    backgroundColor: '#3c5aa6',
    padding: 15,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffcb05',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default RankingScreen;