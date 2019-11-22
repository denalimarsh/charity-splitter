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

        hasCreatedCharitySplitter[msg.sender] = true;

        CharitySplitter charitySplitter = new CharitySplitter(
            _owner
        );

        emit LogNewCharitySplitter(
            address(charitySplitter),
            msg.sender,
            _owner
        );

        return address(charitySplitter);
    }
}