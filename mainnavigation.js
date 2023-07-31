import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "./screens/HomeScreen";
import MyBooking from "./screens/MyBooking";
import Setting from "./screens/Setting";
import Bus from "./screens/bus";
import HotelMap from "./screens/Hotel";
import GuideSearch from "./screens/Guide";
import Login from "./screens/Login";
import Register from "./screens/Register";
import EditScreen from "./screens/EditScreen";
import AttractivePlacesScreen from "./screens/places";
import GuideCredentialsScreen from "./screens/GuideCredentialsScreen";
import BusDataEntryScreen from "./screens/busdataentryscreen";
import HelpAndSupportScreen from "./screens/Support";
import AboutUsScreen from "./screens/About";
import PrivacyPolicyScreen from "./screens/Privacy";
import HotelBookingScreen from "./screens/HotelBooking";
import NavigationMenuScreen from "./screens/Adminpanel";
import HotelLocationScreen from "./screens/HotelLocation";
import PlacesLocationScreen from "./screens/Placeslocation";
import AdminSettings from "./screens/Settingsadmin";
import CreateGuideScreen from "./screens/createguide";
import ExploreScreen from "./screens/Explore";
import GuideBooking from "./screens/guidebooking";
import PlaceDetailsScreen from "./screens/PlacesDetails";
import BusBookingScreen from "./screens/busbooking";
import MyBookingsScreen from "./screens/MyBookingadmin";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const Tabuser = createBottomTabNavigator();

const MainNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MenuScreen"
          component={TabNavigatorp}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Bus" component={Bus} />
        <Stack.Screen name="HotelMap" component={HotelMap} />
        <Stack.Screen name="Guides" component={GuideSearch} />
        <Stack.Screen name="Edit Profile" component={EditScreen} />
        <Stack.Screen
          name="AttractivePlacesScreen"
          component={AttractivePlacesScreen}
        />
        <Stack.Screen
          name="GuideCredentialsScreen"
          component={GuideCredentialsScreen}
        />
        <Stack.Screen
          name="BusDataEntryScreen"
          component={BusDataEntryScreen}
        />
        <Stack.Screen name="Bus Booking" component={BusBookingScreen} />
        <Stack.Screen
          name="HelpAndSupportScreen"
          component={HelpAndSupportScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AboutUsScreen"
          component={AboutUsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PrivacyPolicyScreen"
          component={PrivacyPolicyScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Hotel Booking" component={HotelBookingScreen} />
        <Stack.Screen
          name="NavigationMenuScreen"
          component={NavigationMenuScreen}
        />
        <Stack.Screen
          name="HotelLocationScreen"
          component={HotelLocationScreen}
        />
        <Stack.Screen
          name="PlacesLocationScreen"
          component={PlacesLocationScreen}
        />
        <Stack.Screen name="CreateGuideScreen" component={CreateGuideScreen} />
        <Stack.Screen name="ExploreScreen" component={ExploreScreen} />
        <Stack.Screen name="Guide Booking" component={GuideBooking} />
        <Stack.Screen name="Place Details" component={PlaceDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const TabNavigatorp = () => {
  return (
    <Tabuser.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "Bookings") {
            iconName = "calendar-outline";
          } else if (route.name === "Settings") {
            iconName = "settings-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#008080",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          borderTopColor: "gray",
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: "white",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={NavigationMenuScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="Bookings" component={MyBookingsScreen} />
      <Tab.Screen name="Settings" component={AdminSettings} />
    </Tabuser.Navigator>
  );
};

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = "home-outline";
          } else if (route.name === "My Booking") {
            iconName = "calendar-outline";
          } else if (route.name === "Profile") {
            iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#008080",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          borderTopColor: "gray",
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: "white",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="My Booking"
        component={MyBooking}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={Setting}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};
export default MainNavigator;
