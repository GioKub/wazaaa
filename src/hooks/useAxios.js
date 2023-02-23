import { useContext, useState, useEffect } from "react";
import Axios from "axios";
import { AuthContext } from "../context/index.js";
import baseUrl from "../baseUrl.js";

export default function useAxios() {
  const { auth } = useContext(AuthContext);
  const { access_token } = { ...auth };

  const baseURL = baseUrl;
  // "http://localhost:3000/";
  // "https://api.georgiancargo.co.uk" prod;
  // "http://stg.georgiancargo.co.uk"
  // "http://stg.api.georgiancargo.co.uk" staging
  const defaultAxios = Axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });

  const [axios, setAxios] = useState({ instance: defaultAxios });
  useEffect(() => {
    setAxios({
      instance: Axios.create({
        baseURL,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }),
    });
  }, [access_token]);

  return axios.instance;
}
