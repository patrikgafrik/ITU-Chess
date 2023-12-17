import Chessboard, { ChessboardRef } from 'react-native-chessboard';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import React, {useEffect, useMemo, useRef, useState} from "react";
import {Text, View, Image, TouchableOpacity} from "react-native";
import Clock from "./Clock";
import Icon from 'react-native-vector-icons/FontAwesome';
import {LinearGradient} from "expo-linear-gradient";
import AsyncStorage from '@react-native-async-storage/async-storage';
import GameOver from "./GameOver";


const ChessBoard = ( { route, navigation }) => {

    const [pieceMoved, setPieceMoved] = useState(false);
    const chessboardRef = useRef<ChessboardRef>(null);
    const [moveCount, setMoveCount] = useState(0);
    const [gameOverMessage, setGameOverMessage] = useState('');
    const [gameOver, setGameOver] = useState(false);
    const [rematch, setRematch] = useState(false);
    const [fenList, setFenList] = useState([]);
    const currentDate = new Date();

    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();


    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;

    const { selectedImage } = route.params;
    const { stockfishEnabled } = route.params;

    const imageSources = {
        'image1.png': require('../assets/ituga.png'),
        'image2.png': require('../assets/bat.png'),
        'image3.png': require('../assets/chad.png'),
    };

    const getStockfishDepth = () => {
        if (selectedImage === 'image1.png') {
            return 5;
        } else if (selectedImage === 'image2.png') {
            return 9;
        } else if (selectedImage === 'image3.png') {
            return 13;
        }
    }

    const storeGameResult = async (result) => {
        try {
            // fetch existujucej match history
            const existingHistory = await AsyncStorage.getItem('matchHistory');
            const history = existingHistory ? JSON.parse(existingHistory) : [];


            history.push(result);

            // ulozenie vysledku do match history
            await AsyncStorage.setItem('matchHistory', JSON.stringify(history));
        } catch (error) {
            console.error('Error storing game result:', error);
        }
    };


    const detectPieceMove = ({ state }) => {
        const currentState = chessboardRef.current?.getState().fen;
        const inCheckMate = chessboardRef.current?.getState().in_checkmate;
        setMoveCount(moveCount + 1);
        const moveHistory = state.history;
        setFenList([...fenList, currentState]);

        // white to move
        if (!pieceMoved) {

            if (stockfishEnabled) {
                getStockfishResponse(currentState);
            }

            if (inCheckMate) {
                setGameOverMessage('White Won by Checkmate!');
                setGameOver(true);
                storeGameResult({
                    result: 'win',
                    player: imageSources[selectedImage],
                    moves: moveCount,
                    date: formattedDate,
                    moveList: moveHistory,
                    fenList: fenList
                });

            }
        }
        // black to move
        else {
            if (inCheckMate) {
                setGameOverMessage('Black Won by Checkmate!');
                setGameOver(true);
                storeGameResult({
                    result: 'loss',
                    player: imageSources[selectedImage],
                    moves: moveCount,
                    date: formattedDate,
                    moveList: moveHistory,
                    fenList: fenList
                });
            }
        }

        setPieceMoved(!pieceMoved);
    };

    const handleRematch = () => {
        setGameOver(false);
        setRematch(!rematch);
        chessboardRef.current?.resetBoard();
    }

    const handleAbort = () => {

        navigation.navigate('MenuScreen');
    }

    const [white_currently_playing, swap_player ] = useState(true);

    const isMountingRef = useRef(false);
    const [moveNext, setMoveNext] = useState([]);


    function getStockfishResponse(fenPosition) {

        console.log(fenPosition);
        // stockfish API URL s nastavenim pozadovanych parametrov
        const stockfishUrl = `https://stockfish.online/api/stockfish.php?fen=${encodeURIComponent(fenPosition)}&depth=${getStockfishDepth()}&mode=bestmove`;

        fetch(stockfishUrl)
            .then(response => {

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                return response.json();
            })
            .then(data => {

                const movesString = data.data.split(' ')[1];
                const [fromSquare, toSquare] = [movesString.slice(0, 2), movesString.slice(2, 4)];
                const movesArray = [fromSquare, toSquare];
                setMoveNext(movesArray);
                console.log("Stockfish analysis:", data);
            })
            .catch(error => {
                console.error("An error occurred:", error);
            });
    }


    // pohyb figurou na zaklade stockfish response
    useEffect(() => {
        (async () => {
            await chessboardRef.current?.move({ from: moveNext[0], to: moveNext[1] });
        })();
    }, [moveNext]);


    useEffect(() => {
        isMountingRef.current = true;
    }, []);

    useEffect(() => {
        if (!isMountingRef.current) {
            swap_player(!white_currently_playing);

        } else {
            isMountingRef.current = false;
        }
    }, [pieceMoved]);

    return (
        <LinearGradient
            colors={['#3F3F3F', '#282828', '#1F1F1F']}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}

        >
        <View>
            <View style={{flex: 1, alignItems: 'center', position: 'absolute', top: 120, left: 20}}>
                <Image source={imageSources[selectedImage]} style={{width: 100, height: 100, borderRadius: 20}}></Image>
            </View>
            <GestureHandlerRootView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Chessboard ref={chessboardRef} onMove={detectPieceMove} colors={{black: '#805633', white: '#cdae7e'}} />
                </View>
            </GestureHandlerRootView>

                {
                    gameOver && <GameOver message={gameOverMessage} navigation={navigation} selectedImage={imageSources[selectedImage]}
                                onRematchClick={handleRematch}/>
                }

            <View style={{flex: 1, alignItems: 'center', position: 'absolute', bottom: 100, right: 150,}}>
                <Icon name="clock-o" size={45} color="white" />
                <Clock moveDetected={white_currently_playing} storeGameResult={storeGameResult} player={imageSources[selectedImage]}
                moves={moveCount} date={formattedDate} clockReset={rematch}/>
            </View>
            <View style={{flex: 1, alignItems: 'center', position: 'absolute', bottom: 40, right: 140,}}>
                <TouchableOpacity style={{backgroundColor: '#eb4034', padding: 10, borderRadius: 10}}  onPress={handleAbort}>
                    <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>Abort Game</Text>
                </TouchableOpacity>
            </View>

        </View>
        </LinearGradient>
    )
}

export default ChessBoard;