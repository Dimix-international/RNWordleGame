import {useEffect, useState} from "react";
import {Text} from "react-native";
import {colors} from "../../constants";


const Timer = () => {

    const [tillTomorrow, setTillTomorrow] = useState(0);

    const formatSeconds = () => {

        const oneMin = 60 * 1000;
        const oneHour = 60 * oneMin;
        const oneDay = 24 * oneHour;

        const days = Math.floor(tillTomorrow / oneDay);
        const hours = Math.floor((tillTomorrow % oneDay) / oneHour);
        const minutes = Math.floor((tillTomorrow % oneHour) / oneMin);
        const seconds = Math.floor((tillTomorrow % oneMin) / 1000);

        return `${hours < 10 ? `0${hours}` : hours}:${minutes}:${seconds}`;
    }

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const tomorrow = new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate() + 1,
            );

            setTillTomorrow(tomorrow - now);
        }

        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval)

    },[]);
    return (
        <Text style={{
            color: colors.lightgrey,
            fontSize: 24,
            fontWeight: "700",
        }}>
            {formatSeconds()}
        </Text>
    )
}

export default Timer;