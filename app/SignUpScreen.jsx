import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../Constants/Colors';


const SignUpScreen = () => {
  const router = useRouter()
  return (
    <SafeAreaView style={styles.container}>
      {/* Title of the screen */}
      <Text style={styles.title}>Sign Up</Text>

      {/* Full Name Input Group */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name here..."
          placeholderTextColor="#888" 
        />
      </View>

      {/* Email Input Group */}
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

      {/* Phone Number Input Group */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
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

      {/* Sign Up Button */}
      <TouchableOpacity style={styles.signUpButton} onPress={() => router.push("/AccountVerification")}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Social Sign-Up Buttons (Apple & Google) */}
      <View style={styles.socialButtonsContainer}>
        {/* Apple Sign-Up Button */}
        <TouchableOpacity style={styles.socialButton} onPress={() => console.log('Apple Sign Up')}>
          <FontAwesome name="apple" size={30} color="#000" />
        </TouchableOpacity>
        {/* Google Sign-Up Button */}
        <TouchableOpacity style={styles.socialButton} onPress={() => console.log('Google Sign Up')}>
          <FontAwesome name="google" size={30} color="#DB4437" />
        </TouchableOpacity>
      </View>

      {/* Login Link */}
      <View style={styles.loginTextContainer}>
        <Text style={styles.loginText}>I have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/LoginScreen')}>
          <Text style={styles.loginLink}>Log in</Text>
        </TouchableOpacity>
      </View>
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
