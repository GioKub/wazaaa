import React, { useState, useEffect } from "react";
import { ScrollView, View } from "react-native";
// componenets from ../../../../components/atoms/
import InputWithError from "../../../../components/atoms/InputWithError.js";
import Button from "../../../../components/atoms/Button.js";
import SelectDropdown from "../../../../components/atoms/SelectDropdown.js";
import InputAutoComplete from "../../../../components/atoms/InputAutoComplete.js";
import PreventGoingBack from "../../../../components/atoms/PreventGoingBack.js";
// components from ../../../../components/molecules/
import PickupList from "../../../../components/molecules/PickupList.js";
import RadioButtonGroup from "../../../../components/molecules/RadioButtonGroup";
import SourceRoutesDropdown from "../../../../components/molecules/SourceRoutesDropdown";
// hook componenets
import useValidation from "../../../../hooks/useValidation.js";
// validation componenets
import senderDataValidations from "./PickupItemValidations.js";
//request components
import handleBook from "../../../../requests/handleBook.js";
import useRequest from "../../../../hooks/useRequest.js";
// other componenets
import BookButton from "./BookButton.js";

const PickupItemScreen = ({ navigation }) => {
  const btnGroup = { flex: 1, borderRadius: 20, marginRight: 5 };
  const [usedScanner, setUsedScanner] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [book, booking] = useRequest(handleBook);
  const [emailToBookWith, setEmailToBookWith] = useState("");
  const { errors, validate, hasErrors } = useValidation(senderDataValidations);
  const [parcels, setParcels] = useState([]);
  const [sender, setSender] = useState({});
  const [shouldAlert, setAlert] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [bookCountry, setBookCOuntry] = useState("");
  const [bookindIdToSend, setBookindIdToSend] = useState(0);
  const [itemIdToSend, setItemIdToSend] = useState([]);
  // this stops autoname generator from generating, when name is already ented and
  // you switch to different field, it is basically bug and needs to be fixed, it shouldn't
  // do that in the first place
  const [gotHereFromBooking, setGotHereFromBooking] = useState(false);
  const [newParcel, setNewParcel] = useState({
    description: "Clothes",
    item_price: 75,
    item_currency_code: "EUR",
    collection_option: "OFFICE",
  });
  const [itemsInfo, setItemsInfo] = useState();

  const [globalSettings, setGlobal] = useState({
    parcel_type: "PARCEL",
    customer_type: "INDIVIDUAL",
    // collection_option: "HOME",
  });

  const labels = [
    "Sender phone",
    "Sender Email",
    "Sender addrees line 1",
    "Sender address line 2",
    "Sender address postal code",
  ];
  // keys used to as property names to acces values inside 'sender' object
  const keys = [
    "phone",
    "email",
    "address_line_1",
    "address_line_2",
    "postal_code",
  ];

  useEffect(() => {
    if (parcels.length > 0) {
      console.log("useEffect got called inside PickupItemScreen.js");
      console.log(parcels, "<--updated parcels");
      // console.log(parcels, "<--PickupItemScreen.js");
      setAlert(true);
    }
  }, [parcels.length]);

  // it doesn't get executed when clicking Summary

  const onChangeParcel = (name, value) => {
    setGlobal({ ...globalSettings, [name]: value });
    setAlert(true);
  };

  const parcelType = [
    { label: "Freight", value: "FREIGHT" },
    { label: "Parcel", value: "PARCEL" },
    { label: "Palette", value: "PALETTE" },
  ];

  // this gets called when you click 'Add Parcel' button
  const addReceiver = () => {
    console.log("222222222222");
    validate(sender)
      .then(() => {
        const index = parcels.length;
        // console.log(parcels, "<---parcels");
        // console.log(newParcel, "<--New Parceeel");
        navigation.navigate("Add Parcel", {
          index: index,
          setParcels: setParcels,
          itemsInfo: itemsInfo,
          parcels: parcels,
          newParcel: newParcel,
          newReceiver: newParcel,
          source_country_code: sender.country_code,
          parcel_type: globalSettings.parcel_type,
          customer_type: globalSettings.customer_type,
          collection_option: globalSettings.collection_option,
          isBooking: isBooking,
          bookCountry: bookCountry,
          bookindIdToSend: bookindIdToSend,
          itemIdToSend: itemIdToSend,
        });
      })
      .catch((e) => {
        console.log(e, "<-Validation error from PickupItemScreen.js");
      });
  };

  // gets called when you click on parcel shortand at the button of the screen
  // which appears after you finished entering the data for sender and reciver
  const editParcel = (index, parcel, receiver) => {
    console.log("111111111111111111");
    // console.log(parcels[index], "<--parcel passed down");
    navigation.navigate("Add Parcel", {
      index: index,
      setParcels: setParcels,
      itemsInfo: itemsInfo,
      parcels: parcels,
      newParcel: newParcel,
      newReceiver: receiver,
      source_country_code: sender.country_code,
      parcel_type: globalSettings.parcel_type,
      customer_type: globalSettings.customer_type,
      isBooking: isBooking,
      bookCountry: bookCountry,
    });
  };

  useEffect(() => {
    // console.log(sender, "<---sender");
  }, [sender]);

  const onChange = (name, value) => {
    if (name === "name") {
      setGotHereFromBooking(false);
    } else {
      setGotHereFromBooking(true);
    }

    // e.g. [name]: value "address_line_2": "333"
    const newSender = { ...sender, [name]: value };
    setSender(newSender);

    setAlert(true);
    validate(newSender, name).catch((e) => {});
  };

  const onDone = () => {
    if (emailToBookWith.length !== 0) {
      let idsToSkip = [];
      book({ email: emailToBookWith })
        .then((data) => {
          console.log(data.data, "<---itemssss");
          const parcelsTemp = parcels.slice();
          for (let key = 0; key < parcelsTemp.length; key++) {
            parcelsTemp[key] = {
              ...parcelsTemp[key],
              ...globalSettings,
            };
            parcelsTemp[key].sender = sender;
            // pretty sure this 2 lines to same thing and it is refoctarable
            const r = parcelsTemp[key].receiver;
            parcelsTemp[key].receiver = r ? r : {};
          }

          for (let i = 0; i < parcelsTemp.length; i++) {
            if (parcelsTemp[i].isBooking === true) {
              idsToSkip.push(parcelsTemp[i].itemIdToSend);
            }
          }
          // console.log(parcelsTemp, "<-PickupItemScreen.js");

          console.log(idsToSkip, "<---parcelsTemp");
          // console.log(data.data, "<---------------------");
          setGotHereFromBooking(true);
          if (data.data.error == true) {
            if (data.data.message === "Booking not found!") {
              alert("User with entered email has no active booking");
            } else {
              alert(
                "You entered incorrect email or user with entered email doesn't have any bookings"
              );
            }
            // set error message to be displayed on pickupitemscreen
          } else if (data.data.book.handled_staff_id === null) {
            alert("You first need to HANDLE this parcel");
          } else {
            let i = 0;

            // console.log(
            //   data.data.book.items[0].item_id,
            //   "<--000-------------------"
            // );

            console.log(data.data.book.items.length, "<---length");
            while (i <= data.data.book.items.length - 1) {
              // this item wwas already added in summary page
              console.log("while loop gets usedAAAAAAAAAA");
              if (idsToSkip.includes(data.data.book.items[i].item_id)) {
                i = i + 1;
                console.log("Truth be told1111");
              } else {
                // if this item is not booked already
                if (data.data.book.items[i].finished === 0) {
                  console.log("Truth be told22222");
                  break;
                } else {
                  i = i + 1;
                }
              }
            }

            if (i >= data.data.book.items.length) {
              // setNewParcel({
              //   description: "Clothes",
              //   item_price: 33,
              //   item_currency_code: "EUR",
              //   collection_option: "OFFICE",
              // });
              alert(
                "you have 22222222 all the items for this booking or all the times that are left have already been booked"
              );
            }

            if (data.data.book.source_country === "IE") {
              setNewParcel({
                ...newParcel,
                ...data.data.book.items[i].receiver_address,
                address_line_1: data.data.book.items[i].receiver_address.line_1,
                address_line_2: data.data.book.items[i].receiver_address.line_2,
                weight: data.data.book.items[i].weight,
              });

              setItemsInfo({
                ...data.data.book.items[i],
                drop_off: data.data.book.drop_off,
                home_collection: data.data.book.home_collection,
                isBooking: isBooking,
              });
              // check if bookings are empty, tell gia to add erro for this

              const SenderBook = {
                ...data.data.book.collection_address,
                country_code:
                  data.data.book.collection_address.address_country_code,
              };
              const modifiedSenderBook = {
                ...SenderBook,
                postal_code: SenderBook.address_postal_code,
              };
              setSender(modifiedSenderBook);
              setIsBooking(true);
              setBookCOuntry(data.data.book.source_country);
              setBookindIdToSend(data.data.book.items[i].book_id);
              setItemIdToSend(data.data.book.items[i].item_id);
            }

            // check if bookings are empty, tell gia to add erro for this
            if (data.data.book.source_country === "UK") {
              const SenderBook = {
                ...data.data.book.collection_address,
                country_code:
                  data.data.book.collection_address.address_country_code,
              };
              const modifiedSenderBook = {
                ...SenderBook,
                postal_code: SenderBook.address_postal_code,
              };
              setSender(modifiedSenderBook);
              setIsBooking(true);
              setBookCOuntry(data.data.book.source_country);
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }

    // navigation.navigate("cameraScanner", {
    //   scanOnce: true,
    //   callback: (number) => {
    //     const next = { ...parcel, tracking_number: number };
    //     console.log(next);
    //     // validateParcel(next, "tracking_number").then(() => setParcel(next));
    //   },
    // });
  };

  const chooseBookingWay = () => {};

  // gets called when you click summary button
  const gotoSummary = () => {
    validate(sender)
      .then(() => {
        if (parcels.length > 0) {
          const parcelsTemp = parcels.slice();
          for (let key = 0; key < parcelsTemp.length; key++) {
            parcelsTemp[key] = {
              ...parcelsTemp[key],
              ...globalSettings,
            };
            parcelsTemp[key].sender = sender;
            // pretty sure this 2 lines to same thing and it is refoctarable
            const r = parcelsTemp[key].receiver;
            parcelsTemp[key].receiver = r ? r : {};
          }
          // console.log(parcelsTemp, "<-PickupItemScreen.js");
          navigation.navigate("Summary", {
            isBooking: isBooking,
            parcels: parcelsTemp,
            setAlert: setAlert,
          });
        }
      })
      .catch(() => {});
  };
  // this get called when you click red 'x' next to parcel shorthand
  // at the bottom of the screen
  const removeParcel = (index) => {
    const newParcels = parcels.slice();
    newParcels.splice(index, 1);
    setParcels(newParcels);
  };

  const container = { flex: 1, backgroundColor: "white", padding: 10 };
  return (
    <>
      <PreventGoingBack navigation={navigation} shouldAlert={shouldAlert} />
      <ScrollView style={container}>
        <View style={{ borderWidth: 0, flex: 5.1 }}>
          {/* this is causing bug */}
          {/* this is repsonsible for showing possible names */}
          <InputAutoComplete
            name="name"
            value={sender.name}
            error={errors.name}
            // label={label}
            placeholder="Sender name"
            onChangeText={onChange}
            setUser={setSender}
            validate={validate}
            gotHereFromBooking={gotHereFromBooking}
            isCustomer
          />
          {keys.map((key, i) => (
            <InputWithError
              name={key}
              value={sender[key]}
              error={errors[key]}
              placeholder={labels[i]}
              onChangeText={onChange}
              key={"sender_" + key}
            />
          ))}
          <SourceRoutesDropdown
            name="country_code"
            onSelect={onChange}
            error={errors.country_code}
            selectedValue={sender.country_code}
            placeholder={`Sender address country code: ${
              sender.country_code === undefined ? "" : sender.country_code
            }`}
          />
          <SelectDropdown
            list={parcelType}
            name="parcel_type"
            onSelect={onChangeParcel}
            selectedValue={globalSettings.parcel_type}
            placeholder="Parcel Type"
          />
          <RadioButtonGroup
            label="Customer Type"
            onValueChange={onChangeParcel}
            val={globalSettings.customer_type}
            values={["INDIVIDUAL", "CORPORATE"]}
            name="customer_type"
            checkLabels={["Individual", "Corporate"]}
          />
          {/* commented for QA */}
          {/* <RadioButtonGroup
            label="Collection Option"
            onValueChange={onChangeParcel}
            val={globalSettings.collection_option}
            values={["HOME", "OFFICE"]}
            name="collection_option"
            checkLabels={["Home", "Office"]}
          /> */}
          <View
            style={{
              borderWidth: 0,
              flex: 0.5,
              flexDirection: "row",
            }}
          >
            <Button style={btnGroup} onPress={addReceiver}>
              Add Parcel
            </Button>
            <Button
              style={btnGroup}
              onPress={gotoSummary}
              disabled={hasErrors || parcels.length <= 0}
            >
              Summary
            </Button>
            <BookButton
              setUsedScanner={setUsedScanner}
              onChange={setEmailToBookWith}
              onDone={onDone}
              emailToBookWith={emailToBookWith}
              navigation={navigation}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
            />
            {/* {console.log(usedScanner, "<---scaner used22")} */}
          </View>
          <View style={{ borderWidth: 0, flex: 3 }}>
            <PickupList
              parcels={parcels}
              editParcel={editParcel}
              removeParcel={removeParcel}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default PickupItemScreen;
