import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, Title } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const navigation = useNavigation();
  const navigateToNextScreen = (id, name, imageLink) => {
    navigation.navigate("Place Details", { id, name, imageLink });
  };

  const attractivePlaces = [
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
      name: "Museum",
      id: "04",
      link: "../assets/places/meuseum.jpg",
    },
    // Add more images
  ];

  const Parks = [
    {
      image: require("../assets/places/jallopark.jpg"),
      name: "Jallo Park",
      id: "05",
      link: "../assets/places/jallopark.jpg",
    },
    {
      image: require("../assets//places/iqbalpark.jpg"),
      name: "Gulshan e Iqbal Park",
      id: "06",
      link: "../assets/places/iqbalpark.jpg",
    },
    {
      image: require("../assets//places/zoo.jpg"),
      name: "Lahore Zoo",
      id: "07",
      link: "../assets/places/zoo.jpg",
    },
    // Add more images
  ];

  const MallsImages = [
    {
      image: require("../assets/places/emporium.jpg"),
      name: "Emporium Mall",
      id: "08",
      link: "../assets/Multan.jpeg",
    },
    {
      image: require("../assets/places/packages.jpg"),
      name: "Packages Mall",
      id: "09",
      link: "../assets/Sawat.jpg",
    },
    // Add more images
  ];

  const Section = ({ title, images, navigate }) => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((imageItem, index) => (
          <ImageCard
            key={index}
            style={styles.card}
            image={imageItem.image}
            name={imageItem.name}
            onPress={() =>
              navigate(imageItem.id, imageItem.name, imageItem.link)
            }
          />
        ))}
      </ScrollView>
    </View>
  );

  const ImageCard = ({ image, name, onPress }) => (
    <TouchableOpacity style={styles.imageCardContainer} onPress={onPress}>
      <Card style={[{ backgroundColor: "#F0F0F5" }]}>
        <Card.Cover source={image} style={styles.imageCard} />
        <Card.Content>
          <Title style={styles.imageName}>{name}</Title>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Section
        title="Memorial Places"
        images={attractivePlaces}
        navigate={navigateToNextScreen}
      />

      <Section title="Parks" images={Parks} navigate={navigateToNextScreen} />

      <Section
        title="Malls"
        images={MallsImages}
        navigate={navigateToNextScreen}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F5",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#1F1F29",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageCardContainer: {
    marginRight: 10,
    backgroundColor: "#F0F0F5",
  },
  imageCard: {
    width: 200,
    height: 150,
    marginBottom: 10,
    backgroundColor: "#F0F0F5",
  },
  imageName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1F1F29",
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
    padding: 20,
  },
});

export default HomeScreen;
