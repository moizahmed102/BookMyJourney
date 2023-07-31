import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PrivacyPolicyScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Privacy Policy</Text>

        <Text style={styles.sectionTitle}>1. Information Collection and Use</Text>
        <Text style={styles.sectionText}>
          At Book My Journey, we prioritize the privacy and security of our users' personal information. We collect and use certain information to provide and improve our services. This includes your name, email address, phone number, and other relevant details required for booking hotels, buses, and guides.
        </Text>

        <Text style={styles.sectionTitle}>2. Data Protection and Security</Text>
        <Text style={styles.sectionText}>
          We implement industry-standard security measures to protect your personal data from unauthorized access, disclosure, or alteration. We use encryption, secure servers, and best practices to ensure the confidentiality and integrity of your information.
        </Text>

        <Text style={styles.sectionTitle}>3. Information Sharing</Text>
        <Text style={styles.sectionText}>
          We may share your personal information with our trusted partners, such as hotels, bus operators, and guides, to facilitate your bookings and provide you with a seamless travel experience. However, we do not sell or rent your personal information to third parties for marketing purposes.
        </Text>

        <Text style={styles.sectionTitle}>4. Your Choices</Text>
        <Text style={styles.sectionText}>
          You have the right to access, modify, or delete your personal information stored in our systems. You can update your profile and communication preferences within the app. If you wish to delete your account, please contact our support team.
        </Text>

        <Text style={styles.sectionTitle}>5. Updates to this Privacy Policy</Text>
        <Text style={styles.sectionText}>
          We may update our Privacy Policy from time to time to reflect changes in our practices or legal requirements. We encourage you to review this policy periodically for any updates. By continuing to use our services, you consent to the updated Privacy Policy.
        </Text>

        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor:'white',
  },
  scrollContent: {
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign:'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 16,
  },
  footer: {
    fontSize: 12,
    marginTop: 16,
    textAlign: 'center',
  },
});

export default PrivacyPolicyScreen;
