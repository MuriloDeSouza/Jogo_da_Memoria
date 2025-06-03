import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const MemoryGame = () => {
  // Emojis para o jogo (pares de cartas)
  const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
  
  // Duplica os emojis para formar pares e embaralha
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(false);

  // Inicializa o jogo
  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    // Duplica e embaralha as cartas
    const pairedEmojis = [...emojis, ...emojis];
    const shuffled = pairedEmojis
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false }));
    
    setCards(shuffled);
    setFlipped([]);
    setSolved([]);
  };

  const handleCardPress = (id) => {
    // Evita cliques enquanto animação está ocorrendo
    if (disabled) return;
    
    // Não faz nada se a carta já está virada ou resolvida
    if (flipped.includes(id) || solved.includes(id)) return;
    
    // Vira a carta
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    
    // Verifica se formou um par
    if (newFlipped.length === 2) {
      setDisabled(true);
      checkForMatch(newFlipped);
    }
  };

  const checkForMatch = (flippedCards) => {
    const [first, second] = flippedCards;
    
    if (cards[first].emoji === cards[second].emoji) {
      // Par encontrado!
      setSolved([...solved, first, second]);
      resetTurn();
    } else {
      // Não é par, volta as cartas após 1 segundo
      setTimeout(resetTurn, 1000);
    }
  };

  const resetTurn = () => {
    setFlipped([]);
    setDisabled(false);
    
    // Verifica se o jogo acabou
    if (solved.length + 2 === cards.length) {
      Alert.alert('Parabéns!', 'Você completou o jogo!', [
        { text: 'Jogar Novamente', onPress: initializeGame }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo da Memória</Text>
      
      <View style={styles.board}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.card,
              flipped.includes(card.id) || solved.includes(card.id) 
                ? styles.cardFlipped 
                : styles.cardBack
            ]}
            onPress={() => handleCardPress(card.id)}
            disabled={solved.includes(card.id)}
          >
            <Text style={styles.cardText}>
              {flipped.includes(card.id) || solved.includes(card.id) 
                ? card.emoji 
                : '?'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
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
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  card: {
    width: 70,
    height: 70,
    margin: 5,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBack: {
    backgroundColor: '#6200ee',
  },
  cardFlipped: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#6200ee',
  },
  cardText: {
    fontSize: 30,
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default MemoryGame;