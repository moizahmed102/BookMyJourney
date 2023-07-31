import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Avatar,
  Divider,
  ActivityIndicator,
  Card,
  Button,
} from "react-native-paper";
import { firebase } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Ionicons } from "@expo/vector-icons";

const Settings = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [isRegisteredGuide, setIsRegisteredGuide] = useState(false);
  const [photoURL, setPhotoURL] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCurrentUserData = async () => {
    try {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        const userRef = firebase
          .firestore()
          .collection("users")
          .doc(currentUser.uid);
        const doc = await userRef.get();
        if (doc.exists) {
          const data = doc.data();
          setUser(data);
          setEmail(data.email || "");
          setFullName(data.fullName || "");

          const storage = getStorage();
          const storageRef = ref(storage, `images/${currentUser.uid}`);
          getDownloadURL(storageRef)
            .then((url) => {
              setPhotoURL(url);
            })
            .catch((error) => {
              console.log("Error getting profile picture:", error);
            });
        }
      }
      setLoading(false);
    } catch (error) {
      console.log("Error getting user data from Firestore:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getCurrentUserData();
    });

    return unsubscribe;
  }, [navigation]);

  const handleHelpAndSupport = () => {
    navigation.navigate("HelpAndSupportScreen");
  };

  const handleAboutUs = () => {
    navigation.navigate("AboutUsScreen");
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate("PrivacyPolicyScreen");
  };

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();

      // Reset stayLoggedIn preference in AsyncStorage
      await AsyncStorage.setItem("stayLoggedIn", "false");

      // Clear AsyncStorage cache
      await AsyncStorage.clear();

      // Navigate to the login screen and reset the navigation stack
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (error) {
      console.log("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#008080" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.sectionContainer}>
        <View style={styles.sectionTitleContainer}>
          <Ionicons
            name="person-outline"
            size={24}
            color="#008080"
            style={styles.sectionIcon}
          />
          <Text style={styles.sectionTitle}>My Profile</Text>
        </View>
        <Card style={styles.profileCard}>
          <View style={styles.profileContainer}>
            <View style={styles.avatarContainer}>
              {photoURL ? (
                <Avatar.Image
                  source={{ uri: photoURL }}
                  size={100}
                  style={styles.avatar}
                />
              ) : (
                <Avatar.Icon
                  icon="account-circle"
                  size={100}
                  style={styles.avatar}
                />
              )}
            </View>
            <View style={styles.profileDetails}>
              <Text style={styles.profileName}>{fullName}</Text>
              <Text style={styles.profileEmail}>{email}</Text>
            </View>
          </View>
        </Card>
      </View>

      <TouchableOpacity
        style={styles.editProfileButton}
        onPress={() => navigation.navigate("Edit Profile")}
      >
        <Ionicons
          name="create-outline"
          size={24}
          color="#008080"
          style={styles.editProfileIcon}
        />
        <Text style={styles.editProfileText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionContainer}
        onPress={handleHelpAndSupport}
      >
        <Ionicons
          name="help-circle-outline"
          size={24}
          color="#008080"
          style={styles.optionIcon}
        />
        <Text style={styles.optionText}>Help and Support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.optionContainer} onPress={handleAboutUs}>
        <Ionicons
          name="information-circle-outline"
          size={24}
          color="#008080"
          style={styles.optionIcon}
        />
        <Text style={styles.optionText}>About Us</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.optionContainer}
        onPress={handlePrivacyPolicy}
      >
        <Ionicons
          name="shield-checkmark-outline"
          size={24}
          color="#008080"
          style={styles.optionIcon}
        />
        <Text style={styles.optionText}>Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons
          name="log-out-outline"
          size={24}
          color="#FF3B30"
          style={styles.logoutIcon}
        />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F0F0F5",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  avatarContainer: {
    borderRadius: 50,
    overflow: "hidden",
    marginRight: 20,
  },
  profileDetails: {
    flex: 1,
  },
  avatar: {
    width: 100,
    height: 100,
  },
  profileCard: {
    marginBottom: 20,
    backgroundColor: "#008080",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  profileEmail: {
    fontSize: 16,
    color: "white",
    textAlign: "center",
    marginBottom: 10,
  },
  editProfileButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingLeft: 10,
  },
  editProfileIcon: {
    marginRight: 10,
  },
  editProfileText: {
    fontSize: 16,
    color: "#008080",
  },
  sectionCard: {
    marginBottom: 30,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingLeft: 10,
  },
  optionIcon: {
    marginRight: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#008080",
  },
  sectionContainer: {
    paddingVertical: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionIcon: {
    marginRight: 10,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    color: "#008080",
    fontWeight: "bold",
    marginTop: 30,
  },
  optionText: {
    fontSize: 16,
    color: "#008080",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingLeft: 10,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    color: "#FF3B30",
  },
});

export default Settings;
