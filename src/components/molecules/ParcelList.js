import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  VirtualizedList,
  StyleSheet,
  ScrollView,
} from "react-native";
// components
import ListItem from "../atoms/ListItem.js";
import ParcelInfoModal from "./ParcelInfoModal.js";
import { codes } from "../../utils/countries.js";

// this transforms the shape of parcel it recieved from <ListItem>
// to then pass it to <ParcelInfoModal>
const ParcelList = ({
  parcels = [],
  navigation,
  refresh,
  startPosition,
  setStartPosition = () => {},
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [parcel, setParcel] = useState({});

  const showModal = (parcel) => {
    const { shipping_specs, item, invoice, created_at, ...p } = parcel;
    const { route, sender_information, receiver_information, ...rest } =
      shipping_specs;
    const sender = sender_information;
    const sender_address = sender_information.address;
    const receiver = receiver_information;
    const receiver_address = receiver_information.address;

    // ??????????????????explain what it does?????????????
    let route_name = {
      source_country: codes[route.source_country_code],
      destination_country: codes[route.destination_country_code],
    };

    //turns for example 2022-09-01T11:52:25.000Z into Thu Sep  1 15:52:25 2022
    let pickup_date = new Date(created_at);
    pickup_date = pickup_date.toLocaleString();

    //they add currency next to price, so result is for example 10 EUR
    let item_price_currency = "N/A";
    let freight_price_code = "N/A";
    let delivery_price_code = "N/A";
    if (item.item_price && item.item_currency_code) {
      item_price_currency = item.item_price + " " + item.item_currency_code;
    }
    if (invoice.freight_price && invoice.currency_code)
      freight_price_code = invoice.freight_price + " " + invoice.currency_code;
    if (invoice.delivery_price && invoice.currency_code)
      delivery_price_code =
        invoice.delivery_price + " " + invoice.currency_code;

    setParcel({
      ...p,
      created_at: pickup_date,
      ...item,
      ...route_name,
      ...route,
      sender: { ...sender, ...sender_address, address: {} },
      receiver: { ...receiver, ...receiver_address, address: {} },
      ...rest,
      ...invoice,
      item_price_currency,
      freight_price_code,
      delivery_price_code,
    });

    setModalVisible(true);
  };

  const hideModal = () => setModalVisible(false);

  const renderItem = ({ item, index }) => {
    // <ListItem> recievs parcel from 'data' property inside <VirtualizedList/>
    // and then passes that parcel to showModal()
    return <ListItem parcel={item} onClick={showModal} i={index} key={index} />;
  };

  // this also gets called shit ton of times like getItemCount()
  // logging out index return 0 1 2 2 0 1 2 and sequence is same on evry CTRL+S
  // weird...
  // loggin out returns idential arrays of objects, each object is parcel
  const getItem = (data, index) => {
    return data[index];
  };

  // this gets called shit ton of times even if page_size is set to 1 inside HomeScreen.js
  // and initialNumToRender={1} and windowSize={1} are propertis for <VirtaulizedList>
  // thought these settings would be affecting it but they don't so i don't know what the
  // fuck is going on
  const getItemCount = (data) => {
    return data.length;
  };
  const Empty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyText}>You have no parcels</Text>
    </View>
  );

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const ifCloseToTop = ({ layoutMeasurement, contentOffset, contentSize }) => {
    return contentOffset.y == 0;
  };

  return (
    <>
      {/* this is responsible for showing full parcel info when you click on parcel shorthand */}
      <ParcelInfoModal
        navigation={navigation}
        // calls what you pass here when you click "OK" button
        hideModal={hideModal}
        parcel={parcel}
        modalVisible={modalVisible}
        refresh={refresh}
      />
      {/* this is resposnible for showing parcel shorthands */}
      <ScrollView
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            setStartPosition(startPosition + 1);
          }
          if (ifCloseToTop(nativeEvent)) {
            if (startPosition !== 0) {
              setStartPosition(startPosition - 1);
            }
          }
        }}
        scrollEventThrottle={400}
        style={{ flex: 1 }}
      >
        <VirtualizedList
          data={parcels}
          initialNumToRender={3}
          // item is each parcel and index is 0, 1, 2 ...
          keyExtractor={(item, index) => item.toString() + index.toString()}
          renderItem={renderItem}
          getItemCount={getItemCount}
          windowSize={3}
          getItem={getItem}
          ListEmptyComponent={Empty}
        />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  empty: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ParcelList;
