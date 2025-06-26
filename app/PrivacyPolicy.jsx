import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

const PrivacyPolicy = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* Main Introduction Paragraph */}
        <Text style={styles.introText}>
          Welcome to Budget IQ, your personal finance tool for budgeting, saving, and tracking goals. By using
          Budget IQ, you agree to the terms below and our Privacy Policy.
        </Text>

        {/* Section 1: Use of the App */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Use of the App</Text>
          <Text style={styles.sectionBody}>
            By using Budget IQ, you confirm you are at least 18 years old and agree to these Terms.
          </Text>
        </View>

        {/* Section 2: Accounts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Accounts</Text>
          <Text style={styles.sectionBody}>
            You may need to create an account. You’re responsible for keeping your login details secure.
          </Text>
        </View>

        {/* Section 3: Features & Advice */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Features & Advice</Text>
          <Text style={styles.sectionBody}>
            Our tools help you manage your finances, but we don’t offer financial, legal, or tax advice.
          </Text>
        </View>

        {/* Section 4: Privacy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Privacy</Text>
          <Text style={styles.sectionBody}>
            We respect your privacy and handle your data per our Privacy Policy. We don’t share or sell your
            information without consent, unless required by law.
          </Text>
        </View>

        {/* Section 5: Subscriptions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Subscriptions</Text>
          <Text style={styles.sectionBody}>
            Some features require a paid plan. Fees may change with notice. You can cancel anytime via
            account settings.
          </Text>
        </View>

        {/* Section 6: Refunds */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}> 6. Refunds</Text>
          <Text style={styles.sectionBody}>
            We don’t offer refunds for partial billing periods unless legally required.
          </Text>
        </View>

        {/* Section 7: Acceptable Use */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Acceptable Use</Text>
          <Text style={styles.sectionBody}>
            Don’t misuse the app, break laws, or provide false info.
          </Text>
        </View>

        {/* Section 8: Ownership */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Ownership</Text>
          <Text style={styles.sectionBody}>
            All content and software in Budget IQ belong to us or our partners.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}

export default PrivacyPolicy

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff', // White background
  },
  scrollViewContent: {
    padding: 20, // Overall padding for the content
  },
  introText: {
    fontSize: 16,
    lineHeight: 24, // For better readability
    marginBottom: 20, // Space after intro
    color: '#333',
  },
  section: {
    marginBottom: 20, // Space between sections
  },
  sectionNumber: {
    fontSize: 16,
    fontWeight: 'bold', // Number is part of the bold title
    color: '#333',
    // We'll combine number and title in one line visually
    // by using them in sequence in the JSX, then adjust spacing.
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    // If you want the number and title to be truly inline on one line,
    // you might need to wrap them in a View with flexDirection: 'row'
    // or concatenate the text. For simplicity and maintaining separate styles,
    // I'm keeping them as separate Text components that follow each other.
    // The line break between number and title in the image is minimal,
    // suggesting they are just flowing naturally.
  },
  sectionBody: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
    marginTop: 5, // Space between title and body
  },
});
