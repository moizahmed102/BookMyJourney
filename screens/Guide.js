import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../config";
import {
  Button,
  Card,
  Divider,
  List,
  Avatar,
  Surface,
} from "react-native-paper"; // Import components from react-native-paper

const GuideSearch = () => {
  const navigation = useNavigation();
  const [searchOption, setSearchOption] = useState("tours");
  const [sortBy, setSortBy] = useState("default");
  const [guideData, setGuideData] = useState([]);

  const fetchGuides = async () => {
    try {
      let collectionRef;

      if (searchOption === "tours") {
        collectionRef = firebase.firestore().collection("guideinfo");
      } else {
        collectionRef = firebase.firestore().collection("guides");
      }

      let query = collectionRef;

      if (sortBy === "lowToHigh") {
        query = query.orderBy("price", "asc");
      } else if (sortBy === "highToLow") {
        query = query.orderBy("price", "desc");
      }

      const snapshot = await query.get();
      const fetchedGuideData = snapshot.docs.map((doc) => doc.data());
      setGuideData(fetchedGuideData);
    } catch (error) {
      console.log("Error fetching guide data:", error);
    }
  };

  const hireGuide = (
    guideId,
    price,
    services,
    benefits,
    guideRoute,
    days,
    vehicleType
  ) => {
    console.log(`Hiring guide: ${guideId}`);
    navigation.navigate("Guide Booking", {
      guideId,
      price,
      services,
      benefits,
      route: guideRoute,
      days,
      vehicleType,
    });
  };

  useEffect(() => {
    fetchGuides();
  }, [searchOption, sortBy]);

  const renderGuideItem = ({ item }) => {
    const guideRoute = searchOption === "intracity" ? "Intracity" : item.route;
    return (
      <Card style={styles.card}>
        <Card.Title
          title={`Guide: ${item.guideId}`}
          titleStyle={styles.listItemText}
        />

        <Card.Content style={styles.cardContent}>
          <List.Item
            title={`Price: ${item.price}`}
            left={() => <List.Icon icon="cash" color="#1F1F29" />}
            titleStyle={styles.listItemText}
          />
          <Divider />
          <List.Item
            title={`Route: ${guideRoute}`} // Use the modified guideRoute variable
            left={() => <List.Icon icon="map" color="#1F1F29" />}
            titleStyle={styles.listItemText}
          />
          <Divider />
          <List.Item
            title={`Days: ${item.days}`}
            left={() => <List.Icon icon="calendar" color="#1F1F29" />}
            titleStyle={styles.listItemText}
          />
          <Divider />
          <List.Item
            title={`Vehicle Type: ${item.vehicleType}`}
            left={() => <List.Icon icon="car" color="#1F1F29" />}
            titleStyle={styles.listItemText}
          />
          <Divider />
          <List.Item
            title={`City: ${item.city}`}
            left={() => <List.Icon icon="home" color="#1F1F29" />}
            titleStyle={styles.listItemText}
          />
          <Divider />
          <List.Item
            title={`Rating: ${item.rating}`}
            left={() => <List.Icon icon="star" color="#1F1F29" />}
            titleStyle={styles.listItemText}
          />
          {/* Hire Guide Button */}
          <Button
            mode="contained"
            textColor="#F0F0F5"
            onPress={() =>
              hireGuide(
                item.guideId,
                item.price,
                item.services,
                item.benefits,
                guideRoute,
                item.days,
                item.vehicleType
              )
            }
            style={styles.hireButton}
          >
            Hire Guide
          </Button>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/guides/01.jpg")}
          style={styles.imageBackground}
        />
        <Text style={styles.welcomeText}>
          With BookMyJourney you can hire Guides, To explore Adventures cities
          of Pakistan.
        </Text>
      </View>
      <View style={styles.containerNew}>
        <View style={styles.sortContainer}>
          <Picker
            selectedValue={searchOption}
            onValueChange={(itemValue) => setSearchOption(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Tours" value="tours" />
            <Picker.Item label="Intracity" value="intracity" />
          </Picker>
          <Picker
            selectedValue={sortBy}
            onValueChange={(itemValue) => setSortBy(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Default" value="default" />
            <Picker.Item label="Low to High Price" value="lowToHigh" />
            <Picker.Item label="High to Low Price" value="highToLow" />
          </Picker>
        </View>
        {guideData.length > 0 ? (
          <FlatList
            data={guideData}
            renderItem={renderGuideItem}
            keyExtractor={(item) => item.guideId}
          />
        ) : (
          <Text>No guides found.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerNew: {
    padding: 10,
    marginBottom: 240,
  },
  imageContainer: {
    width: "100%",
    height: 150,
  },
  welcomeText: {
    fontSize: 16,
    paddingHorizontal: 16,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingVertical: 10,
    color: "#F0F0F5",
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderColor: "#008080",
    borderWidth: 1,
    borderRadius: 100,
  },
  imageBackground: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  picker: {
    flex: 1,
    color: "#008080",
  },
  card: {
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#DAECEC",
  },
  cardContent: {
    color: "#F0F0F5",
  },
  listItemText: {
    color: "#1F1F29", // Add this line to set the text color for List.Item components
  },
  hireButton: {
    marginTop: 10,
    alignSelf: "auto", // Align the button to the right side of the card content
  },
});

export default GuideSearch;
