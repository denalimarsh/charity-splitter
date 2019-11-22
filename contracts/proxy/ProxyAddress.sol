pragma solidity ^0.5.0;

/*
*  @title: ProxyAddress
*  @dev: Proxies and proxy targets have to have compatible storage layouts,
*        so we have to add in the different proxied address via inheritance.
*/
contract ProxyAddress {
    address internal proxied;
}