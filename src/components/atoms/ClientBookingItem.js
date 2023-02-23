import React, { useState, useContext, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Divider, useTheme } from "react-native-paper";
// components
import AuthContext from "../../context/AuthContext.js";
import { codes } from "../../utils/countries.js";
import QRCode from "react-native-qrcode-svg";

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
const ClientBookingItem = ({ booking: p, onClick, i }) => {
  const { auth, setAuth } = useContext(AuthContext);
  const [bookStatus, setBookStatus] = useState();
  const [BookstatusColor, setBookStatusColor] = useState();
  const [status, setStatus] = useState(); //this is courier status
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

  useEffect(() => {
    {
      p.finished === 0 &&
        (setBookStatus("Active"), setBookStatusColor("#00FF00"));
    }
    {
      p.finished === 0 &&
        p.courier_phone !== null &&
        (setBookStatus("Handeled"), setBookStatusColor("#87CEEB"));
    }
    {
      p.finished === 1 &&
        (setBookStatus("Finished"), setBookStatusColor("#808080"));
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

  const BookingBadge = {
    ...style.badge,
    // makes the background color of badge green if paid otherwise red
    // backgroundColor: extrasPaid ? "#a2cc3a" : "#ed1c24",
    backgroundColor: BookstatusColor,
    // makes the text inside badge white
    text: {
      color: "#fff",
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
        Preferable visit date: <Text>{p.courier_visit_date}</Text>
      </C>
      <C>
        Courier: <Badge style={paymentBadge}>{status}</Badge>
      </C>
      <C>
        Status: <Badge style={BookingBadge}>{bookStatus}</Badge>
      </C>

      {p?.courier_note?.length !== 0 ? (
        <C>{`Courier Note: ${p.courier_note}`}</C>
      ) : null}

      {/* this is where badge shuld be original and then i can align if i want them to be down or on the left side but they are commented for now because i don't know what to put on the client page */}
      <View style={style.badgeContainer}>
        {/* <Badge style={paymentBadge}>{status}</Badge>
        <Badge style={BookingBadge}>{bookStatus}</Badge> */}
      </View>
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        {bookStatus !== "Finished" ? (
          <>
            <Text style={{ margin: 20, fontWeight: "bold" }}>
              Show QR code to courier when he/she arrives or tell your email:
              {auth.agent.email}
            </Text>
            <QRCode value="http://awesome.link.qr" size={200} />
          </>
        ) : null}
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

export default ClientBookingItem;
