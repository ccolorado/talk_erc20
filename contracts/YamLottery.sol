pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract YamLottery is Ownable{

  using SafeMath for uint;

  address public tokenAddress;
  uint public claimingCount;
  uint public claimingAttempts;
  bool public resolved;
  mapping(address => uint) public balances;
  uint public totalBag;

  event TokensAdded(address indexed player, uint tokenAmount, uint newBalance);
  event LotteryClaimed(address indexed player, uint totalBag);

  constructor(address _tokenAddress, uint _claimingCount)
    Ownable()
  public {
    tokenAddress = _tokenAddress;
    claimingCount = _claimingCount;
    resolved = false;
    totalBag = 0;
  }

  function balanceOf(address player) public view returns(uint){
    return balances[player];
  }

  function addTokens(address player, uint tokenAmount) public {
    require(!resolved, "cannot keep adding tokens once the lottery has been resolved");

    balances[player] = balances[player].add(tokenAmount);
    totalBag = totalBag.add(tokenAmount);

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
    require(balances[msg.sender] > 0, "Claimer is not participating in the lottery");
    require(claimingAttempts < claimingCount, "Lottery has already been claimed");

    if(claimingAttempts.add(1) <= claimingCount) {
      claimingAttempts = claimingAttempts.add(1);

      bool succesfulClaim = (claimingAttempts == claimingCount);

      if(succesfulClaim) {
        require( IERC20(tokenAddress).transfer(msg.sender, totalBag), "Could not transfer tokens");
        emit LotteryClaimed(msg.sender, totalBag);
      }

    }

  }

}
