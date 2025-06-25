import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import BackButton from "../components/UI/BackButton";
import { Colors } from "../Constants/Colors";

const ForgerPassword = () => {
  return (
    <SafeAreaView style={styles.container}>
      <BackButton />
      <Text style={styles.title}>Forgot Password</Text>
      <Text style={styles.subTitle}>
        To reset your password, Please enter the email address that is
        associated with the account. You’ll get the link in your e-mail.
      </Text>

      <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="consultme@gmail.com"
                placeholderTextColor="#888"
                keyboardType="email-address"
                autoCapitalize="none" 
              />
            </View>

      <TouchableOpacity style={styles.verifyButton}>
        <Text style={styles.verifyText}>Send</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ForgerPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffff",
    padding: 20,
    paddingTop : 50
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
    width: '100%', 
    marginBottom: 15, 
  },
  label: {
    fontSize: 16,
    color: Colors.primary, 
    marginBottom: 5,
    fontWeight: '500',
    marginTop : 20
  },
  input: {
    width: '100%',
    height: 45, 
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15, 
    fontSize: 16,
    color: '#333',
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
});
