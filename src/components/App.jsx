import React, { Component } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";

class AppComponent extends Component {
  render() {
    return <p>Hello, world!</p>;
  }
}

const App = connect(null, null)(AppComponent);
export default translate()(App);
