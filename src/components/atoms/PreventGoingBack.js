import { useEffect, useContext } from "react";
import { Alert } from "react-native";
import { AuthContext } from "../../context";


        

const PreventGoingBack = ({
  navigation,
  title = "Go back?",
  paragraph = "Are you sure to continue?",
  shouldAlert = true,
}) => {
  const { auth, setAuth } = useContext(AuthContext);
  useEffect(
    () =>
      navigation.addListener("beforeRemove", (e) => {
        if (!shouldAlert) return;

        e.preventDefault();
        Alert.alert(title, paragraph, [
          {
            text: "No",
            style: "cancel",
            onPress: () => {},
          },
          {
            text: "Yes",
            style: "destructive",
            onPress: () => {
              const newAuth = {...auth}
              newAuth.fromLogin = false;
              setAuth(newAuth)
              navigation.dispatch(e.data.action)}
              ,
          },
        ]);
      }),
    [navigation, shouldAlert]
  );
  return null;
};
export default PreventGoingBack;
