import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
// components
import Button from "../../../../components/atoms/Button.js";
import ParcelList from "../../../../components/molecules/ParcelList.js";
import getGargosRequest from "../../../../requests/getGargosRequest.js";
import logoutRequest from "../../../../requests/logout.js";
import useRequest from "../../../../hooks/useRequest.js";
import { AuthContext } from "../../../../context/index.js";
import SyncButton from "./SyncButton.js";
import Sign from "../signature/Signature.js";
import * as fs from "expo-file-system";

const Home = ({ navigation, route }) => {
  
  const { auth, setAuth } = useContext(AuthContext);
  const canPickup = auth.agent.privileges.includes("PICKUP_CARGO");
  const canProccess = auth.agent.privileges.includes("HANDLE_CARGO");
  const [parcels, setParcels] = useState([]);
  const [request, requesting] = useRequest(getGargosRequest);
  const [_logout, logging_out] = useRequest(logoutRequest);
  const [startPosition, setStartPosition] = useState(0);
  const [fromPickup, setFromPickup] = useState(false)

  // this gets rendered when agent logs in and screen is shown,
  // when the homScreen is focused calls the 'refresh' function
  useEffect(() => navigation.addListener("focus", refresh), [navigation]);


  const goto = (route, params) => {
    navigation.navigate(route, params);
  };
  const logout = () => {
    //this needs to be fixed, it should send token
    _logout()
      .then(() => {
        const sessionPath = fs.cacheDirectory + '/creds.json';
        fs.deleteAsync(sessionPath);
        setAuth({
          isLoggedIn: false,
          accessToken: null,
          agent: { privileges: [] },
        });
      })
      .catch((e) => {
        console.log(e, "<-HomeScreen.js");
      });
  };
  const refresh = () => {
    // POST /cargo
    request({
      paging_specification: {
        // skips first X parcels
        // if there would be 5 in the page_size and 3 in page_offset
        // instead of showing first 5 parcels from 1 to 5 it would show
        // parcels from 3 to 7
        page_offset: startPosition * 30,
        // gets X amount of parcels
        // if there would be 5 it would show 5 parcels
        page_size: 30,
      },
    })
      .then((r) => {
        if(auth?.fromLogin !== true){
          const sessionPath = fs.cacheDirectory + '/parcels.json';
          fs.deleteAsync(sessionPath).then((suc) => {console.log(suc)}).catch((err)=>{console.log(err)});
          
        }
        console.log(auth.fromLogin, "<--wtf does it equal?")
        console.log(auth?.fromLogin !== true, "<=------HOOOOOOOOOME SCREEEn")
        // : Array[{}, {}, {}]
        setParcels(r.data.cargos);
      })
      .catch((e) => {
        console.error(e, "error from Homescreen.js");
      });
  };

  useEffect(() => {
  
    refresh();
  }, [startPosition, auth]);

  // console.log(parcels);

  return (
    <View style={s.container}>
      <View style={s.buttons}>
        <View style={s.horizontalButtons}>
          <Button style={s.mr} onPress={logout} loading={logging_out}>
            Logout
          </Button>
          <SyncButton />
        </View>
        <View style={s.verticalButtons}>
          <Button
            style={s.mb}
            onPress={() => goto("Add Sender", )}
            disabled={!canPickup}
          >
            Pickup items
          </Button>
          <Button
            style={s.mb}
            onPress={() => goto("Modes")}
            disabled={!canProccess}
          >
            Item processing
          </Button>

          {/* <Button
            style={s.mb}
            onPress={() => goto("BookingScreen")}
            disabled={!canPickup}
          >
            Handle Bookings
          </Button> */}
          <Button onPress={() => goto("Search")}>Search</Button>
        </View>
      </View>
      <View style={s.listContainer}>
        {requesting ? (
          // if parcels have not loaded yet show orange loading ring
          <View
            style={{
              flex: 1,
              // alignContent: "center
              // justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ActivityIndicator animating={true} />
            <Text
              style={{ fontWeight: "bold", fontSize: 15 }}
            >{`Now Displaying Parcels from ${startPosition * 30} to ${
              (startPosition + 1) * 30
            }`}</Text>
          </View>
        ) : (
          <ParcelList
            // parcels recieved using refrest() function by seding post request to /cargo
            // and set inside 'parcels' variable using setParcels()
            parcels={parcels}
            navigation={navigation}
            refresh={refresh}
            startPosition={startPosition}
            setStartPosition={setStartPosition}
          />
        )}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  listContainer: {
    flex: 5,
    margin: 5,
  },
  buttons: {
    flex: 2,
  },
  horizontalButtons: {
    flexDirection: "row",
    justifyContent: "center",
    flex: 1,
    margin: 3,
  },
  verticalButtons: {
    margin: 3,
    flex: 4,
  },
  mr: {
    marginRight: 5,
    flex: 1,
  },
  mb: {
    marginBottom: 5,
  },
});

export default Home;
