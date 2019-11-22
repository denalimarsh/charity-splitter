pragma solidity ^0.5.0;

import "./CharitySplitterGlobals.sol";
import "./Proxy.sol";

/*
*  @title: CharitySplitterProxy
*  @dev: Sets the initial state for CharitySplitterV2 contract. This allows
*        CharitySplitterV2 to not have a constructor method.
*/
contract CharitySplitterProxy is Proxy, CharitySplitterGlobals {
    /*
    *  @dev: Constructor, sets contract's deployed address as proxied
    *        and sets owner's address
    */
    constructor(
        address _proxied,
        address _owner
    )
        public
        Proxy(_proxied)
    {
        require(
            owner == address(0),
            "Owner address must be unset at deployment."
        );
        owner = _owner;
        charityCount = 0;
    }
}