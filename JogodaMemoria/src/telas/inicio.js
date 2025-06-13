// src/components/telas/inicio.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const Inicio = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../../assets/pokemon_tela.jpeg')} // Substitua pelo caminho correto do seu logo
        style={styles.logo}
        resizeMode="contain"
      />
      
      <Text style={styles.title}>Pokémon Memory Game</Text>
      <Text style={styles.subtitle}>Encontre todos os pares de Pokémon!</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.playButton]} 
          onPress={() => navigation.navigate('MemoryGame')}
        >
          <Text style={styles.buttonText}>Jogar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.rankButton]}
          onPress={() => navigation.navigate('Rank')}
        >
          <Text style={styles.buttonText}>Ver Ranking</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  logo: {
    width: 500,
    height: 150,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffcb05',
    textShadowColor: '#3c5aa6',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#3c5aa6',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  playButton: {
    backgroundColor: '#4CAF50',
  },
  rankButton: {
    backgroundColor: '#3c5aa6',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Inicio;