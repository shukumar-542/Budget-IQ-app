import { useLocalSearchParams, useRouter, useSearchParams } from "expo-router";
import { useState } from "react";
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
import { useResetPasswordMutation } from "../redux/services/api";
const NewPassword = () => {
  const [NewPassword, setNewPassword] = useState();
  const router = useRouter();
  const [resetPassword] = useResetPasswordMutation();
  const { email } = useLocalSearchParams();
  const { tokenCode } = useLocalSearchParams();
  const handleNext = async () => {
    try {
      const response = await resetPassword({
        email: email,
        tokenCode: tokenCode,
        NewPassword: NewPassword,
      }).unwrap();
      router.replace("/LoginScreen");
    } catch (e) {
      console.log("From New Password : ", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <BackButton style={styles.backButton} />
      <Text style={styles.title}>New Password</Text>
      <Text style={styles.subTitle}>Please enter in your new password</Text>
      {/* Password Input Group */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#888"
          secureTextEntry
          value={NewPassword}
          onChange={setNewPassword}
        />
      </View>
      {/* Confirm Password Input Group */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#888"
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        onPress={() => handleNext()}
        style={styles.verifyButton}
      >
        <Text style={styles.verifyText}>Update</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default NewPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    padding: 20,
    paddingTop: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  subTitle: {
    marginVertical: 15,
    fontSize: 16,
    textAlign: "center",
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
    width: "100%",
    height: 45,
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  verifyButton: {
    backgroundColor: Colors.primary,
    padding: 8,
    borderRadius: 5,
    width: "100%",
    marginTop: "10%",
  },
  verifyText: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    marginTop: 10,
    zIndex: 1,
  },
});
