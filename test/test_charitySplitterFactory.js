const CharitySplitterFactory = artifacts.require("CharitySplitterFactory");

const EVMRevert = "revert";
const BigNumber = web3.BigNumber;

require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();

contract("CharitySplitterFactory", function(accounts) {
  const owner = accounts[1];
  const userOne = accounts[2];
  const userTwo = accounts[3];

  describe("Deployment and initial state", function() {
    beforeEach(async function() {
      this.charitySplitterFactory = await CharitySplitterFactory.new();
    });

    it("should deploy the chairty splitter factory contract", async function() {
      this.charitySplitterFactory.should.exist;
    });
  });

  describe("CharitySplitter creation", function() {
    beforeEach(async function() {
      this.charitySplitterFactory = await CharitySplitterFactory.new();
    });

    it("should allow users to deploy a new CharitySplitter contract", async function() {
      await this.charitySplitterFactory.createCharitySplitter(owner, {
        from: userOne
      }).should.be.fulfilled;
    });

    it("should not allow a user to deploy additional CharitySplitter contracts", async function() {
      await this.charitySplitterFactory.createCharitySplitter(owner, {
        from: userOne
      }).should.be.fulfilled;

      await this.charitySplitterFactory
        .createCharitySplitter(owner, {
          from: userOne
        })
        .should.be.rejectedWith(EVMRevert);
    });

    it("should allow several different users to deploy new CharitySplitter contracts", async function() {
      await this.charitySplitterFactory.createCharitySplitter(owner, {
        from: userOne
      }).should.be.fulfilled;

      await this.charitySplitterFactory.createCharitySplitter(owner, {
        from: userTwo
      }).should.be.fulfilled;
    });

    it("should log an event upon CharitySplitter creation", async function() {
      // Get the expected deployment address (without deploying the actual contract)
      const expectedDeployedAddress = await this.charitySplitterFactory.createCharitySplitter.call(
        owner,
        {
          from: userOne
        }
      );

      // Deploy contract and get the event logs
      const { logs } = await this.charitySplitterFactory.createCharitySplitter(
        owner,
        {
          from: userOne
        }
      ).should.be.fulfilled;
      const event = logs.find(e => e.event === "LogNewCharitySplitter");

      //Check the event's parameters
      event.args._address.should.be.equal(expectedDeployedAddress);
      event.args._creator.should.be.equal(userOne);
      event.args._owner.should.be.equal(owner);
    });
  });
});
