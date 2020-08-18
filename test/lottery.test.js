const Web3 = require('web3')

const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
const BigNumber = require('bignumber.js')

require('chai')
  .use(require('chai-as-promised'))
  .use(require('chai-bignumber')(BigNumber))
  .should()

const YamToken = artifacts.require('YamToken.sol')

const YamTokenContract = require(
  '../build/contracts/YamToken.json'
)

const YamLottery = artifacts.require('YamLottery.sol')

const YamLotteryContract = require(
  '../build/contracts/YamLottery.json'
)

contract('Escrow Contract ', function (accounts) {
    beforeEach(async function () {

      this.addr = {
        owner: accounts[0],
        holder1: accounts[1],
        holder2: accounts[2],
        holder3: accounts[3],
        stranger: accounts[4],
      }
      this.tokenName = "Yet Another Mintable Token"
      this.tokenSymbol = "YAMT"

      this.yamToken = await YamToken.new(this.tokenName, this.tokenSymbol)
      this.addr.token = this.yamToken.address

      this.CYamToken = await new web3.eth.Contract(
        YamTokenContract.abi, this.addr.token
      )

      this.yamLottery= await YamLottery.new()
      this.addr.lottery = this.yamLottery.address

      this.CYamLottery = await new web3.eth.Contract(
        YamLotteryContract.abi, this.addr.lottery
      )

    })

})
