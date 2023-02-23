import React, { useEffect, useState, useContext } from "react";
import { Alert, View, Text, StyleSheet, ScrollView } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import Button from "../../../../components/atoms/Button";
import InputWithError from "../../../../components/atoms/InputWithError";
import useOfflineRequest from "../../../../hooks/useOfflineRequest";
import Sign from "./Signature";

import * as Location from "expo-location";

const DeliverSignatureScreen = ({ navigation, route }) => {
  const [note, setNote] = useState("");
  const [noteToDisplay, setNnoteToDisplay] = useState([]);

  const [base64, setBase64] = useState(undefined);
  const [request, requesting] = useOfflineRequest({
    url: "/cargo/release",
    method: "POST",
  });

  const [gettingLocation, setGettingLocation] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const onNoteChange = (name, value) => {
    setNote(value);
    // setExtra({ ...extra, [name]: value });
  };

  useEffect(() => {
    (async () => {
      if (base64 !== undefined) {
        setGettingLocation(true);
        let location = await Location.getCurrentPositionAsync({});
        setGettingLocation(false);
        if (errorMsg) {
          Alert.alert(errorMsg, "", [
            {
              text: "Ok",
              style: "destructive",
              // onPress: () => {},
            },
          ]);
          // if getting location was sucesfull
        } else {
          Alert.alert("are you sure you want to release it?", "", [
            {
              text: "No",
              style: "cancel",
              onPress: () => {},
            },
            {
              text: "confirm",
              style: "destructive",
              onPress: async () => {
                let tracking_numbers = [];
                try {
                  for (let i = 0; i < route.params.releaseCodes.length; ++i) {
                    // POST /cargo/release
                    const response = await request({
                      release_code: route.params.releaseCodes[i],
                      note: note,
                      signature: base64,
                      lon: location.coords.longitude,
                      lat: location.coords.latitude,
                    });
                    tracking_numbers.push(response.data.tracking_number);
                  }
                  Alert.alert(
                    "Success",
                    `Tracking numbers released are: ${tracking_numbers}`,
                    [{ text: "OK", onPress: () => navigation.navigate("Home") }]
                    // {cancelable: true}
                  );
                } catch (e) {
                  // e.response.data.message
                  Alert.alert(
                    "Error",
                    "Cargo not found for one of the code you entered or it isn't paid",
                    [
                      {
                        text: "OK",
                        onPress: () => navigation.goBack(),
                      },
                    ]
                  );
                  route.params.setError(
                    "Cargo not found for one of the code you entered or it isn't paid"
                  );
                  // route.params.setError(e.response.data.message);
                }
              },
            },
          ]);
        }
      }
    })();
  }, [base64]);

  return (
    <>
      <View style={style.NoteContainer}>
        <View>
          <InputWithError
            name="note"
            placeholder="Note"
            onChangeText={onNoteChange}
            value={note}
          />
        </View>
      </View>
      <Sign onOK={setBase64} />
      {gettingLocation ? <ActivityIndicator animating={true} /> : null}
    </>
  );
};

const style = StyleSheet.create({
  NoteContainer: {
    marginTop: "5%",
    marginBottom: "5%",
    // borderWidth: 3,
  },
  Notes: {
    margin: 10,
    // borderWidth: 3,
    // borderColor: "red",
  },
});

export default DeliverSignatureScreen;
