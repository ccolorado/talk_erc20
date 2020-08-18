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

    })

    describe('token integrity', async function () {

      it('has a name', async function () {

        const _name = await this.CYamToken.methods.name().call()
        _name.should.be.equal(this.tokenName)

      })

      it('has a symbol', async function () {

        const _symbol = await this.CYamToken.methods.symbol().call()
        _symbol.should.be.equal(this.tokenSymbol)

      })

      it('has a total supply', async function () {

        const _totalSupply = await this.CYamToken.methods.totalSupply().call()
        _totalSupply.should.be.equal('0')

      })


    })

    describe('Token Minting', async function () {

      beforeEach(async function () {

        this.mintingBalance =  BigNumber('1000000000000000000').multipliedBy(100).toFixed()

      })

      it('be mintable by owner', async function () {

        await this.CYamToken.methods.mint(this.addr.owner, this.mintingBalance).send({
          from: this.addr.owner,
          gas: 6721975
        }).should.be.fulfilled

      })

      it('increase the balance of the mintedTo account', async function () {

        const _oldBalance = await this.CYamToken.methods.balanceOf(this.addr.owner).call()

        await this.CYamToken.methods.mint(this.addr.owner, this.mintingBalance).send({
          from: this.addr.owner,
          gas: 6721975
        }).should.be.fulfilled

        const _newBalance = await this.CYamToken.methods.balanceOf(this.addr.owner).call()

        _oldBalance.should.be.equal('0')
        _newBalance.should.be.equal(this.mintingBalance)

      })

      it('emit a transfer event at minting', async function () {

        await this.CYamToken.methods.mint(this.addr.owner, this.mintingBalance).send({
          from: this.addr.owner,
          gas: 6721975
        }).should.be.fulfilled

        const events = await this.CYamToken.getPastEvents('Transfer')

        events.length.should.be.equal(1)
        events[0].returnValues.from.should.be.equal('0x0000000000000000000000000000000000000000')
        events[0].returnValues.to.should.be.equal(this.addr.owner)
        events[0].returnValues.value.should.be.equal(this.mintingBalance)

      })

      it('can not be minted by a stranger', async function () {

        await this.CYamToken.methods.mint(this.addr.stranger, this.mintingBalance).send({
          from: this.addr.stranger,
          gas: 6721975
        }).should.be.rejectedWith(
          Error,
          'Returned error: VM Exception while processing transaction: revert Ownable: caller is not the owner'
        )

      })

    })


})
