import { useLocalSearchParams, useRouter } from "expo-router";
import { use, useEffect, useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../Constants/Colors";
import { useVerifyRegistrationMutation } from "../redux/services/api";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/slices/authSlice"; //

import { useSignInMutation } from "../redux/services/api";
import { useResentOtpMutation } from "../redux/services/api";
import { KeyboardAvoidingView, Platform } from "react-native";
const AccountVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const { password } = useLocalSearchParams();
  const dispatch = useDispatch(); // ✅ Add this

  const [oTP, { isLoading }] = useVerifyRegistrationMutation();
  const [resentOtp] = useResentOtpMutation();
  const [signIn] = useSignInMutation();
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index, key) => {
    if (key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleResendOtp = async () => {
    if (!email) {
      Alert.alert("Error", "Email is missing. Cannot resend OTP.");
      return;
    }

    setCountdown(60);
    setIsResendDisabled(true);

    try {
      const response = await resentOtp({ email }).unwrap();
      Alert.alert("Success", "A new OTP has been sent to your email.");
    } catch (e) {
      const statusCode = e?.status;
      const message = e?.data?.message || "Unable to resend OTP.";

      if (statusCode === 429) {
        Alert.alert(
          "Too Many Requests",
          "Please wait before requesting again."
        );
      } else if (statusCode === 500) {
        Alert.alert("Server Error", "Please try again later.");
      } else {
        Alert.alert("Error", message);
      }

      // ✅ Allow user to retry after failure
      setIsResendDisabled(false);
    }
  };

  // Handle OTP verification and sign in
  const handleVerify = async () => {
    // ✅ 1. Check if OTP is complete
    if (otp.join("").length < 6) {
      Alert.alert("Invalid OTP", "Please enter the complete 6-digit code.");
      return;
    }

    if (!email || !password) {
      Alert.alert(
        "Missing Data",
        "Email or password is missing. Please restart the process."
      );
      return;
    }

    try {
      const verifyResponse = await oTP({
        email: email,
        tokenCode: otp.join(""),
      }).unwrap();
      // ✅ 3. Proceed to Sign-in
      try {
        const signInResponse = await signIn({
          email: email,
          password: password,
        }).unwrap();
        const token = signInResponse?.data?.accessToken;
        if (token) {
          dispatch(setToken(token));
          router.replace("/LoginScreen");
        } else {
          Alert.alert("Sign-in Error", "Token is missing. Please try again.");
        }
      } catch (signInError) {
        const statusCode = signInError?.status;
        const message =
          signInError?.data?.message || "Sign-in failed. Please try again.";

        if (statusCode === 401) {
          Alert.alert("Authentication Failed", "Invalid credentials.");
        } else if (statusCode === 500) {
          Alert.alert("Server Error", "Unable to sign in. Try again later.");
        } else {
          Alert.alert("Error", message);
        }
      }
    } catch (err) {
      const statusCode = err?.data?.err?.statusCode || err?.status || 500;
      const message = err?.data?.message || "Failed to verify OTP.";

      Alert.alert(
        "❌ Error", // Add emoji or custom title
        message,
        [{ text: "Cancel", style: "cancel" }],
        { cancelable: true }
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Account Verification</Text>
        <Text style={styles.subTitle}>
          To verify you account, please enter the verification code that you
          have received in your email {email}
        </Text>

        <View style={styles.inputContainer}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.input}
              keyboardType="numeric"
              maxLength={1}
              value={otp[index]}
              onChangeText={(text) => handleOtpChange(index, text)}
              onKeyPress={({ nativeEvent: { key } }) =>
                handleKeyPress(index, key)
              }
              selectTextOnFocus
            />
          ))}
        </View>

        <TouchableOpacity style={styles.verifyButton} onPress={handleVerify}>
          <Text style={styles.verifyText}>Send</Text>
        </TouchableOpacity>

        <View style={styles.resendCode}>
          <Text>
            {isResendDisabled
              ? `Resend OTP in ${countdown}s`
              : "Didn't get code?"}
          </Text>

          <TouchableOpacity
            onPress={handleResendOtp}
            disabled={isResendDisabled}
          >
            <Text style={{ color: isResendDisabled ? "gray" : "#1BA26E" }}>
              Resend OTP
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AccountVerification;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 100,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  subTitle: {
    marginVertical: 20,
    fontSize: 16,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 5,
  },
  input: {
    width: 45,
    height: 50,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 8,
    textAlign: "center",
    fontSize: 20,
  },
  countdown: {
    marginBottom: 10,
    color: "gray",
  },
  resendButton: {
    borderRadius: 5,
    marginBottom: 20,
  },
  resendText: {
    color: "white",
  },
  verifyButton: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 5,
    width: "100%",
  },
  verifyText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  resendCode: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
});
