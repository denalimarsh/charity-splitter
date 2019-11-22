pragma solidity ^0.5.0;

import "../proxy/CharitySplitterV2.sol";
/*
    Charity Splitter Factory V2 interface
*/
interface ICharitySplitterFactoryV2 {
     function createCharitySplitter() external returns(CharitySplitterV2 charitySplitter);
}