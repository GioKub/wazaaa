import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Vibration } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Alert } from "react-native";

const Scanner = (props) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const { barCodes, setBarCodes } = props.barCodes ? props : props.route.params;

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    if (props.barCodes) {
      if (barCodes.indexOf(data) === -1) {
        setBarCodes([...barCodes, data]);
        Vibration.vibrate();
      }
    } else if (props.route.params.scanOnce) {
      setScanned(true);
      Alert.alert(
        "Alert",
        `Barcode ${data} has been scanned!`,
        [
          {
            text: "Retry",
            onPress: () => setScanned(false),
            // style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              props.route.params.callback(data);
              props.navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
});

export default Scanner;
