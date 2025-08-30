import { useRouter } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "../Constants/Colors";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadTokenFromStorage } from "../redux/slices/authSlice";
import { getToken } from "../utils/secureStore";
import { useState } from "react";
import {
  loadLastViewTime,
  saveCurrentViewTime,
} from "../redux/slices/SubscriptionSlice";
import { useSelector } from "react-redux";
const SecondScreen = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);
  const lastViewTime = useSelector((state) => state.subscription.lastViewTime);
  useEffect(() => {
    // Load last view time immediately
    dispatch(loadLastViewTime());
    // Load token
    const loadToken = async () => {
      const storedToken = await getToken();
      if (storedToken) {
        dispatch(loadTokenFromStorage(storedToken));
        setToken(storedToken); // save to local state
      }
      console.log("Loaded token from second screen:", storedToken);
    };
    loadToken();
  }, [dispatch]);

  const handleNext = () => {
    const currentTime = new Date().getTime();
    if (token) {
      if (lastViewTime) {
        const hoursDiff = (currentTime - lastViewTime) / (1000 * 60 * 60); // ms → hours
        if (hoursDiff > 12) {
          router.push("/Subscriptions");
          console.log("Token exists,12 hours left navigating to Subscriptions");
        } else {
          router.replace("/(tabs)");
        }
      }
    } else {
      router.push("/LoginScreen");
      console.log("No token, navigating to LoginScreen");
    }
  };
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/budget.png")}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={styles.heading}>
        Best Budgeting Tools for{"\n"}Home Finances
      </Text>

      <Text style={styles.description}>
        Easily log in or sign up to connect with BUDGET IQ and calculate your
        daily cost
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => handleNext()}>
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>

      <View style={styles.pagination}>
        <View style={styles.dot} />
        <View style={[styles.dot, styles.activeDot]} />
      </View>
    </View>
  );
};

export default SecondScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 24,
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 250,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "#000",
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    width: "100%",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  pagination: {
    flexDirection: "row",
    marginTop: 20,
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
  },
  activeDot: {
    backgroundColor: "#00C46A",
  },
});
