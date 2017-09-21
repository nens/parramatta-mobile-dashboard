// First a user has to check a checkbox on the Terms & Conditions screen,
// then he logs in if necessary, then the actual app is shown. This component
// models that workflow.

import React, { Component } from "react";
import { connect } from "react-redux";

import App from "./App";
import { TermsAndConditions } from "./TermsAndConditions";
import { fetchBootstrap } from "../actions/";

class TermsOrLoginOrAppComponent extends Component {
  constructor() {
    super();
    this.state = {
      termsSigned:
        window.localStorage.getItem("termsSigned") === "true" || false
    };
  }

  componentDidMount() {
    this.props.fetchBootstrap(this.props.sessionState);
  }

  termsSigned() {
    window.localStorage.setItem("termsSigned", "true");
    this.setState({ termsSigned: true });
  }

  hasBootstrap() {
    const session = this.props.sessionState;
    const result = !!(session && session.hasBootstrap && session.bootstrap);
    return result;
  }

  render() {
    if (!this.state.termsSigned) {
      return <TermsAndConditions termsSigned={this.termsSigned.bind(this)} />;
    } else if (!this.hasBootstrap()) {
      // Empty page
      return <span />;
    } else if (!this.props.sessionState.bootstrap.authenticated) {
      this.props.sessionState.bootstrap.doLogin();
    } else {
      return <App />;
    }
  }
}

function mapStateToProps(state) {
  return {
    sessionState: state.session
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchBootstrap: sessionState => fetchBootstrap(dispatch, sessionState)
  };
}

export const TermsOrLoginOrApp = connect(mapStateToProps, mapDispatchToProps)(
  TermsOrLoginOrAppComponent
);
