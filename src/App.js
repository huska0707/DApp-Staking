import "./App.css";
import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import CardDeck from "react-bootstrap/CardDeck";
import HappyChefContract from "./contracts/HappyChef.json";

import getWeb3 from "./getWeb3";
import Pool from "./components/Pool";

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [happyPrice, setHappyPrice] = useState(0);
  const [happyBalance, setHappyBalance] = useState(0);
  const [accounts, setAccounts] = useState(null);
  const [contract, setContract] = useState(null);
  const [pools, setPools] = useState([]);

  let happy;

  useEffect(() => {
    const init = async () => {
      try {
        const web3Instance = await getWeb3();

        const userAccount = await web3Instance.eth.getAccounts();

        const networkId = await web3Instance.eth.net.getId();
        const deployNetwork = HappyChefContract.networks[networkId];

        const contractInstance = new web3Instance.eth.Contract(
          HappyChefContract.abi,
          deployNetwork && deployNetwork.address
        );

        setWeb3(web3Instance);
        setAccounts(userAccount);
        setContract(contractInstance);
        populate(contractInstance, userAccount[0]);
      } catch (error) {
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`
        );
        console.error(error);
      }
    };

    init();
  }, []);

  const updatedHappyPrice = () => {
    if (contract) {
      contract.methods
        .getLastHappyPrice()
        .call()
        .then((res) => setHappyPrice(web3.utils.fromWei(res, "ether")));
    }
  };

  const ellipsis = (str) => {
    return str ? str.slice(0, 6) + "..." + str.slice(str.length - 4) : "";
  };

  const updateHappyBalance = () => {
    if (happy && accounts) {
      happy.methods
        .balanceOf(accounts[0])
        .call()
        .then((balance) => {
          setHappyBalance(
            Number(web3.utils.fromWei(balance, "ether")).toFixed(6)
          );
        });
    }
  };

  const populate = async (contractInstance, account) => {
    updateHappyBalance();
    updatedHappyPrice();

    const nbPools = await contractInstance.methods.getnbPools().call();
    const poolsArray = Array.from({ length: nbPools }, (_, i) => i);
    setPools(poolsArray);
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
        <CardDeck>
          {pools.map((pool) => {
            <Pool
              web3={web3}
              contract={contract}
              account={accounts[0]}
              updateHappyBalance={updateHappyBalance}
              id={pool}
              key={pool}
            />;
          })}
        </CardDeck>
      </Container>
    </>
  );
};

export default App;
