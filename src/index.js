import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { store } from "./store/store";
import { Provider } from "react-redux";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import I18nProvider from "./translation-wrapper/I8nProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
export const I18nContext = React.createContext();

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <I18nProvider>
          <App />
        </I18nProvider>
      </BrowserRouter>
    </Provider>
    ,
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
