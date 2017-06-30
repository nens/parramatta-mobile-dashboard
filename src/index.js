import { AppContainer } from "react-hot-loader";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import { Provider } from "react-redux";
import { theStore } from "./store/Store";

import App from "./components/App";
import i18n from "./i18n"; // initialized i18next instance
import React from "react";
import ReactDOM from "react-dom";
import valuesES2017 from "object.values";

// Make the classic Object.values() work on Chrome (needed for some
if (typeof Object.values !== "function") {
  Object.values = valuesES2017;
}

ReactDOM.render(
  <AppContainer>
    <I18nextProvider i18n={i18n}>
      <Provider store={theStore}>
        <Router basename="/">
          <div>
            <Route exact path="/" component={App} />
          </div>
        </Router>
      </Provider>
    </I18nextProvider>
  </AppContainer>,
  document.getElementById("root")
);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept();
}
