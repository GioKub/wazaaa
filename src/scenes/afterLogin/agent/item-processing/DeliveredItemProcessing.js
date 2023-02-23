import React, { useState, useEffect, useContext } from "react";
import { View } from "react-native";
import InputWithError from "../../../../components/atoms/InputWithError";
import Button from "../../../../components/atoms/Button";
import BootstrapStyleSheet from "react-native-bootstrap-styles";
import ErrorText from "../../../../components/atoms/ErrorText";
import EditBarCode from "../../../../components/molecules/EditBarCode";
import ProcessingList from "../../../../components/molecules/ProcessingList";
import { Chip } from "react-native-paper";
import { Dialog, Paragraph, Portal } from "react-native-paper";
import { FlatList } from "react-native";
import useOfflineRequest from "../../../../hooks/useOfflineRequest";
import PreventGoingBack from "../../../../components/atoms/PreventGoingBack";
import { Alert } from "react-native";
import confirmAlert from "../../../../utils/confirmAlert";
import { AuthContext } from "../../../../context";
import * as Location from "expo-location";

const bootstrapStyleSheet = new BootstrapStyleSheet();
const { s } = bootstrapStyleSheet;

const DeliveredItemProcessing = ({
  navigation,
  route: {
    params: { size: n },
  },
}) => {
  const { auth, setAuth } = useContext(AuthContext);
  const [releaseCode, setCode] = useState("");
  const [releaseCodes, setCodes] = useState([]);
  const [error, setError] = useState("");
  const [size, setSize] = useState(n);
  const [modalVisible, setModalVisible] = useState(false);
  const [editedCode, setEdited] = useState({});
  const [visible, setVisible] = useState(false);
  const [shouldAlert, setAlert] = useState(true);
  const [canRelase, setCanRelase] = useState(
    auth.agent.privileges.includes("RELEASE_CARGO")
  );

  const [request, requesting] = useOfflineRequest({
    url: "/cargo/release",
    method: "POST",
  });
  // const [request, requesting] = useRequest(releaseRequest);

  useEffect(() => {
    const l = releaseCodes.length;
    if (l <= n) setSize(n - l);
  }, [releaseCodes]);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const goToScanner = () => {
    // navigation.navigate("cameraScanner", {
    //     barCodes: releaseCodes,
    //     setBarCodes: setCodes,
    //     multi: true
    // });
    navigation.navigate("Scanner", {
      save: save,
      edit: edit,
      remove: remove,
      barCodes: releaseCodes,
      setBarCodes: setCodes,
    });
  };
  const onChangeText = (_, value) => {
    setCode(value);
  };
  const release = async () => {
    if (!canRelase) {
      setError("You don't have permission for releasing parcels");
    } else {
      let myFunc = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert(
            "You can't relase parcel wihout location permission, please try again"
          );
        } else {
          setAlert(false);
          hideDialog();
          navigation.navigate("DeliverSignScreen", {
            releaseCodes,
            setError,
          });
        }
      };
      myFunc();
    }
  };
  const preReleaseCheck = () => {
    if (size > 0) {
      showDialog();
    } else {
      hideDialog();
      confirmSend();
    }
  };
  const remove = (i) => {
    if (releaseCodes.length >= 1) {
      const newRelease = releaseCodes.slice();
      newRelease.splice(i, 1);
      // setSize(size + 1);
      setCodes(newRelease);
    }
  };

  const edit = (index) => {
    setModalVisible(true);
    setEdited({ code: releaseCodes[index].toString(), index: index });
  };
  const save = () => {
    setModalVisible(false);
    const newRelease = releaseCodes.slice();
    newRelease[editedCode.index] = editedCode.code;
    setCodes(newRelease);
  };
  const add = () => {
    if (releaseCode !== "" && releaseCodes.indexOf(releaseCode) === -1) {
      const newRelease = releaseCodes.slice();
      // setSize(size - 1);
      newRelease.push(releaseCode);
      setCodes(newRelease);
      setCode("");
    }
  };
  // const renderItem = ({item}) => <Text>{item}</Text>;
  const confirmSend = () => {
    confirmAlert({
      paragraph: `Are you sure you want to release these codes?`,
      onConfirm: release,
    });
  };
  return (
    <View style={[s.container, s.bgWhite, s.p3, s.flex1]}>
      <PreventGoingBack navigation={navigation} shouldAlert={shouldAlert} />
      <CustomDialog
        visible={visible}
        hideDialog={hideDialog}
        entered={releaseCodes.length}
        size={n}
        onOK={confirmSend}
      />
      <View style={[s.flex1]}>
        <View>
          <InputWithError
            placeholder="Release code"
            // style={{flex: 6, marginRight: 8}}
            name="releaseCode"
            value={releaseCode}
            onChangeText={onChangeText}
          />
          <Button
            // style={{flex: 1, height: 35, alignSelf: "flex-end"}}
            mode="outlined"
            onPress={goToScanner}
            disabled={requesting}
          >
            Scan
          </Button>
        </View>
        <ErrorText error={error} />
        <Button
          onPress={add}
          style={{ marginVertical: 8 }}
          disabled={requesting}
        >
          Add
        </Button>
        <Chip mode="outlined" style={{ margin: 3 }}>
          {"Remaining codes: " + size}
        </Chip>
        <EditBarCode
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          barcode={editedCode}
          setBarcode={setEdited}
          save={save}
          placeholder="Release Code"
          name="code"
        />
        <ProcessingList
          barCodes={releaseCodes}
          remove={remove}
          edit={edit}
          releaseList={true}
        />
      </View>
      <Button onPress={preReleaseCheck} loading={requesting}>
        Release
      </Button>
    </View>
  );
};

export default DeliveredItemProcessing;

const CustomDialog = ({
  visible,
  hideDialog,
  entered,
  size,
  list = [],
  onOK,
}) => {
  // console.log(visible, hideDialog, entered, size, (list = []), onOK);
  const renderItem = ({ item }) => (
    <Chip mode="outlined" style={{ marginRight: 2 }}>
      {item}
    </Chip>
  );
  const ok = () => {
    hideDialog();
    onOK();
  };
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Title style={{ color: "red" }}>Alert</Dialog.Title>
        <Dialog.Content>
          {size === entered || entered > size ? (
            <Paragraph>{`The codes you have entered are not sequential`}</Paragraph>
          ) : (
            <Paragraph>{`You have entered only ${entered} out of ${size} Codes`}</Paragraph>
          )}
          {list.length > 0 && (
            <>
              <Paragraph>Missing codes are:</Paragraph>
              <FlatList
                data={list}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                horizontal
              />
            </>
          )}
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            style={{ flex: 1, margin: 5 }}
            onPress={hideDialog}
            mode="outlined"
            color="black"
          >
            Go back
          </Button>
          <Button style={{ flex: 1, margin: 5 }} color="red" onPress={ok}>
            OK
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
export { CustomDialog };
