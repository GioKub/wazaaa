import React from "react";
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import BootstrapStyleSheet from "react-native-bootstrap-styles";

const bootstrapStyleSheet = new BootstrapStyleSheet();
const { s, c } = bootstrapStyleSheet;

const PickupList = ({ parcels = [], editParcel, removeParcel }) => {
  const renderItem = ({ item, index }) => {
    // sender is undfined

    const { sender, receiver, ...parcel } = item;

    const edit = () => {
      editParcel(index, parcel, receiver);
    };
    return (
      <View
        style={[s.tableRow, s.tableStripedRow(index)]}
        key={parcel.tracking_number}
      >
        <View style={[s.tableHeadCol, s.flex3, s.justifyContentCenter]}>
          <TouchableOpacity onPress={edit}>
            <Text>{parcel.tracking_number}</Text>
          </TouchableOpacity>
        </View>
        <View style={[s.tableHeadCol, s.flex3]}>
          <TouchableOpacity onPress={edit}>
            <Text style={[s.text]}>{receiver.name}</Text>
          </TouchableOpacity>
        </View>
        <View style={[s.tableHeadCol, s.flex1, s.justifyContentCenter]}>
          <TouchableOpacity
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => removeParcel(index)}
          >
            <Text style={{ color: "red", fontWeight: "bold" }}>X</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <>
      <SafeAreaView>
        {parcels.length ? (
          <FlatList
            nestedScrollEnabled={true}
            data={parcels}
            style={[s.table]}
            ListHeaderComponent={Header}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        ) : null}
      </SafeAreaView>
    </>
  );
};

// this rednerd " #    Reciever "
const Header = () => {
  return (
    <View style={[s.tableHead]}>
      <View style={[s.tableHeadCol]}>
        <Text style={[s.text, s.flex3]}>#</Text>
      </View>
      <View style={[s.tableHeadCol, s.flex3]}>
        <Text style={[s.text, s.textCenter]}>Receiver</Text>
      </View>
      <View style={[s.tableHeadCol, s.flex1]}>
        <Text style={[s.text]} />
      </View>
    </View>
  );
};
export default PickupList;
