pragma solidity ^0.5.0;

/*
    Charity Splitter For Token interface
*/
interface ICharitySplitterForToken {
    function tokenFallback(address _from, uint256 _amount, bytes calldata _data) external returns (bool);
}