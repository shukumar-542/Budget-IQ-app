import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { Colors } from "../Constants/Colors";
import {
  useLazyGetMessageWithTotalTransactionQuery,
  useSignInMutation,
} from "../redux/services/api";
import { setToken } from "../redux/slices/authSlice";
import { saveApiSuccess } from "../redux/slices/messageSlice";
import { getToken, saveAuthData } from "../utils/secureStore";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
const LoginScreen = () => {
  const [triggerGetMessages, { data }] =
    useLazyGetMessageWithTotalTransactionQuery();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const [isEmailValid, setIsEmailValid] = useState(true);

  const validateEmail = (text) => {
    handleChange("email", text);
    // Basic email regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(regex.test(text));
  };
  const router = useRouter();
  const navigation = useNavigation();
  const [signIn, { isLoading, isError }] = useSignInMutation();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleLogin = async () => {
    try {
      const response = await signIn(formData).unwrap();
  
      // Save token and email
      if (response?.data?.accessToken && formData?.email) {
        await saveAuthData(response?.data?.accessToken, formData?.email);
        dispatch(setToken(response?.data?.accessToken));

        const token = await getToken(); // 👈 Fix here
    
      }

      // ✅ Run your extra async function before routing
      await runAnotherAsyncFunction();

      // Already visited → go to main/home page
      router.replace("/(tabs)");
    } catch (error) {
      const statusCode = error?.status || error?.originalStatus;
      const message = error?.data?.message || "Something went wrong";

      if (statusCode === 404) {
        Alert.alert("Login Failed", "User not found. Please check your email.");
      } else if (statusCode === 401) {
        Alert.alert("Login Failed", "Incorrect password. Please try again.");
      } else {
        Alert.alert("Error", message);
      }
    }
  };
  const runAnotherAsyncFunction = async () => {
    try {
      const result = await triggerGetMessages().unwrap();

      // ✅ Save only the `success` value to Redux
      dispatch(saveApiSuccess(result.success));
    } catch (error) {
      
      dispatch(saveApiSuccess(null));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <Image
        source={require("../assets/images/welcome.png")}
        style={styles.logo}
      />
      <Text style={styles.logoText}>BUDGET{"\n"}IQ</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        value={formData.email}
        style={styles.input}
        placeholder="consultme@gmail.com"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={validateEmail}
      />

      <Text style={styles.label}>Password</Text>
      <View style={{ position: "relative" }}>
        <TextInput
          value={formData.password}
          style={[styles.input, { paddingRight: 40 }]} // extra space for icon
          placeholder="********"
          secureTextEntry={!showPassword}
          onChangeText={(text) => handleChange("password", text)}
        />

        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={{ position: "absolute", right: 10, top: 12 }}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={22}
            color="#00794F"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.forgot}
        onPress={() => navigation.navigate("ForgerPassword")}
      >
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleLogin()}
        style={[
          styles.loginButton,
          (isLoading ||
            !isEmailValid ||
            !formData.email.trim() ||
            !formData.password.trim()) && { opacity: 0.6 },
        ]}
        disabled={
          isLoading ||
          !isEmailValid ||
          !formData.email.trim() ||
          !formData.password.trim()
        }
      >
        <Text style={styles.loginButtonText}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/SignUpScreen")}>
          <Text style={styles.signupText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
    marginBottom: 8,
  },
  logoText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#00794F",
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#00794F",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#00794F",
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    color: "#333",
  },
  forgot: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgotText: {
    color: "#00794F",
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: "#00794F",
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    color: "#00794F",
    fontWeight: "600",
  },
});
