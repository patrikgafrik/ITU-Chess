import React, {useState, useEffect, useRef} from 'react';
import { View, Text, Button } from 'react-native';

const Clock = ({ moveDetected, storeGameResult, player, moves, date, clockReset }) => {
    const [seconds, setSeconds] = useState(180);
    const [isActive, setIsActive] = useState(moveDetected);
    const isMountingRef = useRef(false);


    useEffect(() => {
        let interval;

        if (isActive) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => {
                    if (prevSeconds <= 0) {
                        clearInterval(interval);
                        alert('You lost on time!');
                        storeGameResult({
                            result: 'loss',
                            player: player,
                            moves: moves,
                            date: date,
                        })
                        setIsActive(false);
                        return 0;
                    } else {
                        return prevSeconds - 1;
                    }
                });
            }, 1000);
        }


        return () => clearInterval(interval);

    }, [isActive]);

    useEffect(() => {

        setSeconds(180);
        setIsActive(true);

    }, [clockReset]);


    useEffect(() => {
        isMountingRef.current = true;
    }, []);

    useEffect(() => {
        if (!isMountingRef.current) {
            setIsActive(moveDetected);
        } else {
            isMountingRef.current = false;
        }
    }, [moveDetected]);

    return (
        <View>
            <Text style={{color: 'white', fontWeight: 'bold', fontSize: 45, }}>{Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, '0')}</Text>
        </View>
    );
};

export default Clock;