import React from "react";
import { FlatList } from "react-native";
import { Paragraph, Chip } from "react-native-paper";

const ExtraChargesList = ({
  pickupScreen,
  extra_charges = [],
  removeExtraCharge: rm = () => {},
  disabled = false,
  style,
}) => {
  const renderItem = ({ item, index }) => {
    // ternary operator is used to return differnet versions of chip on different cases, cases being extra charges added from extra charges screen and addrecivere screen, from extra cahrges creen i don't want chip to have X button, and from addReciever screen i want them to have, if screen is pickupScreen(addReciver) or extra charges is told to this screen using 'pikcupScreen' prop, if it is it is passed down as true otheriwse as false from corespsonding screens
    return pickupScreen ? (
      <Chip
        onClose={() => rm(index)}
        mode="outlined"
        style={style ? style : { marginRight: 3 }}
        disabled={disabled}
      >
        {`${item.note}: ${item.amount}`}
      </Chip>
    ) : (
      <Chip
        // onClose={() => rm(index)}
        mode="outlined"
        style={style ? style : { marginRight: 3 }}
        disabled={disabled}
      >
        {`${item.note}: ${item.amount}`}
      </Chip>
    );
  };
  return extra_charges.length > 0 ? (
    <FlatList
      style={{ marginTop: 5 }}
      data={extra_charges}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      horizontal
    />
  ) : (
    <Paragraph> No Extra Charges </Paragraph>
  );
};

export default ExtraChargesList;
