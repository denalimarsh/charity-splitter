const CharitySplitterFactoryV2 = artifacts.require("CharitySplitterFactoryV2");
const CharitySplitter = artifacts.require("CharitySplitterV2");

const EVMRevert = "revert";
const BigNumber = web3.BigNumber;

require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();

contract("CharitySplitterFactoryV2", function(accounts) {
  const userOne = accounts[1];
  const userTwo = accounts[2];
  const charityOne = accounts[4];
  const philanthropist = accounts[8];

  describe("Deployment and initial state", function() {
    beforeEach(async function() {
      this.charitySplitterFactoryV2 = await CharitySplitterFactoryV2.new();
    });

    it("should deploy the chairty splitter factory v2 contract", async function() {
      this.charitySplitterFactoryV2.should.exist;
    });
  });

  describe("CharitySplitterProxy creation", function() {
    beforeEach(async function() {
      this.charitySplitterFactoryV2 = await CharitySplitterFactoryV2.new();
    });

    it("should allow users to deploy a new CharitySplitter contract", async function() {
      await this.charitySplitterFactoryV2.createCharitySplitter({
        from: userOne
      }).should.be.fulfilled;
    });

    it("should not allow a user to deploy additional CharitySplitter contracts", async function() {
      await this.charitySplitterFactoryV2.createCharitySplitter({
        from: userOne
      }).should.be.fulfilled;

      await this.charitySplitterFactoryV2
        .createCharitySplitter({
          from: userOne
        })
        .should.be.rejectedWith(EVMRevert);
    });

    it("should allow several different users to deploy new CharitySplitter contracts", async function() {
      await this.charitySplitterFactoryV2.createCharitySplitter({
        from: userOne
      }).should.be.fulfilled;

      await this.charitySplitterFactoryV2.createCharitySplitter({
        from: userTwo
      }).should.be.fulfilled;
    });

    it("should log an event upon CharitySplitter creation", async function() {
      // Get the expected deployment address (without deploying the actual contract)
      const expectedDeployedAddress = await this.charitySplitterFactoryV2.createCharitySplitter.call(
        {
          from: userOne
        }
      );

      // Deploy contract and get the event logs
      const {
        logs
      } = await this.charitySplitterFactoryV2.createCharitySplitter({
        from: userOne
      }).should.be.fulfilled;
      const event = logs.find(e => e.event === "LogNewCharitySplitter");

      //Check the event's parameters
      event.args._address.should.be.equal(expectedDeployedAddress);
      event.args._owner.should.be.equal(userOne);
    });
  });

  describe("CharitySplitter contract interaction", function() {
    beforeEach(async function() {
      this.charitySplitterFactoryV2 = await CharitySplitterFactoryV2.new();

      const charitySplitterAddress = await this.charitySplitterFactoryV2.createCharitySplitter.call(
        {
          from: userOne
        }
      );

      await this.charitySplitterFactoryV2.createCharitySplitter({
        from: userOne
      });

      this.charitySplitter = await CharitySplitter.at(charitySplitterAddress);
    });

    it("should allow the owner to add charities", async function() {
      await this.charitySplitter.addCharity(charityOne, {
        from: userOne
      }).should.be.fulfilled;
    });

    it("should allow the owner to remove charities", async function() {
      await this.charitySplitter.addCharity(charityOne, {
        from: userOne
      });

      await this.charitySplitter.removeCharity(charityOne, {
        from: userOne
      }).should.be.fulfilled;
    });

    it("should process donations and distribute them to each respective charity", async function() {
      const WEI_AMOUNT = 500;

      // Add the charity
      await this.charitySplitter.addCharity(charityOne, {
        from: userOne
      });

      // Get the before balances of each charity
      const beforeCharityOneBalance = Number(
        await web3.eth.getBalance(charityOne)
      );

      // Donation is sent and processed
      await this.charitySplitter.send(WEI_AMOUNT, {
        from: philanthropist
      }).should.be.fulfilled;

      // Get the after balances of each charity
      const afterCharityOneBalance = Number(
        await web3.eth.getBalance(charityOne)
      ).toString();

      // Setup the expected after balances of each charity
      const expectedCharityOneBalance = beforeCharityOneBalance + WEI_AMOUNT;

      // Confirm that the charity balance is the same as expected
      afterCharityOneBalance.should.be.equal(
        expectedCharityOneBalance.toString()
      );
    });
  });
});
