import React from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import BootstrapStyleSheet from "react-native-bootstrap-styles";
import { Chip } from "react-native-paper";
// import {GRAY_MEDIUM} from "_styles/colors";

const bootstrapStyleSheet = new BootstrapStyleSheet();
const { s, c } = bootstrapStyleSheet;
const styles = StyleSheet.create({
  side: {
    flex: 1,
  },
  text: {
    alignContent: "flex-end",
  },
  price: {
    justifyContent: "center",
    alignContent: "center",
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
  },
  container: {
    flexWrap: "wrap",
    flex: 1,
    flexDirection: "row",
  },
  col1: {
    flex: 1.3,
  },
  col2: {
    flex: 1,
  },
  discount: {
    borderWidth: 1,
    borderColor: "#f5f5f5",
    color: "green",
  },
  chip: {
    marginRight: 3,
    paddingHorizontal: 1,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.26)",
    borderRadius: 5,
  },
});
const List = ({ extra_charges = [] }) => {
  const renderItem = ({ item }) => {
    return (
      <View style={styles.chip}>
        <Text>{`${item.note}: ${item.amount}`}</Text>
      </View>
    );
  };
  return extra_charges.length > 0 ? (
    <FlatList
      style={{ marginTop: 1 }}
      data={extra_charges}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      horizontal
    />
  ) : (
    <Text> No Extra Charges </Text>
  );
};
const SummaryListItem = ({ price, parcel = {}, discount }) => {
  // console.log(parcel, "<--parcel");
  return (
    <>
      <View style={styles.container}>
        <View style={styles.col1}>
          <Text style={[s.text, { fontWeight: "bold" }]}>
            Tracking number: {parcel.tracking_number}
          </Text>
          <Text style={[s.text]}>weight: {parcel.weight}</Text>
          <Text style={[s.text]}>description: {parcel.description}</Text>
          <Text style={[s.text]}>notes: {parcel.notes}</Text>
        </View>
        <View style={styles.col2}>
          <Text style={[s.text]}>From: {parcel.sender.country_code}</Text>
          <Text style={[s.text]}>To: {parcel.receiver.country_code}</Text>
          <Text>Total Price: {price ? price : 0}</Text>
          <Text>Freight Price: {parcel.freight_price}</Text>

          <Text>Delivery Price: {parcel.delivery_price}</Text>
          <Text>Packaging Price: {parcel.packaging_price}</Text>
          <Text>discount: {discount}</Text>

          {/* {parcel.extra_charges ? (
                        <>
                            <Text style={[s.text]}>extra charges: </Text>
                            {parcel.extra_charges.map((c, i) => (
                                <Text
                                    key={i + parcel.tracking_number}
                                >{`\t\t${c.note}: ${c.amount}`}</Text>
                            ))}
                        </>
                    ) : (
                        <Text style={[s.text]}>No Extra Charges</Text>
                    )} */}
        </View>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text>Extra charges: </Text>
        <List extra_charges={parcel.extra_charges} />
      </View>
    </>
  );
};

export default SummaryListItem;
