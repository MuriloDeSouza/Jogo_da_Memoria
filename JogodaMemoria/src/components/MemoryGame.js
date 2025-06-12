//cache das imagens dos pokemons 
//guardar jogador e pontuação
// leader board para ver quem é o melhor jogador
// guardar o tempo de jogo
//colocar 3 telas (tela inicial, jogo em si e tela de vitória com o leader_board)

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';

const MemoryGame = () => {
  const pokemonIds = [1, 4, 7, 25, 39, 54, 66, 129];
  
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [showingCards, setShowingCards] = useState(false);
  const [score, setScore] = useState(0); // Estado para armazenar a pontuação

  useEffect(() => {
    prepareGame(); //essa aqui é o meu Backend dentro do Frontend
  }, []);

  // pegando as imagens dos pokémons para o jogo, batendo na API do PokeAPI
  const getPokemonImageUrl = (id) => {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  };

  // Prepara o jogo criando pares de cartas e embaralhando
  const prepareGame = () => {
    const pokemonPairs = pokemonIds.reduce((acc, id) => {
      return [...acc, { id: `${id}-1`, pokemonId: id }, { id: `${id}-2`, pokemonId: id }];
    }, []);
    
    // SHUFFLED é a parte de embaralhar as cartas de forma randomica
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
    setShowingCards(false);
    setScore(0); // Reseta a pontuação ao preparar novo jogo
  };

  // Inicia o jogo mostrando todas as cartas por 3 segundos
  const startGame = () => {
    setGameStarted(true);
    setShowingCards(true);
    
    // Mostra todas as cartas por 3 segundos
    const allCardIds = cards.map(card => card.uniqueId);
    setFlipped(allCardIds);
    
    // Aqui é onde eu desabilito ele reiniciar o jogo enquanto as cartas estão sendo mostradas
    setTimeout(() => {
      setShowingCards(false);
      setFlipped([]);
      setDisabled(false); // Habilita o jogo após esconder as cartas
    }, 3000);
  };

  // Função chamada quando uma carta é pressionada
  const handleCardPress = (uniqueId) => {
    if (disabled || !gameStarted || showingCards) return;
    if (flipped.includes(uniqueId) || solved.includes(uniqueId)) return;
    
    // Adiciona a carta pressionada ao estado de cartas viradas
    const newFlipped = [...flipped, uniqueId];
    setFlipped(newFlipped);
    
    // Verifica se duas cartas foram viradas
    if (newFlipped.length === 2) {
      setDisabled(true);
      checkForMatch(newFlipped);
    }
  };

  // Verifica se as duas cartas viradas formam um par
  // Se sim, adiciona aos pares resolvidos e atualiza a pontuação
  // Se não, reseta as cartas viradas após um tempo
  const checkForMatch = (flippedCards) => {
    const [firstId, secondId] = flippedCards;
    const firstCard = cards.find(card => card.uniqueId === firstId);
    const secondCard = cards.find(card => card.uniqueId === secondId);
    
    //Sistema lindo de pontuação
    // Se as cartas forem iguais, adiciona 20 pontos
    // Se não forem iguais, perde 5 pontos (mas não pode ficar negativo)
    if (firstCard.pokemonId === secondCard.pokemonId) {
      // Acertou o par: ganha 20 pontos
      setScore(prevScore => prevScore + 20);
      const newSolved = [...solved, firstId, secondId];
      setSolved(newSolved);
      
      // Verifica se o jogo terminou
      // Se todas as cartas foram resolvidas, exibe mensagem de vitória
      // Ele completando o jogo ele ganha mais 20 pontos
      // E reinicia o jogo
      if (newSolved.length === cards.length && cards.length > 0) {
        Alert.alert(
          'Parabéns!', 
          `Você conseguiu achar todos os pares! Pontuação final: ${score + 20}`,
          [
            {
              text: 'OK',
              onPress: () => {
                prepareGame(); // Volta para a tela inicial
                setGameStarted(false); // Mostra o botão "Jogar" novamente
              }
            }
          ]
        );
      }
      
      // lógica de perder os pontos caso não acerte o par
      resetTurn();
    } else {
      // Errou o par: perde 5 pontos (mas não fica negativo)
      setScore(prevScore => Math.max(0, prevScore - 5));
      setTimeout(resetTurn, 1000);
    }
  };

  const resetTurn = () => {
    setFlipped([]);
    setDisabled(false);
  };

  // Renderiza o jogo e vai meio que setando os estilos e as ações dos botões
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokémon Memory Game</Text>

        {/* Exibe a pontuação atual */}
        <Text style={styles.score}>Pontuação: {score}</Text>
      
      <View style={styles.board}>
        {cards.map((card) => (
            
          <TouchableOpacity
            key={card.uniqueId}
            style={[
              styles.card,
              (flipped.includes(card.uniqueId) || solved.includes(card.uniqueId) || showingCards
                ? styles.cardFlipped 
                : styles.cardBack
              )]}
            onPress={() => handleCardPress(card.uniqueId)}
            disabled={solved.includes(card.uniqueId) || !gameStarted}
          >
            {(flipped.includes(card.uniqueId) || solved.includes(card.uniqueId) || showingCards) ? (
              <Image
                source={{ uri: getPokemonImageUrl(card.pokemonId) }}
                style={styles.pokemonImage}
                resizeMode="contain"
              />
            ) : (
              <Text style={styles.cardText}>?</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      
      {!gameStarted && (
        <TouchableOpacity style={[styles.button, styles.startButton]} onPress={startGame}>
          <Text style={styles.buttonText}>Jogar</Text>
        </TouchableOpacity>
      )}

      {gameStarted && (
        <TouchableOpacity 
          style={styles.button} 
          onPress={prepareGame}
          disabled={showingCards}
        >
          <Text style={[
            styles.buttonText,
            showingCards && { opacity: 0.5 }
          ]}>Reiniciar Jogo</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Estilos do componente Jogo da Memória
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
    score: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#3c5aa6',
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
    buttonDisabled: {
      backgroundColor: '#cccccc',
    },
    startButton: {
      backgroundColor: '#4CAF50',
    },
    buttonText: {
      color: '#ffcb05',
      fontWeight: 'bold',
    },
  });
  
  export default MemoryGame;