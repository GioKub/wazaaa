import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import ProcessingList from "../../../../components/molecules/ProcessingList";
import EditBarCode from "../../../../components/molecules/EditBarCode";
import BootstrapStyleSheet from "react-native-bootstrap-styles";
import Button from "../../../../components/atoms/Button";
import InputWithError from "../../../../components/atoms/InputWithError";
import ErrorText from "../../../../components/atoms/ErrorText";
import useOfflineRequest from "../../../../hooks/useOfflineRequest";
import { CustomDialog } from "./DeliveredItemProcessing.js";
import PreventGoingBack from "../../../../components/atoms/PreventGoingBack";
import confirmAlert from "../../../../utils/confirmAlert.js";
import { Alert } from "react-native";

const bootstrapStyleSheet = new BootstrapStyleSheet();
const { s } = bootstrapStyleSheet;

const ItemProcessing = ({ navigation, route: { params } }) => {
  // const [request, requesting] = useRequest(processRequest);
  const [request, requesting] = useOfflineRequest({
    url: "/cargo/batch/event",
    method: "POST",
  });
  const [barCodes, setBarCodes] = useState([params.first]);
  const [size, setSize] = useState(params.size);
  const [modalVisible, setModalVisible] = useState(false);
  const [barcode, setBarcode] = useState({ barcode: "" });
  const [error, setErrors] = useState("");
  const [missingCodes, setMissing] = useState([]);
  const [visible, setVisible] = useState(false);
  const [shouldAlert, setAlert] = useState(true);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  useEffect(() => {
    const l = barCodes.length;
    if (l <= params.size) setSize(params.size - l);
  }, [barCodes]);

  const preReleaseCheck = () => {
    let checkOn = [];
    let max = params.first + params.size - 1;
    barCodes.forEach((item) => {
      try {
        const n = parseInt(item);
        if (n <= max && n >= params.first) checkOn.push(n);
      } catch (error) {}
    });
    checkOn = checkOn.sort((a, b) => a - b);
    let remaining = params.size - checkOn.length;
    const missing = [];
    for (let i = 0; i < checkOn.length - 1; i++) {
      const a = checkOn[i];
      const b = checkOn[i + 1];
      const range = b - a > 20 ? a + 10 : b;
      if (b - a >= 2) {
        for (let j = a + 1; j < range; j++) {
          missing.push(j);
          remaining--;
        }
      }
    }
    if (remaining > 0) {
      const last = checkOn.pop();
      for (let i = 1; i <= remaining; i++) {
        missing.push(last + i);
      }
    }
    if (missing.length) {
      setMissing(missing);
      showDialog();
      // console.log(barCodes.length);
      // console.log(params.size);
      // console.log(missingCodes);
    } else if (size !== 0) {
      setMissing(missing);
      showDialog();
    } else {
      hideDialog();
      confirmSend();
    }
  };
  const remove = (i) => {
    if (barCodes.length > 1) {
      const newBars = barCodes.slice();
      newBars.splice(i, 1);
      setBarCodes(newBars);
    }
  };

  const edit = (index) => {
    setModalVisible(true);
    setBarcode({ barcode: barCodes[index].toString(), index: index });
  };
  const save = () => {
    setModalVisible(false);
    const newBarcodes = barCodes;
    newBarcodes[barcode.index] = barcode.barcode;
    setBarCodes(newBarcodes);
  };

  const gotoScanner = () => {
    navigation.navigate("Scanner", {
      save: save,
      edit: edit,
      remove: remove,
      barCodes: barCodes,
      setBarCodes: setBarCodes,
    });
  };
  const onChangeText = (name, value) => {
    setBarcode({ ...barcode, [name]: value });
  };
  const add = () => {
    const b = barcode.barcode;
    if (b && barCodes.indexOf(b) == -1) {
      setBarCodes([...barCodes, b]);
      setBarcode({ barcode: "" });
    }
  };
  const send = () => {
    setAlert(false);
    hideDialog();
    // POST /cargo/batch/event
    request({ tracking_numbers: barCodes, event: params.event })
      .then((r) => {
        console.log(r);
        // alert(r.data);
        Alert.alert(
          "Done",
          "Processed successfully!",
          [{ text: "Home", onPress: () => navigation.navigate("Home") }]
          // {cancelable: true}
        );
      })
      .catch((e) => {
        try {
          setErrors(e.response.data.message);
        } catch (error) {}
      });
  };
  const confirmSend = () => {
    confirmAlert({
      paragraph: `Are you sure you want to process these codes to be ${params.event}?`,
      onConfirm: send,
    });
  };
  return (
    <>
      <PreventGoingBack navigation={navigation} shouldAlert={shouldAlert} />
      <View style={[s.container, s.bgWhite, s.flex1, s.p2]}>
        <CustomDialog
          visible={visible}
          hideDialog={hideDialog}
          entered={barCodes.length}
          size={params.size}
          list={missingCodes}
          onOK={confirmSend}
        />
        <View style={[s.formGroup]}>
          <InputWithError
            placeholder="Barcode"
            name="barcode"
            value={barcode.barcode.toString()}
            onChangeText={onChangeText}
            isNumber
          />
          <ErrorText error={error} />
        </View>
        <View
          style={[
            s.formGroup,
            { flexDirection: "row", justifyContent: "center" },
          ]}
        >
          <View style={[s.formGroup, s.flex1, s.mr2]}>
            <Button onPress={gotoScanner}>Scan</Button>
          </View>
          <View style={[s.formGroup, s.flex1, s.ml2]}>
            <Button onPress={add}>Add</Button>
          </View>
        </View>
        <View
          style={[
            s.formGroup,
            { alignItems: "center", borderWidth: 1, borderRadius: 20 },
          ]}
        >
          <Text mode="outlined" style={{ margin: 3 }}>
            Remaining codes: {size}
          </Text>
          <Text mode="outlined" style={{ margin: 3 }}>
            Total Items: {barCodes.length}
          </Text>
          <Text mode="outlined" style={{ margin: 3 }}>
            Mode: {params.event}
          </Text>
        </View>
        <View style={[s.flex3]}>
          <EditBarCode
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            barcode={barcode}
            setBarcode={setBarcode}
            save={save}
            isNumber
          />
          <ProcessingList barCodes={barCodes} remove={remove} edit={edit} />
        </View>
        <View style={[s.formGroup]}>
          <Button onPress={preReleaseCheck} loading={requesting}>
            Done
          </Button>
        </View>
      </View>
    </>
  );
};

export default ItemProcessing;
