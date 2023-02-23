import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, Alert } from "react-native";
// import useRequest from "../../../hooks/useRequest.js";
import InputWithError from "../../../components/atoms/InputWithError";
import Button from "../../../components/atoms/Button";
import useRequest from "../../../hooks/useRequest";
import changePassword from "../../../requests/changePassword";
import useValidation from "../../../hooks/useValidation";
import changePasswordValidations from "./ChangePasswordValidatons";
import { AuthContext } from "../../../context";

// import loginRequest from "../../../requests/login.js";
// import AuthContext from "../../../context/AuthContext.js";
// import loginScreenValidations from "./LoginScreenValidations.js";
// import useValidation from "../../../hooks/useValidation.js";
// import logoImage from "./logo.png";

const ChangePasswordScreen = ({ navigation }) => {
  const { auth, setAuth } = useContext(AuthContext);
  const [update, updating] = useRequest(changePassword);
  const { validate, errors, addErrors } = useValidation(
    changePasswordValidations
  );

  const [profileData, setProfileData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const onChange = (name, text) => {
    // reason i can't set it using useState and then validate is that
    // useState needs time to muatet and it thinks there are no ltters when
    // there is 1 character
    const newProfileData = { ...profileData, [name]: text };
    setProfileData(newProfileData);
    validate(newProfileData, name).catch((error) => {
      console.error(error, "<--this is validation sadsaderror");
    });
  };

  const updatePassword = () => {
    validate(profileData)
      .then(() => {
        // POST "/auth/update/password"
        update({
          current_password: profileData.currentPassword,
          password: profileData.newPassword,
          confirm_password: profileData.confirmNewPassword,
          token: auth.access_token,
        })
          .then(({ data }) => {
            // response if wrong current password
            if (data.message === "Can't change password") {
              Alert.alert(
                "current password you entered is incorrect please try again",
                "",
                [],
                {
                  cancelable: true,
                }
              );
              // response if invalid token
            } else if (data.message === "Invalid credentials") {
              Alert.alert(
                "invlaid token, please reload the application and try again",
                "",
                [],
                {
                  cancelable: true,
                }
              );
            } else if (data.message === "success") {
              Alert.alert(
                "password updated sucessfuly ",
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
            }
          })
          .catch((err) => {
            console.error(err, "<---asdasd");
          });
      })
      .catch((validationErr) => {});
  };

  return (
    <View style={styles.container}>
      <View style={styles.formGroup}>
        <InputWithError
          name="currentPassword"
          error={errors.currentPassword}
          value={profileData.currentPassword}
          label="Please enter your current password"
          placeholder="Current Password"
          onChangeText={onChange}
          secureTextEntry={true}
          style={styles.field}
        />
        <InputWithError
          name="newPassword"
          error={errors.newPassword}
          value={profileData.newPassword}
          label="Please enter new password"
          placeholder="New Password"
          onChangeText={onChange}
          secureTextEntry={true}
          style={styles.field}
        />
        <InputWithError
          name="confirmNewPassword"
          error={errors.confirmNewPassword}
          value={profileData.confirmNewPassword}
          label="Please repeat new password you entered"
          placeholder="Confrim New Password"
          onChangeText={onChange}
          secureTextEntry={true}
          style={styles.field}
        />
        <Button
          onPress={updatePassword}
          loading={updating}
          style={styles.field}
        >
          Change
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

export default ChangePasswordScreen;
