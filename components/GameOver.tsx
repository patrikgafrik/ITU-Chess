import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const GameOver = ({ message, navigation, selectedImage, onRematchClick }) => {
    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <Text style={styles.message}>{message}</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, styles.restartButton]}
                        onPress={() => {
                            navigation.navigate('GameReplay');
                        }}
                    >
                        <Text style={styles.buttonText}>See Replay</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.quitButton]}
                        onPress={onRematchClick}
                    >
                        <Text style={styles.buttonText}>Rematch</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        elevation: 5,
    },
    message: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    restartButton: {
        backgroundColor: '#3498db',
        marginRight: 5,
    },
    quitButton: {
        backgroundColor: '#e74c3c',
        marginLeft: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default GameOver;
