import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { TabView, SceneMap } from "react-native-tab-view";
import Bus from "./bus";
import HotelMap from "./Hotel";
import GuideSearch from "./Guide";
import ExploreScreen from "./Explore";
import AttractivePlacesScreen from "./places";

const PlacesScreen = () => {
  return <AttractivePlacesScreen />;
};

const HomeScreen = () => {
  const [activeTab, setActiveTab] = useState(0); // Set default tab to "Explore" (index 0)
  const theme = useTheme();
  const navigation = useNavigation();

  const handleTabChange = (index) => {
    setActiveTab(index);
  };

  const getIconName = (tabName) => {
    switch (tabName) {
      case "Explore":
        return "search";
      case "Hotel":
        return "bed";
      case "Bus":
        return "bus";
      case "Guide":
        return "people";
      case "Places":
        return "location";
      default:
        return "alert-circle";
    }
  };
  theme.colors.primary = "#008080";

  const renderIcon = (tabName, iconName, index) => {
    const isActive = activeTab === index;
    const iconColor = isActive ? "#edce69" : "#37474f"; // Set active tab color to yellow, inactive color to #008080

    return (
      <TouchableOpacity
        key={index}
        style={styles.button}
        onPress={() => handleTabChange(index)} // Update the onPress to set the active index
      >
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={30} color={iconColor} />
        </View>
        <Text
          style={[
            styles.tabLabel,
            { color: iconColor }, // Set the text color to the same color as the icon
          ]}
        >
          {tabName}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderScene = SceneMap({
    Explore: ExploreScreen,
    Hotel: HotelMap,
    Bus: Bus,
    Guide: GuideSearch,
    Places: PlacesScreen,
  });

  const renderTabBar = () => (
    <Appbar.Header style={styles.tabBar}>
      <View style={styles.tabIconsContainer}>
        {["Explore", "Hotel", "Bus", "Guide", "Places"].map((tabName, index) =>
          renderIcon(tabName, getIconName(tabName), index)
        )}
      </View>
    </Appbar.Header>
  );

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{
          index: activeTab,
          routes: [
            { key: "Explore", title: "Explore" },
            { key: "Hotel", title: "Hotel" },
            { key: "Bus", title: "Bus" },
            { key: "Guide", title: "Guide" },
            { key: "Places", title: "Places" },
          ],
        }}
        renderScene={renderScene}
        renderTabBar={renderTabBar}
        swipeEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  tabBar: {
    backgroundColor: "#008080",
    height: 100,
    elevation: 0,
  },
  tabIconsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    top: 10,
    flex: 1,
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EFEFEF",
    marginBottom: 1,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default HomeScreen;
