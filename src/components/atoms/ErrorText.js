import React from "react";
import { HelperText } from "react-native-paper";

const ErrorText = ({ error }) =>
  error && error !== "" ? (
    <HelperText type="error" visible={true}>
      {error}
    </HelperText>
  ) : null;

export default ErrorText;
