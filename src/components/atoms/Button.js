import React from "react";
import { Button } from "react-native-paper";

const ButtonWrapper = ({
  children,
  loading = false,
  disabled,
  style = [],
  ...rest
}) => {
  return (
    <Button
      mode="contained"
      style={{ ...style, justifyContent: "center" }}
      disabled={disabled || loading}
      loading={loading}
      uppercase={false}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default ButtonWrapper;
