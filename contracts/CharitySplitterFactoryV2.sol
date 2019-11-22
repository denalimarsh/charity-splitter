pragma solidity ^0.5.0;

import "./interfaces/ICharitySplitterFactoryV2.sol";
import "./proxy/CharitySplitterV2.sol";
import "./proxy/CharitySplitterProxy.sol";

/*
*  @title: CharitySplitterFactoryV2
*  @dev: Factory which facilitates the creation of proxy Charity Splitters,
*        decreasing the operational gas costs of contract deployment.
*/
contract CharitySplitterFactoryV2 is ICharitySplitterFactoryV2 {

    CharitySplitterV2 private masterContract;
    mapping(address => bool) public hasProxy;

    event LogNewCharitySplitter(
        address _address,
        address _owner
    );

    /**
      * @dev Constructor, sets the master contract
    */
    constructor()
        public
    {
        masterContract = new CharitySplitterV2();
    }

    /**
      * @dev creates a new Charity Splitter with the specified owner
      * @return a new Charity Splitter
    */
    function createCharitySplitter()
        external
        returns (CharitySplitterV2 charitySplitter)
    {
        require(
            !hasProxy[msg.sender],
            "User already is owner of a CharitySplitter proxy contract"
        );

        hasProxy[msg.sender] = true;

        CharitySplitterV2 charitySplitterV2 = CharitySplitterV2(address
            (new CharitySplitterProxy(
                    address(masterContract),
                    msg.sender
                )
            )
        );
        
        emit LogNewCharitySplitter(
            address(charitySplitterV2),
            msg.sender
        );

        return charitySplitterV2;
    }
}