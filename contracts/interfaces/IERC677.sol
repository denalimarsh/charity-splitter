pragma solidity ^0.5.0;

import "./IERC677Receiver.sol";

interface IERC677 {
    function transferAndCall(IERC677Receiver, uint, bytes calldata) external returns (bool);
}