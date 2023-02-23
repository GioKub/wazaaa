import { useContext, useState } from "react";
import useAxios from "./useAxios";
import { AuthContext } from "../context/index.js";

export default function useRequest(request, load = false) {
  const axios = useAxios();
  const [isProcessing, setIsProcessing] = useState(false);
  const { setAuth } = useContext(AuthContext);
  const send = async (data) => {
    setIsProcessing(true);
    const response = request(axios, data)
      .catch((e) => {
        // switch (e.response.status) {
        //     case 401:
        //         // Invalidate access tokens etc...
        //         setAuth({isLoggedIn: false, accessToken: null});
        //         break;
        //     default:
        //         break;
        // }
        throw e;
      })
      .finally(() => {
        setIsProcessing(false);
      });
    return response;
  };
  return [send, isProcessing];
}
