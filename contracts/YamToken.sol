pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YamToken is ERC20, Ownable{

  constructor(string memory _name, string memory _symbol)
    ERC20(_name, _symbol)
    Ownable()
  public {
  }

  function mint(address _account, uint _amount) onlyOwner public {
    _mint(_account, _amount);
  }

}
