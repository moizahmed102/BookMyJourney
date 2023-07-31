import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HelpAndSupportScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Help and Support</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <Text style={styles.sectionText}>
          Find answers to commonly asked questions about booking, hotels, buses,
          and guides.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.sectionText}>
          If you have any further questions or need assistance, our support team
          is here to help.
        </Text>
        <Text style={styles.sectionText}>Email: support@bookmyjourney.com</Text>
        <Text style={styles.sectionText}>Phone: +92 334 4693610</Text>
        <Text style={styles.sectionText}>Phone: +92 335 3044966</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Feedback</Text>
        <Text style={styles.sectionText}>
          We value your feedback! If you have any suggestions or encounter any
          issues, please let us know.
        </Text>
        <Text style={styles.sectionText}>
          Email: feedback@bookmyjourney.com
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 16,
    marginBottom: 4,
  },
});

export default HelpAndSupportScreen;
