import React, { useState, useEffect } from "react";
import { Image, View, Platform, StyleSheet, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import * as ImagePicker from "expo-image-picker";
//  components
import Button from "../../../../components/atoms/Button.js";
import ModalContainer from "../../../../components/atoms/ModalContainer.js";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";

export default function UploadHashInvoice({
  imageHash,
  setImageHash,
  image: images = null,
  setImage: setImages = () => {},
  onDone = () => {},
  loading = false,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [maxPictures, setMaxPictures] = useState(false);

  const showModal = () => setModalVisible(true);
  // gets called when you click 'Done' Button
  const hideModal = () => {
    onDone();
    setModalVisible(false);
  };

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          const msg =
            "Sorry, we need camera roll permissions to make this work!";
          alert(msg);
        }
      }
    })();
  }, []);

  useEffect(() => {
    console.log(imageHash.length, "imageHash length");
    if (imageHash.length < 5) {
      setMaxPictures(false);
    }
  }, [imageHash]);

  // gets called when you click "upload file" button
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // Specify the quality of compression, from 0 to 1. 0 means compress for small size,
      //1 means compress for maximum quality.
      quality: 0.5,
      base64: true,
    });

    if (!result.cancelled) {
      //   const newImages = images.slice();
      //   newImages.push(result.uri);
      const newImageHash = imageHash;

      if (result.width > 1000) {
        const manipResult = await manipulateAsync(
          "data:image/png;base64," + result.base64,
          [
            {
              resize: {
                width: 1000,
              },
            },
          ],
          { base64: true }
        );

        newImageHash.push("data:image/png;base64," + manipResult.base64);
      } else {
        newImageHash.push("data:image/png;base64," + result.base64);
      }
      // i just need setImages to rerender component
      // i don't know why it doesnt do it otherwise
      setImages([]);
      setImageHash(newImageHash);
      if (imageHash.length === 5) {
        setMaxPictures(true);
      }
    }
  };

  // gets called when you click 'Open Camera' button
  const pickCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.5,
      base64: true,
    });

    if (!result.cancelled) {
      //   const newImages = images.slice();
      //   newImages.push(result.uri);
      const newImageHash = imageHash;
      if (result.width > 1000) {
        const manipResult = await manipulateAsync(
          "data:image/png;base64," + result.base64,
          [
            {
              resize: {
                width: 1000,
              },
            },
          ],
          { base64: true }
        );

        newImageHash.push("data:image/png;base64," + manipResult.base64);
      } else {
        newImageHash.push("data:image/png;base64," + result.base64);
      }

      // i just need setImages to rerender component
      // i don't know why it doesnt do it otherwise
      setImages([]);
      setImageHash(newImageHash);
      if (imageHash.length === 5) {
        setMaxPictures(true);
      }
    }
  };
  // gets called when you click 'X' next to image
  const remove = (i) => {
    // const newImages = images.slice();
    const newImageHash = imageHash.slice();
    // newImages.splice(i, 1);
    newImageHash.splice(i, 1);
    // setImages(newImages);
    setImageHash(newImageHash);
  };

  const renderItem = ({ item, index }) => {
    // file_name is what is shown as file name next image inside flastlist
    // skips the bas64 heading
    let file_name = item.substring(26, 40) + "...";

    return (
      <View
        style={{
          backgroundColor: index % 2 === 1 ? "#f5f5f5" : "white",
          flexDirection: "row",
          flex: 1,
        }}
      >
        <View style={{ flex: 4, flexDirection: "row" }}>
          <View style={{ flex: 2, margin: 4 }}>
            <Image
              source={{ uri: item }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
          <View style={{ flex: 3, justifyContent: "center" }}>
            <Text>{file_name}</Text>
          </View>
        </View>
        <View style={{ flex: 1 }}>
          <Button mode="outlined" color="red" onPress={() => remove(index)}>
            X
          </Button>
        </View>
      </View>
    );
  };
  return (
    <View style={style.container}>
      <ModalContainer modalVisible={modalVisible}>
        <View style={style.modalContainer}>
          <View style={{ flex: 4 }}>
            <FlatList data={imageHash} renderItem={renderItem} />
          </View>
          <Button
            style={style.button}
            disabled={maxPictures}
            onPress={pickImage}
          >
            Upload file
          </Button>
          <Button style={style.button} onPress={pickCamera}>
            Open Camera
          </Button>
          <Button style={style.button} onPress={hideModal} mode="outlined">
            Done
          </Button>
        </View>
      </ModalContainer>
      <View style={style.col}>
        <Button onPress={showModal} loading={loading}>
          Upload Invoice
        </Button>
      </View>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginBottom: 5,
  },
  button: {
    flex: 1,
    margin: 2,
  },
  col: {
    flex: 1,
    margin: 2,
  },
  buttonRow: { flexDirection: "row" },
  modalContainer: {
    flexDirection: "column",
    flex: 1,
    flexGrow: 1,
    height: 300,
    justifyContent: "center",
  },
});
