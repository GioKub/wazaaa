import React, { useEffect, useState } from "react";
import { SafeAreaView, FlatList, Text, TouchableOpacity } from "react-native";
import { useTheme, ActivityIndicator } from "react-native-paper";
// hook components
import useRequest from "../../hooks/useRequest";
// request components
import getUserRequest from "../../requests/getUser";
// rest of the compoenents
import InputWithError from "./InputWithError";

const InputAutoComplete = ({
  gotHereFromBooking,
  value,
  isCustomer,
  setUser,
  validate = async () => {},
  ...props
}) => {
  const [data, setData] = useState([]);
  const [selectedValue, setSelected] = useState();
  const { colors, roundness } = useTheme();
  const [request, requesting] = useRequest(getUserRequest);
  const [firstTime, setFirst] = useState(true);
  console.log(gotHereFromBooking);
  const styles = {
    dropdown: {
      maxHeight: 100,
      borderWidth: 1,
      borderColor: colors.placeholder,
      borderRadius: roundness,
      padding: 5,
      margin: 2,
      marginTop: 5,
      position: "absolute",
      backgroundColor: "white",
      zIndex: 99,
      width: "100%",
      alignSelf: "center",
      top: 60,
    },
  };

  // this get's called when you click any of the option inside list options that
  // appear when you type something into sender_name
  const onPress = (user) => {
    setData([]);
    setSelected(user.name);
    const newUser = { ...user, ...user.address };
    delete newUser.address;
    // console.log(newUser, "<-NewUser from InputAutoComplete.js");
    // setUser is passed down function, original is setSender()
    setUser(newUser);
    // console.log(newUser, "<-newUSer");
    validate(newUser).catch((e) => {
      console.error(e, "<-Validation error from inputAutoCompelte.js");
    });
  };

  //render item works with data that is passed <FlatList/> through 'data' property
  const renderItem = ({ item, index }) => {
    switch (typeof item) {
      // i don't think this ever gets executed
      case "string":
        return <Text>{item}</Text>;

      default:
        return (
          <TouchableOpacity
            style={{
              borderBottomWidth: 1,
              borderBottomColor: "#ddd",
              padding: 15,
            }}
            onPress={() => onPress(item)}
            key={index}
          >
            <Text style={{ fontSize: 15 }}>
              {item.name + ` (${item.address.country_code})`}
            </Text>
          </TouchableOpacity>
        );
    }
  };

  useEffect(() => {
    // it will alwasy be firstTime because it is to true using setState()
    // and only set to false if it's not set to true which is false
    if (!firstTime) {
      // basically if something is written inisde 'Sender Name' input and
      // none of the options from the shown list have been choose yet
      if (value && selectedValue !== value && value.length >= 1)
        // POST /cargo/findInfo
        request({ name: value })
          .then((r) => {
            // if 'isCustomer' prop has been passed down from 'PickupItemScreen'
            // signifying that we are filling data for the sender then
            // display r.data.customers otherweisre r.data.recievers
            const list = isCustomer ? r.data.customers : r.data.receivers;
            const newData = Object.values(list);
            // console.log(newData[0], "<-inputAUtoCompelte.js");
            setData(newData);
          })
          .catch((e) => setData([]));
    } else setFirst(false);
  }, [value]);

  return (
    <>
      <InputWithError value={value} {...props} />
      {/* (if there is r.data.customers or r.data.recievers and it's not empty and there is something
      written isnide sender name input) or 'requesitng' is true   */}
      {(data &&
        value &&
        value !== "" &&
        data.length > 0 &&
        !gotHereFromBooking) ||
      requesting ? (
        <SafeAreaView style={styles.dropdown}>
          {/* if it is still requesting display orange laoding cirlce  */}
          {requesting ? (
            <ActivityIndicator animating={requesting} />
          ) : (
            // if it finshed requesting dispaly data
            // pretty sure error is about this here
            // erorr is not about input fileds but shown psossible values
            //when you type name and possible names and lastnames are shown
            //for suggestion, if 5 suggestion will be shown 5 errors will be shown
            <FlatList
              nestedScrollEnabled={true}
              // 'data' object we passed here gets paased down to 'renderItem' function
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          )}
        </SafeAreaView>
      ) : null}
    </>
  );
};

export default InputAutoComplete;
