import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../Constants/Colors";
import { useSignUpMutation } from "../redux/services/api";

const SignUpScreen = () => {
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const [isEmailValid, setIsEmailValid] = useState(true);

  const validateField = (field, value) => {
    let errorMsg = "";

    switch (field) {
      case "fullName":
        if (!value.trim()) errorMsg = "Full name is required.";
        else if (value.trim().length < 3) errorMsg = "At least 3 characters.";
        else if (/^\d+$/.test(value)) errorMsg = "Name cannot be numbers only.";
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) errorMsg = "Email is required.";
        else if (!emailRegex.test(value)) errorMsg = "Invalid email format.";
        break;

      case "contactNo":
        if (!value.trim()) errorMsg = "Phone number is required.";
        else if (!/^\d+$/.test(value)) errorMsg = "Digits only.";
        else if (value.length < 4) errorMsg = "At least 4 digits.";
        break;

      case "password":
        if (!value) errorMsg = "Password is required.";
        else if (value.length < 6) errorMsg = "At least 6 characters.";
        else if (/\s/.test(value)) errorMsg = "No spaces allowed.";
        break;

      case "confirmPassword":
        if (value !== formData.password) errorMsg = "Passwords do not match.";
        break;

      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const validateEmail = (text) => {
    handleChange("email", text);
    // Basic email regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(regex.test(text));
  };
  const [signUp, { isLoading, isError, data, error }] = useSignUpMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNo: "",
    password: "",
    confirmPassword: "",
  });
  const validateForm = () => {
    return (
      Object.values(errors).every((err) => !err) &&
      Object.values(formData).every((val) => val.trim() !== "")
    );
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    validateField(field, value);
  };

  const handleSignUp = async () => {
    // ✅ Basic client-side validation
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.contactNo
    ) {
      Alert.alert("Validation Error", "All fields are required.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert(
        "Weak Password",
        "Password must be at least 6 characters long."
      );
      return;
    }

    try {
      // ✅ API call
      const response = await signUp({
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        contactNo: formData.contactNo.trim(),
        password: formData.password,
      }).unwrap();

      // ✅ Save data securely
      await SecureStore.setItemAsync("userFullName", formData.fullName);
      await SecureStore.setItemAsync("userEmail", formData.email);
      await SecureStore.setItemAsync("userContactNo", formData.contactNo);

      // ✅ Navigate to verification screen
      router.push({
        pathname: "/AccountVerification",
        params: {
          email: formData.email,
          password: formData.password,
        },
      });
    } catch (err) {
      // ✅ Extract error details
      const statusCode = err?.status || err?.originalStatus;
      const serverMessage = err?.data?.message || "";

      if (statusCode === 400) {
        Alert.alert(
          "Sign Up Failed",
          serverMessage || "Invalid input. Please check your data."
        );
      } else if (statusCode === 409) {
        Alert.alert(
          "Email Exists",
          "An account with this email already exists. Please log in."
        );
      } else if (statusCode === 422) {
        Alert.alert(
          "Validation Error",
          "Please check your email and contact number."
        );
      } else if (statusCode === 500) {
        Alert.alert(
          "Server Error",
          "Something went wrong on our end. Please try again later."
        );
      } else if (err.name === "TypeError") {
        Alert.alert("Network Error", "Please check your internet connection.");
      } else {
        Alert.alert(
          "Error",
          serverMessage || "Sign Up failed. Please try again."
        );
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Title of the screen */}
      <Text style={styles.title}>Sign Up</Text>

      {/* Full Name Input Group */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={formData.fullName}
          onChangeText={(value) => handleChange("fullName", value)}
          placeholder="Enter your full name here..."
          placeholderTextColor="#888"
        />
      </View>

      {/* Email Input Group */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={formData.email}
          onChangeText={validateEmail}
          placeholder="consultme@gmail.com"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Phone Number Input Group */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={formData.contactNo}
          onChangeText={(val) => handleChange("contactNo", val)}
        />
      </View>

      {/* Password Input Group */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={{ position: "relative" }}>
          <TextInput
            style={[styles.input, { paddingRight: 40 }]}
            placeholder="********"
            placeholderTextColor="#888"
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(val) => handleChange("password", val)}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{ position: "absolute", right: 10, top: 12 }}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Confirm Password Input Group */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={{ position: "relative" }}>
          <TextInput
            style={[styles.input, { paddingRight: 40 }]}
            placeholder="********"
            placeholderTextColor="#888"
            secureTextEntry={!showConfirmPassword}
            value={formData.confirmPassword}
            onChangeText={(val) => handleChange("confirmPassword", val)}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={{ position: "absolute", right: 10, top: 12 }}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={22}
              color={Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* /AccountVerification */}

      {/* Sign Up Button */}
      <TouchableOpacity
        style={[
          styles.signUpButton,
          (!validateForm() || isLoading) && { opacity: 0.6 },
        ]}
        onPress={handleSignUp}
        disabled={!validateForm() || isLoading}
      >
        <Text style={styles.signUpButtonText}>
          {isLoading ? "Signing Up..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      {/* Social Sign-Up Buttons (Apple & Google) */}
      <View style={styles.socialButtonsContainer}>
        {/* Apple Sign-Up Button */}
        {/* <TouchableOpacity style={styles.socialButton} onPress={() => console.log('Apple Sign Up')}>
          <FontAwesome name="apple" size={30} color="#000" />
        </TouchableOpacity> */}
        {/* Google Sign-Up Button */}
        {/* <TouchableOpacity style={styles.socialButton} onPress={() => console.log('Google Sign Up')}>
          <FontAwesome name="google" size={30} color="#DB4437" />
        </TouchableOpacity> */}
      </View>
      {/* <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 40,
        }}
      >
        <TouchableOpacity>
          <Image source={require("../assets/images/apple.png")}></Image>
        </TouchableOpacity>
        <TouchableOpacity>
          <Image source={require("../assets/images/google.png")}></Image>
        </TouchableOpacity>
      </View> */}
      {/* Login Link */}
      <View style={styles.loginTextContainer}>
        <Text style={styles.loginText}>I have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/LoginScreen")}>
          <Text style={styles.loginLink}>Log in</Text>
        </TouchableOpacity>
      </View>
      {isError && (
        <Text style={{ color: "red", marginTop: 10 }}>Signup failed!</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.primary,
    marginBottom: 30,
  },
  inputGroup: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    width: "100%",
    height: 45,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  signUpButton: {
    backgroundColor: Colors.primary,
    width: "100%",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  socialButtonsContainer: {
    flexDirection: "row",
    marginTop: 30,
    width: "60%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  socialButton: {
    backgroundColor: "#f2f2f2",
    borderRadius: 15,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginTextContainer: {
    flexDirection: "row",
    marginTop: 30,
  },
  loginText: {
    fontSize: 16,
    color: "#555",
  },
  loginLink: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "bold",
  },
});

export default SignUpScreen;
