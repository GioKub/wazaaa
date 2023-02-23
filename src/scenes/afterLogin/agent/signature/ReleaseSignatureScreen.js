import React, { useEffect, useState, useContext } from "react";
import { Alert, View, Text, StyleSheet, ScrollView } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import InputWithError from "../../../../components/atoms/InputWithError";
import useRequest from "../../../../hooks/useRequest";
import releaseParcelRequest from "../../../../requests/releaseParcelRequest";
import Sign from "./Signature";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

const ReleaseSignatureScreen = ({ navigation, route }) => {
  const [note, setNote] = useState("");
  const [noteToDisplay, setNnoteToDisplay] = useState([]);

  const [base64, setBase64] = useState(undefined);
  const [request, releasing] = useRequest(releaseParcelRequest);

  const [gettingLocation, setGettingLocation] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const onNoteChange = (name, value) => {
    setNote(value);
  };

  useEffect(() => {
    if (base64 !== undefined) {
      (async () => {
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
              onPress: () => {
                request({
                  tracking_number: route.params.tracking_number,
                  note: note,
                  signature: base64,
                  lon: location.coords.longitude,
                  lat: location.coords.latitude,
                })
                  .then(() => {
                    Alert.alert("Done", "Released successfully!", [
                      { text: "OK", onPress: navigation.goBack() },
                    ]);
                    return;
                  })
                  .catch((e) => {
                    Alert.alert("Error", `${e}`, [
                      {
                        text: "OK",
                        onPress: () => navigation.goBack(),
                      },
                    ]);
                    return;
                  })
                  .finally(route.params.refresh);
              },
            },
          ]);
        }
      })();
    }
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
    // display: "flex",

    // flex: 1,
    marginTop: "5%",
    marginBottom: "5%",
    // marginBottom: 30,
    // flexGrow: 1,
    // borderWidth: 3,
  },
  Notes: {
    margin: 10,
    // borderWidth: 3,
    // borderColor: "red",
  },
});

export default ReleaseSignatureScreen;
