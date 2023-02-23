import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, View, Text, TextInput } from "react-native";
import InputWithError from "../../../../components/atoms/InputWithError.js";
import PreventGoingBack from "../../../../components/atoms/PreventGoingBack.js";
import useValidation from "../../../../hooks/useValidation.js";
import BookFromUKValidations from "../BookFromUKValidations.js";
import ButtonWrapper from "../../../../components/atoms/Button.js";

import BookItemComponent from "../BookItemComponenet.js";

const TestBooking = ({ navigation }) => {
  const { errors, validate, hasErrors } = useValidation(BookFromUKValidations);
  const [parcels, setParcels] = useState([]);

  const [shouldAlert, setAlert] = useState(false);
  const [pageNum, setPageNum] = useState(0);
  const [itemsToRender, setItemsToRender] = useState([]);
  const [renderCount, setRenderCount] = useState(0);

  const [globalSettings, setGlobal] = useState({
    source_country: "UK",
    source_address: {
      name: "",
      email: "",
      phone: "",
      address_country_code: "",
      address_line_1: "",
      address_line_2: "",
      address_postal_code: "",
    },
    parcel_count: "1",
    collection_type: "",
    parcels_weight: "",
    parcels_deminsions: "",
    parcels_content: "",
    address_type: "custom",
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
    if (parcels.length > 0) {
      setAlert(true);
    }
  }, [parcels.length]);

  const onChangeParcelCount = (name, value) => {
    const newGloabl = { ...globalSettings };
    newGloabl[name] = value;
    setGlobal(newGloabl);
    validate(newGloabl, name).catch((e) => {});
  };

  const removeItem = (index) => {
    const items = [...globalSettings.items];
    items.splice(index - 1, 1);

    // goal of this is to set items to updated version
    setGlobal({
      ...globalSettings,
      ["parcel_count"]: (renderCount - 1).toString(),
      ["items"]: items,
    });
    setRenderCount(renderCount - 1);
  };

  useEffect(() => {
    // this loop only gets execued once when you first get on item screen
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
  }, [pageNum, renderCount, globalSettings]);

  const renderComponents = {
    0: (() => {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <InputWithError
            name={"parcel_count"}
            value={globalSettings.parcel_count}
            error={errors["parcel_count"]}
            placeholder={"How many parcles do you have?"}
            onChangeText={onChangeParcelCount}
            key={"sender_" + "parcel_count"}
          />
        </View>
      );
    })(),

    1: <ScrollView style={{ flex: 1 }}>{itemsToRender}</ScrollView>,
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
          {renderComponents[pageNum]}
          {(() => {
            return (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <ButtonWrapper
                  onPress={() => {
                    setPageNum(pageNum - 1);
                  }}
                  style={{ backgroundColor: "#607285" }}
                >
                  Back
                </ButtonWrapper>
                <ButtonWrapper
                  onPress={() => {
                    setRenderCount(parseInt(renderCount) + 1);
                    // setItemsToRender(itemsToRender + 1);
                    // setPageNum(pageNum - 1);
                  }}
                >
                  Add Item
                </ButtonWrapper>

                <ButtonWrapper
                  onPress={() => {
                    setPageNum(pageNum + 1);
                    setRenderCount(globalSettings.parcel_count);
                    if (pageNum === 1) {
                      const newItems = globalSettings.items;
                      for (let i = 0; i < globalSettings.items.length; i++) {
                        newItems[i].item.id = i + 1;
                        newItems[i].address.id = i + 1;
                        setGlobal({ ...globalSettings, item: newItems });
                      }
                      setPageNum(pageNum + 1);
                    }
                  }}
                  style={{ backgroundColor: "#00c9a7" }}
                >
                  Front
                </ButtonWrapper>
              </View>
            );
          })()}
        </View>
      </SafeAreaView>
    </>
  );
};

export default TestBooking;
