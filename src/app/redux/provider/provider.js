"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";

// this  provider wrapper in layout because of next js otherwise use directly in index.js in react

function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
export default Providers;
