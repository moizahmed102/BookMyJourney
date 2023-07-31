import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, ScrollView } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { firebase } from "../config";
import MapView, { Marker } from "react-native-maps";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { SafeAreaView } from "react-native-safe-area-context"; // Import SafeAreaView

const PlaceDetailsScreen = ({ route }) => {
  const { id, name } = route.params;
  const [placeData, setPlaceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    fetchPlaceData();
  }, []);

  useEffect(() => {
    fetchImageURL();
  }, []);

  const fetchPlaceData = async () => {
    try {
      const placeSnapshot = await firebase
        .firestore()
        .collection("Places")
        .doc(id)
        .get();

      if (placeSnapshot.exists) {
        const place = placeSnapshot.data();
        setPlaceData(place);
      } else {
        console.log("Place does not exist.");
      }
    } catch (error) {
      console.log("Error fetching place data: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchImageURL = async () => {
    const storage = getStorage();
    const storageRef = ref(storage, `places/${id}.jpg`);
    getDownloadURL(storageRef)
      .then((url) => {
        setImageURL(url);
      })
      .catch((error) => {
        console.log("Error getting profile picture:", error);
      });
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading place data...</Text>
      </View>
    );
  }

  // Convert coordinates from string to number
  const latitude = parseFloat(placeData?.latitude);
  const longitude = parseFloat(placeData?.longitude);

  // Create the image source dynamically
  const imageSource = imageURL ? { uri: imageURL } : null;
  console.log(imageURL);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {imageSource && (
          <Image source={imageSource} style={styles.coverImage} />
        )}

        <View style={styles.contentContainer}>
          {placeData ? (
            <>
              <Card style={[styles.card, { backgroundColor: "#F0F0F5" }]}>
                <Card.Content>
                  <Title style={styles.placeName}>{name}</Title>
                  <Paragraph style={styles.placeDis}>
                    {placeData.description}
                  </Paragraph>
                  <Paragraph style={styles.placeDis}>
                    Rating: {placeData.rating}
                  </Paragraph>
                </Card.Content>
              </Card>

              <MapView
                style={styles.map}
                initialRegion={{
                  latitude: latitude,
                  longitude: longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: latitude,
                    longitude: longitude,
                  }}
                  title={name}
                />
              </MapView>
            </>
          ) : (
            <Text>Place data not found.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F0F5",
  },
  coverImage: {
    width: "100%",
    height: 200,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
  card: {
    marginBottom: 20,
    color: "#1F1F29",
  },
  placeName: {
    fontSize: 24,
    color: "#1F1F29",
    fontWeight: "bold",
    marginBottom: 10,
  },
  placeDis: {
    fontSize: 14,
    color: "#1F1F29",
  },
  map: {
    flex: 1,
    height: 200,
    marginTop: 10,
  },
});

export default PlaceDetailsScreen;
