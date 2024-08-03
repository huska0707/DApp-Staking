import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ERC20Contract from "../contracts/ERC20.json";

const Pool = ({ id, contract }) => {
  const [token, setToken] = useState(null);
  const [yieldValue, setYieldValue] = useState(0);
  const [icon, setIcon] = useState(null);
  const [depositShow, setDepositShow] = useState(false);
  const [rewardPrice, setRewardPrice] = useState(0);
  const [claim, setClaim] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [price, setPrice] = useState(0);

  let tokenContract;

  useEffect(() => {
    const pool = contract.methods.pool(id).call();
    setYieldValue(pool.yield / 100);
    updatePrices();

    tokenContract = new web3.eht.Contract(ERC20Contract.abi, pool.token);
    tokenContract.methods
      .symbol()
      .call()
      .then((symbol) => {
        setToken(symbol);
        setIcon("images/" + symbol.toLowerCase() + "-coin.svg");
      });

    tokenContract.methods
      .allowance(account, contract._address)
      .call()
      .then((remaining) => setUnlocked(Number(remaining) !== 0));

    web3.eth.subscribe("newBlockHeaders", (err, res) => {
      if (!err) {
        onNewBlock(res);
      }
    });

    updatePoolBalance();
    updateUserBalance();
  }, []);

  const onNewBlock = async () => {
    updatePrices();
  };

  const updatePrices = () => {
    contract.methods
      .pendingReward(id, account)
      .call()
      .then((reward) => {
        setClaim(Number(web3.utils.fromWei(reward)));
      });
    contract.methods
      .getLastPrice(id)
      .call()
      .then((price) => {
        setPrice(Number(web3.utils.fromWei(price)));
      });
    contract.methods
      .getLastHappyPrice()
      .call()
      .then((price) => {
        setRewardPrice(Number(web3.utils.fromWei(price)));
      });
  };

  const updatePoolBalance = () => {
    contract.methods
      .getPoolBalance(id)
      .call()
      .then((balance) => {
        setPoolBalance(Number(web3.utils.fromWei(balance).toFixed(2)));
      });
  };

  const updateUserBalance = () => {
    contract.methods
      .getUserBalance(id, account)
      .call()
      .then((balance) => {
        setUserBalance(Number(web3.utils.fromWei(balance)));
      });
  };

  const onDepositClose = async () => {
    contract.methods.stake(
      id,
      web3.utils
        .toWei(deposit)
        .send({ from: account })
        .then((res) => {
          updateUserBalance();
        })
    );

    setDepositShow(false);
  };

  return (
    <>
      <Card style={{ width: "18rem" }}>
        <Card.Body>
          <Card.Title>
            <img className="coin" alt={"coin " + id} src={icon} />
            {token} staking
          </Card.Title>
          <Row>
            <Col>APR:</Col>
            <Col className="right">{yieldValue} %</Col>
          </Row>
          <Row>
            <Col>Earn:</Col>
            <Col className="right">HAPPY</Col>
          </Row>
          <Row>
            <div className="title">HAPPY earned</div>
          </Row>
          <Row>
            <Col>$ {(rewardPrice * claim).toFixed(6)}</Col>
            <Col className="right">
              <Button variant="primary">Claim</Button>
            </Col>
          </Row>
          <Row>
            <div className="title">{token} staked</div>
          </Row>
          <Row>
            <Col>{userBalance}</Col>
            <Col className="right">
              {!unlocked && <Button variant="primary">Unlock</Button>}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal show={depositShow} centered backdrop="static">
        <Modal.Header>
          <Modal.Title>{token} deposit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              Your {token} balance: {tokenBalance}
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="text"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onDepositClose}>
            Deposit
          </Button>
          <Button variant="secondary" onClick={() => setDepositShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Pool;
