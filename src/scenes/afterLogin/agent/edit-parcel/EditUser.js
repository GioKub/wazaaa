import React, { useEffect, useState } from "react";
import { View, ScrollView } from "react-native";
import BootstrapStyleSheet from "react-native-bootstrap-styles";
// components from "../../../../componenets/atoms"
import InputWithError from "../../../../components/atoms/InputWithError";
import Button from "../../../../components/atoms/Button.js";
import PreventGoingBack from "../../../../components/atoms/PreventGoingBack.js";
// hook componenets
import useValidation from "../../../../hooks/useValidation.js";
// validation componenets
import receiverValidations from "./receiverValidations.js";
import senderValidations from "./senderValidations.js";

const bootstrapStyleSheet = new BootstrapStyleSheet();
const { s, c } = bootstrapStyleSheet;

const EditUser = ({
  navigation,
  route: {
    params: { user: oldUser, parcel, type, setParcel, setAlert },
  },
}) => {
  const [user, setUser] = useState(oldUser);
  const [isValidating, setValidating] = useState(false);
  const [changed, setChanged] = useState(false);
  const { errors, validate, hasErrors } = useValidation(
    type === "Sender" ? senderValidations : receiverValidations
  );

  useEffect(() => {
    setUser(oldUser);
  }, [oldUser]);
  const labels = [
    "name",
    "phone",
    "email",
    "addrees line 1",
    "address line 2",
    "address postal code",
  ];
  const keys = [
    "name",
    "phone",
    "email",
    "address_line_1",
    "address_line_2",
    "postal_code",
  ];
  // "country_code",

  const onChange = (name, value) => {
    const newUser = { ...user, [name]: value };
    setUser(newUser);
    validate(newUser, name).catch((e) => {});
    setAlert(true);
    // using setChanged it knows that something has changed so it will
    // alert "Sure you want to go back?" when trying to leave without clicking save
    setChanged(true);
  };

  // gets called when you clikc 'Save' button
  const onSave = () => {
    setValidating(true);
    validate(user)
      .then((r) => {
        setChanged(false);
        // if type prop passed down from EditParcel.js is sender it only updates
        // parcel.sender otherwise it updates parcel.reciever
        if (type === "Sender") setParcel({ ...parcel, sender: user });
        else setParcel({ ...parcel, receiver: user });
        navigation.goBack();
      })
      .catch((e) => {
        console.error(e, "<-validation error inside EditUser.js");
      })
      .finally(() => setValidating(false));
  };
  return (
    <View style={[s.container, s.bgWhite, s.p3, s.flex1]}>
      <PreventGoingBack
        navigation={navigation}
        shouldAlert={changed}
        title="You haven't saved"
        paragraph="Sure you want to go back?"
      />
      <View style={[s.formGroup]}>
        {keys.map((key, i) => {
          const val = user[key];
          const isNumber = Number.isInteger(val);
          return (
            // this is responsible for showin all the inputs
            <InputWithError
              // label={label}
              name={key}
              error={errors[key]}
              // this is what is shown on top of input fileds
              // and it adds 'Reciver' or 'Sender' in front of word
              placeholder={type + " " + labels[i]}
              value={isNumber && val ? val.toString() : val}
              onChangeText={onChange}
              key={key}
              isNumber={isNumber}
            />
          );
        })}
        <ScrollView></ScrollView>
      </View>
      {/* this is reposnible for showin 'Save' button */}
      <View style={[s.formGroup]}>
        <Button
          onPress={onSave}
          disabled={hasErrors || !changed}
          loading={isValidating}
        >
          Save
        </Button>
      </View>
    </View>
  );
};

export default EditUser;
