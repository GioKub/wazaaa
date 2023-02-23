import React, { useContext } from "react";
import { StyleSheet, View, FlatList } from "react-native";

import MoshListItem from "../../../components/atoms/MoshListItem";
import MoshListItemSeparator from "../../../components/atoms/MoshListItemSeperator";
// import { ListItem, ListItemSeparator } from "../components/lists";
import Icon from "../../../components/atoms/Icon.js";
// import Screen from "../components/Screen";
// import routes from "../navigation/routes";
import { AuthContext } from "../../../context";
import { Divider } from "react-native-paper";
import * as fs from "expo-file-system";

const menuItems = [
  {
    title: "Payments",
    icon: {
      name: "currency-usd",
      backgroundColor: "#21B6A8",
    },
    targetScreen: "PaymentsScreen",
  },

  {
    title: "Change Password",
    icon: {
      name: "shield-key",
      backgroundColor: "#fc5c65",
    },
    targetScreen: "ChangePasswordScreen",
  },
  {
    title: "Update Profile",
    icon: {
      name: "account",
      backgroundColor: "#808080",
    },
    targetScreen: "UpdateCustomerScreen",
  },
  {
    title: "Update Address",
    icon: {
      name: "map-marker",
      backgroundColor: "#6f43a8",
    },
    targetScreen: "UpdateCustAddr",
  },
];

function SettingsScreen({ navigation }) {
  const { auth, setAuth } = useContext(AuthContext);

  // console.log(auth);
  const logout = () => {
    const sessionPath = fs.cacheDirectory + '/creds.json';
    fs.deleteAsync(sessionPath);
    setAuth({
      is_logged_in: false,
      accessToken: null,
      agent: { privileges: [] },
      isLoading: false,
    });
  };

  // console.log(auth.username);

  return (
    // screen was used instead of View here
    <View style={styles.screen}>
      <View style={styles.container}>
        <MoshListItem
          title={auth.agent.email}
          // subTitle={auth.agent.email}
          image={require("../../../../assets/mosh.png")}
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          // ListItemSeperator componenet was used here
          //i repleace with what it was returning instead
          ItemSeparatorComponent={MoshListItemSeparator}
          renderItem={({ item }) => (
            <MoshListItem
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress={() => {
                navigation.navigate(item.targetScreen);
              }}
            />
          )}
        />
      </View>
      <MoshListItem
        title="Log Out"
        IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
        onPress={logout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: "#f8f4f4",
  },
  container: {
    marginVertical: 20,
  },
  separator: {
    width: "100%",
    height: 1,
    backgroundColor: "#f8f4f4",
  },
});

export default SettingsScreen;
