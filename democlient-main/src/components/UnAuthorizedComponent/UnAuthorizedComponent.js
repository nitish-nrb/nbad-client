import React, { Component } from "react";
import AppBarComponent from "../AppBarComponent/AppBarComponent";
import {Link} from 'react-router-dom';

class UnAuthorizedComponent extends Component {
  constructor(props) {
    super(props);

    // Your state initialization goes here
    this.state = {
      // Your state properties go here
    };
  }

  render() {
    return (
      <div>
        <AppBarComponent />
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h1>Authorization Error</h1>
          <p>You don't have the necessary permissions to access this page.</p>
          <p>Please contact your administrator for assistance.</p>
          <Link to="/">Go to Home</Link>
        </div>
      </div>
    );
  }
}

export default UnAuthorizedComponent;
