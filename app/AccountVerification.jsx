import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../Constants/Colors";

const AccountVerification = () => {
  const navigation = useNavigation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(60);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef([]);
  const router = useRouter()

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

  const handleVerify = () => {
    const fullOtp = otp.join("");
    if (fullOtp.length === 6) {
    }
   router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Verification</Text>
      <Text style={styles.subTitle}>
        To verify you account, please enter the verification code that you have
        received in your email co****ty@gmail.com
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
        <Text >
          {isResendDisabled ? `Resend OTP in ${countdown}s` : "Didn't get code?"}
        </Text>

        <TouchableOpacity
          onPress={handleResendOtp}
          disabled={isResendDisabled}
          
        >
          <Text style={{ color: isResendDisabled ? 'gray' : '#1BA26E' }}>Resend OTP</Text>
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
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  subTitle: {
    marginVertical: 20,
    fontSize: 16,
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
    borderColor: "gray",
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
  resendCode : {
    flexDirection : "row",
    alignItems : 'center',
    marginTop : 20,
    gap : 10
  }
});
