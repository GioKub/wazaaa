import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native";
import { ActivityIndicator, Divider } from "react-native-paper";
// components
import { AuthContext } from "../../context/index.js";
import Button from "../atoms/Button.js";
import ModalContainer from "../atoms/ModalContainer.js";
import parcelPaymentInfoRequest from "../../requests/parcelPaymentInfoRequest.js";
import releaseParcelRequest from "../../requests/releaseParcelRequest.js";
import useRequest from "../../hooks/useRequest.js";
import confirmAlert from "../../utils/confirmAlert.js";
import * as Location from "expo-location";

const ParcelInfoModal = ({
  navigation,
  // get's called when you click "OK button"
  hideModal = () => {},
  parcel,
  modalVisible,
  // called inside .finally() inside release()
  refresh = () => {},
}) => {
  // console.log(parcel, "<-ParcelINfoModal");
  const { auth } = useContext(AuthContext);
  const [payment, setPayment] = useState({});
  const [request, releasing] = useRequest(releaseParcelRequest);
  const [paymentInfoRequest, gettinInfo] = useRequest(parcelPaymentInfoRequest);

  // const canEdit = auth.agent.privileges.includes("AMEND_CARGO_INFORMATION");
  // const canRelease = auth.agent.privileges.includes(
  //   "RELEASE_CARGO_BY_TRACKING_NUMBER"
  // );

  const canEdit = auth.agent.hasOwnProperty("privileges")
    ? auth.agent.privileges.includes("EXTRA_CHARGE_CUSTOMER")
    : undefined;

  const canRelease = auth.agent.hasOwnProperty("privileges")
    ? auth.agent.privileges.includes("RELEASE_CARGO_BY_TRACKING_NUMBER")
    : undefined;

  const canSign = auth.agent.hasOwnProperty("privileges")
    ? auth.agent.privileges.includes("AMEND_SIGNATURE")
    : undefined;

  const payed = parcel.payment_status === "PAID";

  const alreadyReleased = parcel.status === "RELEASED";

  // words used as labels to display different 'parcel' object properties
  // e.g. 'Collection option         Home'
  // they are displayed in order in which they are written here
  const parcelLabels = [
    "Tracking number",
    "Weight",
    "Status",
    "From",
    "To",
    "Collection option",
    "Customer type",
    "Parcel type",
    "Notes",
    "Description",
    "Pickup date",
    "Release code",
    "Freight price",
    "Delivery price",
    "Packaging price",
    "Invoice link",
    "Discount",
    "Item price",
  ];

  // keys used for accesing 'parcel' properties
  const parcelKeys = [
    "tracking_number",
    "weight",
    "status",
    "source_country",
    "destination_country",
    "collection_option",
    "customer_type",
    "parcel_type",
    "notes",
    "description",
    "created_at",
    "release_code",
    "freight_price_code",
    "delivery_price_code",
    "packaging_price",
    "invoices",
    "discount_amount",
    "item_price_currency",
  ];
  // this are just labels used to displasy what type of informatin is showns
  // eg. "Address line 1      Paper st. 7"
  // simillar strings but with underscone like address_line_1 inside userKeys
  // are used to acces propertiy values inside parcel.receiver or parel.sender
  const userLabels = [
    "Name",
    "Email",
    "Phone",
    "Address line 1",
    "Address line 2",
    "Postal code",
  ];
  //keys inside parcel.receiver  or parcel.sender which is used to render reciver/sender information
  const userKeys = [
    "name",
    "email",
    "phone",
    "address_line_1",
    "address_line_2",
    "postal_code",
  ];
  const paymentLabels = ["Payment time", "Payment method"];
  const paymentKeys = ["created_at", "payment_method"];
  const receiver = parcel.receiver;
  const sender = parcel.sender;

  useEffect(() => {
    // this is returning error for now
    // POST /cargo/payment/
    paymentInfoRequest({
      tracking_number: parcel.tracking_number,
    })
      .then(({ data: { payment } }) => {
        let payment_date = new Date(payment.created_at);
        payment_date = payment_date.toLocaleString();
        // affected 'payment' object is sued to
        // console.log({ ...payment, created_at: payment_date });
        setPayment({ ...payment, created_at: payment_date });
      })
      .catch((e) => {
        console.error(e, "<-ParcelInfoModal.js");
        setPayment({});
      });
  }, [parcel.tracking_number]);

  const gotoExtraCharges = () => {
    // console.log(parcel, "<-ParcelINfoModal");
    navigation.navigate("ExtraCharges", {
      parcels: parcel,
    });
  };

  // gets called when you click 'Edit button'
  const edit = () => {
    hideModal();
    // same 'parcel' gets pased to edit parcel scren as ParcelInfoModal.js recieved
    // same shape and everythinga
    navigation.navigate("Edit Parcel", { parcel: parcel });
  };

  // get called from confirmRelase() which gets caleld when you click "Release" button
  const release = () => {
    // POST /cargo/release/tracking
    if (!canSign) {
      request({ tracking_number: parcel.tracking_number })
        .then(() => {
          Alert.alert(
            "Done",
            "Released successfully!",
            [{ text: "OK", onPress: hideModal }]
            // {cancelable: true}
          );
        })
        .catch((e) => {
          Alert.alert(
            "Error",
            `${e}`,
            [
              {
                text: "OK",
                onPress: () => {},
              },
            ]
            // {cancelable: true}
          );
        })
        .finally(refresh);
    } else {
      let myFunc = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          alert(
            "You can't relase parcel wihout location permission, please try again"
          );
        } else {
          navigation.navigate("ReleaseSignScreen", {
            tracking_number: parcel.tracking_number,
            refresh,
          });
        }
      };
      myFunc();
    }
  };
  // info displayed under "Payment Information"
  const Payment = () => {
    return paymentKeys.map((key, i) => (
      <View style={styles.row} key={key}>
        <Text style={styles.dd}>{paymentLabels[i]}</Text>

        <Text style={styles.dt}>
          {/* if payment status has not been fetched yet display orange scroll
          otheriwse if it has been fetched and exists display it or if there nothing
          display "Not Paid yet"*/}
          {gettinInfo ? (
            <ActivityIndicator animating />
          ) : payment[key] ? (
            payment[key]
          ) : (
            "Not Paid yet"
          )}
        </Text>
      </View>
    ));
  };
  // info displayed under "Parcel Information"
  const Parcel = () => {
    const link = (url) => Linking.openURL(url);

    // this is only left in the code because this functinonality may be used in the future
    // not in this comonenet but when we have to make client redirect wesbite with the tracking
    // number of clicked parcel already written when cleint clicks on some parcel in his homepage
    // const Link = ({ url }) =>
    //   url ? (
    //     <Text style={styles.link} onPress={() => link(url)}>
    //       Link{"\n"}
    //     </Text>
    //   ) : (
    //     <Text style={styles.dt}>N/A</Text>
    //   );
    return parcelKeys.map((key, i) => (
      <View style={styles.row} key={key}>
        <Text style={styles.dd}>{parcelLabels[i]}</Text>
        {key !== "invoices" ? (
          <Text style={styles.dt}>{parcel[key] ? parcel[key] : "N/A"}</Text>
        ) : (
          // code reaches here because there is such key as "invoices" inside parcelKeys
          // but this returns nothing because invoices property is empty array
          <Text>
            {parcel[key].map((path, i) => {
              return (
                <Text
                  style={{
                    color: "blue",
                    textDecorationLine: "underline",
                    marginRight: 12,
                  }}
                  onPress={() => link(path)}
                >
                  Download invoice {i + 1} {"\n"}
                </Text>
              );
            })}
          </Text>
        )}
      </View>
    ));
  };
  // info displayed under "Rciever Information" and "Sender Information"
  const User = ({ user, role }) => {
    if (!user) return null;
    const email = (mail) => Linking.openURL(`mailto:${mail}`);
    const call = (number) => Linking.openURL(`sms:${number}`);

    return userKeys.map((key, i) => {
      const data = user[key];
      // adds Reciever or Sender in fron of label
      // e.g. turns 'Email' into 'Reciever Email'
      const label = `${role} ${userLabels[i]}`;
      if (!data)
        return (
          // Shows N/A as results if parcel.reciever or parcel.sender
          // didn't contain some key inside userKeys
          <View style={styles.row} key={key}>
            <Text style={styles.dd}>{label}</Text>
            <Text style={styles.dt}>N/A</Text>
          </View>
        );
      return (
        <View style={styles.row} key={key}>
          <Text style={styles.dd}>{label}</Text>
          {i === 1 ? ( //email
            <Text style={styles.link} onPress={() => email(data)}>
              {data}
            </Text>
          ) : i === 2 ? ( //phone
            <Text style={styles.link} onPress={() => call(data)}>
              {data}
            </Text>
          ) : (
            <Text style={styles.dt}>{data}</Text>
          )}
        </View>
      );
    });
  };
  const confirmRelease = () => {
    confirmAlert({
      paragraph: "Are you sure you want to release this parcel?",
      onConfirm: release,
    });
  };
  return (
    <ModalContainer modalVisible={modalVisible}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* content inside this ScrollView is respnsible for showing all the parcel info rest are buttons*/}
        <ScrollView>
          <Text style={styles.informationCategoryName}>Parcel Information</Text>
          <Parcel />
          <Text style={styles.informationCategoryName}>
            Payment Information
          </Text>
          <Divider style={{ marginVertical: 3 }} />
          <Payment />
          <Text style={styles.informationCategoryName}>Sender Information</Text>
          <Divider style={{ marginVertical: 3 }} />
          <User user={sender} role="Sender" />
          <Text style={styles.informationCategoryName}>
            Reciever Information
          </Text>
          <Divider style={{ marginVertical: 3 }} />
          <User user={receiver} role="Receiver" />
          <Divider style={{ marginVertical: 3 }} />
        </ScrollView>
        <View style={styles.buttonRow}>
          {auth.agent.hasOwnProperty("privileges") ? (
            <>
              <Button
                style={{ flex: 4 }}
                onPress={edit}
                // button is disable if agent doesn't have privildege or
                //releasing(don't know whet it occurs what it means though)
                disabled={!canEdit || releasing}
              >
                Edit
              </Button>

              {/* {console.log(alreadyReleased)} */}

              <Button
                style={{ flex: 4, marginHorizontal: 2 }}
                onPress={confirmRelease}
                loading={releasing}
                // disabled={!(payed && notReleased && canRelease) || releasing} original
                disabled={
                  !(payed && !alreadyReleased && canRelease) || releasing
                }
              >
                Release
              </Button>
              <Button
                style={{ flex: 4 }}
                onPress={gotoExtraCharges}
                disabled={!canEdit || releasing}
              >
                Extra Charges
              </Button>
            </>
          ) : null}
          <Button
            style={{ flex: 1, marginHorizontal: 2 }}
            onPress={hideModal}
            mode="outlined"
          >
            Ok
          </Button>
        </View>
      </SafeAreaView>
    </ModalContainer>
  );
};
export default ParcelInfoModal;

const styles = StyleSheet.create({
  dd: {
    flex: 4.5,
    marginRight: 5,
    fontWeight: "bold",
  },
  dt: { flex: 5 },
  link: { flex: 5, color: "blue", textDecorationLine: "underline" },
  row: {
    flexDirection: "row",
    marginBottom: 5,
    borderColor: "rgba(0,0,0,0.12)",
    borderBottomWidth: 0.5,
  },
  btnContainer: { flex: 1 },
  buttonRow: { flexDirection: "row" },
  informationCategoryName: {
    alignSelf: "center",
    color: "#d96b18",
    fontWeight: "bold",
  },
});
