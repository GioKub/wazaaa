import { Alert } from "react-native";

const confirmAlert = ({
  paragraph = "",
  onConfirm = () => {},
  title = "Confirm action",
  onCancel = () => {},
}) => {
  Alert.alert(title, paragraph, [
    {
      text: "No",
      style: "cancel",
      onPress: onCancel,
    },
    {
      text: "confirm",
      style: "destructive",
      onPress: onConfirm,
    },
  ]);
};

export default confirmAlert;
