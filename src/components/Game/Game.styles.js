import {StyleSheet} from "react-native";
import {colors} from "../../constants";

export default StyleSheet.create({
    map: {
        alignSelf: 'stretch',
        marginVertical: 20,
    },
    row: {
        flexDirection: 'row',
        alignSelf: 'stretch',
        justifyContent: 'center',
    },
    cell: {
        borderWidth: 3,
        borderColor: colors.grey,
        flex: 1,
        aspectRatio: 1,
        margin: 3,
        maxWidth: 70,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cellText: {
        color: colors.lightgrey,
        fontSize:28,
        fontWeight: "700",
    }
});