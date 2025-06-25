import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import BackButton from "../components/UI/BackButton";
import { Colors } from "../Constants/Colors";

const Otp = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
      const [countdown, setCountdown] = useState(60);
      const [isResendDisabled, setIsResendDisabled] = useState(true);
      const inputRefs = useRef([]);
  const router = useRouter();


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
  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>OTP</Text>
      <Text style={styles.subTitle}>
        To reset you account, please enter the verification code you get on your
        e-mail.
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

      <TouchableOpacity
        onPress={() => router.push("/NewPassword")}
        style={styles.verifyButton}
      >
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
    </SafeAreaView>
  );
};

export default Otp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    padding: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 20,
  },
  subTitle: {
    marginVertical: 15,
    fontSize: 16,
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
    marginTop: 20,
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
 inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 10,
  },
   resendCode : {
    flexDirection : "row",
    alignItems : 'center',
    marginTop : 20,
    gap : 10,
    justifyContent : 'center'

  }
});
