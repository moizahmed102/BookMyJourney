import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { firebase } from "../config";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const EditScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [photoURL, setPhotoURL] = useState(null);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const getCurrentUserData = async () => {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        const userRef = firebase
          .firestore()
          .collection("users")
          .doc(currentUser.uid);
        try {
          const doc = await userRef.get();
          if (doc.exists) {
            const data = doc.data();
            setEmail(data.email || "");
            setFullName(data.fullName || "");
            setPhotoURL(data.photoURL || null);
          }
        } catch (error) {
          console.log("Error getting user data from Firestore:", error);
        }
      }
    };

    getCurrentUserData();
  }, []);

  const handleChoosePhoto = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access the camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (pickerResult.canceled === false) {
      const { uri } = pickerResult.assets[0];
      uploadImage(uri, user.uid);
    }
  };

  const uploadImage = async (uri, imageName) => {
    const storage = getStorage();
    const storageRef = ref(storage, `images/${imageName}`);
    const response = await fetch(uri);
    const blob = await response.blob();
    uploadBytes(storageRef, blob).then(() => {
      getDownloadURL(storageRef).then((url) => {
        setPhotoURL(url);
      });
    });
  };

  const handleSave = async () => {
    const currentUser = firebase.auth().currentUser;
    const userRef = firebase
      .firestore()
      .collection("users")
      .doc(currentUser.uid);

    if (photoURL) {
      const imageName = currentUser.uid; // Use the current user's UID as the image name

      try {
        const response = await fetch(photoURL);
        const blob = await response.blob();

        const storageRef = ref(firebase.storage(), `images/${imageName}`); // Reference to the image storage location

        await uploadBytes(storageRef, blob); // Upload the image blob to the storage location

        const downloadURL = await getDownloadURL(storageRef); // Get the download URL of the uploaded image

        updateUserData(userRef, downloadURL);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {
      updateUserData(userRef, null);
    }
  };

  const updateUserData = (userRef, downloadURL) => {
    const updateData = {
      fullName: fullName,
      photoURL: downloadURL,
    };

    userRef
      .update(updateData)
      .then(() => {
        Alert.alert("Success", "User data updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {photoURL ? (
          <Image style={styles.profileImage} source={{ uri: photoURL }} />
        ) : (
          <View style={styles.profilePlaceholder}>
            <TouchableOpacity onPress={handleChoosePhoto}>
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name:</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email:</Text>
        <View style={styles.emailWrapper}>
          <Text style={styles.emailText}>
            {email.charAt(0).toUpperCase() + email.slice(1)}
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
    fontSize: 16,
  },
  emailWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 10,
  },
  emailText: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#008080",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  profileContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: "hidden",
    marginVertical: 20,
    top: -30,
    alignSelf: "center",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  profilePlaceholder: {
    backgroundColor: "#CCCCCC",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addPhotoText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default EditScreen;
