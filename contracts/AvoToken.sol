pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";

/**
 * @title AvoToken
 * @dev ERC20 Token that can be minted.
 */
contract AvoToken is MintableToken {

  string public constant name = "Avo Token"; // solium-disable-line uppercase
  string public constant symbol = "AVO"; // solium-disable-line uppercase
  uint8 public constant decimals = 18; // solium-disable-line uppercase

}
