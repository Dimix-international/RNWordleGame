import {Text, View, StyleSheet, Pressable, Alert, ScrollView} from "react-native";
import {colors, colorsToEmoji, MAX_NUMBER_OF_TRIES } from "../../constants";
import {useEffect, useState} from "react";
import * as Clipboard from "expo-clipboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Animated, {SlideInLeft} from 'react-native-reanimated';
import Timer from "../Timer";
import Number from "../Number";
import GuessDistribution from "../GuessDistribution";


const EndScreen = ({rows, getCellBGColor, won = false}) => {

    const [played, setPlayed] = useState(0);
    const [winRate, setWinRate] = useState(0);
    const [curStreak, setCurStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [distribution, setDistribution] = useState(null);

    const shareScore = async () => {
        const textMap = rows
            .map((row, i) =>
                row.map((cell, j) => colorsToEmoji[getCellBGColor(i, j)]).join("")
            )
            .filter((row) => row) //delete undefined
            .join("\n"); //new line
        const textToShare = `Wordle \n${textMap}`;
        await Clipboard.setStringAsync(textToShare);
        Alert.alert("Copied successfully", "Share your score on you social media");
    };

    const readState = async () => {
        const dataString = await AsyncStorage.getItem('@game');
        let data;
        try {
            data = await JSON.parse(dataString);
        } catch (e) {
            console.error(e.message);
        }

        const keys = Object.keys(data);
        const values = Object.values(data);

        const numberOfWins = values.filter(game => game.gameState === 'won').length;
        setWinRate(Math.floor( 100 *  (numberOfWins / keys.length)));

        let _curStreak = 0;
        let maxStreak = 0;
        let prevDay = 0;

        keys.forEach(key => {
            const day = parseInt(key.split('-')[1]);
            if (data[key].gameState === 'won' && _curStreak === 0) {
                _curStreak +=1;
            }
            else if (data[key].gameState === 'won' && prevDay + 1 === day) {
                _curStreak +=1;
            } else {
                if (_curStreak > maxStreak) {
                    maxStreak = _curStreak;
                }
                _curStreak = data[key].gameState === 'won' ? 1 : 0;
            }
            prevDay = day;
        });

        //guess distribution

        const dist = new Array(MAX_NUMBER_OF_TRIES).fill(0);
        values.map((game) => {
            console.log('game', game);
            const {gameState, rows} = game;
            if (gameState === "won") {
                const tries = rows.filter(row => {
                    console.log('row', row)
                    return row[0]
                }).length;
                dist[tries - 1] = dist[tries - 1] + 1;
            }
        });
        setPlayed(() => Object.keys(data).length);
        setCurStreak(() => _curStreak);
        setMaxStreak(() => maxStreak);
        setDistribution(() => dist);
    }


    useEffect(() => {
        readState();
    }, [])

    return (
        <ScrollView style={{alignSelf: 'stretch', width: '100%'}}>
        <View style={{width: '100%', alignItems: 'center'}}>
            <Animated.Text entering={SlideInLeft.springify().mass(0.5)} style={styles.title}>
                { won ? 'Congrats!' : 'Oy, try again tomorrow!'}
            </Animated.Text>
            <Animated.View
                    entering={SlideInLeft.delay(100).springify().mass(0.5)}
                    style={styles.title}
                >
                    <Text style={styles.subtitle}>STATISTICS</Text>
                    <View style={{flexDirection: 'row', marginBottom: 20,}}>
                        <Number number={played} label={'Played'}/>
                        <Number number={winRate} label={'Win %'}/>
                        <Number number={curStreak} label={'Cur streak'}/>
                        <Number number={maxStreak} label={'Max streak'}/>
                    </View>
                </Animated.View>

                    <Animated.View
                        entering={SlideInLeft.delay(200).springify().mass(0.5)}
                        style={{width: '100%'}}
                    >
                        <GuessDistribution distribution={distribution}/>
                    </Animated.View>

                    <Animated.View
                        entering={SlideInLeft.delay(100).springify().mass(0.5)}
                        style={{flexDirection: "row", padding: 10,}}
                    >
                        <View style={{alignItems: "center", flex: 1}}>
                            <Text style={{color: colors.lightgrey}}>Next Wordle</Text>
                            <Timer />
                        </View>
                        <Pressable onPress={shareScore} style={{
                            flex: 1,
                            backgroundColor: colors.primary,
                            borderRadius: 25,
                            alignItems: 'center',
                            justifyContent: "center",
                        }}>
                            <Text style={{
                                color: colors.lightgrey,
                                fontWeight: "700",
                            }}>
                                Share
                            </Text>
                        </Pressable>
                    </Animated.View>
                </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 30,
        color: 'white',
        marginVertical: 15,
        textAlign: 'center',
    },
});

export default EndScreen;