import { Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "../../Constants/Colors";

const Button = ({ children , onPress , isActive}) => {
  return (
    <View>
      <Pressable onPress={onPress} style={({pressed})=> pressed && styles.pressed}>
        <View style={[styles.button ,  { backgroundColor: isActive ? Colors.primary : "#6C6B6E" }]}>
          <Text style={styles.buttonText}>{children}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 4,
    padding: 8,
    // backgroundColor: Colors.primary,
    minWidth : 100
  },

  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize : 17
  },

  pressed: {
    opacity: 0.75,
    backgroundColor: Colors.primary100,
    borderRadius: 4,
  },
});
