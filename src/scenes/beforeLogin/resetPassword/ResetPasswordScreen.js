import React, { useState } from "react";
import ResetPasswordScreenValidation from "./ResetPasswordScreenValidations.js";
import InputWithError from "../../../components/atoms/InputWithError.js";
import useRequest from "../../../hooks/useRequest.js";
import useValidation from "../../../hooks/useValidation.js";
import resetPasswordRequest from "../../../requests/password.js";
import Button from "../../../components/atoms/Button.js";
import { View, StyleSheet, Alert } from "react-native";

//make it more beautiful and add validation for email
const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState({ email: "" });
  const [request, requesting] = useRequest(resetPasswordRequest);
  const { validate, errors, addErrors } = useValidation(
    ResetPasswordScreenValidation
  );

  const showAlert = () =>
    Alert.alert(
      "If we have email in database we will send you password change link!",
      "Click anywhere on the screen to return to login page",
      [],
      {
        cancelable: true,
        onDismiss: () => navigation.navigate("Login"),
      }
    );

  const onChangeText = (name, text) => {
    const newEmail = { ...email, [name]: text };
    setEmail(newEmail);
    validate(newEmail, name).catch((error) => {
      //console.error(error, "111111");
    });
  };

  const ResetPassword = () => {
    validate(email)
      .then(
        request({ ...email, remember_token: true })
          .then((data) => {
            showAlert();
          })
          .catch((error) => {
            //error.response.data.message
            //console.error(error, "axios error 2222");
          })
      )
      .catch((error) => {
        //console.error(error, "2222");
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <InputWithError
          name="email"
          error={errors.email}
          value={email.email}
          label="Please enter your email"
          placeholder="your email here"
          onChangeText={onChangeText}
          style={styles.field}
        />

        <Button
          onPress={ResetPassword}
          loading={requesting}
          style={styles.field}
        >
          Register
        </Button>
      </View>
      <View style={styles.elasticBottom} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
  },
  formGroup: {
    flex: 4,
    justifyContent: "center",
  },
  field: {
    margin: 5,
  },
  elasticBottom: {
    flex: 2,
  },
});

export default ResetPasswordScreen;
