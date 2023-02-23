import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useTheme } from "react-native-paper";
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
const ListItem = ({ parcel: p, onClick, i }) => {
  const { auth, setAuth } = useContext(AuthContext);

  // console.log(auth);

  const [hasExtra, setHasExtra] = useState();

  const [extrasPaid, setExtrasPaid] = useState();

  // console.log(p.status);

  // console.log(p);
  useEffect(() => {
    // if agent is logged in and not client
    auth.agent.hasOwnProperty("privileges")
      ? //if p.extra_extra is not empty set hasExtra to true
        p.extra_extra.length !== 0
        ? setHasExtra(true)
        : setHasExtra(false)
      : setHasExtra(false);
  }, [p.extra_extra]);

  useEffect(() => {
    // if agent is logged in and not client
    auth.agent.hasOwnProperty("privileges")
      ? !hasExtra
        ? setExtrasPaid(true)
        : // if all of the extra inside extra_extra has status set to "Paid"
        // set extrasPaid to true otherwise to false
        p.extra_extra.every((extra) => extra.paid === 1)
        ? setExtrasPaid(true)
        : setExtrasPaid(false)
      : setExtrasPaid(false);
  }, [hasExtra]);

  // console.log(p);
  const { roundness } = useTheme();
  const status = p.invoice.payment_status;

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
    backgroundColor: status === "PAID" ? "#a2cc3a" : "#ed1c24",
    // makes the text inside badge white
    text: {
      color: "#fff",
    },
  };

  const extraBadge = {
    ...style.badge,
    // makes the background color of badge green if paid otherwise red
    // backgroundColor: extrasPaid ? "#a2cc3a" : "#ed1c24",
    backgroundColor: extrasPaid ? "#a2cc3a" : "#ed1c24",
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

  const src = codes[p.shipping_specs.route.source_country_code];
  const dst = codes[p.shipping_specs.route.destination_country_code];
  const sender_name = p.shipping_specs.sender_information.name;
  const receiver_name = p.shipping_specs.receiver_information.name;

  let pickup_date = new Date(p.created_at);
  pickup_date = pickup_date.toLocaleString();

  return (
    // this causes parcel to show full info when clicking on it
    <TouchableOpacity style={container} onPress={() => onClick(p)}>
      <View style={style.badgeContainer}>
        {/* extra charges badge */}
        {auth.agent.hasOwnProperty("privileges") ? (
          <Badge style={!hasExtra ? badgeDefault : extraBadge}>
            {/* {console.log(hasExtra)} */}
            {/* {console.log(hasExtra, "<--hasExtra")} */}
            {!hasExtra
              ? "NO EXTRAS"
              : extrasPaid
              ? "EXTRAS PAID"
              : "UNPAID EXTRAS"}
          </Badge>
        ) : null}

        {/* 1st 'payment_status' badge */}
        <Badge style={badge}>{status}</Badge>
        {/* 2nd badge */}
        <Badge
          style={{
            ...badgeDefault,
            // makes badge sky color
            backgroundColor: "#1e96cd",
            // makes text inside badge white
            text: { color: "#fff" },
          }}
        >
          {/* turns for example 'PICKED_UP' into 'PICKED UP'*/}
          {p.status.replace("_", " ")}
        </Badge>
        {/* 3rd 'weight' badge */}
        <Badge style={badgeDefault}>{p.item.weight} KG</Badge>
      </View>
      <C>
        {/* {" "} adds space between */}
        Tracking number:{" "}
        <Text style={{ fontWeight: "bold" }}>{p.tracking_number}</Text>
      </C>
      <C>Pickup date: {pickup_date}</C>
      <C>
        From <C style={{ color: "green", fontWeight: "bold" }}>{src} </C>
        to <C style={{ color: "red", fontWeight: "bold" }}>{dst} </C>
      </C>
      <C>
        {sender_name} to {receiver_name}
      </C>
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
    position: "absolute",
    top: 10,
    right: 10,
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

export default ListItem;
