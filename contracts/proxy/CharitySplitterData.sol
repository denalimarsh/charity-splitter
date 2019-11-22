pragma solidity ^0.5.0;

import "./ProxyAddress.sol";
import "./CharitySplitterEvents.sol";

/*
*  @title: CharitySplitterData
*  @dev: Can't avoid repeating the declaration of state variables that have accessors,
*        so internal and public versions of the variable declarations must be repeated.
*/
contract CharitySplitterData is ProxyAddress, CharitySplitterEvents {
    address public owner;
    uint256 public charityCount;
    mapping(address => uint256) public charityIndex;
    mapping(uint256 => address payable) public charities;
}