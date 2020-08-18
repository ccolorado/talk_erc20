pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YamLottery is Ownable{

  address public tokenAddress;
  uint public claimingCount;

  constructor(address _tokenAddress, uint _claimingCount)
    Ownable()
  public {
    tokenAddress = _tokenAddress;
    claimingCount = _claimingCount;
  }



}
