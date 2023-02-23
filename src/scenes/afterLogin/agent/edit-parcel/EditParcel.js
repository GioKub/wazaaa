import React, { useContext, useState, useEffect } from "react";
import { View, Text, Alert, Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
// context
import AuthContext from "../../../../context/AuthContext.js";
// components from "../../../../components/atoms/"
import InputWithError from "../../../../components/atoms/InputWithError.js";
import Button from "../../../../components/atoms/Button.js";
import SelectDropdown from "../../../../components/atoms/SelectDropdown.js";
import PreventGoingBack from "../../../../components/atoms/PreventGoingBack.js";
// componenets from "../../../../components/molecules/"
import RadioButtonGroup from "../../../../components/molecules/RadioButtonGroup.js";
import SourceRoutesDropdown from "../../../../components/molecules/SourceRoutesDropdown.js";
import DestinationRoutesDropdown from "../../../../components/molecules/DestinationRoutesDropdown.js";
import ExtraChargesList from "../../../../components/molecules/ExtraChargesList.js";
import PaymentDropdown from "../../../../components/molecules/PaymentDropdown.js";
// hooks
import useRequest from "../../../../hooks/useRequest";
import useValidation from "../../../../hooks/useValidation.js";
// requests
import getPictures from "../../../../requests/getPictures.js";
import paymentRequest from "../../../../requests/paymentRequest.js";
import uploadInvoiceRequest from "../../../../requests/uploadInvoiceRequest.js";
import editParcel from "../../../../requests/editParcel.js";
import EditParcelValidations from "./EditParcelValidations.js";
import parcelPaymentInfoRequest from "../../../../requests/parcelPaymentInfoRequest.js";
// rest of the componenets
import UploadHashInvoice from "../pickup-item/uploadHashInvoice.js";
import confirmAlert from "../../../../utils/confirmAlert";

const EditParcel = ({
  navigation,
  route: {
    params: { parcel: oldParcel },
  },
}) => {
  const [requestPictures, stillGettingPictures] = useRequest(getPictures);
  const [paymentInfoRequest, gettinInfo] = useRequest(parcelPaymentInfoRequest);
  const [request, saving] = useRequest(editParcel);
  const [isValidating, setValidating] = useState(false);
  const { errors, validate, hasErrors } = useValidation(EditParcelValidations);
  const { auth } = useContext(AuthContext);
  const [parcel, setParcel] = useState(oldParcel);
  const [shouldAlert, setAlert] = useState(false);
  const [paymentMethod, setMethod] = useState("ONLINE");
  const [extra, setExtra] = useState({ note: "", amount: "" });
  const [payment, paying] = useRequest(paymentRequest);
  const isPaid = oldParcel.payment_status === "PAID";
  const [image, setImage] = useState([]);
  const [upload_invoice, uploading] = useRequest(uploadInvoiceRequest);
  const [hasPictures] = useState(oldParcel.pictures === 1 ? true : false);
  const [pictureHashes, setPictureHashes] = useState([]);

  useEffect(() => {
    if (hasPictures) {
      // get /pictures?tracking_number=${tracking_number}
      requestPictures({
        tracking_number: oldParcel.tracking_number,
      })
        .then((results) => {
          // console.log(results.data.pictures);
          console.log(results.data.pictures.length, "results in lengths");
          setPictureHashes(results.data.pictures);
        })
        .catch((err) => {
          console.error(err, "<--gettingPicutresError");
          setPictureHashes([]);
        });
    }
  }, []);

  useEffect(() => {
    // this is returning error for now
    // POST /cargo/payment/
    paymentInfoRequest({
      tracking_number: parcel.tracking_number,
    })
      .then(({ data: { payment } }) => {
        setMethod(payment.payment_method);
      })
      .catch((e) => {
        console.error(e, "<-ParcelInfoModal.js");
        // setPayment({});
      });
  }, [parcel.tracking_number]);

  const labels = [
    "Tracking number",
    "Weight",
    "Notes",
    "Description",
    "Delivery price",
    "Freight price",
    "Currency code",
    "Discount",
    "Item price",
    "Item price Currency code",
  ];

  // keys used to acces parcel values
  // e.g. parcel.weight
  const keys = [
    "tracking_number",
    "weight",
    // "source_country_code",
    // "destination_country_code",
    // "collection_option", //Radio button
    // "customer_type", //Radio button
    // "parcel_type", //Dropdown
    "notes",
    "description",
    "delivery_price",
    "freight_price",
    "currency_code",
    "discount_amount",
    "item_price",
    "item_currency_code",
  ];

  // used to decide if agent can edit value inside specific input form
  // this values are saved as values under priviliges object properties
  // so react acceses this property using key which is same as parcel key
  // and sees it is true than it gives agent privilidege to edit the inpit
  // form
  const editRoutes = auth.agent.privileges.includes("AMEND_CARGO_ROUTE");
  const editPrices = auth.agent.privileges.includes("AMEND_CARGO_PRICING");
  const editWeight = auth.agent.privileges.includes("AMEND_CARGO_WEIGHT");

  const privileges = {
    tracking_number: false,
    weight: editWeight,
    notes: true,
    description: true,
    sender: editRoutes,
    receiver: editRoutes,
    source_country_code: editRoutes,
    destination_country_code: editRoutes,
    collection_option: editRoutes,
    customer_type: editRoutes,
    parcel_type: editRoutes,
    currency_code: editPrices,
    extra_charges: editPrices,
    freight_price: editPrices,
    delivery_price: editPrices,
    discount_amount: editPrices,
    item_price: true,
    item_currency_code: true,
  };
  // is used to hint that values for these proeprties inisde 'parcel'
  // are numbers so react will know to convert those values to strings
  // to make it possibel to dispaly them as values inside input form
  const numbers = {
    weight: true,
    freight_price: true,
    delivery_price: true,
    discount_amount: true,
    item_price: true,
  };

  const parcelType = [
    { label: "Freight", value: "FREIGHT" },
    { label: "Parcel", value: "PARCEL" },
  ];
  const onChange = (name, value) => {
    // e.g. [name]: value --> currency_code: USA
    const newParcel = { ...parcel, [name]: value };
    setParcel(newParcel);
    setAlert(true);
    validate(newParcel, name).catch((e) => {
      // console.error(e, "<-EditParcel.js Validation");
    });
  };

  // gets called when you click 'Edit Sender' or 'Edit Reciver' button
  const edit = (isSender = false) => {
    navigation.navigate(`Edit ${isSender ? "Sender" : "Receiver"}`, {
      user: isSender ? parcel.sender : parcel.receiver,
      parcel: parcel,
      type: isSender ? "Sender" : "Receiver",
      setParcel: setParcel,
      setAlert: setAlert,
    });
  };
  const saveParcel = () => {
    // alert(JSON.stringify(parcel))
    setValidating(true);
    validate(parcel)
      .then((r) => {
        setValidating(false);
        // POST /cargo/edit
        console.log(
          { ...parcel, invoiceHash: pictureHashes },
          "<-- parcel being sent"
        );
        return request({ ...parcel, invoiceHash: pictureHashes });
      })
      .then((r) => {
        setAlert(false);
        // alert("Saved Successfully");
        Alert.alert(
          "Done",
          "Saved successfully!",
          [{ text: "back", onPress: () => navigation.goBack() }]
          // {cancelable: true}
        );
      })
      .catch((e) => {
        alert("some error occured");
        // alert(e);
        // alert(e.response.data.data.errors);
      });
  };
  const save = () => {
    confirmAlert({
      paragraph: "Are you sure you want to save this data?",
      onConfirm: saveParcel,
    });
  };

  // gets called when you type something ito "Note" or "Amount" form
  const onExtraChange = (name, value) => {
    // e.g [name]: value --> "note": "dasd"
    // e.g extra --> Object {
    //   "amount": "324",
    //   "note": "sdf",
    // }
    setExtra({ ...extra, [name]: value });

    setAlert(true);
  };

  // gets called when you click add button
  const onAdd = () => {
    // if extra 'exists' and extra.amount is not 0 and it is not empty string
    // and axtra.note is not emty string add current object with note and amount proeprties
    // into old list of objcects otherwise do nothing
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
      setAlert(true);
    }
  };

  const removeExtraCharge = (index) => {
    const newExtra = parcel.extra_charges.slice();
    newExtra.splice(index, 1);
    setParcel({ ...parcel, extra_charges: newExtra });
    setAlert(true);
  };

  const changePaymentMethod = (_, value) => {
    setMethod(value);
  };

  const pay = () => {
    // POST /billing/payment/
    // route ends with extra parameter based on what is chosen as payment_method
    payment({
      invoice_ids: [parcel.invoice_id],
      payment_method: paymentMethod,
    })
      .then(() => {
        Alert.alert(
          "Done",
          "Payment success",
          [{ text: "back", onPress: () => navigation.goBack() }]
          // {cancelable: true}
        );
      })
      .catch((e) => {
        alert(e);
        console.error(e);
      });
  };
  const uploadInvoice = () => {
    (async () => {
      for (let i = 0; i < pictureHashes.length; i++) {
        console.log(parcel.invoice_id);
        const v = pictureHashes[i];
        try {
          // POST /cargo/invoice/upload/${invoice_id}
          // console.log(v);
          await upload_invoice({
            invoice_id: parcel.invoice_id,
            invoice: v,
          });
        } catch (error) {
          console.error(error);
        }
      }
    })()
      .then((r) => {
        Alert.alert(
          "Done",
          "Upload success",
          [{ text: "back", onPress: () => navigation.goBack() }]
          // {cancelable: true}
        );
      })
      .catch((e) => {
        alert(e);
      });
  };

  // get's called when you click 'Done' button inside UploadINvoice.js
  const confirmUpload = () => {
    if (pictureHashes.length)
      confirmAlert({
        paragraph: "Are you sure you want to upload these invoices?",
        onConfirm: uploadInvoice,
      });
    else alert("Please Choose an invoice");
  };

  // gets called when you click 'Pay' button
  const confirmPayment = () => {
    confirmAlert({
      paragraph: "Are you sure you want to pay?",
      onConfirm: pay,
    });
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 10 }}>
      <PreventGoingBack
        navigation={navigation}
        shouldAlert={shouldAlert}
        title="You haven't saved"
        paragraph="Sure you want to go back?"
      />
      <ScrollView>
        {keys.map((key, i) => {
          const val = parcel[key];
          const isNumber = numbers[key];
          return (
            <InputWithError
              name={key}
              error={errors[key]}
              // name on top of input
              placeholder={labels[i]}
              value={isNumber && val ? val.toString() : val}
              onChangeText={onChange}
              key={key}
              isNumber={isNumber}
              disabled={!privileges[key]}
            />
          );
        })}
        {/* <ScrollView> */}
        <SelectDropdown
          list={parcelType}
          name="parcel_type"
          onSelect={onChange}
          selectedValue={parcel.parcel_type}
          placeholder="Parcel Type"
          disabled={!privileges.parcel_type}
        />
        <SourceRoutesDropdown
          name="source_country_code"
          onSelect={onChange}
          selectedValue={parcel.source_country_code}
          placeholder="Source country"
          disabled={!privileges.source_country_code}
        />
        <DestinationRoutesDropdown
          name="destination_country_code"
          onSelect={onChange}
          selectedValue={parcel.destination_country_code}
          placeholder="Destination country"
          disabled={!privileges.destination_country_code}
        />
        {/* </ScrollView> */}
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 2, marginRight: 5 }}>
            <PaymentDropdown
              name=""
              onSelect={changePaymentMethod}
              selectedValue={paymentMethod}
              placeholder="Payment method"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text></Text>
            <Button
              style={{ height: 43 }}
              onPress={confirmPayment}
              loading={paying}
              disabled={shouldAlert || isPaid}
            >
              Pay
            </Button>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 2 }}>
            <InputWithError
              name="note"
              placeholder="Note"
              onChangeText={onExtraChange}
              value={extra.note}
              disabled={!editPrices}
            />
          </View>
          <View style={{ flex: 1, marginHorizontal: 3 }}>
            <InputWithError
              name="amount"
              placeholder="Amount"
              onChangeText={onExtraChange}
              value={extra.amount.toString()}
              isNumber
              disabled={!editPrices}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text></Text>
            <Button
              onPress={onAdd}
              disabled={!editPrices || saving || paying}
              style={{ height: 43 }}
            >
              add
            </Button>
          </View>
        </View>
        <View style={{ marginTop: 2 }}>
          <ExtraChargesList
            pickupScreen={true}
            extra_charges={parcel.extra_charges}
            removeExtraCharge={removeExtraCharge}
            disabled={!editPrices}
          />
        </View>
        <RadioButtonGroup
          label="Customer Type"
          onValueChange={onChange}
          val={parcel.customer_type}
          disabled={!privileges.customer_type}
          values={["INDIVIDUAL", "CORPORATE"]}
          name="customer_type"
          checkLabels={["Individual", "Corporate"]}
        />
        <RadioButtonGroup
          label="Collection Option"
          onValueChange={onChange}
          val={parcel.collection_option}
          disabled={!privileges.collection_option}
          values={["HOME", "OFFICE"]}
          name="collection_option"
          checkLabels={["Home", "Office"]}
        />
        <View style={{ flex: 1, flexDirection: "row", flexWrap: "wrap" }}>
          {/* {console.log(pictureHashes, "<---picturehashes")} */}
          {!stillGettingPictures
            ? // ? console.log(pictureHashes.length, "<--length"):
              pictureHashes.map(function (hash) {
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
        <UploadHashInvoice
          fromEditScreen={true}
          image={image}
          setImage={setImage}
          imageHash={pictureHashes}
          setImageHash={setPictureHashes}
          onDone={() => {
            setAlert(true);
          }}
          loading={uploading}
        />
        <Button
          onPress={() => edit(true)}
          disabled={saving || paying || !privileges.sender || uploading}
        >
          Edit Sender
        </Button>
        <Button
          onPress={() => edit(false)}
          disabled={saving || paying || !privileges.receiver || uploading}
          style={{ marginVertical: 5 }}
        >
          Edit Receiver
        </Button>
        <Button
          onPress={save}
          loading={saving || isValidating}
          disabled={hasErrors || !shouldAlert || uploading}
        >
          Save
        </Button>
      </ScrollView>
    </View>
  );
};

export default EditParcel;
