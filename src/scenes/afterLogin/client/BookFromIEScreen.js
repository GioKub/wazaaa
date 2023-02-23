import React, { useState, useEffect } from "react";
import { ScrollView, View, Text, TextInput } from "react-native";
import InputWithError from "../../../components/atoms/InputWithError.js";
import PreventGoingBack from "../../../components/atoms/PreventGoingBack.js";
import useValidation from "../../../hooks/useValidation.js";
import senderDataValidations from "../agent/pickup-item/PickupItemValidations.js";
import PickDateButton from "./PickDateButton.js";
import ButtonWrapper from "../../../components/atoms/Button.js";
import SelectDropdown from "../../../components/atoms/SelectDropdown.js";
import BookCheckBox from "../../../components/atoms/BookCheckbox.js";
import useRequest from "../../../hooks/useRequest.js";
import BookCourierRequest from "../../../requests/bookCourierRequest.js";

const BookFromIEScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const { errors, validate, hasErrors } = useValidation(senderDataValidations);
  const [parcels, setParcels] = useState([]);
  const [sender, setSender] = useState({});
  const [shouldAlert, setAlert] = useState(false);
  const [dateChoosen, setDateChoosen] = useState(undefined);
  const [tNc, setTnC] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [book] = useRequest(BookCourierRequest);

  //error msgs
  const [tncErrMsg, setTncErrMsg] = useState(false);
  const [dateErrMsg, setDateErrMsg] = useState(false);

  const [globalSettings, setGlobal] = useState({
    source_country: "IE",
    parcel_count: "1",
  });

  useEffect(() => {
    if (dateChoosen !== undefined) {
      setDateErrMsg(false);
    }
  }, [dateChoosen]);

  const ParcelCount = [
    { label: "One 1", value: "1" },
    { label: "Two 2", value: "2" },
    { label: "Three 3", value: "3" },
    { label: "Four 4", value: "4" },
    { label: "More", value: "MORE" },
  ];
  const countriesList = [{ label: "United Kingdom", value: "UK" }];

  const onChangeParcel = (name, value) => {
    setGlobal({ ...globalSettings, [name]: value });
    console.log(name, value);
  };
  const labels = [
    "Sender addrees line 1",
    "Sender address line 2",
    "Sender address postal code",
  ];
  // keys used to as property names to acces values inside 'sender' object
  const keys = ["address_line_1", "address_line_2", "postal_code"];

  useEffect(() => {
    if (parcels.length > 0) {
      console.log("useEffect got called inside PickupItemScreen.js");
      // console.log(parcels, "<--PickupItemScreen.js");
      setAlert(true);
    }
  }, [parcels.length]);

  const onChange = (name, value) => {
    if (name === "name") {
    } else {
    }

    // e.g. [name]: value "address_line_2": "333"
    const newSender = { ...sender, [name]: value };
    setSender(newSender);

    setAlert(true);
    validate(newSender, name).catch((e) => {});
  };

  const onPress = () => {
    if (dateChoosen === undefined) {
      setDateErrMsg(true);
    }
    if (!tNc) {
      setTncErrMsg(true);
    }
    console.log("data should be sent now");
  };

  const container = {
    flex: 1,
    backgroundColor: "white",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 30,
    marginBottom: 30,
    // borderWidth: 5,
    // borderColor: "red",
  };
  return (
    <>
      <PreventGoingBack navigation={navigation} shouldAlert={shouldAlert} />
      <ScrollView
        style={container}
        // contentContainerStyle={{}}
      >
        {/* <TermsCoButton /> */}
        <View
          style={{
            // borderWidth: 5,
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <SelectDropdown
            list={countriesList}
            name="source_country"
            onSelect={onChangeParcel}
            selectedValue={globalSettings.source_country}
            placeholder="Choose Source Country"
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
          <SelectDropdown
            list={ParcelCount}
            name="parcel_count"
            onSelect={onChangeParcel}
            selectedValue={globalSettings.parcel_count}
            placeholder="How many parcels have you got?"
          />
          <InputWithError
            name={"sender_weight"}
            //   value={sender[key]}
            //   error={errors[key]}
            placeholder={"ex. 15kg"}
            label={"Parcel(s) Weight"}
            //   onChangeText={onChange}
            //   key={"sender_" + key}
          />
          <InputWithError
            name={"sender_dimensions"}
            //   value={sender[key]}
            //   error={errors[key]}
            placeholder={"ex. 1ftx2ft"}
            label={"Parcel(s) Dimensions"}
            //   onChangeText={onChange}
            //   key={"sender_" + key}
          />
          <InputWithError
            style={{ marginBottom: 10 }}
            name={"sender_content"}
            //   value={sender[key]}
            //   error={errors[key]}
            placeholder={"ex. clothes, 300GBP"}
            label={"Parcel(s) Content and Parcel(s) Value"}
            //   onChangeText={onChange}
            //   key={"sender_" + key}
          />
          <TextInput
            // style={styles.input}
            // onChangeText={onChangeNumber}
            // value={number}

            style={{ borderWidth: 1, borderRadius: 10 }}
            multiline={true}
            numberOfLines={5}
            placeholder="Write as many recipients as many parcels you have"
          />
          {dateChoosen !== undefined ? (
            <Text style={{ textAlign: "center", padding: 5, fontSize: 20 }}>
              Courier Will Arrive At:
              {" " +
                dateChoosen
                  .toString()
                  .substr(0, dateChoosen.toString().indexOf(" 12:00"))}{" "}
            </Text>
          ) : null}
          <PickDateButton
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            emailToBookWith={"sadasd"}
            setDateChoosen={setDateChoosen}
          />

          {dateErrMsg ? (
            <Text style={{ color: "red", alignSelf: "center" }}>
              You need to Choose Courier Arrival Date
            </Text>
          ) : null}
          <View
            style={{
              flexDirection: "row",
              //   justifyContent: "center",
              marginTop: 10,
              //   marginRight: 50,
            }}
          >
            <BookCheckBox />

            <Text
              style={{ paddingBottom: 20, fontWeight: "700", marginLeft: 5 }}
            >
              Deliver Package to Home Address
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
            }}
          >
            <BookCheckBox
              isChecked={tNc}
              setChecked={() => {
                !tNc && !accepted
                  ? navigation.navigate("TermsCoScreen", {
                      navigation: navigation,

                      setTnC: setTnC,
                      setAccepted: setAccepted,
                      setTncErrMsg: setTncErrMsg,
                    })
                  : !tNc && accepted
                  ? (setTnC(true), setTncErrMsg(false))
                  : setTnC(false);
              }}
            />
            {console.log(tNc, accepted)}
            <Text style={{ fontWeight: "700", marginLeft: 5 }}>
              {"I agree to "}

              <Text
                onPress={() => {
                  !tNc && !accepted
                    ? navigation.navigate("TermsCoScreen", {
                        navigation: navigation,

                        setTnC: setTnC,
                        setAccepted: setAccepted,
                      })
                    : !tNc && accepted
                    ? (setTnC(true), setTncErrMsg(false))
                    : setTnC(false);
                }}
                style={{ color: "red" }}
              >
                terms & conditions
              </Text>
            </Text>
          </View>
          {console.log(tncErrMsg, "erro")}
          {tncErrMsg ? (
            <Text style={{ color: "red", alignSelf: "center" }}>
              You need to Agree With Terms and conditions
            </Text>
          ) : null}
          <ButtonWrapper
            onPress={onPress}
            style={{ backgroundColor: "#198754" }}
          >
            Save
          </ButtonWrapper>
        </View>
      </ScrollView>
    </>
  );
};

export default BookFromIEScreen;
