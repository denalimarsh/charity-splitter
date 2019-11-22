# Argent assessment

## 1. CharitySplitter contract

Primary contract: `CharitySplitter.sol`. I used dual-mapping pattern in order to iterate over the charities at time of donation distribution. After charity removal the most recently added charity is swapped into the position of the removed charity in order to keep the mappings correctly updated. Additionally, I leveraged a custom version of OpenZeppelin's `Address.sol` library.

`test_charitySplitter.js`:

```
  Contract: CharitySplitter
    Deployment and initial state
      ✓ should deploy the chairty splitter contract with the correct parameters (52ms)
    Adding charities
      ✓ should allow the owner to add charities (56ms)
      ✓ should correctly update the charity set and count upon add (127ms)
      ✓ should log an event upon charity add (53ms)
    Removing charities
      ✓ should allow the owner to remove charities (47ms)
      ✓ should correctly update the charity set and count upon removal (101ms)
      ✓ should log an event upon charity removal (43ms)
      ✓ should allow the owner to remove any selected charity and update the state correctly (196ms)
    Donation distribution
      ✓ should accept donations of Ethereum (54ms)
      ✓ should process donations and distribute them to each respective charity (71ms)
      ✓ should process uneven donations and distribute them to each respective charity (98ms)
      ✓ should log an event upon successful donation processing (38ms)
```

## 2. CharitySplitterFactory contract

Primary contract: `CharitySplitterFactory.sol`. The factory uses a straight-forward `createCharitySplitter(_owner)` method and tracks users who have deployed CharitySplitter contracts in a simple `mapping(address => bool)`.

`test_charitySplitterFactory.js`:

```
  Contract: CharitySplitterFactory
    Deployment and initial state
      ✓ should deploy the chairty splitter factory contract
    CharitySplitter creation
      ✓ should allow users to deploy a new CharitySplitter contract (39ms)
      ✓ should not allow a user to deploy additional CharitySplitter contracts (83ms)
      ✓ should allow several different users to deploy new CharitySplitter contracts (79ms)
      ✓ should log an event upon CharitySplitter creation (68ms)
    CharitySplitter contract interaction
      ✓ should allow the owner to add charities
      ✓ should allow the owner to remove charities (67ms)
      ✓ should process donations and distribute them to each respective charity (82ms)
```

## 3. CharitySplitterForToken contract

Primary contracts: `CharitySplitterForToken.sol`, `ERC677.sol`. The contract implements the required `tokenFallback(...)` which allows for the automatic processing of received donations. The ERC677 token's deployed contract address is passed via the `bytes memory data` parameter and parsed by the `Bytes.sol` library.

`test_charitySplitterForToken.js`:

```
  Contract: CharitySplitterForToken
    Deployment and initial state
      ✓ should deploy the Chairty Splitter For Token contract
    ERC677 donation processing
      ✓ should implement IERC677Receiver, allowing users to transfer ERC677 tokens to the contract (77ms)
      ✓ should automatically process donations of ERC677 tokens and distribute them equally to active charities (121ms)
```

## 4. CharitySplitterFactoryV2 contract

Primary contracts: `CharitySplitterFactoryV2.sol`, `/proxy` directory. In order to reduce the gas deployment costs I leveraged a delegate proxy contract architecture with storage and logic concerns separated into different subcontracts. `CharitySplitterV2.sol` contains contract logic while `CharitySplitterData.sol`, `CharitySplitterEvents.sol`, and `CharitySplitterGlobal.sol` contain contract events and global variables. The contract's constructor has been moved to `CharitySplitterProxy.sol`, which manages the initial state.

test_charitySplitterFactoryV2.js`:

```
  Contract: CharitySplitterFactoryV2
    Deployment and initial state
      ✓ should deploy the chairty splitter factory v2 contract
    CharitySplitterProxy creation
      ✓ should allow users to deploy a new CharitySplitter contract (40ms)
      ✓ should not allow a user to deploy additional CharitySplitter contracts (85ms)
      ✓ should allow several different users to deploy new CharitySplitter contracts (78ms)
      ✓ should log an event upon CharitySplitter creation (66ms)
    CharitySplitter contract interaction
      ✓ should allow the owner to add charities (42ms)
      ✓ should allow the owner to remove charities (75ms)
      ✓ should process donations and distribute them to each respective charity (89ms)
```

`test_gasCosts.js`:

```
  Contract: CharitySplitterFactory vs. CharitySplitterFactoryV2
    CharitySplitterFactory gas costs
        Deployment cost: 951937
      ✓ should test new CharitySplitter contract deployment costs (41ms)
    CharitySplitterFactoryV2 gas costs
        Deployment cost: 147165
      ✓ should test new CharitySplitter contract deployment costs
```

As seen in `test_gasCosts.js`, this strategy reduced contract deployment costs from 951,950 gas to 147,165 gas - a savings of 84.5%.
