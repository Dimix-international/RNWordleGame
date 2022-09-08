import {StyleSheet, Text, View} from "react-native";
import GuessDistributionLine from "./GuessDistributionLine";
import {colors} from "../../constants";


const GuessDistribution = ({distribution}) => {

    if (!distribution) return;

    const sum = distribution.reduce((total, dist) => dist + total, 0)

    return (
        <>
            <Text style={styles.subtitle}>GUESS DISTRIBUTION</Text>
            <View style={{width: '100%', padding: 20}}>
                {
                    distribution.map((dist, index) => (
                        <GuessDistributionLine
                            key={index}
                            position={index + 1}
                            amount={dist}
                            percentage={100 * dist / sum}
                        />
                    ))
                }
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    subtitle: {
        fontSize: 20,
        color: colors.lightgrey,
        marginVertical: 15,
        textAlign: 'center',
        fontWeight: 'bold',
    }
});

export default GuessDistribution;