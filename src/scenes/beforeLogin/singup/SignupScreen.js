import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Alert,
  StatusBar,
  Platform,
  SafeAreaView,
} from "react-native";
import useRequest from "../../../hooks/useRequest.js";
import SelectDropdown from "../../../components/atoms/SelectDropdown.js";
import InputWithError from "../../../components/atoms/InputWithError.js";
import Button from "../../../components/atoms/Button.js";
import singupRequest from "../../../requests/singup.js";
import singupScreenValidations from "./SignupScreenValidations.js";
import useValidation from "../../../hooks/useValidation.js";
import { ScrollView } from "react-native-gesture-handler";

const Signup = ({ navigation }) => {
  const [user, setUser] = useState({ username: "", password: "" });
  const [request, requesting] = useRequest(singupRequest);
  const { validate, errors, addErrors } = useValidation(
    singupScreenValidations
  );

  const [globalSettings, setGlobal] = useState({
    //right now i have provided hand written manuals, but when
    //these will be empty i have to simulate choosing this valies
    //from dropdown, can't except customer to click on them
    customer_type: "INDIVIDUAL",
    national_id: "GE",
  });

  const onChangeCustomer = (name, value) => {
    setGlobal({ ...globalSettings, [name]: value });
  };

  const onChangeCountry = (name, value) => {
    setGlobal({ ...globalSettings, [name]: value });
  };

  const customerType = [{ label: "Individual", value: "INDIVIDUAL" }];
  const countries = [{ label: "Georgia", value: "GE" }];

  const onChangeText = (name, text) => {
    const newUser = { ...user, [name]: text };
    setUser(newUser);
    validate(newUser, name).catch((error) => {
      //console.error(error, "111111");
    });
  };

  const Register = () => {
    //add national_id, customer_type and want_notifications field
    let final = { ...user, ...globalSettings, ...{ want_notifications: true } };

    validate(final)
      .then(() => {
        request({ ...final, remember_token: true })
          .then(({ data }) => {
            if (data.message === "success") {
              Alert.alert("", "Confirmation Link has been sent to your email", [
                {
                  // since i don't have method inside function it
                  //automatically navigates this way to login screen and shows box there
                  onPress: navigation.navigate("Login"),
                },
              ]);
            } else if (data.message === "Username already exists!") {
              addErrors({
                username: "this username already exists",
              });
              console.error("username already exists");
            } else if (data.message === "Email already exists!") {
              addErrors({
                email: "this email already exists",
              });
            }
          })
          .catch((error) => {
            console.log(error);
            console.log(error.response.data.message, "333333");
          });
      })
      .catch((error) => {
        console.error(error, "44444");
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.formGroup}>
          <InputWithError
            name="name"
            error={errors.name}
            value={user.name}
            label="name"
            placeholder="Full Name"
            onChangeText={onChangeText}
            style={styles.field}
          />
          <InputWithError
            name="email"
            error={errors.email}
            value={user.email}
            label="Email"
            placeholder="Email"
            onChangeText={onChangeText}
            style={styles.field}
          />
          <InputWithError
            name="username"
            error={errors.username}
            value={user.username}
            label="Username"
            placeholder="Username"
            onChangeText={onChangeText}
            style={styles.field}
          />
          <InputWithError
            name="password"
            error={errors.password}
            value={user.password}
            label="Password"
            placeholder="Password"
            //makes letters appear as black circles
            onChangeText={onChangeText}
            secureTextEntry={true}
            style={styles.field}
          />
          <InputWithError
            name="confirm_password"
            error={errors.confirm_password}
            value={user.confirm_password}
            label="Confirm Passwsord"
            placeholder="Confirm Password"
            onChangeText={onChangeText}
            secureTextEntry={true}
            style={styles.field}
          />
          <InputWithError
            name="phone"
            error={errors.phone}
            value={user.phone}
            label="Phone"
            placeholder="Phone"
            onChangeText={onChangeText}
            style={styles.field}
          />
          <SelectDropdown
            //fix style for this it's not centered
            list={customerType}
            name="customer_type"
            onSelect={onChangeCustomer}
            selectedValue={globalSettings.customer_type}
            placeholder="Customer Type"
            style={styles.customerType}
          />
          <SelectDropdown
            //fix style for this it's not centered
            list={countries}
            name="national_id"
            onSelect={onChangeCountry}
            selectedValue={globalSettings.national_id}
            placeholder="Nationality"
            style={styles.customerType}
          />

          <Button onPress={Register} loading={requesting} style={styles.field}>
            Register
          </Button>
        </View>
        <View style={styles.elasticBottom} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    //makes login whole login page white
    backgroundColor: "white",
    paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0,
  },
  formGroup: {
    //flex: 1,
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
  //this changes nothing
  customerType: {
    margin: 30,
  },
});

export default Signup;
