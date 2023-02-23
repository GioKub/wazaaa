import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, Alert } from "react-native";
// import useRequest from "../../../hooks/useRequest.js";
import InputWithError from "../../../components/atoms/InputWithError";
import Button from "../../../components/atoms/Button";
import updateCustomer from "../../../requests/updateCustomer";
import useRequest from "../../../hooks/useRequest.js";
import useValidation from "../../../hooks/useValidation.js";
import UpdateCustomerAddressValidations from "./updateCustomerAddressValidation";
import getClientAddress from "../../../requests/getClientAddress";
import updateClientAddress from "../../../requests/updateClientAddress";
import SelectDropdown from "../../../components/atoms/SelectDropdown";

import { AuthContext } from "../../../context";

function UpdateCustomerAddressScreen({ navigation }) {
  const { auth, setAuth } = useContext(AuthContext);
  // console.log(auth.agent);
  const [update, updating] = useRequest(updateClientAddress);
  const [getAddr] = useRequest(getClientAddress);
  const [customerData, setCustomerData] = useState({
    address_country_code: "",
    address_line_1: "",
    address_line_2: "",
    address_postal_code: "",
    name: auth.agent.name,
    phone: auth.agent.phone,
    email: auth.agent.email,
  });

  useEffect(() => {
    getAddr()
      .then((r) => {
        // if r.data.addresses.length===0
        setCustomerData({
          address_country_code: r.data.addresses[0].address_country_code,
          address_line_1: r.data.addresses[0].address_line_1,
          address_line_2: r.data.addresses[0].address_line_2,
          address_postal_code: r.data.addresses[0].address_postal_code,
          name: auth.agent.name,
          phone: auth.agent.phone,
          email: auth.agent.email,
        });
      })
      .catch((err) => {
        console.log(err, 123);
      });
  }, []);

  const { validate, errors, addErrors } = useValidation(
    UpdateCustomerAddressValidations
  );

  const countriesList = [
    { label: "United Kingdom", value: "UK" },
    { label: "Georgia", value: "GE" },
    { label: "Ireland", value: "IE" },
    { label: "Sweden", value: "SE" },
  ];

  const onChange = (name, text) => {
    // reason i can't set it using useState and then validate is that
    // useState needs time to muatet and it thinks there are no ltters when
    // there is 1 character
    const newCustomerData = { ...customerData, [name]: text };
    // console.log(newCustomerData);
    setCustomerData(newCustomerData);
    validate(newCustomerData, name).catch((error) => {
      console.error(error, "<--this is validation sadsaderror");
    });
  };

  const finalUpdate = () => {
    validate(customerData)
      .then(() => {
        // console.log(auth.agent.name);
        // console.log(customerData, "<---customer");
        // console.log(
        //   auth.agent.name,
        //   auth.agent.phone,
        //   auth.agent.email,
        //   13213123
        // );
        update(customerData)
          .then((data) => {
            alert("address updated sucesfully");
            navigation.navigate("customerNavigator");
            // Alert.alert(
            //   "Profile updated sucessfuly ",
            //   "you will be logged out",
            //   [],
            //   {
            //     onDismiss: () =>
            //       setAuth({
            //         is_logged_in: false,
            //         accessToken: null,
            //         agent: { privileges: [] },
            //         isLoading: false,
            //       }),
            //     cancelable: true,
            //   }
            // );
          })
          .catch((err) => {
            Alert.alert("Error occured please try again ", "", [], {
              onDismiss: () => navigation.goBack(),
              cancelable: true,
            });
            console.error(err, "13123");
          });
      })
      .catch((err) => {
        console.log(err, "<--validation error 99");
      });
  };
  //   console.log(auth);
  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <SelectDropdown
          list={countriesList}
          name="address_country_code"
          onSelect={onChange}
          selectedValue={customerData.address_country_code}
          placeholder="Choose Source Country"
        />
        <InputWithError
          name="address_line_1"
          error={errors.name}
          value={customerData.address_line_1}
          label="Address Line 1"
          placeholder={auth.agent.name}
          onChangeText={onChange}
          style={styles.field}
        />

        <InputWithError
          name="address_line_2"
          error={errors.username}
          value={customerData.address_line_2}
          label="Address Line 2"
          placeholder={auth.agent.email}
          onChangeText={onChange}
          style={styles.field}
        />
        <InputWithError
          name="address_postal_code"
          error={errors.phone}
          value={customerData.address_postal_code}
          label="Postal Code"
          placeholder={auth.agent.email}
          onChangeText={onChange}
          style={styles.field}
        />
        <Button onPress={finalUpdate} loading={updating} style={styles.field}>
          Update
        </Button>
      </View>
      <View style={styles.elasticBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    //makes login whole login page white
    backgroundColor: "white",
  },
  formGroup: {
    flex: 4,
    //makes form be verticllay cented on screen between the logo and bottom of the screen
    justifyContent: "center",
  },
  field: {
    //defines space between fileds in the form
    margin: 5,
  },
  elasticBottom: {
    flex: 2,
  },
});

export default UpdateCustomerAddressScreen;
