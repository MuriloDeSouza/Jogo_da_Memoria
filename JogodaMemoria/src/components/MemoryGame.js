// MemoryGame.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, TextInput, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
// No topo do MemoryGame.js, adicione:
import RankingScreen from '../telas/rank'; // Importa a tela de ranking

// Tela inicial
export const loadPokemonRanking = async () => {
  try {
    const savedRanking = await AsyncStorage.getItem('pokemonMemoryRanking');
    return savedRanking ? JSON.parse(savedRanking) : [];
  } catch (error) {
    console.error('Erro ao carregar ranking:', error);
    return [];
  }
};

const HomeScreen = ({ onStart, onElementSelect, element, playerName, setPlayerName }) => {
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.title}>Pokémon Memory Game</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Digite seu nome"
        value={playerName}
        onChangeText={setPlayerName}
      />
      
      <Text style={styles.subtitle}>Escolha o tipo de Pokémon:</Text>
      
      <View style={styles.elementButtons}>
        <TouchableOpacity 
          style={[styles.elementButton, element === 'fire' && styles.selectedElement]}
          onPress={() => onElementSelect('fire')}
        >
          <Text>🔥 Fogo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.elementButton, element === 'water' && styles.selectedElement]}
          onPress={() => onElementSelect('water')}
        >
          <Text>💧 Água</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.elementButton, element === 'grass' && styles.selectedElement]}
          onPress={() => onElementSelect('grass')}
        >
          <Text>🌿 Grama</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.elementButton, element === 'electric' && styles.selectedElement]}
          onPress={() => onElementSelect('electric')}
        >
          <Text>⚡ Elétrico</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity 
        style={styles.startButton} 
        onPress={onStart}
        disabled={!playerName}
      >
        <Text style={styles.buttonText}>Iniciar Jogo</Text>
      </TouchableOpacity>
    </View>
  );

};

// Tela de vitória/ranking
const VictoryScreen = ({ score, playerName, time, onRestart, onViewRanking }) => {
  return (
    <View style={styles.victoryContainer}>
      <Text style={styles.victoryTitle}>Parabéns, {playerName}!</Text>
      <Text style={styles.victoryText}>Você completou o jogo em {time} segundos</Text>
      <Text style={styles.victoryScore}>Pontuação: {score}</Text>
      
      <TouchableOpacity 
        style={styles.victoryButton}
        onPress={onRestart}
      >
        <Text style={styles.buttonText}>Jogar Novamente</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.rankingButton}
        onPress={onViewRanking}
      >
        <Text style={styles.buttonText}>Ver Ranking</Text>
      </TouchableOpacity>
    </View>
  );
};

// Tela de ranking
// const RankingScreen = ({ ranking, onBack }) => {
//   return (
//     <View style={styles.rankingContainer}>
//       <Text style={styles.rankingTitle}>Top Jogadores</Text>
      
//       <View style={styles.rankingList}>
//         {ranking.map((item, index) => (
//           <View key={index} style={styles.rankingItem}>
//             <Text style={styles.rankingPosition}>{index + 1}.</Text>
//             <Text style={styles.rankingName}>{item.name}</Text>
//             <Text style={styles.rankingScore}>{item.score} pts</Text>
//             <Text style={styles.rankingTime}>{item.time}s</Text>
//           </View>
//         ))}
//       </View>
      
//       <TouchableOpacity 
//         style={styles.backButton}
//         onPress={onBack}
//       >
//         <Text style={styles.buttonText}>Voltar</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// Componente principal do jogo
const MemoryGame = () => {
  // Estados do jogo
  const [gameStarted, setGameStarted] = useState(false);
  const [screen, setScreen] = useState('home'); // 'home', 'game', 'victory', 'ranking'
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const [showingCards, setShowingCards] = useState(false);
  const [score, setScore] = useState(0);
  const [playerName, setPlayerName] = useState('');
  const [element, setElement] = useState('fire');
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [ranking, setRanking] = useState([]);
  
  // IDs dos Pokémons por elemento
  const pokemonElements = {
    fire: [4, 5, 6, 37, 38, 58, 59, 77, 78, 126], // Charmander, Charmeleon, etc.
    water: [7, 8, 9, 54, 55, 60, 61, 72, 73, 129], // Squirtle, Wartortle, etc.
    grass: [1, 2, 3, 43, 44, 69, 70, 102, 103, 114], // Bulbasaur, Ivysaur, etc.
    electric: [25, 26, 100, 101, 125, 135, 145, 170, 171, 172] // Pikachu, Raichu, etc.
  };

  // Carrega o ranking ao iniciar
  useEffect(() => {
    loadRanking();
  }, []);

    // Substitua o useEffect atual por este:
  useEffect(() => {
    let interval;
    if (screen === 'game' && !loading && !showingCards) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [screen, loading, showingCards]);

    // Substitua a função loadRanking existente por:
  const loadRanking = async () => {
    const ranking = await loadPokemonRanking();
    setRanking(ranking);
  };

  // // Carrega o ranking do AsyncStorage
  // const loadRanking = async () => {
  //   try {
  //     const savedRanking = await AsyncStorage.getItem('pokemonMemoryRanking');
  //     if (savedRanking) {
  //       setRanking(JSON.parse(savedRanking));
  //     }
  //   } catch (error) {
  //     console.error('Erro ao carregar ranking:', error);
  //   }
  // };

  // Salva a pontuação no ranking
  const saveScore = async (finalScore) => {
    if (!playerName) return;
    
    const newScore = {
      name: playerName,
      score: finalScore,
      time: time,
      date: new Date().toISOString(),
      element: element
    };
    
    const newRanking = [...ranking, newScore]
      .sort((a, b) => b.score - a.score || a.time - b.time)
      .slice(0, 10); // Mantém apenas os top 10
    
    try {
      await AsyncStorage.setItem('pokemonMemoryRanking', JSON.stringify(newRanking));
      setRanking(newRanking);
    } catch (error) {
      console.error('Erro ao salvar ranking:', error);
    }
  };

  // Obtém a URL da imagem do Pokémon, verificando cache primeiro
  const getPokemonImageUrl = async (id) => {
    const cacheKey = `pokemon-img-${id}`;
    
    try {
      // Verifica se a imagem está em cache
      const cachedImage = await AsyncStorage.getItem(cacheKey);
      if (cachedImage) {
        return cachedImage;
      }
      
      // Se não estiver em cache, busca da API e salva
      const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
      
      // Simula o download da imagem (em uma aplicação real, você poderia usar react-native-fs para baixar)
      await AsyncStorage.setItem(cacheKey, imageUrl);
      
      return imageUrl;
    } catch (error) {
      console.error('Erro ao obter imagem do Pokémon:', error);
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    }
  };

  // Prepara o jogo
  const prepareGame = async () => {
    setLoading(true);
    
    // Seleciona 4 Pokémons aleatórios do elemento escolhido
    const selectedPokemons = [...pokemonElements[element]]
      .sort(() => Math.random() - 0.5)
      .slice(0, 8); // Seleciona 8 Pokémons (4 pares)
    
    // Cria pares de cartas
    const pokemonPairs = selectedPokemons.reduce((acc, id) => {
      return [...acc, { id: `${id}-1`, pokemonId: id }, { id: `${id}-2`, pokemonId: id }];
    }, []);
    
    // Embaralha as cartas
    const shuffled = pokemonPairs
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({ 
        ...card, 
        uniqueId: index,
        flipped: false,
        imageUrl: '' // Será preenchido depois
      }));
    
    // Pré-carrega as imagens
    const cardsWithImages = await Promise.all(
      shuffled.map(async card => {
        const imageUrl = await getPokemonImageUrl(card.pokemonId);
        return { ...card, imageUrl };
      })
    );
    
    setCards(cardsWithImages);
    setFlipped([]);
    setSolved([]);
    setDisabled(true);
    setShowingCards(false);
    setScore(0);
    setTime(0);
    setLoading(false);
  };

  // Inicia o jogo
  const startGame = async () => {
    await prepareGame();
    setScreen('game');
    setShowingCards(true);
    
    // Mostra todas as cartas por 3 segundos
    const allCardIds = cards.map(card => card.uniqueId);
    setFlipped(allCardIds);
    
    setTimeout(() => {
      setShowingCards(false);
      setFlipped([]);
      setDisabled(false);
    }, 3000);
  };

  // Manipula o pressionar de uma carta
  const handleCardPress = (uniqueId) => {
    if (disabled || showingCards) return;
    if (flipped.includes(uniqueId) || solved.includes(uniqueId)) return;
    
    const newFlipped = [...flipped, uniqueId];
    setFlipped(newFlipped);
    
    if (newFlipped.length === 2) {
      setDisabled(true);
      checkForMatch(newFlipped);
    }
  };

  // Verifica se há combinação
  const checkForMatch = (flippedCards) => {
    const [firstId, secondId] = flippedCards;
    const firstCard = cards.find(card => card.uniqueId === firstId);
    const secondCard = cards.find(card => card.uniqueId === secondId);
    
    if (firstCard.pokemonId === secondCard.pokemonId) {
      setScore(prevScore => prevScore + 20);
      const newSolved = [...solved, firstId, secondId];
      setSolved(newSolved);
      
      if (newSolved.length === cards.length && cards.length > 0) {
        const finalScore = score;
        setScore(prevScore => prevScore + 20); // Adiciona os pontos bônus visualmente
        saveScore(finalScore); // Salva a pontuação real
        setScreen('victory');
        // saveScore();
        // setScreen('victory');
      }
      
      resetTurn();
    } else {
      setScore(prevScore => Math.max(0, prevScore - 5));
      setTimeout(resetTurn, 1000);
    }
  };

  const resetTurn = () => {
    setFlipped([]);
    setDisabled(false);
  };

  // Renderiza a tela atual
  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return (
          <HomeScreen 
            onStart={startGame}
            onElementSelect={setElement}
            element={element}
            playerName={playerName}
            setPlayerName={setPlayerName}
          />
        );
      
      case 'game':
        return (
          <View style={styles.container}>
            <Text style={styles.title}>Pokémon Memory Game</Text>
            <Text style={styles.subtitle}>Elemento: {element}</Text>
            
            <View style={styles.gameInfo}>
              <Text style={styles.infoText}>Jogador: {playerName}</Text>
              <Text style={styles.infoText}>Pontuação: {score}</Text>
              <Text style={styles.infoText}>Tempo: {time}s</Text>
            </View>
            
            {
              loading ? (
                <ActivityIndicator size="large" color="#3c5aa6" />
              ) : 
              (
                <View style={styles.board}>
                  {cards.map((card) => (
                    <TouchableOpacity
                      key={card.uniqueId}
                      style={[
                        styles.card,
                        (flipped.includes(card.uniqueId) || solved.includes(card.uniqueId) || showingCards
                          ? styles.cardFlipped 
                          : styles.cardBack
                        )
                      ]}
                      onPress={() => handleCardPress(card.uniqueId)}
                      disabled={solved.includes(card.uniqueId)}
                    >
                      {(flipped.includes(card.uniqueId) || solved.includes(card.uniqueId) || showingCards ? (
                        <Image
                          source={{ uri: card.imageUrl }}
                          style={styles.pokemonImage}
                          resizeMode="contain"
                        />
                        ) : (
                        <Text style={styles.cardText}>?</Text>
                      ))}
                    </TouchableOpacity>
                  ))}
                </View>
              )
            }
            
            <TouchableOpacity 
              style={styles.button} 
              onPress={() => {
                setScreen('home');
                setGameStarted(false);
              }}
              disabled={showingCards}
            >
              <Text style={[styles.buttonText, showingCards && { opacity: 0.5 }]}>Voltar</Text>
            </TouchableOpacity>
          </View>
      );

      
      case 'victory':
        return (
          <VictoryScreen 
            score={score}
            playerName={playerName}
            time={time}
            onRestart={() => {
              prepareGame();
              setScreen('game');
            }}
            onViewRanking={() => setScreen('ranking')}
          />
        );
      
      case 'ranking':
        return (
          <RankingScreen 
            ranking={ranking}
            onBack={() => setScreen('home')}
          />
        );
      
      default:
        return null;
    }
  };

  return renderScreen();
  };

// Estilos atualizados
const styles = StyleSheet.create({
  // Estilos para todas as telas
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
    marginBottom: 10,
    color: '#ffcb05',
    textShadowColor: '#3c5aa6',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
    color: '#3c5aa6',
  },
  button: {
    backgroundColor: '#3c5aa6',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffcb05',
    fontWeight: 'bold',
    fontSize: 16,
  },
  
  // Estilos da tela inicial
  homeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  input: {
    height: 40,
    width: '80%',
    borderColor: '#3c5aa6',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  elementButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  elementButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
  },
  selectedElement: {
    backgroundColor: '#ffcb05',
    borderWidth: 2,
    borderColor: '#3c5aa6',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    minWidth: 150,
    alignItems: 'center',
  },
  
  // Estilos do jogo
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
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
  
  // Estilos da tela de vitória
  victoryContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  victoryTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3c5aa6',
  },
  victoryText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  victoryScore: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#ffcb05',
    textShadowColor: '#3c5aa6',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  victoryButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    minWidth: 200,
    alignItems: 'center',
  },
  rankingButton: {
    backgroundColor: '#3c5aa6',
    padding: 15,
    borderRadius: 8,
    marginTop: 15,
    minWidth: 200,
    alignItems: 'center',
  },
  
  // Estilos da tela de ranking
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
  rankingList: {
    width: '100%',
    maxWidth: 300,
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
  backButton: {
    backgroundColor: '#3c5aa6',
    padding: 15,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
});

export default MemoryGame;