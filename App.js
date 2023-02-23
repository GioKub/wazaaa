import React from "react";
import { registerRootComponent } from "expo";
import Application from "./src/index.js";

// As for myself, I am simply Hop-Frog, the jester — and this is my last jest.

registerRootComponent(Application);

export default function App() {
  return <Application />;
}
