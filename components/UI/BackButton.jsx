import { useRouter } from "expo-router";
import { Image, StyleSheet, TouchableOpacity } from "react-native";

const BackButton = ({ style }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.back()}
      style={[style, { paddingTop: 10 }]} // full touchable area
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // increases tappable area
    >
      <Image
        source={require("../../assets/images/backicon.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
};

export default BackButton;

const styles = StyleSheet.create({
  image: {
    height: 40,
    width: 40,
  },
});
