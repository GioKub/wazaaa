import React from "react";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { StatusBar } from "react-native";
// components
import Navigator from "./navigations/index.js";
import { AuthContextProvider } from "./context/index.js";
// import { registerRootComponent } from "expo";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#f5a11c", // - secondary color for your app which complements the primary color.
    accent: "#ed1c24", // - primary color for your app, usually your brand color.
  },
};

const App = () => (
  <AuthContextProvider>
    <PaperProvider theme={theme}>
      <StatusBar />
      <Navigator />
    </PaperProvider>
  </AuthContextProvider>
);

export default App;

// registerRootComponent(App);
