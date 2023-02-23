import { useState } from "react";
import * as fs from "expo-file-system";
import useAxios from "./useAxios";
import parseRequest from "../requests/parseRequest.js";

export default function useOfflineRequest(r) {
  const axios = useAxios();
  const [isProcessing, setIsProcessing] = useState(false);

  const isConnected = async () => {
    try {
      await axios.get("http://georgiancargo.co.uk/");
      return true;
    } catch (e) {
      return false;
    }
  };
  const send = async (data) => {
    setIsProcessing(true);
    const config = {
      url: r.url,
      method: r.method,
      data: data,
    };

    // console.log(config, "<--config");

    if (await isConnected()) {
      return parseRequest(axios, config)
        .catch((e) => {
          // console.error(e.response.data, "axios error");
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
    } else {
      let requests = [];
      const path = fs.cacheDirectory + "/offline_requests.json";
      try {
        const raw = await fs.readAsStringAsync(path);
        requests = JSON.parse(raw);
      } catch (e) {
        // Nothing to do
      }
      requests.push(config);
      fs.writeAsStringAsync(path, JSON.stringify(requests))
        .catch((e) => {
          alert("Problem " + e);
        })
        .finally(() => {
          setIsProcessing(false);
        });
      /* const store = "requests";
            get(store)
                .then((res) => {
                    alert("Done");
                    if (res !== null) requests = JSON.parse(res);
                    requests.push(config);
                    return set(store, JSON.stringify(requests));
                })
                .catch((e) => {
                    alert("Error" + e);
                })
                .finally(() => {
                    setIsProcessing(false);
                });
             */
    }
  };
  return [send, isProcessing];
}
