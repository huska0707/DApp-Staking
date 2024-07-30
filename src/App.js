import "./App.css";
import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import CardDeck from "react-bootstrap/CardDeck";

import getWeb3 from "./getWeb3";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [happyPrice, setHappyPrice] = useState(0);
  const [happyBalance, setHappyBalance] = useState(0);
  const [accounts, setAccounts] = useState(null);

  useEffect(() => {
    const init = async () => {
      const web3Instance = await getWeb3();

      const userAccount = await web3Instance.eth.getAccounts();

      setWeb3(web3Instance);
      setAccounts(userAccount);
    };

    init();
  }, []);

  const ellipsis = (str) => {
    return str ? str.slice(0, 6) + "..." + str.slice(str.length - 4) : "";
  };

  if (!web3) {
    return <div>Loading Web3, account and contract ...</div>;
  }

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
