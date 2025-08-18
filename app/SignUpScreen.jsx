import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../Constants/Colors';
import { useSignUpMutation } from '../redux/services/api';


const SignUpScreen = () => {
  const router = useRouter()
  const [signUp, { isLoading, isError, data, error }] = useSignUpMutation();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNo: "",
    password: "",
    confirmPassword: "",
  });

  const  handleChange = (filed, value)=>{
    setFormData({
      ...formData,
      [filed]: value,
    });
  }

  const handleSignUp = async () => {
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log(formData)
    try {
      const response = await signUp({
        fullName: formData.fullName,
        email: formData.email,
        contactNo: formData.contactNo,
        password: formData.password,
      }).unwrap();
      console.log("Sign Up Success:", response);
      router.push('/LoginScreen'); // Navigate to Login Screen on success
    } catch (err) {
      console.error("Sign Up Error:", err);
      alert("Sign Up failed. Please try again.");
    }

  }


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
          onChangeText={(val) => handleChange("email", val)}
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
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#888"
          secureTextEntry
          value={formData.password}
          onChangeText={(val) => handleChange("password", val)}
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
          value={formData.confirmPassword}
          onChangeText={(val) => handleChange("confirmPassword", val)}
        />
      </View>

      {/* /AccountVerification */}

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signUpButton}  onPress={handleSignUp} disabled={isLoading}>
        <Text style={styles.signUpButtonText}> {isLoading ? "Signing Up..." : "Sign Up"}</Text>
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

      {/* Login Link */}
      <View style={styles.loginTextContainer}>
        <Text style={styles.loginText}>I have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/LoginScreen')}>
          <Text style={styles.loginLink}>Log in</Text>
        </TouchableOpacity>
      </View>
       {isError && <Text style={{ color: "red", marginTop: 10 }}>Signup failed!</Text>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 30,
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
  signUpButton: {
    backgroundColor: Colors.primary,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    marginTop: 30,
    width: '60%',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  socialButton: {
    backgroundColor: '#f2f2f2',
    borderRadius: 15,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loginTextContainer: {
    flexDirection: 'row',
    marginTop: 30,
  },
  loginText: {
    fontSize: 16,
    color: '#555',
  },
  loginLink: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

export default SignUpScreen;
