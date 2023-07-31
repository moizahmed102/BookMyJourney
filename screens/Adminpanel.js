import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';

const NavigationMenuScreen = ({ navigation }) => {
  const buttonAnimations = useRef([
    { scale: new Animated.Value(1), opacity: new Animated.Value(1) },
    { scale: new Animated.Value(1), opacity: new Animated.Value(1) },
    { scale: new Animated.Value(1), opacity: new Animated.Value(1) },
    { scale: new Animated.Value(1), opacity: new Animated.Value(1) },
    { scale: new Animated.Value(1), opacity: new Animated.Value(1) },
  ]).current;

  const handleButtonPress = (screenName, index) => {
    const animation = buttonAnimations[index];

    Animated.sequence([
      Animated.timing(animation.scale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animation.opacity, {
        toValue: 0.5,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animation.scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animation.opacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      navigation.navigate(screenName);
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#f86828' }]}
          onPress={() => handleButtonPress('BusDataEntryScreen', 0)}
        >
          <Animated.View
            style={[
              styles.buttonInner,
              {
                transform: [{ scale: buttonAnimations[0].scale }],
                opacity: buttonAnimations[0].opacity,
              },
            ]}
          >
            <Text style={styles.buttonText}>Add Buses</Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#92c400' }]}
          onPress={() => handleButtonPress('HotelLocationScreen', 1)}
        >
          <Animated.View
            style={[
              styles.buttonInner,
              {
                transform: [{ scale: buttonAnimations[1].scale }],
                opacity: buttonAnimations[1].opacity,
              },
            ]}
          >
            <Text style={styles.buttonText}>Add Hotel</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#00b5f1' }]}
          onPress={() => handleButtonPress('PlacesLocationScreen', 2)}
        >
          <Animated.View
            style={[
              styles.buttonInner,
              {
                transform: [{ scale: buttonAnimations[2].scale }],
                opacity: buttonAnimations[2].opacity,
              },
            ]}
          >
            <Text style={styles.buttonText}>Attractive Places</Text>
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#ffc400' }]}
          onPress={() => handleButtonPress('CreateGuideScreen', 3)}
        >
          <Animated.View
            style={[
              styles.buttonInner,
              {
                transform: [{ scale: buttonAnimations[3].scale }],
                opacity: buttonAnimations[3].opacity,
              },
            ]}
          >
            <Text style={styles.buttonText}>Screen 4</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#8d4de8' }]}
          onPress={() => handleButtonPress('GuideCredentialsScreen', 4)}
        >
          <Animated.View
            style={[
              styles.buttonInner,
              {
                transform: [{ scale: buttonAnimations[4].scale }],
                opacity: buttonAnimations[4].opacity,
              },
            ]}
          >
            <Text style={styles.buttonText}>New Button</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    top: -150,
  },
  button: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 10,
  },
  buttonInner: {
    width: '80%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NavigationMenuScreen;
