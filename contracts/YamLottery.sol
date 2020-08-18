pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract YamLottery is Ownable{

  using SafeMath for uint;

  address public tokenAddress;
  uint public claimingCount;
  bool public resolved;
  mapping(address => uint) public balances;

  event TokensAdded(address indexed player, uint tokenAmount, uint newBalance);

  constructor(address _tokenAddress, uint _claimingCount)
    Ownable()
  public {
    tokenAddress = _tokenAddress;
    claimingCount = _claimingCount;
    resolved = false;
  }

  function balanceOf(address player) public view returns(uint){
    return balances[player];
  }

  function addTokens(address player, uint tokenAmount) public {
    require(!resolved, "cannot keep adding tokens once the lottery has been resolved");

    balances[player] = balances[player].add(tokenAmount);

    require(
      IERC20(tokenAddress).transferFrom(msg.sender, address(this), tokenAmount),
      "Failed to add tokens"
    );

    emit TokensAdded(player, tokenAmount, balances[player]);
  }

  function resolveLottery() onlyOwner public {
    resolved = true;
  }

  function claim() public {
    require(resolved, "Lottery is not yet resolved");
  }

}
