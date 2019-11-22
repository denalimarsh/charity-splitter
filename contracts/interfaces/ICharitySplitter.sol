pragma solidity ^0.5.0;

/*
    Charity Splitter interface
*/
interface ICharitySplitter {
    function addCharity(address payable _charityAddress) external;
    function removeCharity(address payable _charityAddress) external;
}