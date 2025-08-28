import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../Constants/Colors";
import { useVerifyRegistrationMutation } from "../redux/services/api";
import { useNavigation } from "@react-navigation/native";
import { useSearchParams } from "expo-router";
import { useSignInMutation } from "../redux/services/api";
import { code, fingerPrint, mail } from "ionicons/icons";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/slices/authSlice"; //
const AccountVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const router = useRouter();
  const params = useLocalSearchParams
    ? useLocalSearchParams()
    : useSearchParams()[0];
  const { email } = useLocalSearchParams();
  const { password } = useLocalSearchParams();
  const dispatch = useDispatch(); // ✅ Add this

  const [oTP, { isLoading }] = useVerifyRegistrationMutation();
  const [signIn, { isLoading: isSigningIn }] = useSignInMutation();
  const [formData, setFormData] = useState({
    email: email,
  });
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

  const handleResendOtp = () => {
    setCountdown(60);
    setIsResendDisabled(true);
    // Add resend logic here
  };
  // Handle OTP verification and sign in
  const handleVerify = async () => {
    try {
      // First, verify the OTP with the backend
      const response = await oTP({
        email: email,
        tokenCode: otp.join(""),
      }).unwrap();
      await new Promise((res) => setTimeout(res, 500)); // wait half second
      // If OTP verification is successful, perform the sign-in
      if (response) {
        const signInResponse = await signIn({
          email: email,
          password: password, // Assuming password is available in formData
        }).unwrap();
        console.log(
          "Sign-in successful:",
          signInResponse,
          signInResponse.accessToken
        );

        const token = signInResponse.data.accessToken;

        console.log("Token being dispatched:", token);
        if (token) dispatch(setToken(token));
        router.replace("/(tabs)");
      }
    } catch (err) {
      console.error("Verification or Sign-in Error:", err);
      alert("Verification failed or Sign-in failed. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Verification</Text>
      <Text style={styles.subTitle}>
        To verify you account, please enter the verification code that you have
        received in your email {email}
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

        <TouchableOpacity onPress={handleResendOtp} disabled={isResendDisabled}>
          <Text style={{ color: isResendDisabled ? "gray" : "#1BA26E" }}>
            Resend OTP
          </Text>
        </TouchableOpacity>
      </View>
    </View>
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
    gap: 10,
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
