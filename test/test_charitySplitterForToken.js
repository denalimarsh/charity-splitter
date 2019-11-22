const CharitySplitterForToken = artifacts.require("CharitySplitterForToken");
const ERC677 = artifacts.require("ERC677");

const EVMRevert = "revert";
const BigNumber = web3.BigNumber;

require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();

contract("CharitySplitterForToken", function(accounts) {
  const contractCreator = accounts[0];
  const owner = accounts[1];
  const userOne = accounts[2];
  const charityOne = accounts[3];
  const charityTwo = accounts[4];

  describe("Deployment and initial state", function() {
    beforeEach(async function() {
      this.charitySplitterForToken = await CharitySplitterForToken.new(owner);
    });

    it("should deploy the Chairty Splitter For Token contract", async function() {
      this.charitySplitterForToken.should.exist;
    });
  });

  describe("ERC677 donation processing", function() {
    const TOTAL_TOKEN_AMOUNT = Number(100);
    const TOKEN_TRANSFER_AMOUNT = Number(10);

    beforeEach(async function() {
      this.charitySplitterForToken = await CharitySplitterForToken.new(owner);
      this.token = await ERC677.new();

      // Add a charity for donation processing
      await this.charitySplitterForToken.addCharity(charityOne, {
        from: owner
      });

      // Add a charity for donation processing
      await this.charitySplitterForToken.addCharity(charityTwo, {
        from: owner
      });

      // Load user account with ERC677 tokens
      await this.token.mint(userOne, TOTAL_TOKEN_AMOUNT, {
        from: contractCreator
      }).should.be.fulfilled;
    });

    it("should implement IERC677Receiver, allowing users to transfer ERC677 tokens to the contract", async function() {
      // Confirm user has available balance of ERC677 tokens
      const userOneTokenBalance = Number(await this.token.balanceOf(userOne));
      userOneTokenBalance.should.be.bignumber.equal(TOTAL_TOKEN_AMOUNT);

      // ERC677 token transfer should be fulfilled
      await this.token.transferAndCall(
        this.charitySplitterForToken.address,
        TOKEN_TRANSFER_AMOUNT,
        this.token.address,
        { from: userOne }
      ).should.be.fulfilled;
    });

    it("should automatically process donations of ERC677 tokens and distribute them equally to active charities", async function() {
      // Get prior balances
      const priorCharityOneTokenBalance = Number(
        await this.token.balanceOf(charityOne)
      );
      const priorCharityTwoTokenBalance = Number(
        await this.token.balanceOf(charityTwo)
      );

      // ERC677 token transfer
      await this.token.transferAndCall(
        this.charitySplitterForToken.address,
        TOKEN_TRANSFER_AMOUNT,
        this.token.address,
        { from: userOne }
      );

      // Set up expected token balances
      const expectedCharityOneTokenBalance =
        priorCharityOneTokenBalance + Number(TOKEN_TRANSFER_AMOUNT / 2);
      const expectedCharityTwoTokenBalance =
        priorCharityTwoTokenBalance + Number(TOKEN_TRANSFER_AMOUNT / 2);

      // Get charity token balances post donation
      const charityOneTokenBalance = Number(
        await this.token.balanceOf(charityTwo)
      );
      const charityTwoTokenBalance = Number(
        await this.token.balanceOf(charityTwo)
      );

      // Confirm that the token balances have increased as expected
      charityOneTokenBalance.should.be.bignumber.equal(
        expectedCharityOneTokenBalance
      );
      charityTwoTokenBalance.should.be.bignumber.equal(
        expectedCharityTwoTokenBalance
      );
    });
  });
});
