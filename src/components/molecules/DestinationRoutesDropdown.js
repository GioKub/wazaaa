import React, { useContext } from "react";
import SelectDropdown from "../atoms/SelectDropdown.js";
import AuthContext from "../../context/AuthContext.js";
import { codes } from "../../utils/countries.js";

const DestinationRoutesDropdown = (props) => {
  const {
    auth: { agent },
  } = useContext(AuthContext);
  const routes = agent ? agent.routes : [];
  const destinationRoutes = [];
  const destinationCodes = [];
  routes.forEach(({ destinationCountryCode: code }) => {
    if (destinationCodes.indexOf(code) === -1) {
      destinationRoutes.push({
        value: code,
        label: codes[code],
      });
      destinationCodes.push(code);
    }
  });
  // destinationRoutes.unshift({
  //   label: "Please choose reciever country",
  //   value: "",
  // });
  // console.log(destinationRoutes);
  return <SelectDropdown list={destinationRoutes} {...props} />;
};

export default DestinationRoutesDropdown;
