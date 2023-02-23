import { createContext } from "react";

const AuthContext = createContext({
  access_token: "",
  remember_token: "",
  is_logged_in: false,
  agent: {
    id: "",
    username: "",
    privileges: [],
    enabled_routes: [
      {
        source_country_code: "",
        destination_country_code: "",
      },
    ],
  },
});

export default AuthContext;
