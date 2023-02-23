import { useState } from "react";
import useAxios from "./useAxios";
import parseRequest from "../requests/parseRequest.js";

export default function useStoredRequest() {
  const axios = useAxios();
  const [isProcessing, setIsProcessing] = useState(false);

  const send = async (config) => {
    setIsProcessing(true);
    const response = parseRequest(axios, config)
      .catch((e) => {
        throw e;
      })
      .finally(() => {
        setIsProcessing(false);
      });
    return response;
  };
  return [send, isProcessing];
}
