pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC20/MintableToken.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

/**
 * @title AvoToken
 * @dev ERC20 Token that can be minted.
 */
contract AvoToken is MintableToken {
    using SafeMath for uint;
    using SafeMath for uint256;

    mapping(address => uint256) balances;
    
    string public constant name = "Avo Token"; // solium-disable-line uppercase
    string public constant symbol = "AVO";     // solium-disable-line uppercase
    uint8 public constant decimals = 18;       // solium-disable-line uppercase

    // TODO need a burn address
    address public constant burnAddress = 0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae; 

    mapping(address => uint) lastMoved;

    function AvoToken() public { }

    function getLastMoved(address addr) public constant returns (uint) {
	return lastMoved[addr];
    }

    function transfer(address _to, uint256 _value) public returns (bool) {
	require(super.transfer(_to, _value)); // execute inherited MintableToken logic first

	ripen(msg.sender);
	
	lastMoved[_to] = block.timestamp;
	lastMoved[msg.sender] = block.timestamp;
    }

    function ripen(address wallet) internal {
	uint last = lastMoved[wallet];
	uint balance = balanceOf(wallet);

	uint loss = 42; // TODO calculate loss through sophisticated ripeness function

	require(super.transfer(burnAddress, 42));
    }
}
