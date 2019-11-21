const CharitySplitter = artifacts.require("CharitySplitter");

const EVMRevert = "revert";
const BigNumber = web3.BigNumber;

require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();

contract("CharitySplitter", function(accounts) {
  const owner = accounts[1];
  const charityOne = accounts[2];
  const charityTwo = accounts[3];
  const charityThree = accounts[4];
  const philanthropist = accounts[8];

  const NULL_ADDRESS = "0x0000000000000000000000000000000000000000";

  describe("Deployment and initial state", function() {
    beforeEach(async function() {
      this.charitySplitter = await CharitySplitter.new(owner);
    });

    it("should deploy the chairty splitter contract with the correct parameters", async function() {
      this.charitySplitter.should.exist;

      const charitySplitterOwner = await this.charitySplitter.owner();
      const charitySplitterCharityCount = Number(
        await this.charitySplitter.charityCount()
      );

      charitySplitterOwner.should.be.equal(owner);
      charitySplitterCharityCount.should.be.bignumber.equal(0);
    });
  });

  describe("Adding charities", function() {
    beforeEach(async function() {
      this.charitySplitter = await CharitySplitter.new(owner);
    });

    it("should allow the owner to add charities", async function() {
      await this.charitySplitter.addCharity(charityOne, {
        from: owner
      }).should.be.fulfilled;
    });

    it("should correctly update the charity set and count upon add", async function() {
      await this.charitySplitter.addCharity(charityOne, {
        from: owner
      });

      const charityCount = Number(await this.charitySplitter.charityCount());
      const charityAddress = await this.charitySplitter.charities(1);
      const charityIndex = Number(
        await this.charitySplitter.charityIndex(charityOne)
      );

      charityCount.should.be.bignumber.equal(1);
      charityAddress.should.be.equal(charityOne);
      charityIndex.should.be.bignumber.equal(1);
    });

    it("should log an event upon charity add", async function() {
      // Get the event logs
      const { logs } = await this.charitySplitter.addCharity(charityOne, {
        from: owner
      }).should.be.fulfilled;
      const event = logs.find(e => e.event === "LogCharityAdded");

      //Check the event's parameters
      event.args._charity.should.be.equal(charityOne);
      Number(event.args._totalCharities).should.be.bignumber.equal(1);
    });
  });

  describe("Removing charities", function() {
    beforeEach(async function() {
      this.charitySplitter = await CharitySplitter.new(owner);

      // Add a charity for testing removal
      await this.charitySplitter.addCharity(charityOne, {
        from: owner
      });
    });

    it("should allow the owner to remove charities", async function() {
      await this.charitySplitter.removeCharity(charityOne, {
        from: owner
      }).should.be.fulfilled;
    });

    it("should correctly update the charity set and count upon removal", async function() {
      await this.charitySplitter.removeCharity(charityOne, {
        from: owner
      });

      const charityCount = Number(await this.charitySplitter.charityCount());
      const charityAddress = await this.charitySplitter.charities(1);
      const charityIndex = Number(
        await this.charitySplitter.charityIndex(charityOne)
      );

      charityCount.should.be.bignumber.equal(0);
      charityAddress.should.be.equal(NULL_ADDRESS);
      charityIndex.should.be.bignumber.equal(0);
    });

    it("should log an event upon charity removal", async function() {
      // Get the event logs
      const { logs } = await this.charitySplitter.removeCharity(charityOne, {
        from: owner
      }).should.be.fulfilled;
      const event = logs.find(e => e.event === "LogCharityRemoved");

      //Check the event's parameters
      event.args._charity.should.be.equal(charityOne);
      Number(event.args._totalCharities).should.be.bignumber.equal(0);
    });

    it("should allow the owner to remove any selected charity and update the state correctly", async function() {
      await this.charitySplitter.addCharity(charityTwo, {
        from: owner
      });

      await this.charitySplitter.removeCharity(charityOne, {
        from: owner
      });

      const charityCount = Number(await this.charitySplitter.charityCount());
      const firstCharityAddress = await this.charitySplitter.charities(1);
      const secondCharityAddress = await this.charitySplitter.charities(2);
      const firstCharityIndex = Number(
        await this.charitySplitter.charityIndex(charityOne)
      );
      const secondCharityIndex = Number(
        await this.charitySplitter.charityIndex(charityTwo)
      );

      charityCount.should.be.bignumber.equal(1);
      firstCharityAddress.should.be.equal(charityTwo);
      secondCharityAddress.should.be.equal(NULL_ADDRESS);
      firstCharityIndex.should.be.bignumber.equal(0);
      secondCharityIndex.should.be.bignumber.equal(1);
    });
  });

  describe("Donation distribution", function() {
    beforeEach(async function() {
      this.charitySplitter = await CharitySplitter.new(owner);

      this.weiAmount = Number(90000);
      this.weiAmountIndividual = Number(this.weiAmount / 3);

      this.weiAmountUneven = Number(100000);
      this.weiAmountIndividualUneven = Number(this.weiAmountUneven / 3);

      // Add first charity
      await this.charitySplitter.addCharity(charityOne, {
        from: owner
      });
      // Add second charity
      await this.charitySplitter.addCharity(charityTwo, {
        from: owner
      });
      // Add third charity
      await this.charitySplitter.addCharity(charityThree, {
        from: owner
      });
    });

    it("should accept donations of Ethereum", async function() {
      await this.charitySplitter.send(this.weiAmount, {
        from: philanthropist
      }).should.be.fulfilled;
    });

    it("should process donations and distribute them to each respective charity", async function() {
      // Get the before balances of each charity
      const beforeCharityOneBalance = Number(
        await web3.eth.getBalance(charityOne)
      );
      const beforeCharityTwoBalance = Number(
        await web3.eth.getBalance(charityTwo)
      );
      const beforeCharityThreeBalance = Number(
        await web3.eth.getBalance(charityThree)
      );

      // Donation is sent and processed
      await this.charitySplitter.send(this.weiAmount, {
        from: philanthropist
      }).should.be.fulfilled;

      // Get the after balances of each charity
      const afterCharityOneBalance = Number(
        await web3.eth.getBalance(charityOne)
      ).toString();
      const afterCharityTwoBalance = Number(
        await web3.eth.getBalance(charityTwo)
      ).toString();
      const afterCharityThreeBalance = Number(
        await web3.eth.getBalance(charityThree)
      ).toString();

      // Setup the expected after balances of each charity
      const expectedCharityOneBalance =
        beforeCharityOneBalance + this.weiAmountIndividual;
      const expectedCharityTwoBalance =
        beforeCharityTwoBalance + this.weiAmountIndividual;
      const expectedCharityThreeBalance =
        beforeCharityThreeBalance + this.weiAmountIndividual;

      // Confirm that the charity balance is the same as expected
      afterCharityOneBalance.should.be.equal(
        expectedCharityOneBalance.toString()
      );
      afterCharityTwoBalance.should.be.equal(
        expectedCharityTwoBalance.toString()
      );
      afterCharityThreeBalance.should.be.equal(
        expectedCharityThreeBalance.toString()
      );
      // NOTE: using toString() here as a workaround for BigNumber issue https://github.com/MikeMcl/bignumber.js/issues/11
    });

    it("should process uneven donations and distribute them to each respective charity", async function() {
      // Get the before balances of each charity
      const beforeCharityOneBalance = Number(
        await web3.eth.getBalance(charityOne)
      );
      const beforeCharityTwoBalance = Number(
        await web3.eth.getBalance(charityTwo)
      );
      const beforeCharityThreeBalance = Number(
        await web3.eth.getBalance(charityThree)
      );

      // Donation is sent and processed
      await this.charitySplitter.send(this.weiAmountUneven, {
        from: philanthropist
      }).should.be.fulfilled;

      // Get the after balances of each charity
      const afterCharityOneBalance = Number(
        await web3.eth.getBalance(charityOne)
      ).toString();
      const afterCharityTwoBalance = Number(
        await web3.eth.getBalance(charityTwo)
      ).toString();
      const afterCharityThreeBalance = Number(
        await web3.eth.getBalance(charityThree)
      ).toString();

      // Setup the expected after balances of each charity
      const expectedCharityOneBalance =
        beforeCharityOneBalance + this.weiAmountIndividualUneven;
      const expectedCharityTwoBalance =
        beforeCharityTwoBalance + this.weiAmountIndividualUneven;
      const expectedCharityThreeBalance =
        beforeCharityThreeBalance + this.weiAmountIndividualUneven;

      // Confirm that the charity balance is the same as expected
      afterCharityOneBalance.should.be.equal(
        expectedCharityOneBalance.toString()
      );
      afterCharityTwoBalance.should.be.equal(
        expectedCharityTwoBalance.toString()
      );
      afterCharityThreeBalance.should.be.equal(
        expectedCharityThreeBalance.toString()
      );
      // NOTE: using toString() here as a workaround for BigNumber issue https://github.com/MikeMcl/bignumber.js/issues/11
    });

    it("should log an event upon successful donation processing", async function() {
      // Get the event logs
      const { logs } = await this.charitySplitter.send(this.weiAmountUneven, {
        from: philanthropist
      }).should.be.fulfilled;
      const event = logs.find(e => e.event === "LogDonation");

      //Check the event's parameters
      event.args._philanthropist.should.be.equal(philanthropist);
      Number(event.args._totalDonationAmount).should.be.bignumber.equal(
        this.weiAmountUneven
      );
      Number(event.args._totalCharities).should.be.bignumber.equal(3);
      Number(event.args._individualDonationAmount).should.be.bignumber.equal(
        this.weiAmountIndividualUneven.toFixed(0)
      );
    });
  });
});
