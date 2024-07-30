import "./App.css";
import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import CardDeck from "react-bootstrap/CardDeck";

const App = () => {
  const [happyPrice, setHappyPrice] = useState(0);
  const [happyBalance, setHappyBalance] = useState(0);
  const [accounts, setAccounts] = useState(null);

  useEffect(() => {
  }, []);

  const ellipsis = (str) => {
    return str ? str.slice(0, 6) + "..." + str.slice(str.length - 4) : "";
  };

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
          <Navbar.Text>HAPPY: $ {happyPrice}</Navbar.Text>
        </Navbar>
        <Navbar.Collapse className="justify-content-end">
          <Button variant="outline-subtle">{happyBalance} HAPPY</Button>
          <Button variant="outline-primary">
            {accounts ? ellipsis(accounts[0]) : "Connect"}
          </Button>
        </Navbar.Collapse>
      </Navbar>

      <Container>
        <CardDeck></CardDeck>
      </Container>
    </>
  );
};

export default App;
