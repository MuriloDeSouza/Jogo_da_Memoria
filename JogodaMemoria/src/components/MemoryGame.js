import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';

const MemoryGame = () => {
  const pokemonIds = [1, 4, 7, 25, 39, 54, 66, 129];
  
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(true); // Começa desabilitado até iniciar o jogo
  const [gameStarted, setGameStarted] = useState(false); // Controla se o jogo foi iniciado
  const [showAllCards, setShowAllCards] = useState(false); // Controla a exibição temporária de todas as cartas

  useEffect(() => {
    prepareGame();
  }, []);

  const getPokemonImageUrl = (id) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  const prepareGame = () => {
    // Cria pares de Pokémons
    const pokemonPairs = pokemonIds.reduce((acc, id) => {
      return [...acc, { id: `${id}-1`, pokemonId: id }, { id: `${id}-2`, pokemonId: id }];
    }, []);
    
    // Embaralha as cartas
    const shuffled = pokemonPairs
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ 
        ...card, 
        uniqueId: index,
        flipped: false 
      }));
    
    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
    setDisabled(true);
    setGameStarted(false);
  };

  const startGame = () => {
    setGameStarted(true);
    setShowAllCards(true);
    
    // Mostra todas as cartas por 3 segundos
    const allCardIds = cards.map(card => card.uniqueId);
    setFlipped(allCardIds);
    
    setTimeout(() => {
      setShowAllCards(false);
      setFlipped([]);
      setDisabled(false); // Habilita o jogo após esconder as cartas
    }, 3000); // 3 segundos para memorizar
  };

  const initializeGame = () => {
    prepareGame();
  };

  const handleCardPress = (uniqueId) => {
    if (disabled || !gameStarted) return;
    if (flipped.includes(uniqueId) || solved.includes(uniqueId)) return;
    
    const newFlipped = [...flipped, uniqueId];
    setFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      setDisabled(true);
      checkForMatch(newFlipped);
    }
  };

  const checkForMatch = (flippedCards) => {
    const [firstId, secondId] = flippedCards;
    const firstCard = cards.find(card => card.uniqueId === firstId);
    const secondCard = cards.find(card => card.uniqueId === secondId);
    
    if (firstCard.pokemonId === secondCard.pokemonId) {
      setSolved([...solved, firstId, secondId]);
      resetTurn();
    } else {
      setTimeout(resetTurn, 1000);
    }
  };

  const resetTurn = () => {
    setFlipped([]);
    setDisabled(false);
    
    if (solved.length + 2 === cards.length && cards.length > 0) {
      Alert.alert('Parabéns!', 'Você encontrou todos os Pokémons!', [
        { text: 'Jogar Novamente', onPress: initializeGame }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokémon Memory Game</Text>
      
      <View style={styles.board}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.uniqueId}
            style={[
              styles.card,
              (flipped.includes(card.uniqueId) || solved.includes(card.uniqueId) || showAllCards
                ? styles.cardFlipped 
                : styles.cardBack
              )]}
            onPress={() => handleCardPress(card.uniqueId)}
            disabled={solved.includes(card.uniqueId) || !gameStarted}
          >
            {(flipped.includes(card.uniqueId) || solved.includes(card.uniqueId) || showAllCards ? (
              <Image
                source={{ uri: getPokemonImageUrl(card.pokemonId) }}
                style={styles.pokemonImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.cardText}>?</Text>
             ))}
          </TouchableOpacity>
        ))}
      </View>
      
      {!gameStarted && (
        <TouchableOpacity style={[styles.button, styles.startButton]} onPress={startGame}>
          <Text style={styles.buttonText}>Iniciar Jogo</Text>
        </TouchableOpacity>
      )}
      
      <TouchableOpacity style={styles.button} onPress={initializeGame}>
        <Text style={styles.buttonText}>Reiniciar Jogo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffcb05',
    textShadowColor: '#3c5aa6',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  card: {
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3c5aa6',
  },
  cardBack: {
    backgroundColor: '#3c5aa6',
  },
  cardFlipped: {
    backgroundColor: '#fff',
  },
  cardText: {
    fontSize: 24,
    color: '#3c5aa6',
    fontWeight: 'bold',
  },
  pokemonImage: {
    width: 70,
    height: 70,
  },
  button: {
    backgroundColor: '#3c5aa6',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  startButton: {
    backgroundColor: '#4CAF50', // Cor diferente para o botão de iniciar
  },
  buttonText: {
    color: '#ffcb05',
    fontWeight: 'bold',
  },
});

export default MemoryGame;