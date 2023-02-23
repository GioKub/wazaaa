import React, { useEffect, useState } from "react";
import useStoredRequest from "../../../../hooks/useStoredRequest.js";
import Button from "../../../../components/atoms/Button.js";
import * as fs from "expo-file-system";
import { useIsFocused } from "@react-navigation/core";

const SyncButton = () => {
  const [label, setLabel] = useState("No sync");
  const [sync, setSync] = useState(false);
  const [request, requesting] = useStoredRequest();

  const isFocused = useIsFocused();

  //i commneted this and usefffec tbecause they were thrwoing error
  // const updateButtonText = () => {
  //   const path = fs.cacheDirectory + "/offline_requests.json";
  //   fs.readAsStringAsync(path).then((raw) => {
  //     const requests = JSON.parse(raw);
  //     if (!requests || !requests.length) {
  //       setLabel("No sync");
  //       setSync(false);
  //     } else {
  //       setLabel(`Sync ${requests.length} Items`);
  //       setSync(true);
  //     }
  //   });
  // };

  // useEffect(() => {
  //   updateButtonText();
  // }, [isFocused]);

  const synItems = async () => {
    const path = fs.cacheDirectory + "/offline_requests.json";
    fs.readAsStringAsync(path).then((requests) => {
      const requestsArray = JSON.parse(requests);
      const stays = Array(requestsArray.length);

      requestsArray.forEach(async (element, i) => {
        try {
          await request(element);
          stays[i] = false;
        } catch (error) {
          alert(error);
          if (error.message === "Network error") {
            alert("Network error");
            stays[i] = true;
          }
        }
      });

      const remainingRequests = [];

      stays.forEach((val) => {
        if (val) remainingRequests.push(requestsArray[i]);
      });
      fs.writeAsStringAsync(path, JSON.stringify(remainingRequests)).then(
        () => {
          updateButtonText();
        }
      );
    });
  };
  return (
    <Button
      style={{ flex: 1 }}
      disabled={!sync}
      onPress={synItems}
      loading={requesting}
    >
      {label}
    </Button>
  );
};

export default SyncButton;
