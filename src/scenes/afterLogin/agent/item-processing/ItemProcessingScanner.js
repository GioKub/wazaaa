import React, { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Scanner from "./Scanner.js";
import ProcessingList from "../../../../components/molecules/ProcessingList";
import EditBarCode from "../../../../components/molecules/EditBarCode";
import BootstrapStyleSheet from "react-native-bootstrap-styles";
import Button from "../../../../components/atoms/Button";

const bootstrapStyleSheet = new BootstrapStyleSheet();
const { s, c } = bootstrapStyleSheet;

const ItemProcessingScanner = ({ navigation, route: { params } }) => {
  const { barCodes, setBarCodes } = params;
  const [barcodes, setBarcodes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [barcode, setBarcode] = useState({});

  useEffect(() => {
    setBarcodes(barCodes);
  }, [barCodes]);

  const remove = (i) => {
    const newBars = [];
    for (let index = 0; index < barcodes.length; index++) {
      if (i !== index) newBars.push(barcodes[index]);
    }
    setBarcodes(newBars);
  };

  const edit = (index) => {
    setModalVisible(true);
    setBarcode({ barcode: barcodes[index].toString(), index: index });
  };
  const save = () => {
    setModalVisible(false);
    const newBarcodes = barcodes;
    newBarcodes[barcode.index] = barcode.barcode;
    setBarcodes(newBarcodes);
  };
  const done = () => {
    setBarCodes(barcodes);
    navigation.goBack();
  };
  return (
    <>
      <React.Fragment>
        <Scanner barCodes={barcodes} setBarCodes={setBarcodes} />
      </React.Fragment>
      <View style={[s.container, styles.camera, s.m2]}>
        <EditBarCode
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          barcode={barcode}
          setBarcode={setBarcode}
          save={save}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flex: 8 }}>
            <ProcessingList barCodes={barcodes} remove={remove} edit={edit} />
          </View>
          <View style={{ flex: 1 }}>
            <Button onPress={done}>Done</Button>
          </View>
        </View>
      </View>
      {/* </ScrollView> */}
    </>
  );
};

const styles = StyleSheet.create({
  camera: { flex: 1, borderWidth: 1, borderRadius: 10 },
});

export default ItemProcessingScanner;
