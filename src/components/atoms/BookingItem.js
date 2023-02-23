import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Divider, useTheme } from "react-native-paper";
// components
import AuthContext from "../../context/AuthContext.js";
import { codes } from "../../utils/countries.js";

const C = ({ children, style }) => (
  <Text mode="outlined" style={{ margin: 3, ...style }}>
    {children}
  </Text>
);

const Badge = ({ children, ...props }) => (
  <View {...props}>
    <Text style={props.style.text}>{children}</Text>
  </View>
);

// 'parcel: p' saves params.parcel into p
const BookingItem = ({ booking: p, onClick, i }) => {
  const { auth, setAuth } = useContext(AuthContext);
  const [status, setStatus] = useState();
  const [statusColor, setStatusColor] = useState();
  const { roundness } = useTheme();

  useEffect(() => {
    {
      p.finished === 1 &&
        p.courier_phone !== null &&
        (setStatus("Finished"), setStatusColor("#00FF00"));
    }
    {
      p.finished === 1 &&
        p.courier_phone === null &&
        (setStatus("Canceled"), setStatusColor("#FF0000"));
    }
    {
      p.finished === 0 &&
        p.courier_phone !== null &&
        (setStatus("Handeled"), setStatusColor("#87CEEB"));
    }
    {
      p.finished === 0 &&
        p.courier_phone === null &&
        (setStatus("Pending"), setStatusColor("#FFA500"));
    }
  }, []);

  const container = {
    ...style.container,
    borderRadius: roundness,
    // applies color "#f5f5f5"(white) to every second parcel shorthand
    // it is confusing because second option for color is also white
    // so commenting this changes nothing
    backgroundColor: i % 2 === 1 ? "#f5f5f5" : "white",
  };

  const badge = {
    ...style.badge,
    // makes the background color of badhe green if paid otherwise red
    // backgroundColor: status === "PAID" ? "#a2cc3a" : "#ed1c24",
    backgroundColor: "#a2cc3a",
    // makes the text inside badge white
    text: {
      color: "#fff",
    },
  };

  const paymentBadge = {
    ...style.badge,
    // makes the background color of badge green if paid otherwise red
    // backgroundColor: extrasPaid ? "#a2cc3a" : "#ed1c24",
    backgroundColor: statusColor,
    // makes the text inside badge white
    text: {
      color: "#fff",
    },
  };

  const badgeDefault = {
    ...style.badge,
    // makes badge light shade of gray
    backgroundColor: "#ddd",
    // makes text inside badge black
    text: {
      color: "#000",
    },
  };

  // the way data is presented needs to be fixed
  // let myDate = new Date(p.created_at);
  // // date = date.toLocaleString();

  return (
    // this causes parcel to show full info when clicking on it
    <TouchableOpacity style={container} onPress={() => onClick(p)}>
      <C>
        ㅤㅤㅤㅤㅤㅤㅤㅤㅤBooking ID:{" "}
        <Text style={{ fontWeight: "bold" }}>{p.id}</Text>
      </C>

      <C>
        Country: <Text>{p.ci_address_country_code}</Text>
      </C>
      <C>
        name: <Text style={{ fontWeight: "bold" }}>{p.ci_name}</Text>
      </C>

      <C>phone: {p.ci_phone}</C>
      <C>email: {p.email}</C>

      <C>address line 1: {p.ci_address_line_1}</C>
      <C>address line 2: {p.ci_address_line_2}</C>
      <C>address postal code: {p.ci_address_postal_code}</C>

      <View style={style.badgeContainer}>
        <Badge style={paymentBadge}>{status}</Badge>
        {/* <Badge
          style={{
            ...badgeDefault,
            // makes badge sky color
            backgroundColor: "#1e96cd",
            // makes text inside badge white
            text: { color: "#fff" },
          }}
        >
          234
        </Badge>
        <Badge style={badgeDefault}>{123123} </Badge> */}
      </View>
    </TouchableOpacity>
  );
};

const style = StyleSheet.create({
  //these styles are applied to each shorthand container for each parcel
  container: {
    borderWidth: 1,
    padding: "5%",
    flexWrap: "wrap",
    borderColor: "rgba(0,0,0,0.26)",
    justifyContent: "space-between",
    alignContent: "space-between",
    marginBottom: 5,
  },
  // this styles applies to penidng, pickedup and kg
  // vertically aligned buttons on right of the screen inside each shorhand for parcel
  badgeContainer: {
    // position: "absolute",
    top: 10,
    right: 10,
    display: "flex",
    flexDirection: "row",
  },
  badge: {
    // defines height of each badge
    paddingVertical: 4,
    // defines width of each badge
    paddingHorizontal: 8,
    borderRadius: 50,
    //defines how far each badge should be from eachother
    margin: 2,
    // makes 7 KG text position in the middle of the badge
    alignItems: "center",
  },
  //neither option inside change anything when they are changed
  badgeText: {
    fontSize: 15,
    textTransform: "capitalize",
  },
});

export default BookingItem;
