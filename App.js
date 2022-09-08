import { SafeAreaView, StyleSheet, Text} from 'react-native';
import {colors} from "./src/constants";
import {StatusBar} from "expo-status-bar";
import Game from "./src/components/Game";


export default function App() {

  return (
      <SafeAreaView style={styles.container}>
          <StatusBar style={'light'}/>
          <Text style={styles.title}>WORDLE</Text>
          <Game />
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    alignItems: 'center',
  },
  title: {
    color:colors.lightgrey,
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 7,
    marginTop: 20,
  },
});
