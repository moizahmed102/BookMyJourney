import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MaterialIcons } from "@expo/vector-icons";
import { firebase } from "../config";
import { StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Checkbox } from "react-native-paper";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setEmail("");
      setPassword("");
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // Load stay logged in preference from AsyncStorage
    const loadStayLoggedInPreference = async () => {
      try {
        const value = await AsyncStorage.getItem("stayLoggedIn");
        if (value !== null && value === "true") {
          setStayLoggedIn(true);
          autoLogin();
        }
      } catch (error) {
        console.log("Error loading stay logged in preference:", error);
      }
    };

    loadStayLoggedInPreference();
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const toggleStayLoggedIn = async () => {
    if (stayLoggedIn) {
      setStayLoggedIn(false);

      // Remove stay logged in preference from AsyncStorage
      try {
        await AsyncStorage.setItem("stayLoggedIn", "false");
      } catch (error) {
        console.log("Error storing stay logged in preference:", error);
      }
    } else {
      setStayLoggedIn(true);

      // Store stay logged in preference in AsyncStorage
      try {
        await AsyncStorage.setItem("stayLoggedIn", "true");
      } catch (error) {
        console.log("Error storing stay logged in preference:", error);
      }

      if (!email || !password) {
        return;
      }

      // If stay logged in is toggled on and there are email and password stored, attempt automatic login
      autoLogin();
    }
  };

  const navigateToMainScreen = (user) => {
    if (user.access_right === "admin") {
      navigation.replace("MenuScreen"); // Navigate to the admin panel if the user is an admin
    } else {
      navigation.replace("Main", { user }); // Navigate to the main screen for regular users
    }
  };

  const autoLogin = async () => {
    setLoading(true);

    try {
      const storedEmail = await AsyncStorage.getItem("email");
      const storedPassword = await AsyncStorage.getItem("password");

      if (storedEmail && storedPassword) {
        await firebase
          .auth()
          .signInWithEmailAndPassword(storedEmail, storedPassword);
        const uid = firebase.auth().currentUser.uid;
        const usersRef = firebase.firestore().collection("users");
        usersRef
          .doc(uid)
          .get()
          .then((firestoreDocument) => {
            if (!firestoreDocument.exists) {
              alert("User does not exist anymore.");
              return;
            }
            const user = firestoreDocument.data();
            navigateToMainScreen(user);
          })
          .catch((error) => {
            alert(error);
          });
      }
    } catch (error) {
      console.log("Error auto logging in:", error);
    } finally {
      setLoading(false);
    }
  };

  const onLoginPress = () => {
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(async (response) => {
        if (stayLoggedIn) {
          // Store login credentials in AsyncStorage
          try {
            await AsyncStorage.multiSet([
              ["email", email],
              ["password", password],
            ]);
            await AsyncStorage.setItem("stayLoggedIn", "true");
          } catch (error) {
            console.log("Error storing login credentials:", error);
          }
        }

        const uid = response.user.uid;
        const usersRef = firebase.firestore().collection("users");
        usersRef
          .doc(uid)
          .get()
          .then((firestoreDocument) => {
            if (!firestoreDocument.exists) {
              alert("User does not exist anymore.");
              setLoading(false);
              return;
            }
            const user = firestoreDocument.data();
            if (user.access_right === "admin") {
              navigation.replace("MenuScreen"); // Navigate to the admin screen if the user is an admin
            } else {
              navigation.replace("Main", { user });
            }
          })
          .catch((error) => {
            alert(error);
            setLoading(false);
          });
      })
      .catch((error) => {
        alert(error);
        setLoading(false);
      });
  };

  const validateEmail = (email) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
  };

  const onFooterLinkPress = () => {
    navigation.navigate("Register");
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={{ flex: 1, width: "100%" }}
        keyboardShouldPersistTaps="always"
      >
        <Image style={styles.logo} source={require("../assets/icon.png")} />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#aaaaaa"
          onChangeText={(text) => setEmail(text)}
          value={email}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
        />
        <View>
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaaaaa"
            secureTextEntry={!isPasswordVisible}
            placeholder="Password"
            onChangeText={(text) => setPassword(text)}
            value={password}
            underlineColorAndroid="transparent"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={styles.passwordVisibilityIcon}
            onPress={togglePasswordVisibility}
          >
            <MaterialIcons
              name={isPasswordVisible ? "visibility-off" : "visibility"}
              size={24}
              color="#aaaaaa"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.stayLoggedInContainer}>
          <Text style={styles.stayLoggedInText}>Stay Logged In</Text>
          <Checkbox.Android
            status={stayLoggedIn ? "checked" : "unchecked"}
            onPress={toggleStayLoggedIn}
            color="#edce69"
          />
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={onLoginPress}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" /> // Show the loading spinner if isLoading is true
          ) : (
            <Text style={styles.buttonTitle}>Log in</Text>
          )}
        </TouchableOpacity>
        <View style={styles.footerView}>
          <Text style={styles.footerText}>
            Don't have an account?{" "}
            <Text onPress={onFooterLinkPress} style={styles.footerLink}>
              Sign up
            </Text>
          </Text>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#008080",
  },
  title: {},
  logo: {
    flex: 1,
    height: 240,
    width: 225,
    alignSelf: "center",
    margin: 55,
  },
  input: {
    height: 48,
    borderRadius: 16,
    borderWidth: 0,
    overflow: "hidden",
    backgroundColor: "white",
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    paddingLeft: 16,
  },
  button: {
    backgroundColor: "#edce69",
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    height: 48,
    borderRadius: 5,
    alignItems: "center",
    shadowColor: "#000",
    justifyContent: "center",
  },
  buttonTitle: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  footerView: {
    flex: 1,
    alignItems: "center",
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    color: "#fff",
  },
  footerLink: {
    color: "#edce69",
    fontWeight: "bold",
    fontSize: 16,
  },
  passwordVisibilityIcon: {
    position: "absolute",
    top: 20,
    right: 37,
  },
  stayLoggedInContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
  },
  stayLoggedInText: {
    fontSize: 16,
    color: "#fff",
  },
});
