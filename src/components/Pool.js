import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

const Pool = ({ id }) => {
  const [token, setToken] = useState(null);
  const [yieldValue, setYieldValue] = useState(0);
  const [icon, setIcon] = useState(null);
  const [rewardPrice, setRewardPrice] = useState(0);
  const [claim, setClaim] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [unlocked, setUnlocked] = useState(false);

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
    </>
  );
};

export default Pool;
