import React, {useState, useEffect, useRef} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, FlatList} from 'react-native';
import Chessboard, { ChessboardRef } from 'react-native-chessboard';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {LinearGradient} from "expo-linear-gradient";

const GameReplay = ({ navigation }) => {
    const [currentMove, setCurrentMove] = useState(0);
    const [history, setHistory] = useState([]);
    const chessboardRef = useRef<ChessboardRef>(null);
    const [move, setMove] = useState([]);
    const [evaluation, setEvaluation] = useState('');
    const [san , setSan] = useState([]);
    const flatListRef = useRef(null);


    useEffect(() => {
        // ziskanie dat z match history
        const fetchMatchHistory = async () => {
            try {
                const storedHistory = await AsyncStorage.getItem('matchHistory');
                if (storedHistory) {
                    setHistory(JSON.parse(storedHistory));
                }
            } catch (error) {
                console.error('Error fetching match history:', error);
            }
        };

        fetchMatchHistory();
    }, []);

    const handleNextMove = () => {
        // inkrementuje index tahu a aktualizuje sachovnicu
        if (currentMove < history[history.length - 1].moveList.length) {
            console.log(history[history.length - 1].moveList[currentMove].san);
            getStockfishEvaluation(history[history.length - 1].fenList[currentMove]);
            const nextMove = [history[history.length - 1].moveList[currentMove].from, history[history.length - 1].moveList[currentMove].to];
            const currentSan = history[history.length - 1].moveList[currentMove].san;
            setMove(nextMove);
            setSan([...san, currentSan]);
            setCurrentMove(currentMove + 1);
        }

    };



    const handleResetBoard = () => {
        // dekrementuje index tahu a aktualizuje sachovnicu
        chessboardRef.current?.resetBoard();
        setCurrentMove(0);
        setEvaluation('');
        setSan([]);
    };

    const renderMove = ({ item, index }) => {
        return (
            <View>

                <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>{index + 1}. {item} </Text>

            </View>
        )
    }

    function getStockfishEvaluation(fenPosition) {

        // stockfish url s parametrom mode=eval pre ziskanie vyhodnotenia pozicie
        const stockfishUrl = `https://stockfish.online/api/stockfish.php?fen=${encodeURIComponent(fenPosition)}&depth=5&mode=eval`;

        fetch(stockfishUrl)
            .then(response => {

                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }

                return response.json();
            })
            .then(data => {

                const evaluatedMove = data.data;
                setEvaluation(evaluatedMove);
                console.log("Stockfish analysis:", data);
            })
            .catch(error => {
                console.error("An error occurred:", error);
            });
    }

    useEffect(() => {
        console.log(move);
        (async () => {
            await chessboardRef.current?.move({ from : move[0], to:  move[1] });
        })();

    }, [currentMove]);

    useEffect(() => {
        flatListRef.current.scrollToEnd({ animated: true });
    }, [san]);


    const handleEndReplay = () => {

        navigation.navigate('MenuScreen');
    }

    return (

        <LinearGradient
            colors={['#3F3F3F', '#282828', '#1F1F1F']}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
            <View style={{ paddingTop: 40, flex: 1, justifyContent: 'flex-start', alignItems: 'center' }}>
                {currentMove >= 1 && <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>Move: {currentMove}</Text>}
                {evaluation && <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>{evaluation}</Text>}
            </View>
            <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center', marginTop: -80 }}>
                {/* Chessboard */}
                <Chessboard ref={chessboardRef} gestureEnabled={false}/>

                {/* Move Evaluation Window */}
                <FlatList
                    ref={flatListRef}
                    data={san}
                    renderItem={renderMove}
                    keyExtractor={(item, index) => index.toString()}
                    onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
                    style={{marginTop: 10,  width: '100%' }}
                />

                {/* Navigation Buttons */}
                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, marginLeft: 30 }}>
                    <TouchableOpacity onPress={handleResetBoard} style={styles.button}>
                        <Text style={{ color: 'white' }}>Reset</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleNextMove} style={[styles.button, { marginHorizontal: 10 }]}>
                        <Text style={{ color: 'white' }}>Next Move</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleEndReplay} style={[styles.button, { backgroundColor: '#eb4034'}]}>
                        <Text style={{ color: 'white' }}>End Replay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </LinearGradient>



    );
};



const styles = StyleSheet.create({
    button: {
        backgroundColor: '#81b64c', padding: 10, borderRadius: 10,
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 25,
        shadowOffset: {width: 1, height: 13},
        margin: 50
    }
})

export default GameReplay;
