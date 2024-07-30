import "./App.css";
import React, { Component } from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";

class App extends Component {
  render() {
    return (
      <>
        <Navbar bg="light">
          <Navbar.Brand className="brand">
            <img
              src="images/happy.png"
              alt="Happy"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Happy Staking
          </Navbar.Brand>
          <Navbar className="justify-content-between">
            <Navbar.Text>HAPPY: $ {this.state.happyPrice}</Navbar.Text>
          </Navbar>
          <Navbar.Collapse className="justify-content-end">
            <Button variant="outline-subtle">
              {this.state.happyBalance} HAPPY
            </Button>
            <Button variant="outline-primary">
              {this.state.accounts
                ? this.ellipsis(this.state.accounts[0])
                : "Connect"}
            </Button>
          </Navbar.Collapse>
        </Navbar>
      </>
    );
  }
}

export default App;
