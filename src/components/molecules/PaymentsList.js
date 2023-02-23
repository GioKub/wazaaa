import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  VirtualizedList,
  StyleSheet,
} from "react-native";
// components
import PaymentItem from "../atoms/PaymentItem.js";
// import ParcelInfoModal from "./ParcelInfoModal.js";

// this transforms the shape of parcel it recieved from <ListItem>
// to then pass it to <ParcelInfoModal>
const PaymentsList = ({ payments = [], navigation, refresh }) => {
  const renderItem = ({ item, index }) => {
    // <ListItem> recievs parcel from 'data' property inside <VirtualizedList/>
    // and then passes that parcel to showModal()
    return (
      <PaymentItem
        parcel={item}
        onClick={() => {
          console.log("Paymnet was clicked");
        }}
        i={index}
        key={index}
      />
    );
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
      <Text style={styles.emptyText}>You have no payments</Text>
    </View>
  );
  return (
    <>
      {/* this is responsible for showing full parcel info when you click on parcel shorthand
      <ParcelInfoModal
        navigation={navigation}
        // calls what you pass here when you click "OK" button
        hideModal={hideModal}
        parcel={parcel}
        modalVisible={modalVisible}
        refresh={refresh}
      /> */}
      {/* this is resposnible for showing parcel shorthands */}
      <SafeAreaView style={styles.container}>
        <VirtualizedList
          data={payments}
          initialNumToRender={3}
          // item is each parcel and index is 0, 1, 2 ...
          keyExtractor={(item, index) => item.toString() + index.toString()}
          renderItem={renderItem}
          getItemCount={getItemCount}
          windowSize={3}
          getItem={getItem}
          ListEmptyComponent={Empty}
        />
      </SafeAreaView>
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

export default PaymentsList;
