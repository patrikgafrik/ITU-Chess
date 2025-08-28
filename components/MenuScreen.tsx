import React, {useEffect, useState} from 'react';
import {View, Text, Button, Modal, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
import Icon from 'react-native-vector-icons/FontAwesome';
import { Switch } from 'react-native-switch';


export default function MenuScreen({ navigation }) {

    const [isModalVisible, setModalVisible] = useState(false);
    const [isButtonVisible, setButtonVisible] = useState(true);
    const [isSwitchOn, setIsSwitchOn] = useState(true);



    const imageSources = {
        'image1.png': require('../assets/goldfish.png'),
        'image2.png': require('../assets/coolfish.png'),
        'image3.png': require('../assets/evilfish.png'),
    };

    const [selectedImage, setSelectedImage] = useState('image1.png');

    const handleImageSelection = (image) => {
        setSelectedImage(image);
    };


    const getDifficulty = () => {
        if (selectedImage === 'image1.png') {
            return 'easy';
        } else if (selectedImage === 'image2.png') {
            return 'medium';
        } else if (selectedImage === 'image3.png') {
            return 'hard';
        }
    }

    const getOpponentName = () => {
        if (selectedImage === 'image1.png') {
            return 'A sleepy goldfish';
        } else if (selectedImage === 'image2.png') {
            return 'Sunglasses Coolfish';
        } else if (selectedImage === 'image3.png') {
            return 'Evil overlord fish';
        }
    }

    const getOpponentDescription = () => {
        if (selectedImage === 'image1.png') {
            return 'Stockfish’s tiny cousin who forgets how the knight moves.';
        } else if (selectedImage === 'image2.png') {
            return 'thinks he’s a pro, medium skills.';
        } else if (selectedImage === 'image3.png') {
            return 'glowing eyes, crowned, intimidating.';
        }
    }


    const startGame = () => {
        setModalVisible(true);
        setButtonVisible(false);
    };

    const viewMatchHistory = () => {
        navigation.navigate('MatchHistory');
    }

    const play = () => {

        navigation.navigate('GameScreen', {selectedImage: selectedImage, stockfishEnabled: isSwitchOn});
        setModalVisible(false);
        setButtonVisible(true);
    }

    const closeModal = () => {
        setModalVisible(false);
        setButtonVisible(true);
    };


    return (

        <LinearGradient
            colors={['#3F3F3F', '#282828', '#1F1F1F']}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}

        >
            {
                isButtonVisible && (
                    <Image style={{position: 'relative', top: 140,  width: 260, height: 200, marginRight: 20}} source={require('../assets/chess.png')}></Image>
                )
            }

            <View style={styles.container}>
                {
                    isButtonVisible && (
                        <TouchableOpacity style={styles.button} onPress={startGame}>
                            <Text style={styles.buttonText}>Start Game</Text>
                        </TouchableOpacity>)

                }
                {
                    isButtonVisible && (
                        <TouchableOpacity style={styles.button} onPress={viewMatchHistory}>
                            <Text style={styles.buttonText}>Game History</Text>
                        </TouchableOpacity>)

                }

                {/* Modal */}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={closeModal}
                >

                    <View style={styles.modalContainer}>

                        <TouchableOpacity style={{position: 'absolute', top: 80, left: 20}} onPress={closeModal}>
                            <Icon name="times" style={{fontWeight: 'bold', fontSize: 30, color: 'white'}}></Icon>
                        </TouchableOpacity>

                        <Text style={{position: 'absolute', top: 150, fontWeight: 'bold', fontSize: 40, color: 'white'}}>Play vs...</Text>
                        <View style={styles.containerImg}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={imageSources[selectedImage]}
                                    style={styles.image}
                                />
                            </View>
                            <View style={{display: 'flex', alignItems: 'center'}}>
                                <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20}}>{getOpponentName()}</Text>
                                <Text style={{color: 'white', marginTop: 30 }}>{getOpponentDescription()}</Text>
                                <Text style={styles.difficultyText}>Difficulty: {getDifficulty()}</Text>
                            </View>

                        </View>

                        <View style={{position : 'absolute', top: 450, backgroundColor: 'grey', padding: 10, borderRadius: 10, marginTop: 50}}>
                            <Text style={{color: 'white'}}>Stockfish is</Text>
                            <Switch
                                value={isSwitchOn}
                                onValueChange={(value) => setIsSwitchOn(value)}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                            {['image1.png', 'image2.png', 'image3.png'].map((image, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={{
                                        borderWidth: selectedImage === image ? 2 : 0,
                                        borderColor: 'green',
                                        borderRadius: 5,
                                    }}
                                    onPress={() => handleImageSelection(image)}
                                >
                                    <Image
                                        source={imageSources[image]}
                                        style={{ width: 70, height: 70, borderRadius: 5 }}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity style={{
                            position: 'absolute', bottom: 80,
                            backgroundColor: '#81b64c', padding: 10, borderRadius: 5,
                            shadowColor: 'rgba(0, 0, 0, 0.3)',
                            shadowOpacity: 0.8,
                            elevation: 6,
                            shadowRadius: 25,
                            shadowOffset: {width: 1, height: 13},
                            margin: 10,
                        }} onPress={play}>
                            <Text style={{fontWeight: 'bold', fontSize: 20, color: 'white'}}>Play</Text>
                        </TouchableOpacity>

                    </View>
                </Modal>
            </View>
        </LinearGradient>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#262522',
        width: 300,
        height: 500,
        borderRadius: 10,
        alignItems: 'center',
    },

    containerImg: {
        alignItems: 'center',
        marginBottom: 150,
    },
    imageContainer: {
        marginTop: 50,
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 20,

    },
    difficultyText: {
        color: 'white',
        marginTop: 30,
    },

    button: {
        backgroundColor: '#81b64c',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: 'rgba(0, 0, 0, 0.3)',
        shadowOpacity: 0.8,
        elevation: 6,
        shadowRadius: 25,
        shadowOffset: {width: 1, height: 13},
        margin: 10
    },

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
})