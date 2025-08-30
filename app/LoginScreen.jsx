import { useNavigation, useRouter } from "expo-router";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../Constants/Colors";
import { useSignInMutation } from "../redux/services/api";
import { useState } from "react";
import { saveAuthData } from "../utils/secureStore";
const LoginScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [signIn, { isLoading, isError }] = useSignInMutation();
  const [formData, setFormData] = useState({
    email: "majelek286@skateru.com",
    password: "11111111",
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
      console.log("Login successful:", response);
      // Save token and email before navigation
      if (response?.data.accessToken && formData?.email) {
        await saveAuthData(response.data.accessToken, formData.email);
        console.log("Token and email saved successfully");
      } else {
        console.warn("Token or email missing");
      }
      router.replace("/Subscriptions");
    } catch (error) {
      console.error("Login failed:", error);
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
        onChangeText={(text) => handleChange("email", text)}
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        value={formData.password}
        style={styles.input}
        placeholder="********"
        secureTextEntry
        onChangeText={(text) => handleChange("password", text)}
      />

      <TouchableOpacity
        style={styles.forgot}
        onPress={() => navigation.navigate("ForgerPassword")}
      >
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleLogin()}
        style={styles.loginButton}
      >
        <Text style={styles.loginButtonText}>Log In</Text>
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
