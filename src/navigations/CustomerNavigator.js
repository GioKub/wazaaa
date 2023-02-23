import React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import HomeScreen from "../scenes/afterLogin/client/HomeScreen.js";
import SettingsScreen from "../scenes/afterLogin/client/SettingsScreen.js";
import NewListingButton from "./newListingButton.js";

const Tab = createBottomTabNavigator();

const CustomerNavigator = ({ navigation }) => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="ActiveBooking"
        component={HomeScreen}
        options={({ navigation }) => ({
          tabBarButton: () => (
            <NewListingButton
              onPress={() => navigation.navigate("ClientBookings")}
            />
          ),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="qr-code" color={"black"} size={size} />
          ),
        })}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default CustomerNavigator;
