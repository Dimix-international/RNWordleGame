import {ActivityIndicator, ScrollView, Text, View} from 'react-native';
import {useEffect, useState} from "react";
import {CLEAR, colors, ENTER, NUMBER_OF_TRIES} from "../../constants";
import {KeyboardComponent} from "../Keyboard/Keyboard";
import {words} from "../../words";
import styles from './Game.styles';
import {copyArray, getDayKey, getDayOfTheYear} from "../../utlis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import EndScreen from "../EndScreen";
import Animated, {FlipInEasyX, SlideInLeft, ZoomIn} from 'react-native-reanimated';


export const dayOfTheYear = getDayOfTheYear();
const dayKey = getDayKey();


const Game = () => {
//AsyncStorage.removeItem('@game');
    const word = words[0];
    const letters = word.split(""); // ['h', 'e', 'l', 'l', 'o']
    const [isFinishGame, setIsFinishGame] = useState(false);

    const [rows, setRows] = useState(
        new Array(NUMBER_OF_TRIES).fill(new Array(letters.length).fill(''))
    );

    const [curRow, setCurRow] = useState(0);
    const [curCol, setCurCol] = useState(0);
    const [gameState, setGameState] = useState('playing'); // won, lost, playing
    const [loaded, setLoaded] = useState(false);


    const onKeyPressed = (key) => {

        if (gameState !== 'playing') {
            return;
        }

        const updatedRows = copyArray(rows);

        if (key === CLEAR) {
            const prevCol = curCol - 1;

            if (prevCol >= 0) {
                updatedRows[curRow][prevCol] = '';
                setRows(updatedRows);
                setCurCol(prevCol);
            }

            return;
        }

        if (key === ENTER) {
            if (curCol === rows[0].length) {
                setCurRow(row => row + 1);
                setCurCol(0);
            }
            return;
        }

        if (curCol < rows[0].length) {
            updatedRows[curRow][curCol] = key;
            setRows(updatedRows);
            setCurCol(col => col + 1);
        }
    }

    const isCellActive = (row, col) => {
        return row === curRow && col === curCol
    }

    const getCellBGColor = (row, col) => {
        const letter = rows[row][col];

        if (row >= curRow) {
            return colors.black;
        }

        if (letter === letters[col]) {
            return colors.primary;
        }
        if (letters.includes(letter)) {
            return colors.secondary;
        }

        return colors.darkgrey;
    }

    const getAllLettersWithColor = (color) => {
        return rows.flatMap((row, i) =>
            row.filter((cell, j) => getCellBGColor(i, j) === color));
    }

    const greensCaps = getAllLettersWithColor(colors.primary);
    const yellowCaps = getAllLettersWithColor(colors.secondary);
    const greyCaps = getAllLettersWithColor(colors.darkgrey);

    const checkGameState = () => {
        if(checkIfWon() && gameState !== "won") {
            setGameState('won');
        }
        else if(checkIfLost() && gameState !== "lost") {
            setGameState('lost');
        }
    }

    const checkIfWon = () => {
        const row = rows[curRow - 1];

        return row.every((letter, i) => letter === letters[i]);
    };

    const checkIfLost = () => {
        return !checkIfWon() && curRow === rows.length;
    };

    const persistState = async() => {
        //write all the state in async storage
        const dataForToday = {
            rows,
            curRow,
            curCol,
            gameState
        };
        try {
            const existingStateString = await AsyncStorage.getItem("@game");
            const existingState = existingStateString ? JSON.parse(existingStateString) : {};

            existingState[dayKey] = dataForToday;

            const dataString = JSON.stringify(existingState); //later JSON.parse(string)
            await AsyncStorage.setItem('@game', dataString);

            if (gameState !== 'playing') {
                setTimeout(() => {
                    setIsFinishGame(true);
                }, 1000)
            }
        } catch (e) {
            console.error(e.message);
        }
    }

    const readState = async () => {
        const dataString = await AsyncStorage.getItem('@game');
        try {
            const data = JSON.parse(dataString);
            const day = data[dayKey];
            const {rows, curRow, curCol, gameState} = day || {};
            setRows(() => rows);
            setCurCol(() => curCol);
            setCurRow(() => curRow);
            setGameState(() => gameState);
        } catch (e) {
            console.error(e.message);
        }

        setLoaded(true);

    }

    useEffect(() => {
        readState();
    }, [])

    useEffect(() => {
        if (loaded) {
            persistState();
        }
    }, [rows, curRow, curCol, gameState, loaded]);

    useEffect(() => {
        if(curRow > 0) {
            checkGameState();
        }
    }, [curRow])

    if (!loaded) {
        return <ActivityIndicator />
    }

    if (gameState !== 'playing' && isFinishGame) {
        return <EndScreen
            won = {gameState === 'won'}
            rows={rows}
            getCellBGColor={getCellBGColor}
        />
    }

    const getCellStyle = (i, j) => [styles.cell, {
        borderColor: isCellActive(i, j)
            ? colors.lightgrey
            : colors.darkgrey,
        backgroundColor: getCellBGColor(i, j),
    }];


    return (
        <>
            <ScrollView style={styles.map}>
                {
                    rows.map((row, i) => (
                        <Animated.View entering={SlideInLeft.delay(i * 50)}
                            key={`row-${i}`}
                            style={styles.row}>
                            {
                                row.map((letter, j) => {
                                    return (
                                    <>
                                        {
                                            i < curRow && (
                                            <Animated.View
                                                entering={FlipInEasyX.delay(j * 50)}
                                                key={`cell-color-${i}-${j}`}
                                                style={getCellStyle(i, j)}>
                                                <Text style={styles.cellText}>{letter?.toUpperCase()}</Text>
                                            </Animated.View>
                                            )
                                        }
                                        {
                                            i === curRow && !!letter && (
                                                <Animated.View
                                                    entering={ZoomIn}
                                                    key={`cell-active-${i}-${j}`}
                                                    style={getCellStyle(i, j)}>
                                                    <Text style={styles.cellText}>{letter?.toUpperCase()}</Text>
                                                </Animated.View>
                                            )
                                        }
                                        {
                                            !letter && (
                                                <View
                                                    key={`cell-${i}-${j}`}
                                                    style={getCellStyle(i, j)}>
                                                    <Text style={styles.cellText}>{letter?.toUpperCase()}</Text>
                                                </View>
                                            )
                                        }
                                    </>
                                )})
                            }
                        </Animated.View>
                    ))
                }

            </ScrollView>
            <KeyboardComponent
                onKeyPressed={onKeyPressed}
                greenCaps={greensCaps}
                yellowCaps={yellowCaps}
                greyCaps={greyCaps}
            />
        </>
    );
}

export default Game;