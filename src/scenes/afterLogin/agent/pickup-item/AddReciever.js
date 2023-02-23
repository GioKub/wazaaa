import React, { useState, useEffect, useContext } from "react";
import {
  ScrollView,
  Text,
  View,
  SafeAreaView,
  Image,
  StyleSheet,
} from "react-native";
import BootstrapStyleSheet from "react-native-bootstrap-styles";
import { Chip, Divider, ActivityIndicator } from "react-native-paper";
// componetns from ./../../../components/atoms/
import InputWithError from "../../../../components/atoms/InputWithError";
import Button from "../../../../components/atoms/Button";
import InputAutoComplete from "../../../../components/atoms/InputAutoComplete";
import PreventGoingBack from "../../../../components/atoms/PreventGoingBack";
import CheckBox from "../../../../components/atoms/Checkbox";
// components from ../../../../components/molecules
import DestinationRoutesDropdown from "../../../../components/molecules/DestinationRoutesDropdown";
import ExtraChargesList from "../../../../components/molecules/ExtraChargesList";
import RadioButtonGroup from "../../../../components/molecules/RadioButtonGroup";
// hook componenets
import useRequest from "../../../../hooks/useRequest";
import useValidation from "../../../../hooks/useValidation";
// request componenets
import getParcelPrice from "../../../../requests/getParcelPrice";
import getTrackingDuplicates from "../../../../requests/getTrackingDuplicates";
/// validation componenets
import receiverValidations from "./receiverValidations";
import parcelValidations from "./parcelValidations";
// rest of the components
import UploadInvoice from "./UploadInvoice";
import { AuthContext } from "../../../../context";
import BookDetailsButton from "./BookDetailsButton";

const bootstrapStyleSheet = new BootstrapStyleSheet();
const { s } = bootstrapStyleSheet;

const AddReciever = ({ navigation, route }) => {
  const {
    index,
    setParcels,
    parcels,
    newReceiver = {},
    newParcel,
    source_country_code,
    parcel_type,
    customer_type,
    itemsInfo,
    isBooking,
    setIsBooking,
    setNewParcel,
    bookCountry,
    bookindIdToSend,
    itemIdToSend,
    gotHereFromBooking,
  } = {
    ...route.params,
  };

  // console.log(isBooking, "-----isBoooooking");
  const { auth, setAuth } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [receiver, setReceiver] = useState({});
  const [parcel, setParcel] = useState({});
  const { errors: receiverErrors, validate: validateReceiver } =
    useValidation(receiverValidations);
  const { errors: parcelErrors, validate: validateParcel } =
    useValidation(parcelValidations);
  const [policyError, setPolicyError] = useState(false);
  const [shouldAlert, setAlert] = useState(false);
  const [price, setPrice] = useState({
    currency_code: "",
    freight_price: 0,
    delivery_price: 0,
    packaging_price: 0,
  });
  const [extra, setExtra] = useState({ note: "", amount: "" });
  const [image, setImage] = useState([]);

  const [imageHash, setImageHash] = useState([]);

  const [canMinimumPrice, setCanMinimumPrice] = useState(
    auth.agent.privileges.includes("EDIT_MINIMUM_PRICE")
  );
  const [canPackagingPrice, setPackagingPrice] = useState(
    auth.agent.privileges.includes("EDIT_PACKAGING_PRICE")
  );

  //now each can be etiher 1, 0 or null if they haven't been defined before
  const recievedStateOfPackaging =
    parcels[index] !== undefined ? parcels[index].packaging : null;
  const recievedStateOfMinPrice =
    parcels[index] !== undefined ? parcels[index].min_price : null;

  // if it's not specificaly set to 0 it should return true, because in other
  // options it set to 1 or if its not set it should be checked by default

  const [isPackagingChecked, setPackagingChecked] = useState(
    recievedStateOfPackaging === 0 ? false : true
  );
  const [isMinPriceChecked, setMinPriceChecked] = useState(
    recievedStateOfMinPrice === 0 ? false : true
  );

  // console.log(parcel.packaging === 1 ? true : false);
  // this gets called when you type something into 'note' or 'amount' field
  const onExtraChange = (name, value) => {
    setExtra({ ...extra, [name]: value });
  };
  //gets called when you click 'add' button next to notes and amount input fields
  const onAdd = () => {
    if (
      extra &&
      extra.amount !== 0 &&
      extra.amount.toString() !== "" &&
      extra.note !== ""
    ) {
      const newExtra = parcel.extra_charges ? parcel.extra_charges.slice() : [];
      newExtra.push(extra);
      setExtra({ note: "", amount: "" });

      setParcel({ ...parcel, extra_charges: newExtra });
    }
  };
  const removeExtraCharge = (index) => {
    const newExtra = parcel.extra_charges.slice();
    newExtra.splice(index, 1);
    setParcel({ ...parcel, extra_charges: newExtra });
  };
  const [priceRequest, requestingPrice] = useRequest(getParcelPrice);
  const [trackingRequest, requestingTracking] = useRequest(
    getTrackingDuplicates
  );

  useEffect(() => {
    priceRequest({
      source_country_code: source_country_code,
      destination_country_code: receiver.country_code,
      collection_option: parcel.collection_option,
      parcel_type: parcel_type,
      customer_type: customer_type,
      weight: parcel.weight,
      packaging: isPackagingChecked ? 1 : 0,
      min_price: isMinPriceChecked ? 1 : 0,
    })
      .then(({ data }) => {
        setPrice({
          currency_code: data.prices.currency_code,
          freight_price: data.prices.freight_price,
          delivery_price: data.prices.delivery_price,
          packaging_price: data.prices.packaging_price,
        });
        setPolicyError(false);
      })
      .catch((e) => {
        console.error(e, "<-AddReciever.js");
        setPolicyError(true);
      });
  }, [
    source_country_code,
    receiver.country_code,
    parcel.collection_option,
    parcel_type,
    customer_type,
    parcel.weight,
    isPackagingChecked,
    isMinPriceChecked,
  ]);

  useEffect(() => {
    setReceiver(newReceiver);
  }, [newReceiver]);
  useEffect(() => {
    let UK2GE = false;
    let GE2UK = true;
    console.log(auth.agent.routes);
    for (let i = 0; i < auth.agent.routes.length; i++) {
      if (
        auth.agent.routes[i].destinationCountryCode === "UK" &&
        auth.agent.routes[i].sourceCountryCode === "GE"
      ) {
        GE2UK = true;
        break;
      }
    }
    for (let i = 0; i < auth.agent.routes.length; i++) {
      if (
        auth.agent.routes[i].destinationCountryCode === "GE" &&
        auth.agent.routes[i].sourceCountryCode === "UK"
      ) {
        UK2GE = true;
        break;
      }
    }
    if (UK2GE && GE2UK) {
      setReceiver({ ...newReceiver, country_code: "GE" });
    }
  }, []);
  useEffect(() => {
    // console.log(image, "<---image");
    setAlert(true);
  }, [image]);
  useEffect(() => {
    console.log("rewriting occured");
    // console.log(newParcel, "<--newParc");
    if (parcels.length !== 0) {
      console.log("length is 000000");
      const parcel = parcels[index];
      setParcel({ ...newParcel, ...parcel });
    } else {
      console.log("length is 000000");
      setParcel({ ...newParcel });
    }
  }, [newParcel]);

  useEffect(() => {
    if (parcels[index]?.invoiceHash !== undefined) {
      setImageHash(parcels[index].invoiceHash);
    }
  }, [parcel]);
  const receiveLabels = [
    // "Receiver name",
    "Receiver phone",
    "Receiver Email",
    // "Receiver address country code",
    "Receiver addrees line 1",
    "Receiver address line 2",
    "Receiver address postal code",
  ];
  const receiverKeys = [
    // "name",
    "phone",
    "email",
    // "country_code",
    "address_line_1",
    "address_line_2",
    "postal_code",
  ];
  const parcelLabels = [
    // "Tracking number",
    // "weight",
    // "source country code",
    // "destination country code",
    "description",
    "notes",
    "extra charges",
    "price",
  ];
  const parcelKeys = [
    // "tracking_number",
    // "weight",
    // "source_country_code",
    // "destination_country_code",
    "description",
    "notes",
    // "extra_charges",
    // "price",
  ];
  const onChangeReceiver = (name, value) => {
    const newReceiver = { ...receiver, [name]: value };
    setReceiver(newReceiver);
    validateReceiver(newReceiver, name).catch((e) => {});
    setAlert(true);
  };
  const onChangeParcel = (name, value) => {
    const next = { ...parcel, [name]: value };
    setParcel(next);
    console.log(999777666);
    // console.log(next, "<--updated parcel");
    validateParcel(next, name).catch((e) => {});
    setAlert(true);
  };
  // gets called when you click  'Add' button at the bottom of the screen
  const onSave = () => {
    validateReceiver(receiver)
      .finally(() => {
        return validateParcel(parcel);
      })
      .then(() => {
        // POST /cargo/track
        trackingRequest({ tracking_number: parcel.tracking_number })
          .then((r) => alert("This tracking number already exists"))
          .catch((e) => {
            setAlert(false);
            if (index <= parcels.length) {
              const newParcels = parcels.slice();
              const _price = price.freight_price + price.delivery_price;

              newParcels[index] = {
                ...parcel,
                receiver: receiver,
                price: _price,
                ...price,
                invoice: image,
                invoiceHash: imageHash,
                packaging: isPackagingChecked ? 1 : 0,
                min_price: isMinPriceChecked ? 1 : 0,
                isBooking: isBooking,
                bookindIdToSend: bookindIdToSend,
                itemIdToSend: itemIdToSend,
              };
              setParcels(newParcels);
              // console.log(newParcels, "<---here is the data")
            }

        

            setNewParcel({
              description: "Clothes",
              item_price: 75,
              item_currency_code: "EUR",
              collection_option: "OFFICE",
            });
            setIsBooking(false);
            navigation.goBack();
          });
      })
      .catch((e) => {
        return validateParcel(parcel);
      });
  };
  // gets called whe you click 'Scan' button
  const goToScanner = () => {
    navigation.navigate("cameraScanner", {
      scanOnce: true,
      callback: (number) => {
        const next = { ...parcel, tracking_number: number };
        validateParcel(next, "tracking_number").then(() => setParcel(next));
      },
    });
  };
  return (
    <>
      <PreventGoingBack
        navigation={navigation}
        shouldAlert={shouldAlert}
        title="You haven't saved"
        paragraph="Sure you want to go back?"
      />
      <ScrollView style={[s.container, s.bgWhite, s.p3, s.flex1]}>
        <View>
          <SafeAreaView>
            <InputAutoComplete
              name="name"
              value={receiver.name}
              error={receiverErrors.name}
              // label={label}
              placeholder="Receiver name"
              // onChangeText={onChange}
              onChangeText={onChangeReceiver}
              setUser={setReceiver}
              validate={validateReceiver}
              // enabling this causes fields to not appear
              // gotHereFromBooking={gotHereFromBooking}
            />
          </SafeAreaView>
          <View style={[s.formGroup]}>
            {/* this form renders 'Reciver phone', 'Reciever email', 'Reciever address line1', 'Reciever address line 2'
             and 'Reciver addres postal code' */}
            <Form
              labels={receiveLabels}
              keys={receiverKeys}
              receiver={receiver}
              errors={receiverErrors}
              onChange={onChangeReceiver}
            />
            <View style={[s.formGroup]}>
              <DestinationRoutesDropdown
                name="country_code"
                onSelect={onChangeReceiver}
                error={receiverErrors.country_code}
                selectedValue={receiver.country_code}
                placeholder={`Receiver address country code: ${
                  receiver.country_code === undefined
                    ? ""
                    : receiver.country_code
                }`}
              />
            </View>
          </View>
          {/* i don't know what first Divider is for, deleting this changes nothing */}
          <Divider />

          <Divider style={{ marginBottom: 10 }} />
          <View style={[s.formGroup]}>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 2, marginRight: 5 }}>
                <InputWithError
                  error={parcelErrors.tracking_number}
                  name="tracking_number"
                  placeholder="Tracking number"
                  onChangeText={onChangeParcel}
                  value={parcel.tracking_number}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text></Text>
                <Button onPress={goToScanner} style={{}}>
                  Scan
                </Button>
              </View>
            </View>
            {/* {console.log(parcel, "<---parcel")} */}
            {/* inside this view is shown Wieght, Price and currency inputs*/}
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 2, marginRight: 2 }}>
                <InputWithError
                  error={parcelErrors.weight}
                  name="weight"
                  placeholder="Weight"
                  onChangeText={onChangeParcel}
                  value={
                    parcel.weight ? parcel.weight.toString() : parcel.weight
                  }
                />
              </View>
              <View style={{ flex: 1, marginHorizontal: 3 }}>
                <InputWithError
                  error={parcelErrors.item_price}
                  name="item_price"
                  placeholder="Price"
                  onChangeText={onChangeParcel}
                  value={
                    parcel.item_price
                      ? parcel.item_price.toString()
                      : parcel.item_price
                  }
                  isNumber
                />
              </View>
              <View style={{ flex: 1, marginLeft: 3 }}>
                <InputWithError
                  error={parcelErrors.item_currency_code}
                  name="item_currency_code"
                  placeholder="Currency"
                  onChangeText={onChangeParcel}
                  value={parcel.item_currency_code}
                />
              </View>
            </View>
            {/* this form renders 'Clothes' and 'Notes' input fields */}
            <Form
              labels={parcelLabels}
              keys={parcelKeys}
              receiver={parcel}
              errors={parcelErrors}
              onChange={onChangeParcel}
            />
            <Divider />
            <Divider style={{ marginVertical: 10 }} />
            <Text>Add new extra charge</Text>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 2 }}>
                <InputWithError
                  name="note"
                  placeholder="Note"
                  onChangeText={onExtraChange}
                  value={extra.note}
                />
              </View>
              <View style={{ flex: 1, marginHorizontal: 3 }}>
                <InputWithError
                  name="amount"
                  placeholder="Amount"
                  onChangeText={onExtraChange}
                  value={extra.amount.toString()}
                  isNumber
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text></Text>
                <Button onPress={onAdd} style={{}}>
                  Add
                </Button>
              </View>
            </View>
            {/* is resposible for rendering extra charges you enter */}
            {/* <ExtraChargesList
              extra_charges={parcel.extra_charges}
              removeExtraCharge={removeExtraCharge}
            /> */}
            <RadioButtonGroup
              label="Delivery Option"
              onValueChange={onChangeParcel}
              val={parcel.collection_option}
              values={["HOME", "OFFICE"]}
              name="collection_option"
              checkLabels={["Home", "Office"]}
            />
            {/* add packaging checkbox button, price is 1pound per package */}
            {/* add minimum price application/dissaplication checkbox button */}
            {/* <CheckBox name="Courier" /> */}
            {/* price for packagin: 1 pound for each parcel */}
            <CheckBox
              disabled={!canPackagingPrice}
              name="Packaging"
              isChecked={isPackagingChecked}
              setChecked={setPackagingChecked}
            />
            {/* minimum price is set at 10 pounds for 3 kg*/}
            <CheckBox
              disabled={!canMinimumPrice}
              name="minimum price"
              isChecked={isMinPriceChecked}
              setChecked={setMinPriceChecked}
            />
            <View style={{ marginBottom: 5 }}>
              {requestingPrice ? (
                <ActivityIndicator animating={requestingPrice} />
              ) : (
                <>
                  {policyError ? (
                    source_country_code === receiver.country_code ? (
                      <Text style={{ color: "red" }}>
                        same country codes are choose on both pages
                      </Text>
                    ) : (
                      <Text>
                        No route policy found for current setting, please adjust
                        inputs or contact administrator
                      </Text>
                    )
                  ) : (
                    <>
                      <Chip style={{ marginBottom: 5, marginTop: 10 }}>
                        {`Freight price: ${price.freight_price} ${price.currency_code}`}
                      </Chip>
                      <Chip>
                        {`Delivery price: ${price.delivery_price} ${price.currency_code}`}
                      </Chip>
                      <Chip>
                        {`Packaging price: ${price.packaging_price} ${price.currency_code}`}
                      </Chip>
                    </>
                  )}

                  {/* && (
                    <Text>
                      No route policy found for current setting, please adjust
                      inputs or contact administrator
                    </Text> */}
                  <ExtraChargesList
                    pickupScreen={true}
                    extra_charges={parcel.extra_charges}
                    removeExtraCharge={removeExtraCharge}
                  />
                </>
              )}
            </View>
          </View>
        </View>
        <View style={[s.formGroup, s.pb3]}>
          <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
            {imageHash.length !== 0
              ? imageHash.map(function (hash) {
                  return (
                    <Image
                      style={{
                        width: 50,
                        height: 50,
                        borderWidth: 1,
                        borderColor: "black",
                        marginRight: 5,
                        marginBottom: 5,
                      }}
                      source={{ uri: hash }}
                    />
                  );
                })
              : null}
          </View>

          {/* {console.log(parcel, "<----hashes")} */}
          <UploadInvoice
            image={image}
            setImage={setImage}
            imageHash={imageHash}
            setImageHash={setImageHash}
          />

          <BookDetailsButton
            bookCountry={bookCountry}
            isBooking={!isBooking}
            itemsInfo={itemsInfo}
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
          />
          <Button
            onPress={onSave}
            disabled={policyError}
            loading={requestingTracking}
          >
            Add
          </Button>
        </View>
      </ScrollView>
    </>
  );
};

// this componenet renders many input fields at once instead of
// having to create each of them manually
const Form = ({ labels, keys, receiver, onChange, errors = {} }) => {
  return (
    <>
      {keys.map((key, i) => (
        <InputWithError
          name={key}
          key={"receiver_" + key}
          placeholder={labels[i]}
          onChangeText={onChange}
          error={errors[key]}
          value={receiver[key] ? receiver[key].toString() : ""}
          // label={label}
          isNumber={key === "price" || key === "weight"}
        />
      ))}
    </>
  );
};

export default AddReciever;
