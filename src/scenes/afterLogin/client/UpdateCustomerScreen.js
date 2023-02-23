import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, Alert } from "react-native";
// import useRequest from "../../../hooks/useRequest.js";
import InputWithError from "../../../components/atoms/InputWithError";
import Button from "../../../components/atoms/Button";
import updateCustomer from "../../../requests/updateCustomer";
import useRequest from "../../../hooks/useRequest.js";
import useValidation from "../../../hooks/useValidation.js";
import UpdateCustomerValidations from "./UpdateCustomerValidations";

// import InputWithError from "../../../components/atoms/InputWithError";
// import Button from "../../../components/atoms/Button";
// import useRequest from "../../../hooks/useRequest";
// import changePassword from "../../../requests/changePassword";
// import useValidation from "../../../hooks/useValidation";
// import changePasswordValidations from "./ChangePasswordValidatons";
import { AuthContext } from "../../../context";

function UpdateCustomerScreen({ navigation }) {
  const { auth, setAuth } = useContext(AuthContext);
  const [update, updating] = useRequest(updateCustomer);
  const [customerData, setCustomerData] = useState({
    name: auth.agent.name,
    phone: auth.agent.phone,
    // email: auth.agent.email,
    username: auth.agent.username,
  });

  const { validate, errors, addErrors } = useValidation(
    UpdateCustomerValidations
  );

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
        // console.log(customerData);
        update(customerData)
          .then((data) => {
            Alert.alert(
              "Profile updated sucessfuly ",
              "you will be logged out",
              [],
              {
                onDismiss: () =>
                  setAuth({
                    is_logged_in: false,
                    accessToken: null,
                    agent: { privileges: [] },
                    isLoading: false,
                  }),
                cancelable: true,
              }
            );
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
        <InputWithError
          name="name"
          error={errors.name}
          value={customerData.name}
          label="Full Name"
          placeholder={auth.agent.name}
          onChangeText={onChange}
          style={styles.field}
        />
        {/* <InputWithError
          name="email"
          error={errors.email}
          value={customerData.email}
          label="Email"
          placeholder={auth.agent.email}
          onChangeText={onChange}
          style={styles.field}
        /> */}
        <InputWithError
          name="username"
          error={errors.username}
          value={customerData.username}
          label="Username"
          placeholder={auth.agent.email}
          onChangeText={onChange}
          style={styles.field}
        />
        <InputWithError
          name="phone"
          error={errors.phone}
          value={customerData.phone}
          label="Phone"
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

export default UpdateCustomerScreen;
