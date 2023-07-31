import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";

const AboutUsScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/icon.png")} style={styles.logo} />
      <Text style={styles.title}>About Book My Journey</Text>

      <Text style={styles.description}>
        Book My Journey is your one-stop destination for all your travel needs.
        We offer a seamless and convenient way to book hotels, buses, and guides
        for your dream vacation or business trip.
      </Text>

      <Text style={styles.description}>
        Our mission is to make travel planning easy and enjoyable for everyone.
        Whether you're exploring a new city, going on an adventure, or attending
        a conference, we've got you covered.
      </Text>

      <Text style={styles.description}>
        At Book My Journey, we strive to provide the best travel experience by
        partnering with top-notch hotels, reliable bus operators, and
        experienced guides. Your satisfaction and safety are our top priorities.
      </Text>

      <Text style={styles.description}>
        Thank you for choosing Book My Journey for your travel needs. We look
        forward to being a part of your amazing journey!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    backgroundColor: "white",
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    marginBottom: 16,
    textAlign: "center",
  },
});

export default AboutUsScreen;
