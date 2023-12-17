import {Button, StyleSheet, TextInput, View, LogBox} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ChessBoard from './components/ChessBoard';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MenuScreen from './components/MenuScreen';
import MatchHistory from "./components/MatchHistory";
import GameReplay from "./components/GameReplay";

LogBox.ignoreAllLogs();
const Stack = createStackNavigator();

const App = () => {


    return (

            <NavigationContainer>
                <Stack.Navigator initialRouteName={"MenuScreen"}>
                    <Stack.Screen
                        name="MenuScreen"
                        component={MenuScreen}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="GameScreen"
                        component={ChessBoard}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="MatchHistory"
                        component={MatchHistory}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="GameReplay"
                        component={GameReplay}
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
    )

};

export default App;