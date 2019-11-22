pragma solidity ^0.5.0;

/*
    Charity Splitter Factory interface
*/
interface ICharitySplitterFactory {
     function createCharitySplitter(address _owner) external returns(address charitySplitterAddress);
}