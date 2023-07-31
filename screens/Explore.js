import React, { useRef } from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Animated, Dimensions } from "react-native";
import { Divider } from "react-native-paper";
import Carousel from "react-native-snap-carousel";
import {
  TextInput as PaperTextInput,
  Button,
  Text,
  Card,
  Title,
  Subheading,
} from "react-native-paper";

const ImageCard = ({ image, name }) => (
  <View style={styles.imageCardContainer}>
    <Card.Cover source={image} style={styles.imageCard} resizeMode="cover" />
    <Card.Content style={styles.imageCardOverlay}>
      <Text style={styles.imageCardName}>{name}</Text>
    </Card.Content>
  </View>
);

const ExploreScreen = () => {
  // Dummy data for popular destinations (replace it with actual data)
  const services = [
    {
      name: "Tour Guides",
      image: require("../assets/guide.png"),
    },
    {
      name: "Hotels",
      image: require("../assets/hotel1.jpg"),
    },
    {
      name: "Buses",
      image: require("../assets/bus.jpg"),
    },
    {
      name: "Attractions",
      image: require("../assets/attractions.jpg"),
    },
  ];

  // Animated value for scaling images on press
  const scaleValue = useRef(new Animated.Value(1)).current;

  // Function to handle image press animation
  const handleImagePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Dummy data for featured destinations
  const featuredDestinations = [
    {
      name: "Islamabad, Pakistan",
      image: require("../assets/islamabad.jpg"),
      id: "10",
      link: "../assets/islamabad.jpg",
    },
    {
      name: "Murree, Pakistan",
      image: require("../assets/murree.jpg"),
      id: "11",
      link: "../assets/murree.jpg",
    },
    {
      name: "Naran Kaghan, Pakistan",
      image: require("../assets/naran.jpg"),
      id: "12",
      link: "../assets/naran.jpg",
    },
    // Add more featured destinations
  ];

  // Dummy data for trending places
  const trendingPlaces = [
    {
      image: require("../assets/places/La.jpeg"),
      name: "Minar-e-Pakistan",
      id: "02",
      link: "../assets/places/La.jpeg",
    },
    {
      image: require("../assets/places/badshahi.jpg"),
      name: "Badshahi Mosque",
      id: "01",
      link: "../assets/places/badshahi.jpg",
    },
    {
      image: require("../assets/places/Wazir_Khan_Mosque.jpg"),
      name: "Wazir Khan Mosque",
      id: "03",
      link: "../assets/places/Wazir_Khan_Mosque.jpg",
    },
    {
      image: require("../assets/places/meuseum.jpg"),
      name: "Meuseum",
      id: "04",
      link: "../assets/places/meuseum.jpg",
    },
    // Add more trending places
  ];

  // Get the screen width using Dimensions API
  const screenWidth = Dimensions.get("window").width;

  // Get the navigation object using useNavigation hook
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Heading for Our Services */}
        <Title style={styles.heading}>Our Services</Title>
        <Carousel
          data={services}
          renderItem={({ item }) => (
            <Animated.View
              style={[
                styles.serviceItem,
                { transform: [{ scale: scaleValue }] },
              ]}
            >
              <TouchableOpacity onPress={handleImagePress} activeOpacity={0.7}>
                <ImageCard image={item.image} name={item.name} />
              </TouchableOpacity>
            </Animated.View>
          )}
          sliderWidth={screenWidth}
          itemWidth={200} // Adjust the width for the carousel item
          loop
          autoplay
          autoplayInterval={3000}
          loopClonesPerSide={2}
          useNativeDriver
        />

        {/* Heading for Featured Destinations */}
        <Divider style={styles.divider} />
        <Title style={styles.heading}>Featured Destinations</Title>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featuredDestinations.map((destination, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() =>
                navigation.navigate("Place Details", {
                  id: destination.id,
                  name: destination.name,
                })
              }
            >
              <Card.Cover source={destination.image} style={styles.cardCover} />
              <Card.Content>
                <Subheading style={styles.cardTitle}>
                  {destination.name}
                </Subheading>
              </Card.Content>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Heading for Trending Places */}
        <Divider style={styles.divider} />
        <Title style={styles.heading}>Trending Places</Title>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {trendingPlaces.map((destination, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() =>
                navigation.navigate("Place Details", {
                  id: destination.id,
                  name: destination.name,
                })
              }
            >
              <Card.Cover source={destination.image} style={styles.cardCover} />
              <Card.Content>
                <Subheading style={styles.cardTitle}>
                  {destination.name}
                </Subheading>
              </Card.Content>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    padding: 10,
    backgroundColor: "#F0F9FA",
  },
  heading: {
    fontSize: 24,
    color: "#1F1F29",
    fontWeight: "bold",
    paddingHorizontal: 20,
    marginBottom: 20, // Add more space between the headings and content
    marginTop: 10, // Add top margin to the first heading
    opacity: 0.9,
  },
  imageCard: {
    width: 200,
    height: 150,
    borderRadius: 8,
    backgroundColor: "#F0F0F5",
    justifyContent: "flex-end",
    marginVertical: 10, // Add vertical margin between image cards
  },
  imageCardOverlay: {
    backgroundColor: "F0F0F5",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  imageCardName: {
    fontSize: 16, // Change the font size to 16 to match cardTitle
    fontWeight: "bold",
    color: "#1F1F29",
    textAlign: "center",
    marginTop: 10, // Add top margin to match cardTitle
  },
  imageCardContainer: {
    marginRight: 2, // Add horizontal spacing between image cards
  },
  card: {
    marginHorizontal: 8,
    elevation: 4,
    backgroundColor: "#F0F0F5",
    borderRadius: 8,
    width: 250,
    overflow: "hidden",
    marginVertical: 10, // Add vertical margin between cards
    shadowColor: "#1F1F29",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 4,
  },
  cardCover: {
    height: 150,
    borderRadius: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F1F29",
    marginTop: 10,
  },
  divider: {
    marginVertical: 20,
    marginHorizontal: 20,
    backgroundColor: "#1F1F29",
  },
});

export default ExploreScreen;
