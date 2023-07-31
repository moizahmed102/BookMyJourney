import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { firebase } from '../config';
import { Picker } from '@react-native-picker/picker';

const BusDataEntryScreen = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [seatsAvailable, setSeatsAvailable] = useState('1');
  const [busService, setBusService] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [price, setPrice] = useState('');

  const [busServiceOptions] = useState(['Daewoo Express', 'Skyways', 'Elite Travel']);

  const handleSaveBusData = async () => {
    if (
      from === '' ||
      to === '' ||
      seatsAvailable === '' ||
      busService === '' ||
      departureTime === '' ||
      arrivalTime === '' ||
      price === ''
    ) {
      Alert.alert('Fill all the fields.');
      return;
    }

    try {
      const db = firebase.firestore();
      const collectionRef = db.collection('busservices');
      await collectionRef.add({
        from,
        to,
        seatsAvailable: parseInt(seatsAvailable),
        busService,
        departureTime,
        arrivalTime,
        price: parseFloat(price),
      });

      // Clear input fields after submission
      setFrom('');
      setTo('');
      setSeatsAvailable('1');
      setBusService('');
      setDepartureTime('');
      setArrivalTime('');
      setPrice('');

      Alert.alert('Bus service information is successfully saved.');
    } catch (error) {
      console.error('Error creating bus service:', error);
      Alert.alert('An error occurred while creating the bus service.');
    }
  };

  return (
    <View style={styles.container}>
      <Picker
        style={styles.picker}
        selectedValue={from}
        onValueChange={(value) => setFrom(value)}
      >
        <Picker.Item label="Select Departure City" value="" />
        <Picker.Item label="Lahore" value="Lahore" />
        <Picker.Item label="Islamabad" value="Islamabad" />
        <Picker.Item label="Rawalpindi" value="Rawalpindi" />
        <Picker.Item label="Murree" value="Murree" />
      </Picker>
      <Picker
        style={styles.picker}
        selectedValue={to}
        onValueChange={(value) => setTo(value)}
        enabled={from !== ''}
      >
        <Picker.Item label="Select Arrival City" value="" />
        {from !== 'Lahore' && <Picker.Item label="Lahore" value="Lahore" />}
        {from !== 'Islamabad' && <Picker.Item label="Islamabad" value="Islamabad" />}
        {from !== 'Rawalpindi' && <Picker.Item label="Rawalpindi" value="Rawalpindi" />}
        {from !== 'Murree' && <Picker.Item label="Murree" value="Murree" />}
      </Picker>

      <Picker
        style={styles.picker}
        selectedValue={seatsAvailable}
        onValueChange={(value) => setSeatsAvailable(value)}
      >
        {[...Array(10)].map((_, index) => (
          <Picker.Item key={index} label={(index + 1).toString()} value={(index + 1).toString()} />
        ))}
      </Picker>

      <Picker
        style={styles.picker}
        selectedValue={busService}
        onValueChange={(value) => setBusService(value)}
      >
        <Picker.Item label="Select Bus Service" value="" />
        {busServiceOptions.map((option) => (
          <Picker.Item key={option} label={option} value={option} />
        ))}
      </Picker>

      <TextInput
        style={styles.input}
        placeholder="Departure Time"
        value={departureTime}
        onChangeText={setDepartureTime}
        placeholderTextColor="#808080"
      />
      <TextInput
        style={styles.input}
        placeholder="Arrival Time"
        value={arrivalTime}
        onChangeText={setArrivalTime}
        placeholderTextColor="#808080"
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        placeholderTextColor="#808080"
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveBusData}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#FFF',
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
  picker: {
    width: '100%',
    height: 48,
    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    marginBottom: 16,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#6200EE',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BusDataEntryScreen;
