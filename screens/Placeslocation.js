import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { firebase } from '../config';

const PlacesLocationScreen = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [rating, setRating] = useState('');

  const handleCreateHotelLocation = async () => {
  if (latitude === '' || longitude === '' || name === '' || description === '') {
  Alert.alert('Fill all the fields.');
  return;
  }

    try {
        const db = firebase.firestore();
      
        // Get the current count of documents in the "Hotel-Location" collection
        const collectionRef = db.collection('Places');
        const querySnapshot = await collectionRef.get();
        const count = querySnapshot.size;
      
        // Create a new document with the sequential ID
        const sequentialId = (count + 1).toString().padStart(2, '0'); // Add leading zero if necessary
        await collectionRef.doc(sequentialId).set({
          id: sequentialId,
          latitude,
          longitude,
          name,
          rating,
          description,
        });
      
        // Clear input fields after submission
        setLatitude('');
        setLongitude('');
        setName('');
        setDescription('');
        setRating('');
      
        Alert.alert('Attractive place created successfully.');
      } catch (error) {
        console.error('Error creating hotel location:', error);
        Alert.alert('An error occurred while creating the hotel location.');
      }      
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Latitude"
          value={latitude}
          onChangeText={setLatitude}
          placeholderTextColor="#808080"
        />
        <TextInput
          style={styles.input}
          placeholder="Longitude"
          value={longitude}
          onChangeText={setLongitude}
          placeholderTextColor="#808080"
        />
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#808080"
        />
        <TextInput
          style={styles.input}
          placeholder="Rating"
          value={rating}
          onChangeText={setRating}
          placeholderTextColor="#808080"
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          placeholderTextColor="#808080"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleCreateHotelLocation}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFF',
  },
  formContainer: {
    width: '100%',
    marginBottom: 24,
    marginTop: 30,
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  button: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    backgroundColor: '#FF5A5F',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default PlacesLocationScreen;
