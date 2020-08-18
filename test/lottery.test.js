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
      this.claimingCount = 3

      this.yamToken = await YamToken.new(this.tokenName, this.tokenSymbol)
      this.addr.token = this.yamToken.address

      this.CYamToken = await new web3.eth.Contract(
        YamTokenContract.abi, this.addr.token
      )

      this.yamLottery= await YamLottery.new(this.addr.token, this.claimingCount)
      this.addr.lottery = this.yamLottery.address

      this.CYamLottery = await new web3.eth.Contract(
        YamLotteryContract.abi, this.addr.lottery
      )

      this.initialBalance = BigNumber('1000000000000000000').multipliedBy(100)
      await this.yamToken.mint(this.addr.owner, this.initialBalance.toFixed());
      await this.yamToken.mint(this.addr.holder1, this.initialBalance.toFixed());
      await this.yamToken.mint(this.addr.holder2, this.initialBalance.toFixed());
      await this.yamToken.mint(this.addr.holder3, this.initialBalance.toFixed());

    })

    describe.only('lottery integrity', async function () {

      it('recive a token address', async function () {

        const _tokenAddress = await this.CYamLottery.methods.tokenAddress().call()
        _tokenAddress.should.be.equal(this.addr.token)

      })

      it('store a claiming count', async function () {

        const _claimingCount = await this.CYamLottery.methods.claimingCount().call()
        _claimingCount.should.be.equal(this.claimingCount)

      })


    })



    /*
      * not be ready to claim
      * claimers mut have a balance in the contract
      * lottery can be claimed until the lottery is declared ready
      * once the lottery becomes ready, players can claim the price each claimer increases the claim count
      * declare the winner when the claim count reaches the the claimerCount
      */

})
