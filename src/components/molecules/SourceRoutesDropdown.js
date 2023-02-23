import React, { useContext } from "react";
import SelectDropdown from "../atoms/SelectDropdown.js";
import AuthContext from "../../context/AuthContext.js";
import { codes } from "../../utils/countries.js";

const SourceRoutesDropdown = (props) => {
  const {
    auth: { agent },
  } = useContext(AuthContext);
  const routes = agent ? agent.routes : [];
  const sourceRoutes = [];
  const sourceCodes = [];
  routes.forEach(({ sourceCountryCode: code }) => {
    if (sourceCodes.indexOf(code) === -1) {
      sourceRoutes.push({
        value: code,
        label: codes[code],
      });
      sourceCodes.push(code);
    }
  });

  // console.log(sourceRoutes, "<--sourceRoutes");
  return <SelectDropdown list={sourceRoutes} {...props} />;
};

export default SourceRoutesDropdown;
