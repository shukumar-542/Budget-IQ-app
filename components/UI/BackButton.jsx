import { useRouter } from "expo-router";
import { Image, Pressable, StyleSheet, View } from "react-native";

const BackButton = ({ style }) => {
    const router = useRouter();

    return (
        <Pressable onPress={() => router.back()} style={style}>
            <Image
                source={require('@/assets/images/backicon.png')}
                style={styles.image}
                resizeMode="contain"
            />
        </Pressable>
    );
};

export default BackButton;

const styles = StyleSheet.create({
    image: {
        height: 40,
        width: 40,
    },
});
