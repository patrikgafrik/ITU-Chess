import React, { useEffect, useState } from 'react';
import {View, Text, FlatList, StyleSheet, Image, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LinearGradient} from "expo-linear-gradient";
import Icon from 'react-native-vector-icons/FontAwesome';

const MatchHistory = ( {navigation}) => {
    const [history, setHistory] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {

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

    const renderMatchItem = ({ item }) => (
        <View style={styles.tableRow}>
            <Image style={styles.image} source={item.player}></Image>
            <Text style={[styles.cell, { color: item.result === 'win' ? 'green' : 'red' }]}>{item.result === 'win' ? 'Win' : 'Loss'}</Text>
            <Text style={styles.cell}>{item.moves}</Text>
            <Text style={styles.cell}>{item.date}</Text>
        </View>
    );

    // funkcia pre reset match history
    const resetAsyncStorage = async () => {
        try {
            await AsyncStorage.removeItem('matchHistory');
            console.log('AsyncStorage cleared successfully.');
            setHistory([]);
        } catch (error) {
            console.error('Error clearing AsyncStorage:', error);
        }
    };


    return (

        <LinearGradient
            colors={['#3F3F3F', '#282828', '#1F1F1F']}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}

        >
            <View>
                <View style={{ top: 150, flexDirection: 'row', alignItems: 'center', padding: 10}}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{marginRight: 10}}>
                        <Icon name="arrow-left" size={30} color="white" />
                    </TouchableOpacity>
                    <Text style={{fontWeight: 'bold', fontSize: 40, color: 'white' }}>Game History</Text>
                </View>

                <View style={{top: 170}}>
                    <Text style={{fontWeight: 'bold', fontSize: 20, color: 'white'}}>Total games played: {history.length}</Text>
                    <Text style={{fontWeight: 'bold', fontSize: 20, color: 'white'}}>Win ratio: {((history.filter(item => item.result === 'win').length / history.length) * 100).toFixed(2)}%</Text>
                </View>
                <View style={{top: 190, flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#b31717', borderRadius: 10, justifyContent: 'center'}}>
                    <TouchableOpacity  onPress={resetAsyncStorage}>
                        <Text style={{fontWeight: 'bold', fontSize: 20, color: 'white'}}>Clear History</Text>
                    </TouchableOpacity>
                </View>


                {/* Table Header */}
                <View style={{top:190}}>
                <View style={styles.tableHeader}>
                    <Text style={styles.headerCell}>VS</Text>
                    <Text style={styles.headerCell}>Result</Text>
                    <Text style={styles.headerCell}>Moves</Text>
                    <Text style={styles.headerCell}>Date</Text>
                </View>
                {/* Table Content */}
                <FlatList
                    data={history}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderMatchItem}
                />
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#81b64c',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
    },
    headerCell: {
        flex: 1,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white'
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: 'gray',
        paddingVertical: 10,
    },
    cell: {
        flex: 1,
        textAlign: 'center',
        color: 'white',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    }
});

export default MatchHistory;
