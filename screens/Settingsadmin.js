import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { firebase } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

const AdminSettings = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [photoURL, setPhotoURL] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCurrentUserData = async () => {
    try {
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        const userRef = firebase.firestore().collection('users').doc(currentUser.uid);
        const doc = await userRef.get();
        if (doc.exists) {
          const data = doc.data();
          setUser(data);
          setEmail(data.email || '');
          setFullName(data.fullName || '');

          const storage = getStorage();
          const storageRef = ref(storage, `images/${currentUser.uid}`);
          getDownloadURL(storageRef)
            .then((url) => {
              setPhotoURL(url);
            })
            .catch((error) => {
              console.log('Error getting profile picture:', error);
            });
        }
      }
      setLoading(false);
    } catch (error) {
      console.log('Error getting user data from Firestore:', error);
      setLoading(false);
    }
  };


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCurrentUserData();
    });

    return unsubscribe;
  }, [navigation]);






  const handleHelpAndSupport = () => {
    navigation.navigate('HelpAndSupportScreen');
  };

  const handleAboutUs = () => {
    navigation.navigate('AboutUsScreen');
  };

  const handlePrivacyPolicy = () => {
    navigation.navigate('PrivacyPolicyScreen');
  };

  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();

      // Reset stayLoggedIn preference in AsyncStorage
      await AsyncStorage.setItem('stayLoggedIn', 'false');

      // Clear AsyncStorage cache
      await AsyncStorage.clear();

      // Navigate to the login screen and reset the navigation stack
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.log('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileContainer1}>
        {photoURL ? (
          <Image source={{ uri: photoURL }} style={styles.profileImage} />
        ) : (
          <View style={styles.profilePlaceholder} />
        )}
      </View>
      <View style={styles.profileContainer}>
        <View style={styles.profileBox}>
          <Text style={styles.profileHeading}>Email:</Text>
          <Text style={styles.profileText}>{email.charAt(0).toUpperCase() + email.slice(1)}</Text>
        </View>
        <View style={styles.profileBox}>
          <Text style={styles.profileHeading}>Name:</Text>
          <Text style={styles.profileText}>{fullName}</Text>
        </View>
      </View>
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>General</Text>
        <TouchableOpacity style={styles.optionContainer} onPress={handleHelpAndSupport}>
          <Text style={styles.optionText}>Help and Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer} onPress={handleAboutUs}>
          <Text style={styles.optionText}>About Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer} onPress={handlePrivacyPolicy}>
          <Text style={styles.optionText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.sectionButton} onPress={() => navigation.navigate('EditScreen')}>
        <Text style={styles.sectionButtonText}>Edit Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  profileContainer1: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    marginVertical: 20,
    top: -20,
    alignSelf: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profilePlaceholder: {
    backgroundColor: '#CCCCCC',
    flex: 1,
  },
  profileContainer: {
    marginBottom: 20,
    top: -20,
  },
  profileBox: {
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  profileText: {
    fontSize: 15,
    color: '#333',
  },
  sectionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingVertical: 12,
    marginBottom: 10,
    top: -40,
  },
  sectionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sectionContainer: {
    marginBottom: 20,
    top: -35,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#E5E5E5',
  },
  optionText: {
    fontSize: 16,
    color: '#333333',
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    paddingVertical: 12,
    top: -40,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AdminSettings;
