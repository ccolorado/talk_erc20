pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YamLottery is Ownable{

  address public tokenAddress;

  constructor(address tokenAddress, uint claimerCount)
    Ownable()
  public {
  }



}
