import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Spinner from "react-bootstrap/Spinner";
import ERC20Contract from "../contracts/ERC20.json";

const Pool = ({ id, web3, contract, account, updateHappyBalance }) => {
  const [yieldValue, setYieldValue] = useState(0);
  const [price, setPrice] = useState(0);
  const [rewardPrice, setRewardPrice] = useState(0);
  const [claim, setClaim] = useState(0);
  const [poolBalance, setPoolBalance] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const [token, setToken] = useState(null);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [icon, setIcon] = useState(null);
  const [deposit, setDeposit] = useState(0);
  const [depositShow, setDepositShow] = useState(false);
  const [withdraw, setWithdraw] = useState(0);
  const [withdrawShow, setWithdrawShow] = useState(false);
  const [unlockLoading, setUnlockLoading] = useState(false);
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);
  const [claimLoading, setClaimLoading] = useState(false);
  let tokenContract;

  useEffect(() => {
    const init = async () => {
      const pool = await contract.methods.pools(id).call();
      setYieldValue(pool.yield / 100);
      updatePrices();

      tokenContract = new web3.eth.Contract(ERC20Contract.abi, pool.token);
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

      updatePoolBalance();
      updateUserBalance();

      web3.eth.subscribe("newBlockHeaders", (err, res) => {
        if (!err) {
          onNewBlock(res);
        }
      });
    };

    init();
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
        setPoolBalance(Number(web3.utils.fromWei(balance)).toFixed(2));
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

  const onUnlock = async () => {
    setUnlockLoading(true);
    tokenContract.methods
      .approve(contract._address, -1)
      .send({ from: account })
      .then((res) => {
        setUnlocked(res.status === true);
        setUnlockLoading(false);
      });
  };

  const onDeposit = async () => {
    const balance = await tokenContract.methods.balanceOf(account).call();
    setTokenBalance(web3.utils.fromWei(balance));
    setDepositShow(true);
    setDepositLoading(true);
  };

  const onWithdraw = async () => {
    setWithdrawShow(true);
    setWithdrawLoading(true);
  };

  const onDepositClose = async () => {
    contract.methods
      .stake(id, web3.utils.toWei(deposit))
      .send({ from: account })
      .then((res) => {
        updateUserBalance();
        updatePoolBalance();
        setDepositLoading(false);
      });
    setDepositShow(false);
  };

  const onWithdrawClose = async () => {
    contract.methods
      .unstake(id, web3.utils.toWei(withdraw))
      .send({ from: account })
      .then((res) => {
        updateUserBalance();
        setWithdrawLoading(false);
      });
    setWithdrawShow(false);
  };

  const onClaim = async () => {
    setClaimLoading(true);
    contract.methods
      .unstake(id, 0)
      .send({ from: account })
      .then(() => {
        updatePrices();
        setClaimLoading(false);
        updateHappyBalance();
      });
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
              <Button
                variant="primary"
                onClick={onClaim}
                disabled={claim === 0 || claimLoading}
              >
                {claimLoading && (
                  <Spinner as="span" animation="border" size="sm" />
                )}
                Claim
              </Button>
            </Col>
          </Row>
          <Row>
            <div className="title">{token} staked</div>
          </Row>
          <Row>
            <Col>{userBalance}</Col>
            <Col className="right">
              {!unlocked && (
                <Button
                  variant="primary"
                  onClick={onUnlock}
                  disabled={unlockLoading}
                >
                  {unlockLoading && (
                    <Spinner as="span" animation="border" size="sm" />
                  )}
                  Unlock
                </Button>
              )}
              {unlocked && (
                <>
                  <Button
                    variant="primary"
                    onClick={onDeposit}
                    disabled={depositShow || depositLoading}
                  >
                    {depositLoading && (
                      <Spinner as="span" animation="border" size="sm" />
                    )}
                    +
                  </Button>{" "}
                </>
              )}
              {unlocked && userBalance !== "0" && (
                <Button
                  variant="primary"
                  onClick={onWithdraw}
                  disabled={withdrawShow || withdrawLoading}
                >
                  {withdrawLoading && (
                    <Spinner as="span" animation="border" size="sm" />
                  )}
                  -
                </Button>
              )}
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer>
          <Row>
            <Col>Total Pool Liquidity</Col>
            <Col className="right">$ {(price * poolBalance).toFixed(2)}</Col>
          </Row>
          <Row>
            <Col>My staked value</Col>
            <Col className="right">$ {(price * userBalance).toFixed(2)}</Col>
          </Row>
        </Card.Footer>
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

      <Modal show={withdrawShow} centered backdrop="static">
        <Modal.Header>
          <Modal.Title>{token} withdraw</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              Your {token} balance: {userBalance}
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="text"
                value={withdraw}
                onChange={(e) => setWithdraw(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={onWithdrawClose}>
            Withdraw
          </Button>
          <Button variant="secondary" onClick={() => setWithdrawShow(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

Pool.propTypes = {
  web3: PropTypes.object.isRequired,
  contract: PropTypes.object.isRequired,
  account: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  updateHappyBalance: PropTypes.func.isRequired,
};

export default Pool;
