import React, {useState, useEffect, useRef} from 'react';
import { View, Text, Button } from 'react-native';


const Clock = ({ moveDetected, clockReset, onTimeLoss }) => {
    const [seconds, setSeconds] = useState(5);
    const [isActive, setIsActive] = useState(moveDetected);
    const isMountingRef = useRef(false);


    useEffect(() => {
        let interval;

        if (isActive) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => {
                    if (prevSeconds <= 0) {
                        clearInterval(interval);
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

    // React to time reaching 0: perform side effects here.
    useEffect(() => {
        if (seconds === 0 && isActive) {
            setIsActive(false);       // stop the clock
            onTimeLoss?.();           // notify parent (ChessBoard)
        }
    }, [seconds, isActive, onTimeLoss]);

    useEffect(() => {

        setSeconds(10);
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