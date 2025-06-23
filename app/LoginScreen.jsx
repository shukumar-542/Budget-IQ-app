import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <Image source={require('../assets/images/welcome.png')} style={styles.logo} />
      <Text style={styles.logoText}>BUDGET{"\n"}IQ</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="consultme@gmail.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="********"
        secureTextEntry
      />

      <TouchableOpacity style={styles.forgot}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Log In</Text>
      </TouchableOpacity>

      <View style={styles.signupContainer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity>
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
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00794F',
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: 'center',
    marginBottom: 8,
  },
  logoText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00794F',
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00794F',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#00794F',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  forgot: {
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  forgotText: {
    color: '#00794F',
    fontSize: 12,
  },
  loginButton: {
    backgroundColor: '#00794F',
    paddingVertical: 14,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#00794F',
    fontWeight: '600',
  },
});

