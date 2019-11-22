pragma solidity ^0.5.0;

import "./ProxyAddress.sol";
import "./CharitySplitterEvents.sol";

/*
*  @title: CharitySplitterGlobals
*  @dev: Declares global variables as internal in order to strip the default
*        getter/setter methods which add bloat to the contract.
*/
contract CharitySplitterGlobals is ProxyAddress, CharitySplitterEvents {
    address internal owner;
    uint256 internal charityCount;
    mapping(address => uint256) internal charityIndex;
    mapping(uint256 => address payable) internal charities;
}