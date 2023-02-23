import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, View, Text, TextInput } from "react-native";
import InputWithError from "../../../components/atoms/InputWithError.js";
import PreventGoingBack from "../../../components/atoms/PreventGoingBack.js";
import useValidation from "../../../hooks/useValidation.js";
import BookFromUKValidations from "./BookFromUKValidations.js";
import PickDateButton from "./PickDateButton.js";
import ButtonWrapper from "../../../components/atoms/Button.js";
import SelectDropdown from "../../../components/atoms/SelectDropdown.js";
import BookCheckBox from "../../../components/atoms/BookCheckbox.js";
import useRequest from "../../../hooks/useRequest.js";
import BookCourierRequest from "../../../requests/bookCourierRequest.js";
import getClientAddress from "../../../requests/getClientAddress.js";
import { ActivityIndicator } from "react-native-paper";
import BookItemComponent from "./BookItemComponenet.js";
import RadioButtonGroup from "../../../components/molecules/RadioButtonGroup.js";
import EnterDetailsVaildations from "./enterDetailsValidations.js";
import EnterRecieverValidations from "./EnterReciverValidations.js";
import { isEmail } from "validator";

const BookFromUKScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const { errors, validate, hasErrors } = useValidation(BookFromUKValidations);
  const [parcels, setParcels] = useState([]);
  const [sender, setSender] = useState({});
  const [shouldAlert, setAlert] = useState(false);
  const [dateChoosen, setDateChoosen] = useState(undefined);
  const [tNc, setTnC] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [book, booking] = useRequest(BookCourierRequest);
  const [getAddr] = useRequest(getClientAddress);
  const [pageNum, setPageNum] = useState(0);
  const [items, setItems] = useState([]);
  const [renderCount, setRenderCount] = useState(0);
  const [itemsToRender, setItemsToRender] = useState([]);
  const [defaultDisabled, setDefaultDisabled] = useState(false);
  const [inputsDisabled, setInputsDisabled] = useState(false);
  const [homeCollection, setHomeCollection] = useState(false);
  const [dropOff, setDropOff] = useState(false);
  const [lastCheckbox, setLastCheckbox] = useState("");
  const [serviceErrMsg, setServiceErrMsg] = useState(false);
  const [countriesList, setCountesList] = useState([]);

  const setDropOffHandler = (state) => {
    setDropOff(state);
    setServiceErrMsg(false);
    setLastCheckbox("DropOff");
  };
  const setHomeCollectionHandler = (state) => {
    setHomeCollection(state);
    setServiceErrMsg(false);
    setLastCheckbox("HomeCollection");
  };

  useEffect(() => {
    if (homeCollection === true && dropOff === true) {
      if (lastCheckbox === "HomeCollection") {
        setDropOff(false);
        setHomeCollection(true);
      } else {
        setHomeCollection(false);
        setDropOff(true);
      }
    }
    setGlobal({
      ...globalSettings,
      drop_off: dropOff,
      home_collection: homeCollection,
    });
  }, [dropOff, homeCollection]);

  //error msgs
  const [tncErrMsg, setTncErrMsg] = useState(false);
  const [dateErrMsg, setDateErrMsg] = useState(false);

  const [globalSettings, setGlobal] = useState({
    source_country: "UK",
    visit_date: "",
    parcels_count: "1",
    drop_off: false,
    home_collection: false,
    address_type: "default",
    source_address: {
      name: "",
      email: "",
      phone: "",
      address_country_code: "",
      address_line_1: "",
      address_line_2: "",
      address_postal_code: "",
    },
    address_obj: {
      address_postal_code: "",
      address_line_1: "",
      address_line_2: "",
      address_country_code: "UK",
    },
    items: [
      {
        item: {
          id: "",
          dimensions: "",
          weight: "",
          value: "",
          details: "",
        },
        address: {
          id: "",
          name: "",
          email: "",
          phone: "",
          country_code: "GE",
          line_1: "",
          line_2: "",
          postal_code: "",
        },
        to_be_delivered: false,
        insurance: false,
      },
    ],
  });

  useEffect(() => {
    if (dateChoosen !== undefined) {
      setDateErrMsg(false);
      const date = JSON.stringify(dateChoosen);
      setGlobal({ ...globalSettings, visit_date: date.slice(1, -15) });
    }
  }, [dateChoosen]);

  // useEffect(() => {
  //   getAddr()
  //     .then((data) => {
  //       if (
  //         data.data.addresses[0].address_country_code ===
  //         globalSettings.source_country
  //       ) {
  //         console.log("it is equal, default address set automaticaly");
  //         console.log(
  //           data.data.addresses[0].address_country_code,
  //           globalSettings.source_country
  //         );
  //         const newAddr = { ...globalSettings.address_obj };
  //         newAddr.address_line_1 = data.data.addresses[0].address_line_1;
  //         newAddr.address_line_2 = data.data.addresses[0].address_line_2;
  //         newAddr.address_postal_code =
  //           data.data.addresses[0].address_postal_code;
  //         setGlobal({
  //           ...globalSettings,
  //           address_obj: newAddr,
  //           address_type: "default",
  //         });

  //         setDefaultDisabled(false);
  //       } else {
  //         setDefaultDisabled(true);
  //         setGlobal({
  //           ...globalSettings,
  //           address_obj: {
  //             address_postal_code: "",
  //             address_line_1: "",
  //             address_line_2: "",
  //             address_country_code: "",
  //           },
  //           address_type: "custom",
  //         });
  //       }
  //     })
  //     .catch((err) => {
  //       console.err(err);
  //     });
  // }, [globalSettings.source_country]);

  // this hook sets country to default country choose by user, and created array for it
  useEffect(() => {
    getAddr().then((data) => {
      // this part sets the country code to choose in picker to default country code
      const newAddr = { ...globalSettings.address_obj };
      newAddr.address_line_1 = data.data.addresses[0].address_line_1;
      newAddr.address_line_2 = data.data.addresses[0].address_line_2;
      newAddr.address_postal_code = data.data.addresses[0].address_postal_code;
      setGlobal({
        ...globalSettings,
        address_obj: newAddr,
        source_country: data.data.addresses[0].address_country_code,
      });

      // this one add label for the country code
      const newCountriesList = [];
      if (data.data.addresses[0].address_country_code === "IE") {
        newCountriesList.push({
          label: "Ireland",
          value: data.data.addresses[0].address_country_code,
        });
      } else if (data.data.addresses[0].address_country_code === "UK") {
        newCountriesList.push({
          label: "United Kingdom",
          value: data.data.addresses[0].address_country_code,
        });
      } else if (data.data.addresses[0].address_country_code === "GE") {
        newCountriesList.push({
          label: "Georgia",
          value: data.data.addresses[0].address_country_code,
        });
      } else if (data.data.addresses[0].address_country_code === "SE") {
        newCountriesList.push({
          label: "Sweden",
          value: data.data.addresses[0].address_country_code,
        });
      }

      setCountesList(newCountriesList);
    });
  }, []);

  // this for disabling input field when addrest type is default
  useEffect(() => {
    if (globalSettings.address_type === "default") {
      setInputsDisabled(true);
      // this is to remove error messages under input field
      // if you press enxt on uk page and then move to ie page
      // erros stay despite inputs being filled with defautl addr data
      // altoguht it does cause inputs to immideal trigger erros when you default
      // addres is ie and you go to booking and it's uk and so it's empty but it cathches
      // addrets type as default for a second before it gets set to custom by useffect
      // but that's sacrifice i'm willing to make
      // validate(globalSettings.address_obj)
      //   .then((r) => {
      //     console.log(r, 13123);
      //   })
      //   .catch((e) => {
      //     console.log(e, 1231241902);
      //   });

      // this is so that when you select custom and change some fields
      // it shouldnt save the data and should show default when you click
      // back on default, when it clikcs back on custom it should be clean inputs
      getAddr().then((data) => {
        if (
          data.data.addresses[0].address_country_code ===
          globalSettings.source_country
        ) {
          const newAddr = { ...globalSettings.address_obj };
          newAddr.address_line_1 = data.data.addresses[0].address_line_1;
          newAddr.address_line_2 = data.data.addresses[0].address_line_2;
          newAddr.address_postal_code =
            data.data.addresses[0].address_postal_code;
          setGlobal({
            ...globalSettings,
            address_obj: newAddr,
          });
        }
      });
    } else {
      setGlobal({
        ...globalSettings,
        address_obj: {
          address_postal_code: "",
          address_line_1: "",
          address_line_2: "",
          address_country_code: "",
        },
      });
      setInputsDisabled(false);
    }
  }, [globalSettings.address_type]);

  const onChangeParcel = (name, value) => {
    // console.log(globalSettings.parcels_count, "<------count");
    // setItemsToRender(globalSettings.parcels_count);
    const newGloabl = { ...globalSettings };
    newGloabl.address_obj.address_country_code = value;
    // this updates address_obj.address_country_code
    setGlobal(newGloabl);
    // this updates source_country
    setGlobal({ ...globalSettings, [name]: value });
  };

  const labels = [
    "Sender addrees line 1",
    "Sender address line 2",
    "Sender address postal code",
  ];

  useEffect(() => {
    if (parcels.length > 0) {
      console.log("useEffect got called inside PickupItemScreen.js");
      // console.log(parcels, "<--PickupItemScreen.js");
      setAlert(true);
    }
  }, [parcels.length]);

  const onChange = (name, value) => {
    // setGlobal({ ...globalSettings, [name]: value });
    // e.g. [name]: value "address_line_2": "333"

    if (name === "address_type") {
      setGlobal({ ...globalSettings, [name]: value });
    } else {
      const newGloabl = { ...globalSettings };
      newGloabl.address_obj.address_country_code =
        globalSettings.source_country;
      newGloabl.address_obj[name] = value;
      setGlobal(newGloabl);

      // console.log(newGloabl, "<----newGlobal");
      setAlert(true);
      validate(newGloabl.address_obj, name).catch((e) => {});
    }
  };

  const onChangeParcelCount = (name, value) => {
    const newGloabl = { ...globalSettings };
    newGloabl[name] = value;

    console.log(newGloabl);
    setGlobal(newGloabl);
    validate(newGloabl, name).catch((e) => {});
  };

  const onPress = () => {
    // checks terms and conditions button firts
    if (!tNc) {
      setTncErrMsg(true);
    } else {
      // then checks if date was choosen
      if (dateChoosen === undefined) {
        setDateErrMsg(true);
      } else {
        // then checks data were etnered in the input field if addrest type is custom

        validate(globalSettings.address_obj)
          .then((r) => {
            globalSettings.drop_off = globalSettings.drop_off == false ? 0 : 1 
            globalSettings.home_collection = globalSettings.home_collection == false ? 0 : 1 
            globalSettings.items[0].item.weight = globalSettings.items[0].item.weight == "" ? 0 : globalSettings.items[0].item.weight
            globalSettings.items[0].item.id = globalSettings.items[0].item.id === "" ? 1 : globalSettings.items[0].item.id
            
            // finally checks if parcels_count field is postive integer
            validate(globalSettings, "parcels_count")
              .then((r) => {
                book(globalSettings)
                  .then((data) => {
                    console.log(data.data, "<----data recieved");
                    JSON.stringify(data.data.error) === "true"
                      ? alert(
                          "Can't create booking. All your bookings must be finished"
                        )
                      : (navigation.navigate("customerNavigator"),
                        alert("Courier Booked Sucesfully"));
                  })
                  .catch((err) => {
                    console.error(err);
                  });
              })
              .catch((e) => {
                console.log(e, 1231241902);
              });
          })
          .catch((e) => {});
      }
    }
  };

  const setDate = (date) => {
    if (date < new Date()) {
      alert("Selected date can't be in the past");
    } else {
      setDateChoosen(date);
    }
  };

  const removeItem = (index) => {
    if (renderCount != 1) {
      const items = [...globalSettings.items];
      items.splice(index - 1, 1);

      console.log(renderCount - 1, "<---render Count");

      // goal of this is to set items to updated version
      setGlobal({
        ...globalSettings,
        ["parcels_count"]: (renderCount - 1).toString(),
        ["items"]: items,
      });
      setRenderCount(renderCount - 1);
    }
  };

  useEffect(() => {
    // this loop only gets execued once when you first get on item screen;
    const newItems = [...globalSettings.items];
    for (let N = newItems.length; N < renderCount; N++) {
      newItems.push({
        item: {
          id: "",
          dimensions: "",
          weight: "",
          value: "",
          details: "",
        },
        address: {
          id: "",
          name: "",
          email: "",
          phone: "",
          country_code: "GE",
          line_1: "",
          line_2: "",
          postal_code: "",
        },
        to_be_delivered: false,
        insurance: false,
      });
    }
    setGlobal({ ...globalSettings, items: newItems });
  }, [renderCount]);

  useEffect(() => {
    if (globalSettings.source_country !== "UK") {
      if (pageNum === 1) {
        if (globalSettings.items.length !== 0) {
          let newItems = [];

          for (let index = 1; index <= renderCount; index++) {
            newItems.push(
              <BookItemComponent
                key={index - 1}
                index={index}
                removeItem={removeItem}
                globalSettings={globalSettings}
                setGlobal={setGlobal}
              />
            );
          }
          setItemsToRender(newItems);
        }
      }
    }
  }, [pageNum, renderCount, globalSettings]);

  const UKcomponenets = {
    0: (
      <ScrollView style={{ paddingTop: "5%", paddingBottom: "5%" }}>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginBottom: 10,
            justifyContent: "center",
          }}
        >
          <Text>To choose different source country </Text>
          <Text
            style={{
              color: "red",
              fontWeight: "bold",
            }}
            onPress={() => {
              navigation.navigate("UpdateCustAddr");
            }}
          >
            click here
          </Text>
          <Text>to update address </Text>
        </View>
        <SelectDropdown
          list={countriesList}
          name="source_country"
          onSelect={onChangeParcel}
          selectedValue={globalSettings.source_country}
          placeholder="Choose Source Country"
        />

        <RadioButtonGroup
          label="Address Type"
          onValueChange={onChange}
          val={globalSettings.address_type}
          disabled={defaultDisabled}
          values={["default", "custom"]}
          name="address_type"
          checkLabels={["Default", "Custom"]}
        />
        <InputWithError
          disabled={inputsDisabled}
          name={"address_line_1"}
          value={globalSettings.address_obj["address_line_1"]}
          error={errors["address_line_1"]}
          placeholder={labels[0]}
          onChangeText={onChange}
          key={"sender_" + "address_line_1"}
        />
        <InputWithError
          disabled={inputsDisabled}
          name={"address_line_2"}
          value={globalSettings.address_obj["address_line_2"]}
          error={errors["address_line_2"]}
          placeholder={labels[1]}
          onChangeText={onChange}
          key={"sender_" + "address_line_2"}
        />
        <InputWithError
          disabled={inputsDisabled}
          name={"address_postal_code"}
          value={globalSettings.address_obj["address_postal_code"]}
          error={errors["address_postal_code"]}
          placeholder={labels[2]}
          onChangeText={onChange}
          key={"sender_" + "address_postal_code"}
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
          setDateChoosen={setDate}
        />

        {dateErrMsg ? (
          <Text style={{ color: "red", alignSelf: "center" }}>
            You need to Choose Courier Arrival Date
          </Text>
        ) : null}
        <InputWithError
          name={"parcels_count"}
          value={globalSettings.parcels_count}
          error={errors["parcels_count"]}
          placeholder={"How many parcles do you have?"}
          onChangeText={onChangeParcelCount}
          key={"sender_" + "parcels_count"}
        />
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
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
        {tncErrMsg ? (
          <Text style={{ color: "red", alignSelf: "center" }}>
            You need to Agree With Terms and conditions
          </Text>
        ) : null}

        {booking ? <ActivityIndicator animating={true} /> : null}
        <ButtonWrapper
          disabled={booking}
          onPress={onPress}
          style={{ backgroundColor: "#198754" }}
        >
          Save
        </ButtonWrapper>
      </ScrollView>
    ),
  };

  const IEcomponents = {
    0: (
      <ScrollView
        contentContainerStyle={{
          paddingTop: "5%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginBottom: 10,
            justifyContent: "center",
          }}
        >
          <Text>To choose different source country </Text>
          <Text
            style={{
              color: "red",
              fontWeight: "bold",
            }}
            onPress={() => {
              navigation.navigate("UpdateCustAddr");
            }}
          >
            click here
          </Text>
          <Text>to update address </Text>
        </View>

        <SelectDropdown
          list={countriesList}
          name="source_country"
          onSelect={onChangeParcel}
          selectedValue={globalSettings.source_country}
          placeholder="Choose Source Country"
        />
        <RadioButtonGroup
          label="Address Type"
          onValueChange={onChange}
          val={globalSettings.address_type}
          disabled={defaultDisabled}
          values={["default", "custom"]}
          name="address_type"
          checkLabels={["Default", "Custom"]}
        />
        <InputWithError
          disabled={inputsDisabled}
          name={"address_line_1"}
          value={globalSettings.address_obj["address_line_1"]}
          error={errors["address_line_1"]}
          placeholder={labels[0]}
          onChangeText={onChange}
          key={"sender_" + "address_line_1"}
        />
        <InputWithError
          disabled={inputsDisabled}
          name={"address_line_2"}
          value={globalSettings.address_obj["address_line_2"]}
          error={errors["address_line_2"]}
          placeholder={labels[1]}
          onChangeText={onChange}
          key={"sender_" + "address_line_2"}
        />
        <InputWithError
          disabled={inputsDisabled}
          name={"address_postal_code"}
          value={globalSettings.address_obj["address_postal_code"]}
          error={errors["address_postal_code"]}
          placeholder={labels[2]}
          onChangeText={onChange}
          key={"sender_" + "address_postal_code"}
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
          setDateChoosen={setDate}
        />

        {dateErrMsg ? (
          <Text style={{ color: "red", alignSelf: "center" }}>
            You need to Choose Courier Arrival Date
          </Text>
        ) : null}
        <InputWithError
          name={"parcels_count"}
          value={globalSettings.parcels_count}
          error={errors["parcels_count"]}
          placeholder={"How many parcles do you have?"}
          onChangeText={onChangeParcelCount}
          key={"sender_" + "parcels_count"}
        />

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            marginTop: 10,
            justifyContent: "center",
          }}
        >
          <Text>
            Home collection is when courier visits to your address and Drop Off
            is when you will deliver your parcels to our office.
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            //   justifyContent: "center",
            marginTop: 10,
            //   marginRight: 50,
          }}
        >
          <BookCheckBox
            isChecked={homeCollection}
            setChecked={setHomeCollectionHandler}
          />

          <Text
            style={{
              fontWeight: "700",
              marginLeft: 5,
            }}
          >
            Home Collection
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            //   justifyContent: "center",

            //   marginRight: 50,
          }}
        >
          <BookCheckBox isChecked={dropOff} setChecked={setDropOffHandler} />

          <Text
            style={{
              fontWeight: "700",
              marginLeft: 5,
            }}
          >
            Drop Off
          </Text>
        </View>
        {serviceErrMsg === true ? (
          <View
            style={{
              flexDirection: "row",
              //   justifyContent: "center",
              marginTop: 10,
              //   marginRight: 50,
            }}
          >
            <Text
              style={{
                paddingBottom: 20,
                // fontWeight: "700",
                fontWeight: "bold",
                fontSize: 15,
                marginLeft: 5,
                color: "red",
              }}
            >
              {serviceErrMsg === false
                ? null
                : "You have to choose one of the service type"}
            </Text>
          </View>
        ) : null}
      </ScrollView>
    ),

    1: <ScrollView style={{ flex: 1 }}>{itemsToRender}</ScrollView>,
    2: (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
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
        {tncErrMsg ? (
          <Text style={{ color: "red", alignSelf: "center" }}>
            You need to Agree With Terms and conditions
          </Text>
        ) : null}

        {booking ? <ActivityIndicator animating={true} /> : null}
        <ButtonWrapper
          disabled={booking}
          onPress={onPress}
          style={{ backgroundColor: "#198754" }}
        >
          Save
        </ButtonWrapper>
      </View>
    ),
  };

  return (
    <>
      <PreventGoingBack navigation={navigation} shouldAlert={shouldAlert} />
      <SafeAreaView style={{ flex: 1, padding: 10 }}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignContent: "center",
            backgroundColor: "white",
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          {globalSettings.source_country === "UK"
            ? UKcomponenets[pageNum]
            : IEcomponents[pageNum]}

          {(() => {
            if (globalSettings.source_country !== "UK") {
              console.log("its not fucking UK");
              // if it's not items screen return only 'front' and 'back' buttons
              if (pageNum !== 1) {
                return (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingTop: "5%",
                    }}
                  >
                    <ButtonWrapper
                      onPress={() => {
                        if (pageNum !== 0) {
                          setPageNum(pageNum - 1);
                        } else {
                          navigation.goBack();
                        }
                      }}
                      style={{ backgroundColor: "#607285" }}
                    >
                      Back
                    </ButtonWrapper>

                    <ButtonWrapper
                      onPress={() => {
                        // this is that clicking front button won't redirect you to next scree
                        // where wevertyhing is empty when you are on last screen
                        if (pageNum !== 2) {
                          if (pageNum === 0) {
                            // check addres fields
                            validate(globalSettings.address_obj)
                              .then((r) => {
                                // check date
                                if (dateChoosen === undefined) {
                                  setDateErrMsg(true);
                                } else {
                                  // check service type
                                  if (!homeCollection && !dropOff) {
                                    setServiceErrMsg(true);
                                  } else {
                                    validate(
                                      globalSettings,
                                      "parcels_count"
                                    ).then((r) => {
                                      setRenderCount(
                                        globalSettings.parcels_count
                                      );
                                      setPageNum(pageNum + 1);
                                    });
                                  }
                                }
                              })
                              .catch((e) => {
                                console.log(e, 1231241902);
                              });
                          } else if (pageNum === 1) {
                            console.log("page num is 11111111");
                            const newItems = globalSettings.items;
                            for (
                              let i = 0;
                              i < globalSettings.items.length;
                              i++
                            ) {
                              newItems[i].item.id = i + 1;
                              newItems[i].address.id = i + 1;
                              setGlobal({ ...globalSettings, items: newItems });
                            }
                          } else {
                            setPageNum(pageNum + 1);
                          }
                        }
                      }}
                      style={{ backgroundColor: "#00c9a7" }}
                    >
                      Front
                    </ButtonWrapper>
                  </View>
                );
                // otherwise if it is items screen return only 'front' , 'add item' and 'back' buttons
              } else {
                return (
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingTop: "5%",
                    }}
                  >
                    <ButtonWrapper
                      disabled={booking}
                      onPress={() => {
                        setPageNum(pageNum - 1);
                      }}
                      style={{ backgroundColor: "#607285" }}
                    >
                      Back
                    </ButtonWrapper>
                    <ButtonWrapper
                      disabled={booking}
                      onPress={() => {
                        setRenderCount(parseInt(renderCount) + 1);
                      }}
                    >
                      + Add Item
                    </ButtonWrapper>
                    <ButtonWrapper
                      disabled={booking}
                      onPress={() => {
                        let fullyEntered = true;
                        const newItems = globalSettings.items;

                        for (let i = 0; i < newItems.length; i++) {
                          if (
                            newItems[i].address.name.length === 0 ||
                            newItems[i].address.phone.length === 0 ||
                            newItems[i].address.line_1.length === 0 ||
                            newItems[i].address.postal_code.length === 0
                          ) {
                            fullyEntered = false;
                          }

                          if (newItems[i].address.email.length > 0) {
                            if (!isEmail(newItems[i].address.email)) {
                              fullyEntered = false;
                            }
                          }

                          if (
                            // newItems[i].item.name.length === 0 ||
                            newItems[i].item.weight.length === 0 ||
                            newItems[i].item.dimensions.length === 0 ||
                            newItems[i].item.value.length === 0
                          ) {
                            fullyEntered = false;
                          }
                          if (newItems[i].item.details.length === 0) {
                            fullyEntered = false;
                          }
                        }
                        if (!fullyEntered) {
                          alert(
                            "you must first fill all the required fields to continue "
                          );
                        } else {
                          setPageNum(pageNum + 1);
                        }

                        console.log("11111111111111");
                        for (let i = 0; i < globalSettings.items.length; i++) {
                          newItems[i].item.id = i + 1;
                          // newItems[i].address.id = i + 1;
                          setGlobal({ ...globalSettings, items: newItems });
                        }
                      }}
                      style={{ backgroundColor: "#00c9a7" }}
                    >
                      Front
                    </ButtonWrapper>
                  </View>
                );
              }
            }
          })()}
        </View>
      </SafeAreaView>
    </>
  );
};

export default BookFromUKScreen;
