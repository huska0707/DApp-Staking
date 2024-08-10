//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ChainLinkStub is AggregatorV3Interface, Ownable {
    int256 value;

    constructor(int256 _value) {
        value = _value;
    }

    function decimals() external view override returns (uint8) {
        return 8;
    }

    function description() external view override returns (string memory) {
        return "ChainLinkStub";
    }

    function version() external view override returns (uint256) {
        return 1;
    }
}
