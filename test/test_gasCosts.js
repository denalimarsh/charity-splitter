const CharitySplitterFactory = artifacts.require("CharitySplitterFactory");
const CharitySplitterFactoryV2 = artifacts.require("CharitySplitterFactoryV2");

const BigNumber = web3.BigNumber;

require("chai")
  .use(require("chai-as-promised"))
  .use(require("chai-bignumber")(BigNumber))
  .should();

contract("CharitySplitterFactory vs. CharitySplitterFactoryV2", function(
  accounts
) {
  const owner = accounts[1];
  const userOne = accounts[2];

  describe("CharitySplitterFactory gas costs", function() {
    beforeEach(async function() {
      this.charitySplitterFactory = await CharitySplitterFactory.new();
    });

    it("should test new CharitySplitter contract deployment costs", async function() {
      const txResult = await this.charitySplitterFactory.createCharitySplitter(
        owner,
        {
          from: userOne
        }
      ).should.be.fulfilled;

      console.log("\tDeployment cost: " + txResult.receipt.gasUsed);
    });
  });

  describe("CharitySplitterFactoryV2 gas costs", function() {
    beforeEach(async function() {
      this.charitySplitterFactoryV2 = await CharitySplitterFactoryV2.new();
    });

    it("should test new CharitySplitter contract deployment costs", async function() {
      const txResult = await this.charitySplitterFactoryV2.createCharitySplitter(
        {
          from: userOne
        }
      ).should.be.fulfilled;

      console.log("\tDeployment cost: " + txResult.receipt.gasUsed);
    });
  });
});
