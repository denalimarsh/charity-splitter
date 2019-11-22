pragma solidity ^0.5.0;

import "./interfaces/ICharitySplitterFactory.sol";
import "./CharitySplitter.sol";

/*
*  @title: CharitySplitterFactory
*  @dev: Factory which facilitates the creation of new Charity Splitters
*/
contract CharitySplitterFactory is ICharitySplitterFactory {

    mapping(address => bool) public hasCreatedCharitySplitter;

    event LogNewCharitySplitter(
        address indexed _address,
        address indexed _creator,
        address indexed _owner
    );

    /**
      * @dev initializes a new CharitySplitterFactory instance
    */
    constructor()
        public
    {
        // Intentionally left blank
    }

    /**
      * @dev creates a new Charity Splitter with the specified owner
      * @param  _owner      owner of the new Charity Splitter contract
      * @return             a new Charity Splitter
    */
    function createCharitySplitter(
        address _owner
    )
        external
        returns(address charitySplitterAddress)
    {
        require(
            !hasCreatedCharitySplitter[msg.sender],
            "This address has already deployed a CharitySplitter contract"
        );

        CharitySplitter charitySplitter = new CharitySplitter(
            _owner
        );

        address _charitySplitterAddress = address(charitySplitter);

        hasCreatedCharitySplitter[msg.sender] = true;

        emit LogNewCharitySplitter(
            _charitySplitterAddress,
            msg.sender,
            _owner
        );

        return _charitySplitterAddress;
    }
}